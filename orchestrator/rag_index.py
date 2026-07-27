"""RAG indexer — naplní databázu `rag_chunks` naším obsahom (Krok 2).

Čo robí (po ľudsky):
1. Pozbiera náš obsah — publikované WP články + FAQ z frontendu.
2. Rozseká ho na menšie kúsky (chunky).
3. Pre každý kúsok si od Gemini vypýta „embedding" (768 čísel = význam kúska).
4. Uloží kúsky + ich embeddingy do tabuľky `rag_chunks` (Cesta B — pole `real[]`).

Neskôr `/api/chat` pri otázke nájde najbližšie kúsky a odpovie len z nich.

Beh (lokálne na Macu, kde má orchestrátor `.env`):
    python rag_index.py            # naplní/aktualizuje databázu
    python rag_index.py --dry-run  # len ukáže, čo by indexoval (bez Gemini/DB)

Potrebné premenné (v `orchestrator/.env`):
    RAG_DATABASE_URL  — verejná adresa Railway PostGIS (DATABASE_PUBLIC_URL)
    GEMINI_API_KEY    — Google Gemini (rovnaký kľúč ako Writer)
    WP_URL, SITE_URL  — voliteľné (defaulty nižšie)

Zásada (ako directus.py): tento modul je „iba čítač + zapisovač vektorov".
Nič nepublikuje do WP ani Directusu okrem vlastného zhrnutia do `agent_logs`.
Pri výpadku jedného zdroja pokračuje ďalším a starý obsah nechá nedotknutý.
"""

import os
import re
import sys
import html
import hashlib

import requests
from dotenv import load_dotenv

from directus import zapis_log

load_dotenv()

WP_URL = os.getenv("WP_URL", "https://www.digitalnapomoc.sk")
# Verejná adresa nášho frontendu — do nej skladáme odkazy na zdroje (články
# citujeme na /blog/<slug>, nie na skrytú wp. subdoménu).
SITE_URL = os.getenv("SITE_URL", "https://www.digitalnapomoc.sk")
RAG_DATABASE_URL = os.getenv("RAG_DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini embeddings — 768-rozmerný vektor. Rovnaký model použije aj /api/chat
# na otázku (tam s taskType RETRIEVAL_QUERY), tu pre obsah RETRIEVAL_DOCUMENT.
EMBED_MODEL = "text-embedding-004"

AGENT_NAME = "rag_index"

# Chunkovanie: ~220 slov na kúsok s miernym prekryvom, nech sa myšlienka
# nerozdelí presne v strede vety medzi dva kúsky.
CHUNK_MAX_WORDS = 220
CHUNK_OVERLAP_WORDS = 40


# ── Pomocníci na text ──────────────────────────────────────────────────────

def strip_html(raw):
    """Z HTML spraví čistý text (tagy preč, entity ako &nbsp; rozkódované)."""
    text = re.sub(r"<[^>]*>", " ", raw or "")
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def chunk_text(text, max_words=CHUNK_MAX_WORDS, overlap=CHUNK_OVERLAP_WORDS):
    """Rozseká dlhý text na kúsky po slovách s prekryvom."""
    words = text.split()
    if not words:
        return []
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + max_words, len(words))
        chunks.append(" ".join(words[start:end]))
        if end == len(words):
            break
        start = end - overlap
    return chunks


def make_source(source_url, source_type, title, chunks):
    """Poskladá jeden „zdroj" (článok/FAQ) + hash na preskočenie nezmeneného."""
    chunks = [c for c in (c.strip() for c in chunks) if c]
    joined = "\n".join(chunks)
    return {
        "source_url": source_url,
        "source_type": source_type,
        "title": title,
        "chunks": chunks,
        "content_hash": hashlib.sha256(joined.encode("utf-8")).hexdigest(),
    }


# ── Zber obsahu ────────────────────────────────────────────────────────────

def _wp_headers():
    """Publikované články sú verejné; ak sú v .env WP údaje, priložíme ich
    (funguje aj keby bolo REST čítanie čiastočne uzamknuté)."""
    headers = {"Accept": "application/json"}
    user, pwd = os.getenv("WP_USER"), os.getenv("WP_APP_PASSWORD")
    if user and pwd:
        import base64
        token = base64.b64encode(f"{user}:{pwd}".encode()).decode()
        headers["Authorization"] = f"Basic {token}"
    return headers


def fetch_wp_articles():
    """Načíta všetky publikované WP články (stránkovane po 100)."""
    sources = []
    page = 1
    while True:
        params = {
            "status": "publish",
            "per_page": "100",
            "page": str(page),
            "orderby": "date",
            "order": "desc",
            "_fields": "id,slug,title,content",
        }
        r = requests.get(
            f"{WP_URL}/wp-json/wp/v2/posts", headers=_wp_headers(), params=params, timeout=60
        )
        if r.status_code == 400:  # WP vráti 400, keď požiadaš stránku za koncom
            break
        r.raise_for_status()
        posts = r.json()
        if not posts:
            break
        for p in posts:
            title = strip_html(p["title"]["rendered"])
            body = strip_html(p["content"]["rendered"])
            if not body:
                continue
            url = f"{SITE_URL}/blog/{p['slug']}"
            sources.append(make_source(url, "article", title, chunk_text(body)))
        if len(posts) < 100:
            break
        page += 1
    return sources


def load_faqs():
    """Vytiahne FAQ (otázka/odpoveď) z frontendu — jediný zdroj pravdy
    `frontend/lib/content.ts`, žiadna kópia. Pri zmene formátu súboru len
    varuje a FAQ preskočí (nikdy nezhodí indexáciu)."""
    path = os.path.join(os.path.dirname(__file__), "..", "frontend", "lib", "content.ts")
    try:
        with open(path, encoding="utf-8") as f:
            src = f.read()
    except OSError as e:
        print(f"ℹ️  FAQ preskočené (nedá sa čítať {path}): {e}")
        return []
    block = re.search(r"export const faqs\s*=\s*\[(.*?)\];", src, re.DOTALL)
    if not block:
        print("ℹ️  FAQ preskočené (v content.ts som nenašiel pole `faqs`).")
        return []
    pairs = re.findall(
        r'q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"',
        block.group(1),
        re.DOTALL,
    )
    faqs = [(q.strip(), a.strip()) for q, a in pairs]
    if not faqs:
        print("ℹ️  FAQ preskočené (pole `faqs` je prázdne alebo v inom tvare).")
    return faqs


def fetch_faq_source():
    """FAQ ako jeden zdroj, kde každá dvojica otázka/odpoveď je vlastný kúsok."""
    faqs = load_faqs()
    if not faqs:
        return []
    chunks = [f"Otázka: {q}\nOdpoveď: {a}" for q, a in faqs]
    return [make_source(f"{SITE_URL}/#faq", "faq", "Časté otázky (FAQ)", chunks)]


def gather_sources():
    """Všetok obsah na indexáciu. Nový zdroj = pridať sem jeden riadok."""
    sources = []
    sources += fetch_wp_articles()
    sources += fetch_faq_source()
    return sources


# ── Embeddingy (Gemini) ────────────────────────────────────────────────────

def embed(text, task_type="RETRIEVAL_DOCUMENT"):
    """Premení text na 768-rozmerný vektor cez Gemini. Vráti zoznam floatov."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{EMBED_MODEL}:embedContent"
    payload = {
        "model": f"models/{EMBED_MODEL}",
        "content": {"parts": [{"text": text}]},
        "taskType": task_type,
    }
    headers = {"x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json"}
    r = requests.post(url, headers=headers, json=payload, timeout=60)
    data = r.json()
    if r.status_code != 200:
        raise RuntimeError(f"Gemini embedding zlyhal: {r.status_code} {str(data)[:300]}")
    return data["embedding"]["values"]


# ── Zápis do databázy ──────────────────────────────────────────────────────

def existing_hash(cur, source_url):
    """Hash naposledy uloženej verzie zdroja (na preskočenie nezmeneného)."""
    cur.execute("SELECT content_hash FROM rag_chunks WHERE source_url = %s LIMIT 1", (source_url,))
    row = cur.fetchone()
    return row[0] if row else None


def index_source(conn, src):
    """Zaindexuje jeden zdroj. Vráti počet uložených kúskov (0 = preskočený).

    Bezpečne: najprv spočíta všetky embeddingy, a až keď sú OK, v jednej
    transakcii zmaže staré kúsky a vloží nové. Pri chybe embeddingu zostane
    starý obsah nedotknutý.
    """
    with conn.cursor() as cur:
        unchanged = existing_hash(cur, src["source_url"]) == src["content_hash"]
    conn.rollback()  # ukonči krátku čítaciu transakciu (nedrž ju počas embedovania)
    if unchanged:
        print(f"⏭️  Bez zmeny, preskakujem: {src['title']}")
        return 0

    vectors = [embed(c) for c in src["chunks"]]  # výnimka → rieši volajúci

    with conn:  # transakcia (commit na úspech, rollback na výnimku)
        with conn.cursor() as cur:
            cur.execute("DELETE FROM rag_chunks WHERE source_url = %s", (src["source_url"],))
            for i, (chunk, vec) in enumerate(zip(src["chunks"], vectors)):
                cur.execute(
                    """INSERT INTO rag_chunks
                       (source_url, source_type, title, chunk_index, chunk_text, content_hash, embedding)
                       VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                    (src["source_url"], src["source_type"], src["title"], i, chunk, src["content_hash"], vec),
                )
    print(f"✅ {src['title']} — {len(src['chunks'])} kúskov")
    return len(src["chunks"])


def run(dry_run=False):
    print("🔎 Zbieram obsah (WP články + FAQ)…")
    sources = gather_sources()
    total_chunks = sum(len(s["chunks"]) for s in sources)
    print(f"📚 Zdrojov: {len(sources)}, kúskov spolu: {total_chunks}")

    if dry_run:
        for s in sources:
            print(f"  • [{s['source_type']}] {s['title']} — {len(s['chunks'])} kúskov  ({s['source_url']})")
        print("\nℹ️  Dry-run: nič som neposielal do Gemini ani do databázy.")
        return

    if not RAG_DATABASE_URL:
        print("❌ Chýba RAG_DATABASE_URL (verejná adresa PostGIS). Pozri docs/rag-krok1-db.md.")
        sys.exit(1)
    if not GEMINI_API_KEY:
        print("❌ Chýba GEMINI_API_KEY.")
        sys.exit(1)

    import psycopg2

    indexed_sources = indexed_chunks = skipped = errors = 0
    conn = psycopg2.connect(RAG_DATABASE_URL)
    try:
        for src in sources:
            try:
                n = index_source(conn, src)
                if n:
                    indexed_sources += 1
                    indexed_chunks += n
                else:
                    skipped += 1
            except Exception as e:
                errors += 1
                print(f"⚠️  Zdroj „{src['title']}“ zlyhal, nechávam starú verziu: {e}")
    finally:
        conn.close()

    summary = (
        f"Indexácia hotová: {indexed_sources} zdrojov / {indexed_chunks} kúskov nových, "
        f"{skipped} bez zmeny, {errors} chýb."
    )
    print(f"\n🎉 {summary}")
    zapis_log("error" if errors else "success", topic="rag_index", message=summary, agent_name=AGENT_NAME)


if __name__ == "__main__":
    run(dry_run="--dry-run" in sys.argv)
