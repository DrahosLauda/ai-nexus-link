/**
 * Základ interných ciest šablóny. Všetky odkazy v balíku sa stavajú cez `href()`,
 * aby lift ku klientovi (šablóna do rootu domény) bola zmena jediného miesta:
 * stačí `TEMPLATE_BASE = ""`.
 *
 * Hrefy v `content.ts` sú písané root-relatívne (napr. `/ponuka`,
 * `/kontakt?typ=kytica`, `/ponuka#predplatne`) — `href()` k nim prilepí základ
 * a korektne zachová query aj hash.
 */
export const TEMPLATE_BASE = "/ukazky/kvetinarstvo";

export function href(path: string): string {
  if (!path.startsWith("/")) return path; // externé / kotva bez cesty nechávame
  if (path === "/") return TEMPLATE_BASE || "/";
  return `${TEMPLATE_BASE}${path}`;
}
