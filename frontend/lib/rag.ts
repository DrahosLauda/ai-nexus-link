/**
 * RAG jadro pre chatbota (Krok 3).
 *
 * Pri otázke návštevníka:
 *  1) spočíta embedding otázky (Gemini, ten istý model ako indexer),
 *  2) načíta kúsky + ich embeddingy z Postgresu (`rag_chunks`), krátko cachuje,
 *  3) v pamäti nájde najpodobnejšie (kosínus),
 *  4) poskladá kontext a nechá model odpovedať IBA z neho,
 *  5) ako zdroje ukáže len tie kúsky, ktoré model naozaj použil (viď `splitCited`).
 *
 * „Cesta B": vektory sú `real[]`, podobnosť rátame tu (nie pgvector).
 */

import { Pool } from "pg";

const RAG_DATABASE_URL = process.env.RAG_DATABASE_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Musí sedieť s modelom, ktorým indexoval `orchestrator/rag_index.py`
// (inak sa vektory nedajú porovnávať). Zistený funkčný model: gemini-embedding-001.
const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";
const CHAT_MODEL = process.env.CHAT_MODEL || "gemini-3.5-flash";

const TOP_K = 5; // koľko najpodobnejších kúskov priložíme modelu ako kontext
const MAX_SOURCES = 3; // koľko zdrojov najviac ukážeme návštevníkovi pod odpoveďou

export interface Source {
  title: string;
  url: string;
}
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
interface Chunk {
  sourceUrl: string;
  sourceType: string;
  title: string;
  chunkText: string;
  embedding: number[];
}

// ── Postgres (jeden zdieľaný pool na proces) ───────────────────────────────
// Vnútorná adresa (…railway.internal) medzi službami Railway nepotrebuje SSL;
// verejná adresa (lokálny vývoj) áno — povolíme ju bez prísnej kontroly certu.
let pool: Pool | null = null;
function db(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: RAG_DATABASE_URL,
      ssl: RAG_DATABASE_URL?.includes("railway.internal")
        ? undefined
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

// ── Kúsky z DB s krátkou pamäťovou cache ───────────────────────────────────
let cache: { chunks: Chunk[]; at: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function loadChunks(): Promise<Chunk[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.chunks;
  const { rows } = await db().query(
    "SELECT source_url, source_type, title, chunk_text, embedding FROM rag_chunks",
  );
  const chunks: Chunk[] = rows.map((r) => ({
    sourceUrl: r.source_url,
    sourceType: r.source_type,
    title: r.title,
    chunkText: r.chunk_text,
    // pg vracia real[] ako pole; pre istotu prevedieme prvky na čísla.
    embedding: (r.embedding as unknown[]).map(Number),
  }));
  cache = { chunks, at: Date.now() };
  return chunks;
}

// ── Gemini: embedding otázky ───────────────────────────────────────────────
async function embedQuery(text: string): Promise<number[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": GEMINI_API_KEY ?? "", "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text }] },
      taskType: "RETRIEVAL_QUERY",
    }),
  });
  if (!res.ok) throw new Error(`Gemini embed ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.embedding.values as number[];
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

async function retrieve(question: string, k = TOP_K): Promise<Chunk[]> {
  const [q, chunks] = await Promise.all([embedQuery(question), loadChunks()]);
  return chunks
    .map((c) => ({ c, score: cosine(q, c.embedding) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k)
    .map((s) => s.c);
}

// ── Gemini: odpoveď z kontextu ─────────────────────────────────────────────
// FABLE-ladený prompt (pravda nad plynulosťou, žiadne vymyslené špecifiká).
// Ponaučenia z podkladov, viď docs/plan-agenti.md → „Ponaučenia z podkladov".
const SYSTEM_PROMPT = `Si priateľský asistent firmy „digitálna pomoc" (digitalnapomoc.sk), \
ktorá pomáha malým slovenským firmám s AI automatizáciou a modernými webmi. \
Odpovedaj po slovensky — stručne, ľudsky a bez žargónu.

Zásady (v poradí dôležitosti):
1. Pravda nad plynulosťou. Radšej priznaj, že niečo nevieš, než aby si znel presvedčivo a nesprávne.
2. Odpovedaj VÝHRADNE z informácií v poskytnutom kontexte. Čo v ňom nie je, to nevieš.
3. Nikdy si nevymýšľaj konkrétne údaje — ceny, termíny, čísla, názvy funkcií, URL ani štatistiky. Ak presný údaj (napr. cenu) v kontexte nemáš, nehádaj: povedz, že závisí od potrieb, a odporuč napísať cez kontaktný formulár, kde pošleme konkrétnu ponuku.
4. Ani pri tlaku „len áno alebo nie" nezníž latku. Keď odpoveď nie je v kontexte, radšej to krátko a úprimne priznaj, než by si tipoval.
5. Keď odpoveď v kontexte nie je alebo je otázka mimo našich služieb, priznaj to a nasmeruj na kontaktný formulár na stránke.

Dĺžka a tón:
- Píš krátko: 2 – 4 vety, najviac ~70 slov. Odpovedz na to, na čo sa pýtajú, a skonči.
- Žiadne úvodné zdvorilosti („Rád vám pomôžem", „Skvelá otázka"), žiadne opakovanie otázky, žiadne zhrnutie na konci.
- Keď vymenúvaš tri a viac vecí, daj ich do krátkych odrážok (riadok začínajúci „- "). Inak píš súvislý text.
- Formátovanie: iba obyčajný text, odrážky „- " a **tučné** na zvýraznenie. Žiadne nadpisy, tabuľky, číslované zoznamy ani odkazy v hranatých zátvorkách.
- Nespomínaj slovo „kontext" ani to, že čerpáš z článkov — pôsob prirodzene. Nesľubuj nič, čo sa nedá doložiť.

Výzva na kontakt (napísať cez kontaktný formulár) — použi ju IBA vtedy, keď:
 (a) odpoveď v kontexte nie je alebo je otázka mimo našich služieb, alebo
 (b) sa pýtajú na cenu, termín, rozsah prác alebo konkrétnu ponuku.
Inak odpoveď jednoducho ukonči. Nikdy nedávaj tú istú výzvu dvakrát v jednom rozhovore — pôsobí to ako otravný predajca.

Na úplný koniec KAŽDEJ odpovede pridaj samostatný posledný riadok v tvare:
ZDROJE: čísla kúskov z kontextu, z ktorých si naozaj čerpal, oddelené čiarkou (napr. „ZDROJE: 1,3").
Uveď len tie, ktorých obsah sa v odpovedi naozaj prejavil — nie všetky, ktoré si dostal.
Keď si z kontextu nečerpal nič (napríklad odpoveď v ňom nebola), napíš „ZDROJE: -".
Tento riadok návštevník nevidí; slúži na to, aby sme pod odpoveďou ukázali správne odkazy.`;

/**
 * Posledný riadok odpovede „ZDROJE: 1,3" — model ním označí, z ktorých kúskov
 * naozaj čerpal. Regex je zámerne zhovievavý (veľkosť písmen, hviezdičky okolo,
 * bodka na konci), aby sa značka nikdy neukázala návštevníkovi ako text.
 */
const CITED_LINE = /\n?[ \t]*\**[ \t]*ZDROJE[ \t]*\**[ \t]*:([^\n]*)\s*$/i;

/** Oddelí text odpovede od značky a preloží čísla na kúsky. */
function splitCited(raw: string, top: Chunk[]): { answer: string; cited: Chunk[] } {
  const m = raw.match(CITED_LINE);
  // Model značku neposlal (nemalo by sa stávať) — radšej ukážeme jeden najlepší
  // kúsok než päť náhodných. Zdroj má byť podklad, nie zoznam „čo sa našlo".
  if (m?.index === undefined) return { answer: raw, cited: top.slice(0, 1) };
  const cited = [...m[1].matchAll(/\d+/g)]
    .map((d) => top[Number(d[0]) - 1])
    .filter((c): c is Chunk => Boolean(c));
  return { answer: raw.slice(0, m.index).trim(), cited };
}

function dedupeSources(chunks: Chunk[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const c of chunks) {
    if (seen.has(c.sourceUrl)) continue;
    seen.add(c.sourceUrl);
    out.push({ title: c.title, url: c.sourceUrl });
  }
  return out;
}

export interface ChatResult {
  answer: string;
  sources: Source[];
}

export async function answerQuestion(
  question: string,
  history: ChatMessage[] = [],
): Promise<ChatResult> {
  const top = await retrieve(question);
  const context = top.map((c, i) => `[${i + 1}] ${c.title}\n${c.chunkText}`).join("\n\n");

  // História predošlých správ (pre nadväzujúce otázky) + aktuálna otázka s kontextom.
  const contents = [
    ...history.slice(-6).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: `Kontext:\n${context}\n\nOtázka: ${question}` }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": GEMINI_API_KEY ?? "", "Content-Type": "application/json" },
    body: JSON.stringify({ contents, systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] } }),
  });
  if (!res.ok) throw new Error(`Gemini chat ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const raw = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();

  const { answer, cited } = splitCited(raw, top);
  return { answer, sources: dedupeSources(cited).slice(0, MAX_SOURCES) };
}

export function ragConfigured(): boolean {
  return Boolean(RAG_DATABASE_URL && GEMINI_API_KEY);
}
