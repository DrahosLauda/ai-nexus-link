/**
 * Vloží štruktúrované dáta (JSON-LD) do stránky ako <script>.
 *
 * Štruktúrované dáta sú „strojovo čitateľný ťahák" o obsahu — Google z nich
 * robí rich results a AI vyhľadávače podľa nich lepšie chápu a citujú stránku.
 * Prijíma jeden objekt alebo pole objektov (schém).
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // Obsah je náš vlastný, serverom vygenerovaný objekt — bezpečné.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
