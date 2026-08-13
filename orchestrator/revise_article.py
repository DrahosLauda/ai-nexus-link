"""
Revízia existujúceho článku — smerovanie na NAŠE riešenia (nie cudzie nástroje).

Prečíta publikovaný WP článok, prepíše ho tak, aby odporúčal naše riešenia ako
prínos pre klienta, ZACHOVÁ obrázky aj tému, a uloží ho ako NOVÝ KONCEPT
„[REVÍZIA] …" na ľudské schválenie. **Pôvodný článok NIKDY nemení.**

Použitie:
    python revise_article.py <ID>            # vytvorí koncept-revíziu vo WP
    python revise_article.py <ID> --dry-run  # len vypíše návrh, nič nezapíše

Poznámka k SEO: revidujte postupne (nie hromadne naraz) a originál nahrádzajte
až po kontrole — náhle masové zmeny obsahu môžu zakolísať pozíciami v Googli.
"""

import re
import sys

import requests

from wp_writer_agent import (
    WP_URL,
    wp_auth_header,
    DEFAULT_TEXT_MODELS,
    _text_openai_compat,
    _text_gemini,
    _text_claude,
)
from directus import nacitaj_config, zapis_log


def generate_text(provider, model, system_prompt, prompt):
    """Text cez zvoleného poskytovateľa (rovnaký vzor ako Writer)."""
    if provider == "gemini":
        return _text_gemini(model, system_prompt, prompt)
    if provider == "claude":
        return _text_claude(model, system_prompt, prompt)
    return _text_openai_compat(provider, model, system_prompt, prompt)


def fetch_article(post_id):
    """Načíta titulok a HTML obsah publikovaného článku."""
    r = requests.get(
        f"{WP_URL}/wp-json/wp/v2/posts/{post_id}",
        params={"_fields": "id,title,content"},
        timeout=60,
    )
    if r.status_code != 200:
        raise RuntimeError(f"Nepodarilo sa načítať článok {post_id}: WP {r.status_code} {r.text[:200]}")
    data = r.json()
    return data["title"]["rendered"], data["content"]["rendered"]


def revision_prompt(title, html):
    return f"""
    Tu je existujúci článok na našom webe (HTML). Uprav ho tak, aby namiesto
    cudzích platených nástrojov odporúčal NAŠE riešenia (AI automatizácia,
    moderný headless web, náš chatbot / rezervácie / tvorba obsahu) ako PRÍNOS
    pre klienta (ušetrený čas a peniaze), a na konci pridaj nenásilné CTA na
    nezáväznú bezplatnú konzultáciu.

    Prísne pravidlá:
    - ZACHOVAJ tému, štruktúru aj všetky existujúce <img> tagy presne ako sú.
    - NEvymýšľaj si čísla, percentá, ceny ani štúdie.
    - Nemeň zmysel faktov — len presmeruj odporúčania na naše riešenia.
    - Slovenčina, čistý HTML (bez <html>, <head>, <body> tagov).

    Pôvodný titulok: {title}

    Vráť odpoveď presne takto:
    - Prvý riadok: TITLE: (rovnaký alebo jemne vylepšený titulok)
    - Od druhého riadku IBA upravené HTML, nič iné.

    Pôvodný článok:
    {html}
    """


def revise(post_id, dry_run=False):
    config = nacitaj_config() or {}
    provider = config.get("text_provider") or "zai"
    model = config.get("text_model") or DEFAULT_TEXT_MODELS.get(provider, "glm-4.5-flash")
    system_prompt = config.get("system_prompt") or None

    print(f"📥 Načítavam článok {post_id}…")
    orig_title, html = fetch_article(post_id)

    out = generate_text(provider, model, system_prompt, revision_prompt(orig_title, html))
    out = out.replace("```html", "").replace("```", "").strip()

    new_title = f"[REVÍZIA] {orig_title}"
    match = re.match(r"\s*TITLE:\s*(.+)", out)
    if match:
        new_title = f"[REVÍZIA] {match.group(1).strip()}"
        out = out[match.end():].strip()

    if dry_run:
        print(f"\n=== NÁVRH (dry-run — nič nezapisujem) — {new_title} ===\n")
        print(out)
        return None

    print(f"📝 Vytváram koncept: {new_title}")
    r = requests.post(
        f"{WP_URL}/wp-json/wp/v2/posts",
        headers=wp_auth_header() | {"Content-Type": "application/json"},
        json={"title": new_title, "content": out, "status": "draft"},
        timeout=60,
    )
    if r.status_code == 201:
        new_id = r.json().get("id")
        print(f"✅ Koncept-revízia vytvorená (ID: {new_id}).")
        print("   Skontroluj ju vo wp-admin → Články a nahraď originál až po kontrole.")
        zapis_log(
            "success",
            topic=f"revízia #{post_id}",
            message=f"Koncept „[REVÍZIA] {orig_title}“ (originál nezmenený).",
            wp_post_id=new_id,
        )
        return new_id

    print(f"❌ WordPress vrátil chybu: {r.status_code}\n{r.text[:300]}")
    zapis_log("error", topic=f"revízia #{post_id}", message=f"WP {r.status_code}: {r.text[:200]}")
    return None


if __name__ == "__main__":
    args = sys.argv[1:]
    dry = "--dry-run" in args
    ids = [a for a in args if not a.startswith("--")]
    if not ids:
        print("Použitie: python revise_article.py <ID> [--dry-run]")
        sys.exit(1)
    revise(ids[0], dry_run=dry)
