"""Reťazec agentov: Writer napíše koncept → SEO+GEO agent ho vylepší.

Jeden beh, dvaja agenti za sebou. Určené ako Start Command cron workera na
Railway (`python run_pipeline.py`) — nahrádza samostatné spúšťanie Writera.

Prečo takto (a nie druhý cron): je to **deterministické** — SEO agent dostane
presne to ID článku, ktoré Writer práve vytvoril. Žiadne „hádanie najnovšieho
konceptu" ani preteky v čase medzi dvomi cronmi.

Ručné spustenie jednotlivých agentov ostáva (`python wp_writer_agent.py`,
`python seo_geo_agent.py`).
"""

import os

import rag_index
from seo_geo_agent import optimalizuj
from wp_writer_agent import generate_and_post_article


def reindex_rag():
    """Doindexovanie do RAG chatbota (publikované články → rag_chunks).

    Beží pri každom behu pipeline, aby sa nové/ručne publikované články samy
    dostali do chatbota (Cesta B — bez samostatného cronu). Je oddelené od
    Writera a NIKDY nezhodí hlavný beh: chýbajúca konfigurácia či chyba sa len
    vypíše. Reindex je „šikovný" (preskočí nezmenené), takže je lacný.
    """
    if not os.getenv("RAG_DATABASE_URL"):
        print("ℹ️  RAG_DATABASE_URL nie je nastavené — doindexovanie preskočené.")
        return
    try:
        print("🔄 Doindexovanie RAG (nové publikované články)…")
        rag_index.run()
    except SystemExit as e:
        print(f"⚠️  RAG doindexovanie skončilo predčasne (kód {e.code}) — pokračujem.")
    except Exception as e:
        print(f"⚠️  RAG doindexovanie zlyhalo (pokračujem): {e}")


def main():
    print("▶️  Reťazec: Writer → SEO+GEO agent → RAG reindex")

    post_id = generate_and_post_article()
    if post_id:
        print(f"➡️  Odovzdávam článok ID {post_id} SEO+GEO agentovi…")
        optimalizuj(post_id=post_id)
        print("✅ Writer + SEO+GEO dokončené.")
    else:
        print("⏹️  Writer nevytvoril koncept — SEO+GEO agent preskočený.")

    # Doindexovanie beží vždy (nezávisle od Writera) — zachytí aj ručne
    # publikované články od posledného behu.
    reindex_rag()
    print("✅ Reťazec dokončený.")


if __name__ == "__main__":
    main()
