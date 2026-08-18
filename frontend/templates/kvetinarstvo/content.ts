/**
 * Boma Flora — kvetinový ateliér v centre Trenčína (demo obsah šablóny „kvetinárstvo").
 *
 * Jediné miesto pravdy pre texty šablóny. Sekcie a rozvrh stránok podľa
 * `templates/kvetinarstvo/DESIGN.md`. Fiktívna, ale uveriteľná demo značka —
 * žiadne vymyslené ocenenia/certifikáty, len konkrétne, overiteľné tvrdenia
 * (adresa, hodiny, postup objednávky).
 */

// ---------------------------------------------------------------------------
// Zdieľané typy
// ---------------------------------------------------------------------------

export interface Odkaz {
  label: string;
  href: string;
}

export interface Meta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export interface OtvaracieHodiny {
  dni: string;
  hodiny: string;
}

/** Editorial riadok v sekcii „Služby" na Domove (01–05). */
export interface Sluzba {
  cislo: string;
  nazov: string;
  popis: string;
  href: string;
}

/** Sezóna odrody — kedy vrcholí (uvádzame ju pri zložení kytice). */
export type Sezona = "jar" | "leto" | "jesen" | "zima" | "celorocne";

/** Príležitosť, ku ktorej sa kytica hodí (filter v katalógu). */
export type Prilezitost =
  | "narodeniny"
  | "vyrocie"
  | "svadba"
  | "premamu"
  | "smutok"
  | "gratulacia"
  | "potesenie";

/**
 * Jedna rezaná odroda, z ktorej viažeme. Poháňa sekciu „Z čoho je" na detaile
 * kytice — `id` odkazuje aj na foto-výrez v `images/media.ts` (`odrodaVyrezy`).
 * `farba` je kľúč do `farbyKvetov`.
 */
export interface Odroda {
  id: string;
  nazov: string;
  farba: string;
  sezona: Sezona;
}

/** Veľkostný variant kytice — počet stoniek, priemer a cena. */
export interface KyticaVariant {
  kod: "S" | "M" | "L";
  nazov: string;
  /** Počet stoniek v tejto veľkosti. */
  stonky: number;
  /** Priemer hotovej väzby v centimetroch. */
  priemerCm: number;
  /** Cena v eurách — ČÍSLO (formátuje ho `Intl` v sk-SK/EUR). */
  cena: number;
}

/** Fotka produktu. `src` prázdne = palete verný placeholder (`FloraFigure`). */
export interface KyticaFotka {
  src?: string;
  alt: string;
}

/** Forma väzby — filter „typ" v katalógu. */
export type KyticaTyp = "kytica" | "aranzman" | "box" | "smutocna";

/** Nálepka na karte (najviac jedna — inak stratí význam). */
export type Nalepka = "bestseller" | "sezonne" | "novinka";

/**
 * Hotová kytica ako produkt katalógu `/kytice` — model „Kvetinový e-shop na kľúč".
 *
 * Tvar zodpovedá tomu, ako produkt vyzerá vo WooCommerce (názov, fotky, varianty,
 * atribúty), aby sa v E2 vymenil len zdroj dát (`katalog.ts` → Woo Store API) a
 * komponenty ostali nezmenené. Cena „od" sa neukladá — počíta sa z variantov
 * (`cenaOd()` v `katalog.ts`), nech neexistujú dve pravdy o cene.
 */
export interface Kytica {
  id: string;
  slug: string;
  nazov: string;
  /** Jedna veta na kartu a do meta popisu detailu. */
  perex: string;
  /** Odsek do sekcie „O kytici". */
  popis: string;
  fotky: KyticaFotka[];
  /** Z čoho ju viažeme — `id` do `odrody`. */
  zlozenie: string[];
  varianty: KyticaVariant[];
  /** Ako dlho vydrží vo váze (konkrétne, podľa odrôd). */
  trvacnost: string;
  /** Čo presne zákazník dostane v cene. */
  vCene: string[];
  prilezitosti: Prilezitost[];
  /** Prevládajúci odtieň — kľúč do `farbyKvetov` (filter „farba"). */
  farba: string;
  typ: KyticaTyp;
  nalepka?: Nalepka;
}

/** Karta kategórie na `/ponuka`. */
export interface Kategoria {
  nazov: string;
  popis: string;
  cena: string;
  href: string;
  /** Text tlačidla karty (líši sa — „Objednať" vs. „Pozrieť kytice"). */
  cta: string;
}

export interface Referencia {
  citat: string;
  meno: string;
  prilezitost: string;
}

export interface Krok {
  cislo: string;
  nazov: string;
  popis: string;
}

export interface Otazka {
  otazka: string;
  odpoved: string;
}

export interface SezonneObdobie {
  obdobie: string;
  kvety: string[];
}

export interface PredplatneFrekvencia {
  frekvencia: string;
  cena: string;
}

export interface CenovaUroven {
  nazov: string;
  cena: string;
  popis: string;
}

export interface Realizacia {
  miesto: string;
  popis: string;
  alt: string;
}

export interface PolozkaObchodu {
  nazov: string;
  cena: string;
  popis: string;
}

/** Blok textu v tele blogového článku — odsek alebo medzinadpis. */
export interface ClanokBlok {
  typ: "odsek" | "medzinadpis";
  text: string;
}

export interface Clanok {
  slug: string;
  titulok: string;
  perex: string;
  datum: string;
  /** Strojovo čitateľný dátum (ISO 8601) pre `<time dateTime>`. */
  datumISO: string;
  citanieMinut: number;
  obrazokAlt: string;
  telo: ClanokBlok[];
}

export interface ClenTimu {
  meno: string;
  rola: string;
  veta: string;
  alt: string;
}

export interface TypObjednavky {
  hodnota: string;
  label: string;
}

export interface NavPolozka {
  href: string;
  label: string;
  popis?: string;
}

/** Hlavička sekcie — eyebrow + nadpis (+ voliteľný popis). */
export interface Zahlavie {
  eyebrow?: string;
  nadpis: string;
  popis?: string;
}

// ---------------------------------------------------------------------------
// Značka a globálne údaje (hlavička, pätička, kontakt)
// ---------------------------------------------------------------------------

export const brand = {
  meno: "Boma Flora",
  slogan: "Kvetinový ateliér v centre Trenčína",
  adresaRiadok1: "Mierové námestie 12",
  adresaRiadok2: "911 01 Trenčín",
  telefon: "+421 902 345 678",
  email: "info@bomaflora.sk",
  otvaracieHodiny: [
    { dni: "Pondelok – Piatok", hodiny: "8:30 – 17:30" },
    { dni: "Sobota", hodiny: "9:00 – 12:00" },
    { dni: "Nedeľa", hodiny: "zatvorené" },
  ] as OtvaracieHodiny[],
  socialne: {
    instagram: "#",
    facebook: "#",
    pinterest: "#",
  },
};

/** Hlavička — 6 odkazov + CTA pilulka (Kontakt nie je v menu, viď DESIGN.md). */
export const headerNav: NavPolozka[] = [
  { href: "/kytice", label: "Kytice" },
  { href: "/ponuka", label: "Ponuka" },
  { href: "/svadby", label: "Svadby a eventy" },
  { href: "/obchod", label: "Obchod" },
  { href: "/blog", label: "Blog" },
  { href: "/atelier", label: "Ateliér" },
];

export const headerCta: Odkaz = { label: "Objednať kvety", href: "/kontakt" };

/** Pätička — krátky text o značke + mini-mapa všetkých 7 stránok. */
export const footerText =
  "Boma Flora je kvetinový ateliér v centre Trenčína. Kytice viažeme na počkanie aj na objednávku, od bežného dňa až po svadobný deň.";

export const footerNav: NavPolozka[] = [
  { href: "/", label: "Domov", popis: "Úvodná stránka a aktuálna ponuka" },
  { href: "/kytice", label: "Kytice", popis: "Hotové kytice, ktoré viažeme — s cenou a veľkosťami" },
  { href: "/ponuka", label: "Ponuka", popis: "Kytice, sezónny kalendár a predplatné" },
  { href: "/svadby", label: "Svadby a eventy", popis: "Kvetinová výzdoba na váš veľký deň" },
  { href: "/obchod", label: "Obchod", popis: "Sortiment a budúci online nákup" },
  { href: "/blog", label: "Blog", popis: "Sezóna, starostlivosť a zákulisie ateliéru" },
  { href: "/atelier", label: "Ateliér", popis: "Kto sme a ako pracujeme" },
  { href: "/kontakt", label: "Kontakt", popis: "Adresa, hodiny a objednávkový formulár" },
];

// ---------------------------------------------------------------------------
// Meta / OG — po jednom zázname na stránku (aj keď je vetva `noindex`)
// ---------------------------------------------------------------------------

export const meta: Record<
  "domov" | "kytice" | "ponuka" | "svadby" | "obchod" | "blog" | "atelier" | "kontakt",
  Meta
> = {
  domov: {
    title: "Boma Flora — kvetinový ateliér v centre Trenčína",
    description:
      "Kytice na počkanie aj na objednávku, svadobná výzdoba a smútočná väzba. Kvetinový ateliér na Mierovom námestí v Trenčíne.",
    ogTitle: "Boma Flora — kvetinový ateliér v centre Trenčína",
    ogDescription:
      "Kytice, svadobná výzdoba a smútočná väzba z ateliéru v centre Trenčína. Doručenie po Trenčíne, vyzdvihnutie na Mierovom námestí.",
  },
  ponuka: {
    title: "Ponuka kvetov — Boma Flora Trenčín",
    description:
      "Kytice dňa, kytice na mieru, smútočné vence a predplatné kvetov. Sezónny kalendár kvetov a doručenie po Trenčíne.",
    ogTitle: "Ponuka — Boma Flora",
    ogDescription:
      "Kytice dňa, kytice na mieru, smútočná väzba, kvety do vázy a predplatné — ponuka kvetinového ateliéru Boma Flora v Trenčíne.",
  },
  svadby: {
    title: "Svadby a eventy — Boma Flora Trenčín",
    description:
      "Svadobné kytice a kompletná kvetinová výzdoba obradu aj hostiny. Realizácie z Trenčína a Považia, ceny od 180 €.",
    ogTitle: "Svadby a eventy — Boma Flora",
    ogDescription:
      "Kvetinová výzdoba svadieb a eventov v Trenčíne a na Považí — od kytice nevesty po kompletnú inštaláciu.",
  },
  obchod: {
    title: "Obchod — Boma Flora Trenčín",
    description:
      "Sortiment kvetinového ateliéru Boma Flora — kytice, predplatné a darčekové poukazy. Online nákup pripravujeme.",
    ogTitle: "Obchod — Boma Flora",
    ogDescription:
      "Kytice, predplatné kvetov a darčekové poukazy z ateliéru Boma Flora. Zatiaľ objednávka telefonicky alebo formulárom.",
  },
  kytice: {
    title: "Hotové kytice — Boma Flora Trenčín",
    description:
      "Kytice, ktoré viažeme celý rok — s cenou, veľkosťou aj zoznamom odrôd. Filtrujte podľa príležitosti, farby a typu väzby.",
    ogTitle: "Hotové kytice — Boma Flora",
    ogDescription:
      "Katalóg hotových kytíc kvetinového ateliéru Boma Flora v Trenčíne: tri veľkosti, konkrétne odrody, doručenie po meste.",
  },
  blog: {
    title: "Blog — Boma Flora Trenčín",
    description:
      "O sezónnych kvetoch, starostlivosti o rezané kvety a zákulisí kvetinového ateliéru v centre Trenčína.",
    ogTitle: "Blog — Boma Flora",
    ogDescription: "Sezónne kvety, starostlivosť o kytice a zákulisie ateliéru Boma Flora.",
  },
  atelier: {
    title: "Ateliér — Boma Flora Trenčín",
    description:
      "Kvetinový ateliér v centre Trenčína od roku 2014. Kto sme, ako pracujeme a odkiaľ nakupujeme kvety.",
    ogTitle: "Ateliér — Boma Flora",
    ogDescription: "Príbeh, tím a spôsob práce kvetinového ateliéru Boma Flora v Trenčíne.",
  },
  kontakt: {
    title: "Kontakt a objednávka — Boma Flora Trenčín",
    description:
      "Adresa, otváracie hodiny a objednávkový formulár kvetinového ateliéru Boma Flora na Mierovom námestí v Trenčíne.",
    ogTitle: "Kontakt — Boma Flora",
    ogDescription: "Napíšte, zavolajte alebo príďte do ateliéru na Mierovom námestí v Trenčíne.",
  },
};

// ---------------------------------------------------------------------------
// Kalendár menín — copywriting pre podpisový prvok (dáta/tabuľka mien rieši
// frontend-dev, viď DESIGN.md sekcia e-bis; toto sú texty okolo nich).
// ---------------------------------------------------------------------------

export const meninyCopy = {
  eyebrowDnes: "Dnes má meniny",
  labelZajtra: "zajtra",
  ctaZena: "Prekvapte ju kyticou →",
  ctaMuz: "Prekvapte ho kyticou →",
  hrefKytica: "/kontakt?typ=kytica",
  /** Fallback pre dni bez mena (štátne sviatky a pod.) — pás nesmie byť prázdny. */
  fallbackText: "Dnes ani zajtra nemá meniny nikto — ateliér má aj tak čerstvé kvety.",
  fallbackCta: "Pozrieť aktuálnu ponuku →",
  hrefFallback: "/ponuka",
};

/** Väčší variant na `/ponuka` — dnešok + najbližších 6 dní. */
export const offerMeninyBlok = {
  nadpis: "Meniny tento týždeň",
  popis: "Meno, kytica, hotovo. Pozrite, kto má meniny v najbližších siedmich dňoch, a objednajte kyticu vopred.",
  cta: "Objednať kyticu k meninám →",
  href: "/kontakt?typ=kytica",
};

// ---------------------------------------------------------------------------
// Domov `/`
// ---------------------------------------------------------------------------

export const homeHero = {
  h1: "Ručne viazané kytice pre Radosť a Váš deň",
  podnadpis:
    "Kytice na počkanie aj na objednávku — od kytice dňa po svadobnú výzdobu, s doručením po celom Trenčíne.",
  ctaPrimarna: { label: "Objednať kvety", href: "/kontakt" } as Odkaz,
  ctaSekundarna: { label: "Svadby a eventy", href: "/svadby" } as Odkaz,
};

/** Manifest (sekcia 3) — zvýraznené slovo oddelené, aby ho vedel dev obaliť kurzívou. */
export const homeManifest = {
  leadPred: "Pri každej kytici sa ",
  leadDoraz: "rozhodujeme",
  leadPo: ", aké kvety vybrať, odkiaľ ich máme a pre koho kyticu viažeme.",
  odseky: [
    "Sme kvetinový ateliér v centre Trenčína. Kvety nakupujeme od lokálnych pestovateľov, ale aj priamo z Holandska, Ekvádoru a Kolumbie, takže vieme poskladať kyticu presne na to, čo potrebujete — od bežného dňa až po svadobnú výzdobu.",
    "Väčšinu kytíc viažeme bez floristickej peny, tak, ako kvety rástli.",
  ],
};

export const seasonalEyebrow = "Augustový výber";

/** Sezónny výber na Domove — slugy kytíc z katalógu (poradie = poradie kariet). */
export const seasonalSlugy = ["letne-popoludnie", "trencianska-zahrada", "terakota"];

export const homeSluzby: Sluzba[] = [
  {
    cislo: "01",
    nazov: "Svadby a eventy",
    popis: "Svadobné kytice aj kompletná výzdoba obradu a hostiny — od prvej konzultácie po inštaláciu v deň D.",
    href: "/svadby",
  },
  {
    cislo: "02",
    nazov: "Kytice na objednávku",
    popis: "Kytica podľa príležitosti, farieb aj rozpočtu, pripravená v deň vyzdvihnutia.",
    href: "/ponuka#kytice-na-mieru",
  },
  {
    cislo: "03",
    nazov: "Smútočné kytice a vence",
    popis:
      "Vence, ikebany a smútočné kytice vieme uviazať aj v ten istý deň a doručiť priamo do domu smútku v Trenčíne.",
    href: "/ponuka#smutocne",
  },
  {
    cislo: "04",
    nazov: "Predplatné kvetov",
    popis: "Čerstvé kvety domov alebo do prevádzky každý týždeň, dva týždne alebo mesiac, s výmenou vody a vázy.",
    href: "/ponuka#predplatne",
  },
  {
    cislo: "05",
    nazov: "Firemné kvety",
    popis: "Pravidelná výzdoba recepcie či prevádzky podľa dohodnutých termínov, faktúra priamo na firmu.",
    href: "/kontakt?typ=ine",
  },
];

export const homeGaleria: { alt: string }[] = [
  { alt: "Floristka viaže kyticu s orgovánom v ateliéri Boma Flora" },
  { alt: "Nevesta drží svadobnú kyticu z bielych ruží a eukalyptu" },
  { alt: "Detail rúk pri aranžovaní bielej svadobnej väzby" },
  { alt: "Hotová kytica z bielych ruží a eukalyptu v prírodnom papieri" },
  { alt: "Viazanie svadobnej kytice z bielych a ružových ruží" },
  { alt: "Girlanda z eukalyptu, ruží a dálií na svadobnom stole" },
];

export const homeAtelierTeaser = {
  eyebrow: "Ateliér",
  odseky: [
    "Boma Flora funguje v centre Trenčína od roku 2014. Začínali sme v malej predajni na Ovocnej ulici, dnes máme ateliér s chladiarenskou miestnosťou a tímom troch floristiek.",
    "Kvety vyberáme osobne, dvakrát do týždňa, priamo na veľkoobchode. Zvyšok dopĺňame od pestovateľov spod Bielych Karpát.",
  ],
  podpis: "— Barbora Momčilová, zakladateľka Boma Flora",
  odkaz: "Spoznajte ateliér →",
  href: "/atelier" as const,
};

/** Hlavičky sekcií a drobné UI texty Domova (data-driven, nie v JSX). */
export const homeSekcie = {
  sezonnyNadpis: "Čo práve viažeme",
  sezonnyOdkaz: "Všetky kytice →",
  sluzby: { eyebrow: "Čo pre vás robíme", nadpis: "Od kytice dňa po svadobný deň" } as Zahlavie,
  kroky: { eyebrow: "Ako to prebieha", nadpis: "Tri kroky k vašej kytici" } as Zahlavie,
  referencie: { eyebrow: "Referencie", nadpis: "Čo hovoria zákazníci" } as Zahlavie,
};

export const homeKrokyObjednavky: Krok[] = [
  {
    cislo: "01",
    nazov: "Vyberiete",
    popis: "Napíšete, zavoláte, alebo si vyberiete z ponuky — stačí povedať príležitosť a rozpočet.",
  },
  {
    cislo: "02",
    nazov: "Uviažeme",
    popis: "Kyticu viažeme v deň vyzdvihnutia alebo doručenia, nie deň vopred.",
  },
  {
    cislo: "03",
    nazov: "Vyzdvihnete alebo doručíme",
    popis: "Vyzdvihnete si ju v ateliéri na Mierovom námestí, alebo ju doručíme po Trenčíne.",
  },
];

export const homeReferencie: Referencia[] = [
  {
    citat:
      "Objednávala som kyticu na poslednú chvíľu k narodeninám mamy a stihli to za dve hodiny. Krajšie, než som si vedela predstaviť.",
    meno: "Zuzana Vargová",
    prilezitost: "narodeninová kytica",
  },
  {
    citat: "Robili nám výzdobu na svadbu vo Vinárstve Skalka. Prišli deň vopred, všetko postavili a nemuseli sme riešiť vôbec nič.",
    meno: "Michaela a Tomáš",
    prilezitost: "svadba",
  },
  {
    citat: "Smútočný veniec pre otca priviezli do domu smútku v ten istý deň, presne podľa dohody.",
    meno: "Ján Petrík",
    prilezitost: "smútočná väzba",
  },
];

export const homeCtaPas = {
  text: "Kvety na dnes, na budúci týždeň, aj na veľký deň o pol roka.",
  ctaPrimarna: { label: "Objednať kvety", href: "/kontakt" } as Odkaz,
  ctaSekundarna: { label: "Dohodnúť konzultáciu", href: "/kontakt?typ=svadba" } as Odkaz,
};

// ---------------------------------------------------------------------------
// Ponuka `/ponuka`
// ---------------------------------------------------------------------------

export const offerSubhero = {
  h1: "Ponuka",
  text: "Viažeme podľa toho, čo práve kvitne — ponuka sa mení každý týždeň podľa sezóny.",
};

export const offerKategorie: Kategoria[] = [
  {
    nazov: "Hotové kytice",
    popis: "Dvanásť kytíc, ktoré viažeme pravidelne — s cenou, priemerom aj zoznamom odrôd.",
    cena: "od 18 €",
    href: "/kytice",
    cta: "Pozrieť kytice",
  },
  {
    nazov: "Kytice na mieru",
    popis: "Poviete farby, príležitosť a rozpočet, my poskladáme kyticu presne na mieru.",
    cena: "od 28 €",
    href: "/kontakt?typ=kytica",
    cta: "Objednať",
  },
  {
    nazov: "Smútočné kytice a vence",
    popis:
      "Vence, ikebany aj kytice na rozlúčku. Objednávka aj v deň obradu, doručenie do domu smútku alebo na cintorín v Trenčíne.",
    cena: "od 35 €",
    href: "/kontakt?typ=smutocna",
    cta: "Objednať",
  },
  {
    nazov: "Kvety do interiéru a vázy",
    popis: "Rezané kvety do vázy na dva týždne, doplnené o zeleň — pre domácnosť aj recepciu firmy.",
    cena: "od 18 €",
    href: "/kontakt?typ=ine",
    cta: "Objednať",
  },
];

/** Podpisový obsahový prvok — jar/leto/jeseň/zima → kvety, ktoré vtedy vrcholia. */
export const sezonnyKalendar: SezonneObdobie[] = [
  { obdobie: "Jar (marec – máj)", kvety: ["tulipány", "narcisy", "hyacinty", "konvalinky", "ranunculusy"] },
  { obdobie: "Leto (jún – august)", kvety: ["pivonky", "slnečnice", "dálie", "hortenzie", "levanduľa"] },
  {
    obdobie: "Jeseň (september – november)",
    kvety: ["astry", "chryzantémy", "gerbery", "ozdobné trávy", "okrasné tekvičky"],
  },
  { obdobie: "Zima (december – február)", kvety: ["amarylis", "vianočná ruža", "eukalyptus", "cezmína", "anemonky"] },
];

export const predplatneFrekvencie: PredplatneFrekvencia[] = [
  { frekvencia: "Týždenne", cena: "od 20 € / dodávka" },
  { frekvencia: "Každé dva týždne", cena: "od 22 € / dodávka" },
  { frekvencia: "Mesačne", cena: "od 25 € / dodávka" },
];

export const predplatnePopis =
  "Pri prvej dodávke vám necháme vlastnú vázu. Pri každej ďalšej v nej vymeníme vodu aj kvety. Platíte mesačne vopred a zrušiť môžete kedykoľvek e-mailom.";

export const praktickeInfo = {
  doprava: {
    nadpis: "Doručenie po Trenčíne",
    text: "Doručujeme po celom Trenčíne v pracovné dni medzi 10:00 a 17:00, cena od 4 € podľa lokality. Objednávku na daný deň prijímame do 12:00.",
  },
  starostlivost: {
    nadpis: "Starostlivosť o rezané kvety",
    tipy: [
      "Stonky skráťte šikmým rezom pod tečúcou vodou tesne pred vložením do vázy.",
      "Vodu vymieňajte každé dva dni, kyticu držte mimo priameho slnka a kúrenia.",
      "Odstráňte listy, ktoré by boli pod hladinou vody — vo vode hnijú a skracujú výdrž kytice.",
    ],
  },
};

export const offerFaq: Otazka[] = [
  {
    otazka: "Musím kyticu objednať vopred?",
    odpoved: "Pri kytici dňa nie, tú viažeme z toho, čo práve máme. Kyticu na mieru odporúčame nahlásiť aspoň deň vopred.",
  },
  {
    otazka: "Platíte kartou aj v ateliéri?",
    odpoved: "Áno, aj kartou, aj v hotovosti. Online platbu na webe pripravujeme.",
  },
  {
    otazka: "Dá sa poslať kytica ako darček bez toho, aby obdarovaný vedel od koho?",
    odpoved: "Áno, na priložený lístok napíšeme presne to, čo chcete — pokojne aj anonymne.",
  },
];

// ---------------------------------------------------------------------------
// Svadby a eventy `/svadby`
// ---------------------------------------------------------------------------

export const weddingsSubhero = {
  h1: "Svadby a eventy",
  text: "Kvetinová výzdoba od kytice pre nevestu po inštaláciu na mieste hostiny — pre svadby v Trenčíne a na Považí.",
};

export const weddingsProcessIntro =
  "Prvé stretnutie je zadarmo a nič nezaväzuje — príďte do ateliéru, alebo si dohodneme videohovor. Prejdeme spolu farby, miesto aj rozpočet a do týždňa vám pošleme návrh kvetov s fotkami. Termín si potvrďte aspoň 8 týždňov vopred, v hlavnej sezóne (máj až september) radšej skôr.";

export const weddingsRealizacie: Realizacia[] = [
  {
    miesto: "Kaštieľ Omšenie",
    popis: "Kompletná výzdoba obradovej brány, tabule menu a hlavného stola pre 80 hostí.",
    alt: "Kvetinová brána z eukalyptu a bielych ruží pred Kaštieľom Omšenie",
  },
  {
    miesto: "Vinárstvo Skalka",
    popis: "Kytica nevesty, pierka pre ženícha a girlanda na hlavnom svadobnom stole.",
    alt: "Svadobná girlanda na dlhom drevenom stole vo Vinárstve Skalka",
  },
  {
    miesto: "Hotel Elizabeth, Trenčín",
    popis: "Obradová výzdoba v átriu hotela a kvetinová stena na fotenie hostí.",
    alt: "Kvetinová stena z ruží a hortenzií v átriu Hotela Elizabeth",
  },
];

export const weddingsCenoveUrovne: CenovaUroven[] = [
  { nazov: "Kytica a pierka", cena: "od 180 €", popis: "Kytica nevesty, pierka pre ženícha a svedkov, prípadne aj rodičov." },
  {
    nazov: "Obradová výzdoba",
    cena: "od 450 €",
    popis: "Výzdoba obradového miesta — brána, uličkové väzby alebo stôl na podpis.",
  },
  {
    nazov: "Kompletná výzdoba s inštaláciou",
    cena: "od 1 200 €",
    popis: "Obrad aj hostina vrátane montáže na mieste a odvozu po akcii.",
  },
];

export const weddingsPriebeh: Krok[] = [
  { cislo: "01", nazov: "Dopyt", popis: "Napíšete termín, miesto a predstavu — ozveme sa ihneď." },
  { cislo: "02", nazov: "Konzultácia", popis: "Prejdeme detaily naživo alebo online, zadarmo a bez záväzku." },
  { cislo: "03", nazov: "Návrh a rozpočet", popis: "Dostanete návrh kvetov s fotkami, zoznam kvetov a presnú cenu." },
  { cislo: "04", nazov: "Realizácia v deň D", popis: "Prídeme s kyticami aj výzdobou, postavíme a po akcii odvezieme." },
];

export const weddingsReferencie: Referencia[] = [
  {
    citat: "Barbora nám poradila kvety, ktoré vydržali celý horúci júnový deň a ešte aj vyzerali skvele na fotkách.",
    meno: "Kristína a Marek",
    prilezitost: "svadba, Vinárstvo Skalka",
  },
  {
    citat: "Prišli hodinu pred obradom, postavili bránu z eukalyptu a nikto sa nemusel o nič starať.",
    meno: "Simona a Adam",
    prilezitost: "svadba, Kaštieľ Omšenie",
  },
];

export const weddingsCta = {
  text: "V hlavnej sezóne máme voľné víkendy obsadené aj pol roka vopred — ozvite sa čo najskôr.",
  cta: { label: "Poslať dopyt", href: "/kontakt?typ=svadba" } as Odkaz,
};

// ---------------------------------------------------------------------------
// Obchod `/obchod` (predajný tok je zatiaľ placeholder — pozri DESIGN.md)
// ---------------------------------------------------------------------------

export const shopSubhero = {
  h1: "Obchod",
  text: "Online nákup pripravujeme — zatiaľ si kvety objednáte telefonicky alebo cez formulár, s doručením po Trenčíne.",
};

export const shopStitok = "Online nákup pripravujeme";

export const shopSortiment: PolozkaObchodu[] = [
  { nazov: "Kytica dňa", cena: "od 22 €", popis: "Kytica z toho, čo práve viažeme." },
  { nazov: "Kytica na mieru", cena: "od 28 €", popis: "Podľa farieb, príležitosti a rozpočtu." },
  { nazov: "Predplatné kvetov", cena: "od 20 € / dodávka", popis: "Pravidelné dodávky domov alebo do firmy." },
  { nazov: "Darčekový poukaz", cena: "od 30 €", popis: "Hodnota podľa vášho výberu, platí rok od vydania." },
];

export const shopKrokyBuduceho: Krok[] = [
  { cislo: "01", nazov: "Vyberiete", popis: "Kyticu alebo predplatné si vyberiete v e-shope." },
  { cislo: "02", nazov: "Zvolíte termín", popis: "Deň doručenia po Trenčíne alebo vyzdvihnutie v ateliéri." },
  { cislo: "03", nazov: "Zaplatíte online", popis: "Kartou, priamo pri objednávke — e-shop spustíme v priebehu tohto roka." },
];

export const shopCta = {
  text: "Chcete objednať už teraz?",
  cta: { label: "Napísať alebo zavolať", href: "/kontakt" } as Odkaz,
};

// ---------------------------------------------------------------------------
// Katalóg hotových kytíc `/kytice` + `/kytice/[slug]` (E1)
//
// Hotová kytica = produkt. Statická sada tu je JEDINÝ zdroj pravdy o katalógu;
// prístup k nej vedie cez `katalog.ts`, takže v E2 sa vymení len ten za
// WooCommerce Store API (produkty sú obsah → patria do WP, nie do Directusu).
// Odrody poháňajú sekciu „Z čoho ju viažeme" — jedna dátová sada, žiadna
// duplicita zoznamov kvetov naprieč stránkami.
// ---------------------------------------------------------------------------

/** Odtiene kvetov a kytíc — kľúč `farba`. `svetla` = potrebuje orámovanie. */
export const farbyKvetov: Record<string, { label: string; hex: string; svetla?: boolean }> = {
  biela: { label: "biela", hex: "#f6f1e9", svetla: true },
  ruzova: { label: "ružová", hex: "#e2a0b3" },
  cervena: { label: "červená", hex: "#b23b30" },
  bordova: { label: "bordová", hex: "#7b2d3a" },
  zlta: { label: "žltá", hex: "#e3b23c" },
  oranzova: { label: "terakotová", hex: "#c07856" },
  fialova: { label: "fialová", hex: "#8a7aa6" },
  modra: { label: "modrá", hex: "#7c9bb5" },
  zelena: { label: "zelená", hex: "#6e8b6a" },
  /** Len pre kytice — miešaná paleta (v UI sa kreslí ako viacfarebný bod). */
  pestra: { label: "pestrá", hex: "#c07856" },
};

export const sezonaLabel: Record<Sezona, string> = {
  jar: "Jar",
  leto: "Leto",
  jesen: "Jeseň",
  zima: "Zima",
  celorocne: "Celoročne",
};

export const prilezitostLabel: Record<Prilezitost, string> = {
  narodeniny: "Narodeniny",
  vyrocie: "Výročie a láska",
  svadba: "Svadba",
  premamu: "Pre mamu",
  smutok: "Smútočná",
  gratulacia: "Blahoželanie",
  potesenie: "Pre radosť",
};

export const typLabel: Record<KyticaTyp, string> = {
  kytica: "Viazaná kytica",
  aranzman: "Aranžmán v nádobe",
  box: "Kvetinový box",
  smutocna: "Smútočná väzba",
};

export const nalepkaLabel: Record<Nalepka, string> = {
  bestseller: "Najpredávanejšia",
  sezonne: "Sezónne",
  novinka: "Novinka",
};

/** Poradie príležitostí vo filtri (chip „Všetky" pridá komponent). */
export const katalogPrilezitosti: Prilezitost[] = [
  "narodeniny",
  "vyrocie",
  "svadba",
  "premamu",
  "smutok",
  "gratulacia",
  "potesenie",
];

/**
 * Odrody, z ktorých viažeme. `id` sa používa v `Kytica.zlozenie` aj ako kľúč
 * foto-výrezu v `images/media.ts` (`odrodaVyrezy`).
 */
export const odrody: Odroda[] = [
  { id: "ruza-red-naomi", nazov: "Ruža Red Naomi", farba: "cervena", sezona: "celorocne" },
  { id: "ruza-mondial", nazov: "Ruža Mondial", farba: "biela", sezona: "celorocne" },
  { id: "ruza-avalanche", nazov: "Ruža Avalanche", farba: "biela", sezona: "celorocne" },
  { id: "ruza-sweet-avalanche", nazov: "Ruža Sweet Avalanche", farba: "ruzova", sezona: "celorocne" },
  { id: "eustoma-ruzova", nazov: "Eustoma ružová", farba: "ruzova", sezona: "leto" },
  { id: "eustoma-biela", nazov: "Eustoma biela", farba: "biela", sezona: "leto" },
  { id: "ranunculus-biely", nazov: "Ranunculus biely", farba: "biela", sezona: "jar" },
  { id: "hortenzia-biela", nazov: "Hortenzia biela", farba: "biela", sezona: "leto" },
  { id: "hortenzia-modra", nazov: "Hortenzia modrá", farba: "modra", sezona: "leto" },
  { id: "hortenzia-ruzova", nazov: "Hortenzia ružová", farba: "ruzova", sezona: "leto" },
  { id: "pivonka-ruzova", nazov: "Pivonka ružová", farba: "ruzova", sezona: "leto" },
  { id: "dalia-koralova", nazov: "Dália koralová", farba: "oranzova", sezona: "leto" },
  { id: "dalia-bordova", nazov: "Dália bordová", farba: "bordova", sezona: "leto" },
  { id: "astra-fialova", nazov: "Astra fialová", farba: "fialova", sezona: "jesen" },
  { id: "chryzantema-plnokveta-oranzova", nazov: "Chryzantéma plnokvetá oranžová", farba: "oranzova", sezona: "jesen" },
  { id: "chryzantema-plnokveta-bordova", nazov: "Chryzantéma plnokvetá bordová", farba: "bordova", sezona: "jesen" },
  { id: "chryzantema-margaretkova-biela", nazov: "Chryzantéma margarétková biela", farba: "biela", sezona: "jesen" },
  { id: "gerbera-cervena", nazov: "Gerbera červená", farba: "cervena", sezona: "celorocne" },
  { id: "slnecnica", nazov: "Slnečnica", farba: "zlta", sezona: "leto" },
  { id: "frezia-zlta", nazov: "Frézia žltá", farba: "zlta", sezona: "celorocne" },
  { id: "orgovan-fialovy", nazov: "Orgován fialový", farba: "fialova", sezona: "jar" },
  { id: "ozdobna-trava", nazov: "Ozdobná tráva", farba: "zelena", sezona: "jesen" },
  { id: "eukalyptus", nazov: "Eukalyptus", farba: "zelena", sezona: "celorocne" },
  { id: "green-bell", nazov: "Green Bell (molucella)", farba: "zelena", sezona: "leto" },
  { id: "matricaria", nazov: "Matricaria", farba: "biela", sezona: "celorocne" },
  { id: "gypsomilka", nazov: "Gypsomilka", farba: "biela", sezona: "celorocne" },
];

/** Čo je v cene pri bežnej viazanej kytici (produkt si to môže prepísať). */
const V_CENE_ZAKLAD = [
  "ručná špirálová väzba bez floristickej peny",
  "balenie do prírodného papiera",
  "vrecúško výživy pre rezané kvety",
  "ručne písaný lístok so vzkazom",
];

/**
 * Katalóg hotových kytíc. Čítať ho cez `katalog.ts` (nie priamo v komponentoch)
 * — v E2 sa pod tou istou funkciou vymení zdroj za WooCommerce Store API.
 * Fotky: `src` prázdne = zatiaľ placeholder, dopĺňa sa sem (bez zásahu do kódu).
 */
export const katalogKytice: Kytica[] = [
  {
    id: "kyt-01",
    slug: "letne-popoludnie",
    nazov: "Letné popoludnie",
    perex: "Dálie od pestovateľky spod Vršatca, ružové ruže a eukalyptus.",
    popis:
      "Viažeme ju od polovice júla do prvých mrazov, kým máme dálie od pestovateľky spod Vršatca. Koralová a bordová sa v nej striedajú so starou ružovou, modrastý eukalyptus celok upokojí. Dálie znášajú prevoz zle, preto ich kupujeme výhradne lokálne — v tejto kytici nikdy nie sú z dovozu.",
    fotky: [
      {
        src: "/kvetinarstvo/img/sezona-1.webp",
        alt: "Kytica koralových a bordových dálií s ružovými ružami a eukalyptom na svetlom stole",
      },
    ],
    zlozenie: ["dalia-koralova", "dalia-bordova", "ruza-sweet-avalanche", "eukalyptus"],
    varianty: [
      { kod: "S", nazov: "Malá", stonky: 15, priemerCm: 28, cena: 32 },
      { kod: "M", nazov: "Stredná", stonky: 21, priemerCm: 34, cena: 44 },
      { kod: "L", nazov: "Veľká", stonky: 29, priemerCm: 42, cena: 58 },
    ],
    trvacnost: "7 – 10 dní vo váze",
    vCene: V_CENE_ZAKLAD,
    prilezitosti: ["narodeniny", "potesenie", "gratulacia", "premamu"],
    farba: "oranzova",
    typ: "kytica",
    nalepka: "sezonne",
  },
  {
    id: "kyt-02",
    slug: "trencianska-zahrada",
    nazov: "Trenčianska záhrada",
    perex: "Hortenzie, astry a gypsomilka — jemná väzba bez jedinej ostrej farby.",
    popis:
      "Kytica pre ľudí, ktorí majú radšej tvar než farbu. Základ tvoria hortenzie, biela a modrastá; medzi ne dávame astry a gypsomilku, aby väzba mala vzduch a nepôsobila ako kompaktná guľa. Hortenzia pije veľa vody — ak ju necháte v plnej váze a každý druhý deň skrátite stonky, vydrží najdlhšie zo všetkého, čo v nej je.",
    fotky: [
      {
        src: "/kvetinarstvo/img/sezona-2.webp",
        alt: "Kytica bielych a zelenkastých hortenzií s drobnými ružovými kvetmi na plátennom pozadí",
      },
    ],
    zlozenie: ["hortenzia-biela", "hortenzia-modra", "astra-fialova", "gypsomilka"],
    varianty: [
      { kod: "S", nazov: "Malá", stonky: 13, priemerCm: 26, cena: 28 },
      { kod: "M", nazov: "Stredná", stonky: 19, priemerCm: 33, cena: 39 },
      { kod: "L", nazov: "Veľká", stonky: 25, priemerCm: 40, cena: 52 },
    ],
    trvacnost: "6 – 8 dní vo váze (hortenzia potrebuje veľa vody)",
    vCene: V_CENE_ZAKLAD,
    prilezitosti: ["narodeniny", "gratulacia", "potesenie", "premamu"],
    farba: "biela",
    typ: "kytica",
  },
  {
    id: "kyt-03",
    slug: "terakota",
    nazov: "Terakota",
    perex: "Chryzantémy, orgován a ozdobná tráva v pálenej hlinenej nádobe.",
    popis:
      "Aranžmán staviame priamo do terakotovej nádoby, na mriežku z vlastných stoniek — bez floristickej peny. Nádoba ostáva vám a keď kvety doslúžia, naplníme ju znova za cenu kvetov. Orgován máme v máji a júni; po sezóne ho v tej istej palete nahrádza astra.",
    fotky: [
      {
        src: "/kvetinarstvo/img/sezona-3.webp",
        alt: "Aranžmán oranžových a krémových chryzantém s orgovánom a ozdobnou trávou v terakotovej nádobe",
      },
    ],
    zlozenie: [
      "chryzantema-plnokveta-oranzova",
      "chryzantema-plnokveta-bordova",
      "orgovan-fialovy",
      "ozdobna-trava",
    ],
    varianty: [
      { kod: "M", nazov: "Stredný", stonky: 18, priemerCm: 30, cena: 35 },
      { kod: "L", nazov: "Veľký", stonky: 26, priemerCm: 38, cena: 49 },
    ],
    trvacnost: "10 – 14 dní (chryzantémy vydržia zo všetkého najdlhšie)",
    vCene: [
      "aranžovanie do terakotovej nádoby — nádoba ostáva vám",
      "mriežka z vlastných stoniek namiesto floristickej peny",
      "vrecúško výživy pre rezané kvety",
      "ručne písaný lístok so vzkazom",
    ],
    prilezitosti: ["potesenie", "gratulacia", "narodeniny"],
    farba: "pestra",
    typ: "aranzman",
  },
  {
    id: "kyt-04",
    slug: "mondial",
    nazov: "Mondial",
    perex: "Krémovo-biele ruže Mondial s eustomou a eukalyptom.",
    popis:
      "Mondial je ruža s veľkým kalichom, ktorá otvára pomaly a drží tvar aj po týždni. Viažeme ju s bielou eustomou do kompaktnejšej gule, eukalyptus dopĺňame len po obvode, aby biela ostala hlavná. Chodí k nám na výročia, promócie a poďakovania — teda vždy, keď má kytica pôsobiť slávnostne, nie sladko.",
    fotky: [
      {
        src: "/kvetinarstvo/img/galeria-4.webp",
        alt: "Kytica bielych ruží Mondial s eukalyptom, previazaná stuhou, na drevenom stole",
      },
      {
        src: "/kvetinarstvo/img/galeria-3.webp",
        alt: "Detail rúk, ktoré dokladajú zeleň do bielej kvetinovej väzby",
      },
    ],
    zlozenie: ["ruza-mondial", "eustoma-biela", "eukalyptus"],
    varianty: [
      { kod: "S", nazov: "Malá", stonky: 15, priemerCm: 28, cena: 42 },
      { kod: "M", nazov: "Stredná", stonky: 21, priemerCm: 35, cena: 56 },
      { kod: "L", nazov: "Veľká", stonky: 29, priemerCm: 42, cena: 74 },
    ],
    trvacnost: "8 – 12 dní vo váze",
    vCene: V_CENE_ZAKLAD,
    prilezitosti: ["vyrocie", "gratulacia", "potesenie"],
    farba: "biela",
    typ: "kytica",
    nalepka: "bestseller",
  },
  {
    id: "kyt-05",
    slug: "kytica-nevesty",
    nazov: "Kytica nevesty",
    perex: "Ruže Avalanche, eustoma a eukalyptus — viažeme ju ráno v deň obradu.",
    popis:
      "Svadobnú kyticu viažeme ráno v deň obradu, nie deň vopred — na fotkách z večera to vidieť. Stonky obtáčame stuhou v odtieni, ktorý si vyberiete, spodok necháme voľný, aby sa kytica dala medzi obradom a hostinou postaviť do vody. Z tých istých kvetov pripravíme pierko pre ženícha.",
    fotky: [
      {
        src: "/kvetinarstvo/img/galeria-2.webp",
        alt: "Nevesta drží svadobnú kyticu z bielych ruží, eustomy a eukalyptu",
      },
      {
        src: "/kvetinarstvo/img/galeria-5.webp",
        alt: "Floristka dokončuje väzbu svadobnej kytice z bielych a ružových ruží",
      },
    ],
    zlozenie: ["ruza-avalanche", "eustoma-biela", "matricaria", "eukalyptus"],
    varianty: [
      { kod: "S", nazov: "Menšia", stonky: 17, priemerCm: 26, cena: 68 },
      { kod: "M", nazov: "Väčšia", stonky: 23, priemerCm: 30, cena: 86 },
    ],
    trvacnost: "vydrží celý svadobný deň, vo váze ďalších 5 – 7 dní",
    vCene: [
      "väzba ráno v deň obradu",
      "stuha na stonkách v odtieni podľa vášho výberu",
      "pierko pre ženícha z tých istých kvetov",
      "prinesenie na miesto obradu v Trenčíne",
    ],
    prilezitosti: ["svadba"],
    farba: "biela",
    typ: "kytica",
  },
  {
    id: "kyt-06",
    slug: "kytica-dna",
    nazov: "Kytica dňa",
    perex: "Z toho, čo v ten deň prišlo z veľkoobchodu — bez objednávky vopred.",
    popis:
      "Kytica dňa nemá pevné zloženie. Viažeme ju z toho, čo v utorok alebo v piatok ráno prišlo — v auguste je to najčastejšie eustoma, chryzantéma a eukalyptus. Poviete rozpočet a farbu, ktorej sa chcete vyhnúť, ostatné nechajte na nás. Pripravíme ju na počkanie, zvyčajne do desiatich minút.",
    fotky: [
      {
        src: "/kvetinarstvo/img/obchod-kytica-dna.webp",
        alt: "Kytica terakotových a bielych eustom s eukalyptom, zabalená v prírodnom papieri",
      },
    ],
    zlozenie: ["eustoma-ruzova", "eustoma-biela", "chryzantema-margaretkova-biela", "eukalyptus"],
    varianty: [
      { kod: "S", nazov: "Malá", stonky: 11, priemerCm: 24, cena: 22 },
      { kod: "M", nazov: "Stredná", stonky: 17, priemerCm: 30, cena: 32 },
      { kod: "L", nazov: "Veľká", stonky: 23, priemerCm: 36, cena: 44 },
    ],
    trvacnost: "7 – 10 dní vo váze",
    vCene: V_CENE_ZAKLAD,
    prilezitosti: ["potesenie", "narodeniny", "gratulacia"],
    farba: "pestra",
    typ: "kytica",
  },
  {
    id: "kyt-07",
    slug: "pudrova",
    nazov: "Púdrová",
    perex: "Ruže Sweet Avalanche, biele ranunculusy a hortenzia v pastelovej palete.",
    popis:
      "Najtichšia kytica, akú viažeme — tri odtiene ružovej, ktoré sa navzájom neprebíjajú, a biele ranunculusy, ktoré sa doma ešte otvoria. Ranunculus máme od februára do mája; mimo sezóny ho nahrádza záhradná ruža v tom istom tóne, cena sa nemení.",
    fotky: [
      {
        src: "/kvetinarstvo/img/obchod-na-mieru.webp",
        alt: "Pastelová kytica ružových ruží, bielych ranunculusov a eukalyptu pri okne",
      },
    ],
    zlozenie: ["ruza-sweet-avalanche", "ranunculus-biely", "hortenzia-ruzova", "eukalyptus"],
    varianty: [
      { kod: "S", nazov: "Malá", stonky: 15, priemerCm: 28, cena: 36 },
      { kod: "M", nazov: "Stredná", stonky: 21, priemerCm: 34, cena: 48 },
      { kod: "L", nazov: "Veľká", stonky: 29, priemerCm: 41, cena: 62 },
    ],
    trvacnost: "7 – 10 dní vo váze",
    vCene: V_CENE_ZAKLAD,
    prilezitosti: ["narodeniny", "vyrocie", "potesenie", "premamu"],
    farba: "ruzova",
    typ: "kytica",
  },
  {
    id: "kyt-08",
    slug: "pivonky-vo-vaze",
    nazov: "Pivonky vo váze",
    perex: "Deväť pivoniek v sklenenej váze — máj a jún, kým ich máme.",
    popis:
      "Pivonky kupujeme v pukoch, aby sa rozvili až u vás doma: prvý deň vyzerajú zatvorené, na druhý sa otvoria naplno a vydržia tak necelý týždeň. Aranžujeme ich do jednoduchej sklenenej vázy, ktorá ostáva vám. Mimo sezóny tú istú väzbu robíme zo záhradných ruží.",
    fotky: [
      {
        src: "/kvetinarstvo/img/obchod-predplatne.webp",
        alt: "Biele a ružové pivonky v sklenenej váze na drevenej komode",
      },
    ],
    zlozenie: ["pivonka-ruzova", "eukalyptus"],
    varianty: [
      { kod: "M", nazov: "9 pivoniek", stonky: 9, priemerCm: 30, cena: 45 },
      { kod: "L", nazov: "15 pivoniek", stonky: 15, priemerCm: 38, cena: 68 },
    ],
    trvacnost: "5 – 7 dní (pivonka kvitne krátko a naplno)",
    vCene: [
      "aranžovanie do sklenenej vázy — váza ostáva vám",
      "pivonky v pukoch, aby sa rozvili až doma",
      "vrecúško výživy pre rezané kvety",
      "ručne písaný lístok so vzkazom",
    ],
    prilezitosti: ["vyrocie", "narodeniny", "potesenie", "premamu"],
    farba: "ruzova",
    typ: "aranzman",
  },
  {
    id: "kyt-09",
    slug: "mala-pozornost",
    nazov: "Malá pozornosť",
    perex: "Sedem červených gerber v prírodnom papieri so štítkom na vzkaz.",
    popis:
      "Najmenšia kytica, akú viažeme — pre situácie, keď stačí gesto. Gerbery majú duté stonky, preto ich rezáme nakrátko a do vázy patrí len pár centimetrov vody; vydržia potom o niekoľko dní dlhšie. Na štítok napíšeme, čo poviete, pokojne aj bez podpisu.",
    fotky: [
      {
        src: "/kvetinarstvo/img/obchod-poukaz.webp",
        alt: "Malá kytica červených gerber v prírodnom papieri s prázdnym darčekovým štítkom",
      },
    ],
    zlozenie: ["gerbera-cervena", "gypsomilka"],
    varianty: [
      { kod: "S", nazov: "7 gerber", stonky: 7, priemerCm: 20, cena: 18 },
      { kod: "M", nazov: "11 gerber", stonky: 11, priemerCm: 25, cena: 26 },
    ],
    trvacnost: "7 – 9 dní (gerbere stačí pár centimetrov vody)",
    vCene: [
      "ručná väzba a balenie do prírodného papiera",
      "darčekový štítok s ručne písaným vzkazom",
      "vrecúško výživy pre rezané kvety",
    ],
    prilezitosti: ["potesenie", "gratulacia", "premamu"],
    farba: "cervena",
    typ: "kytica",
  },
  {
    id: "kyt-10",
    slug: "red-naomi",
    nazov: "Red Naomi",
    perex: "Deväť, pätnásť alebo dvadsaťpäť tmavočervených ruží so zeleňou Green Bell.",
    popis:
      "Red Naomi má takmer čierny stred, silnú vôňu a otvára pomaly — je to ruža, ktorá vydrží dlhšie ako väčšina červených odrôd. Viažeme ju samostatne, aby nič neodvádzalo pozornosť; po obvode dávame len úzky pás zelených Green Bell. Počet ruží si zvolíte podľa toho, čo chcete povedať.",
    fotky: [
      {
        alt: "Kytica tmavočervených ruží Red Naomi lemovaná zelenými stonkami Green Bell",
      },
    ],
    zlozenie: ["ruza-red-naomi", "green-bell"],
    varianty: [
      { kod: "S", nazov: "9 ruží", stonky: 9, priemerCm: 24, cena: 34 },
      { kod: "M", nazov: "15 ruží", stonky: 15, priemerCm: 30, cena: 54 },
      { kod: "L", nazov: "25 ruží", stonky: 25, priemerCm: 38, cena: 86 },
    ],
    trvacnost: "8 – 12 dní vo váze",
    vCene: V_CENE_ZAKLAD,
    prilezitosti: ["vyrocie", "narodeniny"],
    farba: "cervena",
    typ: "kytica",
  },
  {
    id: "kyt-11",
    slug: "ticha-rozlucka",
    nazov: "Tichá rozlúčka",
    perex: "Biele chryzantémy a eustoma s eukalyptom — uviažeme aj v deň obradu.",
    popis:
      "Smútočnú väzbu viažeme prednostne: ak zavoláte do obeda, býva hotová do troch hodín. Podávame ju previazanú prírodným motúzom, bez fólie, aby sa dala položiť aj oprieť o stenu. Doručíme ju do domu smútku alebo na cintorín v Trenčíne, po dohode aj mimo mesta.",
    fotky: [
      {
        alt: "Smútočná kytica bielych chryzantém a eustomy s eukalyptom, previazaná motúzom",
      },
    ],
    zlozenie: ["chryzantema-margaretkova-biela", "eustoma-biela", "eukalyptus"],
    varianty: [
      { kod: "M", nazov: "Stredná", stonky: 21, priemerCm: 36, cena: 38 },
      { kod: "L", nazov: "Veľká", stonky: 31, priemerCm: 46, cena: 56 },
    ],
    trvacnost: "10 – 14 dní (chryzantéma vydrží aj v chlade)",
    vCene: [
      "väzba v deň objednávky, prednostne",
      "previazanie prírodným motúzom, bez fólie",
      "stužka s nápisom podľa vášho zadania",
      "doručenie do domu smútku alebo na cintorín v Trenčíne",
    ],
    prilezitosti: ["smutok"],
    farba: "biela",
    typ: "smutocna",
  },
  {
    id: "kyt-12",
    slug: "slnecne-rano",
    nazov: "Slnečné ráno",
    perex: "Slnečnice a frézie v okrúhlom boxe — kvety stoja vo vlastnej vode.",
    popis:
      "Box vykladáme fóliou a plníme mriežkou zo stoniek, nie penou, takže kvety stoja vo vode a vydržia rovnako dlho ako vo váze. Hodí sa, keď posielate kvety niekomu do práce alebo do nemocnice, kde vázu nemá kde vziať — box sa postaví na stôl a je hotovo.",
    fotky: [
      {
        alt: "Okrúhly kvetinový box so slnečnicami, žltými fréziami a bielou matricariou",
      },
    ],
    zlozenie: ["slnecnica", "frezia-zlta", "matricaria"],
    varianty: [
      { kod: "S", nazov: "Malý box", stonky: 11, priemerCm: 18, cena: 34 },
      { kod: "M", nazov: "Väčší box", stonky: 17, priemerCm: 24, cena: 46 },
    ],
    trvacnost: "7 – 10 dní (vodu v boxe doplňte každý druhý deň)",
    vCene: [
      "okrúhly box vyložený fóliou, kvety stoja vo vode",
      "mriežka zo stoniek namiesto floristickej peny",
      "vrecúško výživy pre rezané kvety",
      "ručne písaný lístok so vzkazom",
    ],
    prilezitosti: ["gratulacia", "potesenie", "narodeniny"],
    farba: "zlta",
    typ: "box",
    nalepka: "novinka",
  },
];

/** Texty katalógu a detailu (jediné miesto pravdy — nie v JSX). */
export const katalogObsah = {
  subhero: {
    h1: "Hotové kytice",
    text: "Kytice, ktoré viažeme celý rok. Pri každej vidíte, z čoho je, aký má priemer a koľko stojí v troch veľkostiach.",
  },
  /** Nadpis (h2) sekcie s filtrom a mriežkou — drží hierarchiu h1 → h2 → h3. */
  mriezkaNadpis: "Vyberte si kyticu",
  filter: {
    prilezitost: "Príležitosť",
    farba: "Farba",
    typ: "Typ väzby",
    vsetky: "Všetky",
    zrusit: "Zrušiť filtre",
    /** Text do `aria-live` — doplní sa počet nájdených kytíc. */
    vysledok: (n: number) => `${n} ${n === 1 ? "kytica" : n < 5 ? "kytice" : "kytíc"} v tomto výbere`,
    prazdne: "V tejto kombinácii teraz nič neviažeme. Skúste uvoľniť jeden filter alebo nám napíšte, čo hľadáte.",
  },
  karta: {
    cenaOd: "od",
  },
  dovera: {
    nadpis: "Ako to funguje",
    body: [
      {
        nadpis: "Viažeme v deň doručenia",
        text: "Kyticu pripravujeme ráno v deň, keď si ju vyzdvihnete alebo ju doručíme — nie deň vopred.",
      },
      {
        nadpis: "Fotku pošleme pred doručením",
        text: "Kým kytica odíde z ateliéru, pošleme vám ju odfotenú. Keď niečo nesedí, uviažeme ju znova.",
      },
      {
        nadpis: "Doručenie po Trenčíne",
        text: "V pracovné dni medzi 10:00 a 17:00, cena od 4 € podľa lokality. Objednávky na daný deň do 12:00.",
      },
    ],
  },
  cta: {
    text: "Nenašli ste tú pravú? Uviažeme kyticu podľa vašej predstavy.",
    primar: { label: "Napísať, čo hľadáte", href: "/kontakt?typ=kytica" } as Odkaz,
    sekundar: { label: "Zavolať do ateliéru", href: "/kontakt" } as Odkaz,
  },
  detail: {
    spat: "Všetky kytice",
    velkostNadpis: "Veľkosť",
    stonky: "stoniek",
    priemer: "priemer",
    cenaLabel: "Cena vybranej veľkosti",
    cta: "Objednať túto kyticu",
    ctaPoznamka: "Objednávku dohodneme e-mailom alebo telefonicky — platí sa až pri prevzatí.",
    poradime: "Neviete si vybrať? Poradíme →",
    poradimeHref: "/kontakt?typ=kytica",
    oKytici: "O kytici",
    zlozenieNadpis: "Z čoho ju viažeme",
    zlozeniePoznamka:
      "Odrody uvádzame konkrétne. Keď niektorá práve nie je v kvalite, ktorú chceme, nahradíme ju rovnocennou a dáme vám vedieť vopred.",
    trvacnostNadpis: "Trvácnosť",
    vCeneNadpis: "Čo je v cene",
    starostlivostNadpis: "Ako jej predĺžite život",
    dalsieNadpis: "Ďalšie kytice",
    /** Predvyplnenie kontakt-formulára (`?typ=`) — hodnota z `contactTypyObjednavky`. */
    objednavkaTyp: "kytica",
  },
};

/** Prelink na katalóg kytíc z iných stránok (Obchod, Ateliér). */
export const katalogPrelink = {
  eyebrow: "Katalóg",
  nadpis: "Pozrite si hotové kytice",
  popis:
    "Dvanásť kytíc, ktoré viažeme pravidelne — s cenou, priemerom aj zoznamom odrôd. Vyberiete si a napíšete nám, kedy ju chcete mať.",
  cta: { label: "Otvoriť katalóg kytíc", href: "/kytice" } as Odkaz,
};

// ---------------------------------------------------------------------------
// Blog `/blog` + `/blog/[slug]` — demo články (data-driven, nahradí ich agent)
// ---------------------------------------------------------------------------

export const blogSubhero = {
  h1: "Blog",
  text: "Píšeme o sezónnych kvetoch, starostlivosti o kytice a o tom, čo sa deje v ateliéri.",
};

export const blogClanky: Clanok[] = [
  {
    slug: "preco-v-auguste-viazeme-dalie",
    titulok: "Prečo v auguste viažeme hlavne dálie",
    perex:
      "Dálie majú v auguste najsilnejšie farby aj najdlhšiu výdrž vo váze — vysvetľujeme, prečo sú tento mesiac na prvom mieste našej ponuky.",
    datum: "2. august 2026",
    datumISO: "2026-08-02",
    citanieMinut: 4,
    obrazokAlt: "Náruč čerstvo narezaných dálií na pracovnom stole ateliéru",
    telo: [
      {
        typ: "odsek",
        text: "Sezóna dálií u nás vrcholí od polovice júla do prvých mrazov, no práve august je mesiac, keď majú kvety najviac farby a najpevnejšie stonky. Kupujeme ich od pestovateľky spod Vršatca, ktorá nám ich vozí dvakrát týždenne ešte s rosou na lupeňoch.",
      },
      {
        typ: "odsek",
        text: "Vo váze vydržia sedem až desať dní, ak im stonky skrátite šikmým rezom a vymeníte vodu každé dva dni. Dálie nemajú rady priamy slnečný svit ani blízkosť kúrenia — preto ich odporúčame umiestniť do chladnejšej časti miestnosti.",
      },
      { typ: "medzinadpis", text: "Prečo nekupujeme dálie z dovozu" },
      {
        typ: "odsek",
        text: "Dália je kvet, ktorý cestu na druhý koniec Európy neznáša — stonky mäknú a farba bledne. Preto je jednou z mála vecí, ktorú v lete kupujeme výhradne lokálne, aj keď to znamená menší výber odrôd.",
      },
      {
        typ: "odsek",
        text: "Do augustového výberu ich kombinujeme s eukalyptom a záhradnými ružami, ktoré majú podobne dlhú výdrž.",
      },
    ],
  },
  {
    slug: "tri-chyby-ktore-skracuju-zivot-kvetom",
    titulok: "Tri chyby, ktoré skracujú život rezaným kvetom",
    perex:
      "Najčastejšie sa kytica pokazí nie kvôli kvalite kvetov, ale kvôli tomu, ako sa s ňou zaobchádza doma. Tu sú tri veci, ktoré vidíme najčastejšie.",
    datum: "20. júl 2026",
    datumISO: "2026-07-20",
    citanieMinut: 3,
    obrazokAlt: "Náruč čerstvých tulipánov na drevenom stole v rannom svetle",
    telo: [
      {
        typ: "odsek",
        text: "Prvá chyba je studená voda priamo z vodovodu. Kvety majú radšej vlažnú vodu izbovej teploty, do ktorej sa lepšie nasávajú cez stonku.",
      },
      {
        typ: "odsek",
        text: "Druhá je ponechanie kytice vo fólii z obchodu. Fólia drží vlhkosť pri stonkách, ale kvetom hore bráni v prístupe vzduchu — kyticu preto po prinesení domov vždy rozbaľte.",
      },
      { typ: "medzinadpis", text: "A tá najčastejšia" },
      {
        typ: "odsek",
        text: "Tretia, najčastejšia chyba je, že sa voda nemení dostatočne často. Baktérie vo vode upchávajú stonky rýchlejšie, než väčšina ľudí čaká — odporúčame meniť vodu každé dva dni a pri každej výmene stonky mierne skrátiť.",
      },
    ],
  },
  {
    slug: "ako-vybrat-kvety-na-svadbu",
    titulok: "Ako vybrať kvety na svadbu, keď neviete, kde začať",
    perex:
      "Pri prvej konzultácii s párom riešime tri veci: farby, sezónu a rozpočet. Poradíme, v akom poradí o nich premýšľať.",
    datum: "5. júl 2026",
    datumISO: "2026-07-05",
    citanieMinut: 5,
    obrazokAlt: "Kytica nevesty z pivoniek a záhradných ruží na svetlom pozadí",
    telo: [
      {
        typ: "odsek",
        text: "Najprv farby, potom kvety — nie naopak. Väčšina párov k nám príde s Pinterestom plným kvetov, ktoré v ich termíne buď nekvitnú, alebo sa musia doviezť z druhého konca sveta za trojnásobnú cenu. Preto sa najprv pýtame na paletu, nie na konkrétny druh.",
      },
      {
        typ: "odsek",
        text: "Sezóna potom rozhodne za vás. Júnová svadba znamená pivonky a záhradné ruže, septembrová skôr dálie a astry, zimná amarylis a vetvičky ihličia. Kvety mimo sezóny sa dajú zohnať, ale poznať to bude aj na cene, aj na výdrži.",
      },
      { typ: "medzinadpis", text: "Rozpočet sa delí na tri časti" },
      {
        typ: "odsek",
        text: "Kytica nevesty, výzdoba obradového miesta a výzdoba hostiny majú spravidla pomer približne 15 : 35 : 50 percent z celkového rozpočtu na kvety. Ak vopred viete celkovú sumu, vieme spolu rozdeliť, kde má zmysel pridať a kde ubrať.",
      },
    ],
  },
  {
    slug: "kytice-bez-floristickej-peny",
    titulok: "Prečo väčšinu kytíc viažeme bez floristickej peny",
    perex:
      "Floristická pena uľahčuje prácu, ale v pôde sa nerozloží ani po desiatkach rokov. Vysvetľujeme, ako viažeme bez nej a čo to znamená pre kyticu.",
    datum: "18. jún 2026",
    datumISO: "2026-06-18",
    citanieMinut: 4,
    obrazokAlt: "Floristka viaže kyticu špirálovou technikou priamo v ruke",
    telo: [
      {
        typ: "odsek",
        text: "Floristická pena (zelený blok, do ktorého sa zapichujú stonky) je v odbore bežná, pretože drží tvar aranžmánu a šetrí čas. Problém je, že ide o mikroplast, ktorý sa v prírode prakticky nerozkladá.",
      },
      {
        typ: "odsek",
        text: "Väčšinu kytíc preto viažeme klasickou špirálovou technikou v ruke, väzby do váz staviame na mriežke z vlastných stoniek alebo na kovovej pichadle, ktorá sa dá umyť a použiť znova.",
      },
      { typ: "medzinadpis", text: "Kedy penu predsa použijeme" },
      {
        typ: "odsek",
        text: "Pri niektorých svadobných inštaláciách — napríklad kvetinovej stene upevnenej na kovovej konštrukcii — sa bez nej zatiaľ nezaobídeme. V takých prípadoch používame verziu bez ftalátov a po akcii ju zlikvidujeme ako pevný odpad, nie kompost.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Ateliér `/atelier`
// ---------------------------------------------------------------------------

export const studioSubhero = {
  h1: "Ateliér",
  text: "Sme kvetinový ateliér v centre Trenčína — kytice viažeme na Mierovom námestí od roku 2014.",
};

export const studioPribeh = {
  odseky: [
    "Boma Flora vznikla v roku 2014 v malej predajni na Ovocnej ulici. O tri roky neskôr sme sa presťahovali na Mierové námestie, kde máme dnes ateliér aj vlastnú chladiarenskú miestnosť.",
    "Barbora Momčilová založila ateliér po skončení záhradníckej školy v Piešťanoch. Dnes v ňom spolu s ňou pracujú ďalšie dve floristky a jeden florista.",
  ],
};

export const studioTim: ClenTimu[] = [
  {
    meno: "Barbora Momčilová",
    rola: "zakladateľka a floristka",
    veta: "Väzbu sa učila u starej mamy, dnes najčastejšie viaže svadobné kytice.",
    alt: "Portrét Barbory Momčilovej, zakladateľky Boma Flora",
  },
  {
    meno: "Denisa Šulková",
    rola: "floristka",
    veta: "Má na starosti kytice dňa a predplatné — zákazníkov pozná väčšinou po mene.",
    alt: "Portrét floristky Denisy Šulkovej pri práci",
  },
  {
    meno: "Tomáš Kollár",
    rola: "florista, svadby a eventy",
    veta: "Stavia inštalácie na svadbách a firemných akciách, deň vopred si všetko premeria a naplánuje.",
    alt: "Portrét floristu Tomáša Kollára",
  },
];

/** Konkrétne fakty namiesto prázdnych superlatívov (viď DESIGN.md, sekcia 4). */
export const studioAkoPracujeme: string[] = [
  "Kvety nakupujeme od lokálnych pestovateľov, ale aj priamo z Holandska, Ekvádoru a Kolumbie.",
  "Na veľkoobchod chodíme osobne dvakrát týždenne — v utorok a piatok ráno, aby sme mali čerstvý tovar na celý týždeň.",
  "Väčšinu väzby robíme bez floristickej peny; tvar kytice drží špirálová technika alebo vlastná mriežka zo stoniek.",
  "Zvyšky kvetov a zeleň kompostujeme, obaly recyklujeme.",
];

export const studioPriestor: { alt: string }[] = [
  { alt: "Pracovný stôl v ateliéri s nožnicami, motúzom a prírodným baliacim papierom" },
  { alt: "Presklená kvetinová chladnička s naaranžovanými kyticami" },
  { alt: "Baliaci pult s hotovými kyticami pripravenými na odber" },
];

export const studioCta = {
  text: "Chcete nás spoznať osobne?",
  cta: { label: "Zastavte sa v ateliéri", href: "/kontakt" } as Odkaz,
};

// ---------------------------------------------------------------------------
// Kontakt a objednávka `/kontakt`
// ---------------------------------------------------------------------------

export const contactIntro =
  "Napíšte, zavolajte, alebo príďte priamo do ateliéru na Mierovom námestí. Na kytice dňa a bežné objednávky odpovedáme do niekoľkých hodín, pri svadbách nám dajte vedieť aspoň pár týždňov vopred.";

/** Hodnoty zodpovedajú `?typ=` parametru použitému v CTA naprieč šablónou. */
export const contactTypyObjednavky: TypObjednavky[] = [
  { hodnota: "kytica", label: "Kytica" },
  { hodnota: "svadba", label: "Svadba" },
  { hodnota: "smutocna", label: "Smútočná väzba" },
  { hodnota: "predplatne", label: "Predplatné kvetov" },
  { hodnota: "ine", label: "Iné" },
];

export const contactFaq: Otazka[] = [
  {
    otazka: "Dokedy mám objednať bežnú kyticu?",
    odpoved: "Kyticu na konkrétny deň odporúčame nahlásiť aspoň deň vopred, kyticu dňa viažeme bez objednávky z toho, čo práve máme.",
  },
  {
    otazka: "Stihnete smútočnú väzbu narýchlo?",
    odpoved: "Áno, smútočnú kyticu alebo malý veniec vieme uviazať aj v ten istý deň, zvyčajne do niekoľkých hodín od objednávky.",
  },
  {
    otazka: "Ako dopredu riešiť svadobné kvety?",
    odpoved: "Odporúčame ozvať sa 3 až 6 mesiacov pred termínom, v hlavnej sezóne (máj – september) pokojne aj skôr.",
  },
  {
    otazka: "Doručujete aj mimo Trenčína?",
    odpoved: "Doručenie zabezpečujeme po celom Trenčíne, mimo mesta po dohode individuálne — napíšte nám lokalitu a poradíme.",
  },
  {
    otazka: "Ako môžem zaplatiť?",
    odpoved: "V ateliéri kartou aj v hotovosti, pri doručení hotovosťou kuriérovi alebo prevodom vopred.",
  },
];

// ---------------------------------------------------------------------------
// Sekčné hlavičky a UI mikrotexty podstránok (data-driven — nie v JSX)
// ---------------------------------------------------------------------------

/** Ponuka — hlavičky sekcií, FAQ eyebrow a záverečné CTA. */
export const offerSekcie = {
  kategorie: { eyebrow: "Čo viažeme", nadpis: "Kategórie kytíc a väzby" } as Zahlavie,
  kalendar: {
    eyebrow: "Sezónny kalendár",
    nadpis: "Čo kvitne v akom období",
    popis:
      "Viažeme podľa toho, čo práve kvitne. Tu vidíte, ktoré kvety majú sezónu v jednotlivých ročných obdobiach.",
  } as Zahlavie,
  predplatne: {
    eyebrow: "Predplatné kvetov",
    nadpis: "Čerstvé kvety pravidelne, bez starostí",
  } as Zahlavie,
  faqEyebrow: "Časté otázky",
};

export const offerCta = {
  text: "Máte v hlave konkrétnu kyticu? Napíšte nám ju.",
  ctaPrimarna: { label: "Objednať kvety", href: "/kontakt" } as Odkaz,
  ctaSekundarna: { label: "Pozrieť hotové kytice", href: "/kytice" } as Odkaz,
};

/** Svadby — hlavičky sekcií. */
export const weddingsSekcie = {
  procesEyebrow: "Ako pracujeme s párom",
  realizacie: { eyebrow: "Realizácie", nadpis: "Svadby, ktoré sme zdobili" } as Zahlavie,
  ceny: {
    eyebrow: "Rozsah a orientačné ceny",
    nadpis: "Tri úrovne spolupráce",
    popis:
      "Ceny sú orientačné a závisia od sezóny, počtu hostí a miesta. Presnú sumu dostanete v návrhu.",
  } as Zahlavie,
  priebeh: { eyebrow: "Priebeh spolupráce", nadpis: "Od dopytu po deň D" } as Zahlavie,
  referencie: { eyebrow: "Referencie párov", nadpis: "Ako to videli nevesty a ženísi" } as Zahlavie,
};

/** Obchod — hlavičky sekcií a poznámka pod sortimentom. */
export const shopSekcie = {
  sortiment: { eyebrow: "Sortiment", nadpis: "Čo si u nás objednáte" } as Zahlavie,
  ako: { eyebrow: "Ako to bude fungovať", nadpis: "Nákup online, keď spustíme e-shop" } as Zahlavie,
  poznamkaPred: "Karty zatiaľ nie sú nákupné. Zatiaľ objednáte telefonicky alebo formulárom — ",
  poznamkaOdkaz: "napíšte nám →",
};

/** Blog — mikrotexty zoznamu, detailu a záverečné CTA (zdieľané zoznam/detail). */
export const blogSekcie = {
  citajFeatured: "Čítať článok →",
  detailEyebrow: "Z ateliéru Boma Flora",
  suvisiaceNadpis: "Ďalšie články",
};

export const blogCta = {
  text: "Kytica podľa sezóny? Objednajte.",
  cta: { label: "Objednať kvety", href: "/kontakt" } as Odkaz,
};

/** Ateliér — hlavičky sekcií. */
export const studioSekcie = {
  pribeh: { eyebrow: "Príbeh", nadpis: "Ako Boma Flora vznikla" } as Zahlavie,
  tim: { eyebrow: "Tím", nadpis: "Kto viaže vaše kvety" } as Zahlavie,
  akoPracujeme: { eyebrow: "Ako pracujeme", nadpis: "Konkrétne, nie prázdne sľuby" } as Zahlavie,
  priestorEyebrow: "Priestor",
};

/** Kontakt — h1, hlavičky a labely (mimo `contactIntro`/`contactFaq`). */
export const contactSekcie = {
  h1: "Kontakt a objednávka",
  atelierEyebrow: "Ateliér",
  hodinyNadpis: "Otváracie hodiny",
  mapaOdkaz: "Otvoriť v mapách →",
  formularNadpis: "Objednávkový formulár",
  formularPopis: "Vyplňte, čo potrebujete, a ozveme sa vám späť. Polia označené * sú povinné.",
  faqEyebrow: "Časté otázky",
};
