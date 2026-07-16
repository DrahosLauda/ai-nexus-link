export const heroBullets = [
  "Klienti priemerne ušetria 10+ hodín týždenne",
  "AI asistent pracuje 24/7 — bez chýb a bez prestávok",
  "Napojenie na vaše existujúce nástroje v priebehu dní",
];

export const stats = [
  { value: "60+", label: "spokojných klientov z celého Slovenska" },
  { value: "10 hod.", label: "priemerná týždenná úspora času" },
  { value: "48 hod.", label: "od konzultácie k prvému riešeniu" },
  { value: "100 %", label: "komunikácia bez žargónu" },
];

export const steps = [
  {
    num: "01",
    title: "Bezplatná konzultácia",
    body: "Porozprávame sa o tom, čo vás najviac zdržiava. Žiadne technické výsluchy — stačí opísať bežný pracovný deň.",
  },
  {
    num: "02",
    title: "Návrh riešenia",
    body: "Do pár dní dostanete konkrétny návrh: čo zautomatizujeme, čo to prinesie a koľko to bude stáť.",
  },
  {
    num: "03",
    title: "Nasadenie a podpora",
    body: "Všetko nastavíme, zaškolíme vás a zostaneme na blízku. Prvé výsledky uvidíte do 48 hodín.",
  },
];

export const testimonials = [
  {
    quote:
      "Chatbot na webe nám vybaví väčšinu otázok zákazníkov. Konečne večer neodpisujem na e‑maily.",
    name: "Martina K.",
    initials: "MK",
    role: "majiteľka e‑shopu, Trnava",
  },
  {
    quote:
      "Faktúry a objednávky sa spracujú samy. Ušetrím celý deň v týždni a všetko mi trpezlivo vysvetlili.",
    name: "Peter H.",
    initials: "PH",
    role: "stolárstvo, Žilina",
  },
  {
    quote:
      "Ako neziskovka sme sa báli, že digitál je nad naše sily. Dnes máme prihlášky, evidenciu aj newsletter na pár klikov.",
    name: "Zuzana B.",
    initials: "ZB",
    role: "občianske združenie, Košice",
  },
];

export const faqs = [
  {
    q: "Musím rozumieť technológiám?",
    a: "Vôbec nie. Všetko nastavíme za vás a vysvetlíme jednoduchou rečou. Naším cieľom je, aby ste nástroje vedeli pohodlne používať — nie ich programovať.",
  },
  {
    q: "Koľko to stojí?",
    a: "Prvá konzultácia je zadarmo. Potom dostanete jasnú cenovú ponuku podľa rozsahu — bez skrytých poplatkov. Malé automatizácie začínajú na stovkách eur, nie tisícoch.",
  },
  {
    q: "Ako rýchlo uvidím výsledky?",
    a: "Prvé riešenie zvyčajne nasadíme do 48 hodín od konzultácie. Väčšie projekty (weby, komplexné automatizácie) trvajú 2–4 týždne.",
  },
  {
    q: "Čo ak niečo prestane fungovať?",
    a: "Zostávame na blízku. Ku každému riešeniu ponúkame podporu — napíšete nám a vyriešime to, zvyčajne ešte v ten deň.",
  },
];

/**
 * Záložné články — zobrazia sa, len keď sa nepodarí načítať skutočné
 * články z WordPressu (www.digitalnapomoc.sk).
 */
export const fallbackPosts = [
  {
    tag: "AI v praxi",
    date: "8. júl 2026",
    read: "6",
    href: "#blog",
    title: "Koľko stojí AI pre malú firmu? Menej, než si myslíte",
    excerpt:
      "Prehľad reálnych nákladov na chatbota či automatizáciu — a kedy sa investícia vráti.",
  },
  {
    tag: "Automatizácia",
    date: "24. jún 2026",
    read: "5",
    href: "#blog",
    title: "5 rutinných úloh, ktoré za vás zvládne automatizácia",
    excerpt:
      "Faktúry, objednávky, e‑maily, reporty a plánovanie — konkrétne príklady zo slovenských firiem.",
  },
  {
    tag: "Návod",
    date: "10. jún 2026",
    read: "7",
    href: "#blog",
    title: "AI chatbot na webe: čo čakať v prvom mesiaci",
    excerpt:
      "Ako prebieha nasadenie, čo sa chatbot naučí a ako merať, či sa oplatí.",
  },
];

// Absolútne cesty ("/#sluzby"), aby menu fungovalo aj z podstránok blogu.
export const navLinks = [
  { href: "/#sluzby", label: "Služby" },
  { href: "/#postup", label: "Ako to funguje" },
  { href: "/#referencie", label: "Referencie" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
];
