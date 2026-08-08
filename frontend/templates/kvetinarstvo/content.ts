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

/** Kytica v sezónnom výbere / náhľade sortimentu. */
export interface Kytica {
  nazov: string;
  kvety: string;
  cena: string;
  alt: string;
}

/** Karta kategórie na `/ponuka`. */
export interface Kategoria {
  nazov: string;
  popis: string;
  cena: string;
  href: string;
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

/** Hlavička — 5 odkazov + CTA pilulka (Kontakt nie je v menu, viď DESIGN.md). */
export const headerNav: NavPolozka[] = [
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
  "domov" | "ponuka" | "svadby" | "obchod" | "blog" | "atelier" | "kontakt",
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

export const seasonalKytice: Kytica[] = [
  {
    nazov: "Letné popoludnie",
    kvety: "dálie, záhradné ruže, eukalyptus",
    cena: "od 32 €",
    alt: "Kytica letných dálií a záhradných ruží doplnená eukalyptom",
  },
  {
    nazov: "Trenčianska záhrada",
    kvety: "hortenzie, astry, gypsofila",
    cena: "od 28 €",
    alt: "Kytica hortenzií a astrov v teplých letných tónoch",
  },
  {
    nazov: "Terakota",
    kvety: "dálie, chryzantémy, ozdobná tráva",
    cena: "od 35 €",
    alt: "Kytica dálií a chryzantém v terakotových odtieňoch s ozdobnou trávou",
  },
];

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
  sezonnyOdkaz: "Celá ponuka →",
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
    nazov: "Kytice dňa",
    popis: "Kytica, ktorú práve viažeme z toho, čo dnes prišlo z veľkoobchodu. Bez objednávky vopred.",
    cena: "od 22 €",
    href: "/kontakt?typ=kytica",
  },
  {
    nazov: "Kytice na mieru",
    popis: "Poviete farby, príležitosť a rozpočet, my poskladáme kyticu presne na mieru.",
    cena: "od 28 €",
    href: "/kontakt?typ=kytica",
  },
  {
    nazov: "Smútočné kytice a vence",
    popis:
      "Vence, ikebany aj kytice na rozlúčku. Objednávka aj v deň obradu, doručenie do domu smútku alebo na cintorín v Trenčíne.",
    cena: "od 35 €",
    href: "/kontakt?typ=smutocna",
  },
  {
    nazov: "Kvety do interiéru a vázy",
    popis: "Rezané kvety do vázy na dva týždne, doplnené o zeleň — pre domácnosť aj recepciu firmy.",
    cena: "od 18 €",
    href: "/kontakt?typ=ine",
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
  { cislo: "01", nazov: "Dopyt", popis: "Napíšete termín, miesto a predstavu — ozveme sa do 2 dní." },
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
    citanieMinut: 3,
    obrazokAlt: "Kytica v sklenenej váze na kuchynskom stole pri okne",
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
  ctaSekundarna: { label: "Kúpiť online", href: "/obchod" } as Odkaz,
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
