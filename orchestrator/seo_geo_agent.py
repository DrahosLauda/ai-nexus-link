"""SEO + GEO agent — vylepší koncept článku pre vyhľadávače aj AI.

Druhá „lego" kocka po Writerovi. Vezme koncept (od Writera alebo podľa ID),
nechá model navrhnúť SEO/GEO vylepšenia a **bezpečne** zapíše meta popis do WP
poľa `excerpt` (frontend ho renderuje ako `<meta description>`). Ostatné návrhy
(kľúčové slovo, interné odkazy, GEO tip) idú do `agent_logs` — rozhoduje človek.

Zásady (rovnaké ako Writer):
- Publikuje/mení len KONCEPTY — status článku nemení, človek schvaľuje.
- Config a logy v Directuse (klikaním); vlastný obmedzený token.
- Nikdy nezhodí beh — pri chybe zaloguje a skončí.

GEO = Generative Engine Optimization (optimalizácia pre AI vyhľadávače).

Použitie:
    python seo_geo_agent.py            # spracuje najnovší koncept
    python seo_geo_agent.py 802        # spracuje článok s daným ID
"""

import json
import re
import sys

import requests

from directus import nacitaj_config, zapis_log

# Znovupoužitie z Writera (bez duplikovania) — prihlásenie do WP a volania modelov.
from wp_writer_agent import (
    DEFAULT_TEXT_MODELS,
    WP_URL,
    _text_claude,
    _text_gemini,
    _text_openai_compat,
    wp_auth_header,
)

AGENT_NAME = "seo_geo"


def _generate_text(provider, model, system_prompt, prompt):
    """Jednotné volanie modelu podľa poskytovateľa (rovnaká sada ako Writer)."""
    if provider == "gemini":
        return _text_gemini(model, system_prompt, prompt)
    if provider == "claude":
        return _text_claude(model, system_prompt, prompt)
    return _text_openai_compat(provider, model, system_prompt, prompt)  # zai, kimi


def get_target_post(post_id=None):
    """Vráti článok na spracovanie: podľa ID, inak najnovší koncept.

    Koncepty nie sú verejné, preto čítame s prihlásením (application password).
    """
    if post_id:
        url = f"{WP_URL}/wp-json/wp/v2/posts/{post_id}"
        params = {"context": "edit"}
    else:
        url = f"{WP_URL}/wp-json/wp/v2/posts"
        params = {"status": "draft", "per_page": 1, "orderby": "date", "order": "desc", "context": "edit"}

    response = requests.get(url, headers=wp_auth_header(), params=params, timeout=30)
    response.raise_for_status()
    data = response.json()
    if post_id:
        return data
    return data[0] if data else None


def get_link_candidates(exclude_id):
    """Zoznam publikovaných článkov (titulok + slug) ako návrhy interných odkazov."""
    try:
        response = requests.get(
            f"{WP_URL}/wp-json/wp/v2/posts",
            params={"status": "publish", "per_page": 30, "_fields": "id,slug,title"},
            timeout=30,
        )
        response.raise_for_status()
        return [
            {"titulok": re.sub(r"<[^>]+>", "", p["title"]["rendered"]).strip(), "slug": p["slug"]}
            for p in response.json()
            if p.get("id") != exclude_id
        ]
    except Exception:
        return []


def seo_prompt(title, content_html, candidates):
    """Zadanie pre model — vráti IBA JSON so SEO/GEO návrhmi."""
    zoznam = "\n".join(f'- "{c["titulok"]}" (slug: {c["slug"]})' for c in candidates) or "(žiadne)"
    return f"""
Si SEO a GEO špecialista pre slovenský web. Dostaneš článok a zoznam iných článkov.
Vráť IBA platný JSON objekt (nič pred ním ani za ním) s presne týmito kľúčmi:
- "meta_popis": pútavý SEO meta popis po slovensky, 150–160 znakov, bez HTML,
  vystihne článok a láka na klik.
- "focus_keyword": hlavné kľúčové slovo alebo krátka fráza (po slovensky).
- "interne_odkazy": pole max 3 návrhov zo zoznamu nižšie (každý objekt:
  {{"titulok": "...", "slug": "...", "preco": "krátky dôvod"}}). Ak nič nesedí, [].
- "geo_tip": jedna veta — ako zlepšiť citovateľnosť pre AI vyhľadávače.

Titulok článku: "{title}"

Obsah článku (HTML):
{content_html[:6000]}

Iné články na webe (kandidáti na interné odkazy):
{zoznam}
""".strip()


def parse_navrhy(text):
    """Z odpovede modelu vytiahne JSON objekt. Vráti dict alebo None."""
    cleaned = text.replace("```json", "").replace("```", "").strip()
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None


def update_excerpt(post_id, meta_popis):
    """Zapíše meta popis do WP poľa `excerpt`. Status článku NEMENÍ (ostáva koncept)."""
    response = requests.post(
        f"{WP_URL}/wp-json/wp/v2/posts/{post_id}",
        headers=wp_auth_header() | {"Content-Type": "application/json"},
        json={"excerpt": meta_popis},
        timeout=30,
    )
    response.raise_for_status()


def optimalizuj(post_id=None):
    if not WP_URL:
        print("❌ Chýba WP_URL v .env.")
        return

    # 0. Config z Directusu (poskytovateľ/model/prompt); bez neho rozumné defaulty.
    config = nacitaj_config(AGENT_NAME) or {}
    provider = config.get("text_provider") or "gemini"
    model = config.get("text_model") or DEFAULT_TEXT_MODELS.get(provider)
    system_prompt = config.get("system_prompt") or None

    # 1. Nájdi článok.
    try:
        post = get_target_post(post_id)
    except Exception as e:
        print(f"❌ Nepodarilo sa načítať článok: {e}")
        zapis_log("error", message=f"Načítanie článku zlyhalo: {e}", agent_name=AGENT_NAME)
        return
    if not post:
        print("ℹ️  Žiadny koncept na spracovanie.")
        zapis_log("success", message="Žiadny koncept na spracovanie.", agent_name=AGENT_NAME)
        return

    pid = post["id"]
    title = re.sub(r"<[^>]+>", "", post["title"]["rendered"]).strip()
    content_html = post["content"]["rendered"]
    print(f"🔎 Optimalizujem článok ID {pid}: „{title}“ (poskytovateľ: {provider}, model: {model})")

    # 2. Model navrhne SEO/GEO vylepšenia.
    candidates = get_link_candidates(exclude_id=pid)
    try:
        raw = _generate_text(provider, model, system_prompt, seo_prompt(title, content_html, candidates))
    except Exception as e:
        print(f"❌ Model zlyhal: {e}")
        zapis_log("error", topic=title, message=f"Generovanie návrhov zlyhalo: {e}", wp_post_id=pid, agent_name=AGENT_NAME)
        return

    navrhy = parse_navrhy(raw)
    if not navrhy or not navrhy.get("meta_popis"):
        print("⚠️  Odpoveď modelu sa nedala spracovať na JSON.")
        zapis_log("error", topic=title, message=f"Neplatná odpoveď modelu: {raw[:300]}", wp_post_id=pid, agent_name=AGENT_NAME)
        return

    meta_popis = navrhy["meta_popis"].strip()

    # 3. Bezpečne zapíš meta popis do konceptu (status nemeníme).
    try:
        update_excerpt(pid, meta_popis)
    except Exception as e:
        print(f"❌ Zápis meta popisu zlyhal: {e}")
        zapis_log("error", topic=title, message=f"Zápis excerpt zlyhal: {e}", wp_post_id=pid, agent_name=AGENT_NAME)
        return

    # 4. Ostatné návrhy (kľúčové slovo, odkazy, GEO tip) do logu — rozhoduje človek.
    odkazy = navrhy.get("interne_odkazy") or []
    odkazy_txt = "; ".join(f'{o.get("titulok")} (/blog/{o.get("slug")})' for o in odkazy) or "žiadne"
    sprava = (
        f"Meta popis nastavený ({len(meta_popis)} zn.). "
        f"Kľúčové slovo: {navrhy.get('focus_keyword', '—')}. "
        f"Interné odkazy: {odkazy_txt}. "
        f"GEO tip: {navrhy.get('geo_tip', '—')}"
    )
    print(f"✅ {sprava}")
    zapis_log("success", topic=title, message=sprava, wp_post_id=pid, agent_name=AGENT_NAME)
    print("   Skontroluj koncept vo wp-admin a publikuj.")


if __name__ == "__main__":
    arg = sys.argv[1] if len(sys.argv) > 1 else None
    optimalizuj(post_id=arg)
