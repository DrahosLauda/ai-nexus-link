"""Reťazec agentov: Writer napíše koncept → SEO+GEO agent ho vylepší.

Jeden beh, dvaja agenti za sebou. Určené ako Start Command cron workera na
Railway (`python run_pipeline.py`) — nahrádza samostatné spúšťanie Writera.

Prečo takto (a nie druhý cron): je to **deterministické** — SEO agent dostane
presne to ID článku, ktoré Writer práve vytvoril. Žiadne „hádanie najnovšieho
konceptu" ani preteky v čase medzi dvomi cronmi.

Ručné spustenie jednotlivých agentov ostáva (`python wp_writer_agent.py`,
`python seo_geo_agent.py`).
"""

from seo_geo_agent import optimalizuj
from wp_writer_agent import generate_and_post_article


def main():
    print("▶️  Reťazec: Writer → SEO+GEO agent")

    post_id = generate_and_post_article()
    if not post_id:
        print("⏹️  Writer nevytvoril koncept — SEO+GEO agent preskočený.")
        return

    print(f"➡️  Odovzdávam článok ID {post_id} SEO+GEO agentovi…")
    optimalizuj(post_id=post_id)
    print("✅ Reťazec dokončený.")


if __name__ == "__main__":
    main()
