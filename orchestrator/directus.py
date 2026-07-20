"""Pomocník na komunikáciu agentov s Directusom.

Na jednom mieste sústreďuje dve veci, ktoré potrebuje každý agent:
- načítať si svoje nastavenia z kolekcie `agent_config`,
- zapísať po sebe stopu do kolekcie `agent_logs`.

Zásada: tento modul NIKDY nezhodí hlavný beh agenta. Keď Directus nie je
dostupný (napr. výpadok), funkcie len vypíšu varovanie a agent pokračuje
s rozumnými defaultmi — článok vznikne aj bez configu/logu.
"""

import os

import requests
from dotenv import load_dotenv

load_dotenv()

DIRECTUS_URL = os.getenv("DIRECTUS_URL")
DIRECTUS_TOKEN = os.getenv("DIRECTUS_TOKEN")

# Meno agenta, ktorého config/logy tento skript používa. Neskôr pribudnú
# ďalší agenti (napr. SEO) s vlastným menom.
AGENT_NAME = "wp_writer"


def _headers():
    return {
        "Authorization": f"Bearer {DIRECTUS_TOKEN}",
        "Content-Type": "application/json",
    }


def _dostupny():
    """Overí, či máme kam a čím sa pripojiť."""
    return bool(DIRECTUS_URL and DIRECTUS_TOKEN)


def nacitaj_config(agent_name=AGENT_NAME):
    """Vráti aktívny konfiguračný riadok agenta z `agent_config`.

    Hľadá riadok, kde `agent_name` sedí a `is_active` je zapnuté. Ak taký
    nie je (alebo je Directus nedostupný), vráti None a agent použije defaulty.
    """
    if not _dostupny():
        print("ℹ️  Directus nie je nastavený (DIRECTUS_URL/TOKEN) — použijem defaulty.")
        return None

    params = {
        "filter[agent_name][_eq]": agent_name,
        "filter[is_active][_eq]": "true",
        "limit": 1,
    }
    try:
        response = requests.get(
            f"{DIRECTUS_URL}/items/agent_config",
            headers=_headers(),
            params=params,
            timeout=30,
        )
        if response.status_code != 200:
            print(f"⚠️  agent_config sa nepodarilo načítať: {response.status_code} {response.text[:200]}")
            return None
        data = response.json().get("data", [])
        if not data:
            print(f"ℹ️  Pre agenta „{agent_name}“ nie je aktívny config — použijem defaulty.")
            return None
        print(f"✅ Načítaný config agenta „{agent_name}“ z Directusu.")
        return data[0]
    except Exception as e:
        print(f"⚠️  Chyba pri čítaní agent_config: {e}")
        return None


def zapis_log(status, topic=None, message=None, wp_post_id=None, agent_name=AGENT_NAME):
    """Pridá záznam do `agent_logs`. Zlyhanie zápisu logu nikdy nezhodí agenta.

    status: "success" alebo "error".
    """
    if not _dostupny():
        return

    payload = {
        "agent_name": agent_name,
        "status": status,
        "topic": topic,
        "message": message,
        "wp_post_id": wp_post_id,
    }
    try:
        response = requests.post(
            f"{DIRECTUS_URL}/items/agent_logs",
            headers=_headers(),
            json=payload,
            timeout=30,
        )
        if response.status_code not in (200, 204):
            print(f"⚠️  Log sa nepodarilo zapísať: {response.status_code} {response.text[:200]}")
        else:
            print(f"📝 Zápis do agent_logs: {status}.")
    except Exception as e:
        print(f"⚠️  Chyba pri zápise agent_logs: {e}")
