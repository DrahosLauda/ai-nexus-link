/** Odošle lead na /api/lead; vráti chybovú hlášku alebo null pri úspechu. */
export async function submitLead(lead: {
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
  website?: string; // honeypot
}): Promise<string | null> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (res.ok) return null;
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    return data?.error ?? "Odoslanie zlyhalo. Skúste to prosím znova.";
  } catch {
    return "Odoslanie zlyhalo. Skontrolujte pripojenie a skúste znova.";
  }
}
