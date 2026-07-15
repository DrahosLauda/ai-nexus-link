import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3-flash-preview";

const SYSTEM_INSTRUCTION = `
Si priateľský, profesionálny AI asistent pre AI Nexus Link — technologickú vetvu Digitálnej Pomoci,
ktorá stavia headless weby a AI automatizáciu pre firmy.

Kľúčové fakty o AI Nexus Link:
- Prepájame Next.js frontend s headless CMS (WordPress alebo Directus): frontend beží samostatne
  a CMS spravuje len obsah, vďaka čomu je web podstatne rýchlejší ako klasický WordPress.
- AI SEO Optimalizácia: AI agenti priebežne prepisujú a vylepšujú články a meta tagy.
- Headless Transformácia: existujúci WordPress zrýchlime vytvorením samostatného Next.js frontendu.
- E-commerce automatizácia: záchrana opustených košíkov a personalizované AI zľavy bez manuálnej práce.

Pravidlá:
1. Odpovedaj vždy po slovensky.
2. Buď stručný — 2-3 krátke odstavce max.
3. Ak sa niekto pýta na cenu, vysvetli, že cena sa odvíja od rozsahu projektu, a navrhni
   nezáväznú konzultáciu cez /kontakt.
4. Ak nevieš odpovedať, navrhni konzultáciu cez /kontakt.
5. Zvýrazňuj kľúčové slová pomocou **tučného textu**.
`.trim();

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

function isValidHistory(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        (item.role === "user" || item.role === "model") &&
        Array.isArray(item.parts) &&
        item.parts.every((p: unknown) => typeof (p as { text?: unknown })?.text === "string"),
    )
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Neplatné telo požiadavky." }, { status: 400 });
  }

  const { message, history } = (body ?? {}) as { message?: unknown; history?: unknown };

  if (typeof message !== "string" || message.trim().length === 0) {
    return Response.json({ error: "Správa nesmie byť prázdna." }, { status: 400 });
  }
  const safeHistory = isValidHistory(history) ? history : [];

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Chat momentálne nie je dostupný." }, { status: 503 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [...safeHistory, { role: "user", parts: [{ text: message }] }],
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    const reply = response.text;
    if (!reply) {
      return Response.json({ error: "Nepodarilo sa vygenerovať odpoveď." }, { status: 502 });
    }

    return Response.json({ reply });
  } catch {
    return Response.json({ error: "Spojenie so serverom bolo prerušené." }, { status: 502 });
  }
}
