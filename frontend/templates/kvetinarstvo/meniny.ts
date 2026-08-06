/**
 * Kalendár menín — dáta pre podpisový prvok šablóny. Statická slovenská tabuľka
 * mien pre všetkých 366 dní (kľúč `"MM-DD"` → meno + rod), 0 externých závislostí.
 *
 * Rod (`"z"`/`"m"`) je pri mene uložený zámerne — z koncovky sa spoľahlivo
 * neodvodí (Peter vs. Ester), a CTA potrebuje správne „prekvapte ju/ho".
 * Dni bez mena (Nový rok, sviatky, Štedrý deň, Dušičky…) v tabuľke chýbajú →
 * `menoNaDen()` vráti `null` a UI použije fallback vetu z `content.ts`.
 *
 * Dátum sa počíta v pásme Europe/Bratislava (nie UTC servera), aby sa deň
 * prepol o polnoci. ISR na dotknutých stránkach drží `revalidate ≤ 1 h`.
 */

export type Rod = "z" | "m";

export interface Meniny {
  /** `"MM-DD"` daného dňa. */
  mmdd: string;
  /** ISO dátum `"YYYY-MM-DD"` pre `<time datetime>`. */
  iso: string;
  meno: string | null;
  rod: Rod | null;
}

type Zaznam = [meno: string, rod: Rod];

/** Slovenský kalendár menín. Dni, ktoré tu chýbajú, nemajú meno (sviatky a pod.). */
const KALENDAR: Record<string, Zaznam> = {
  // Január
  "01-02": ["Alexandra", "z"], "01-03": ["Daniela", "z"], "01-04": ["Drahoslav", "m"],
  "01-05": ["Andrea", "z"], "01-06": ["Antónia", "z"], "01-07": ["Bohuslava", "z"],
  "01-08": ["Severín", "m"], "01-09": ["Alexej", "m"], "01-10": ["Dáša", "z"],
  "01-11": ["Malvína", "z"], "01-12": ["Ernest", "m"], "01-13": ["Rastislav", "m"],
  "01-14": ["Radovan", "m"], "01-15": ["Dobroslav", "m"], "01-16": ["Kristína", "z"],
  "01-17": ["Nataša", "z"], "01-18": ["Bohdana", "z"], "01-19": ["Drahomíra", "z"],
  "01-20": ["Dalibor", "m"], "01-21": ["Vincent", "m"], "01-22": ["Zora", "z"],
  "01-23": ["Miloš", "m"], "01-24": ["Timotej", "m"], "01-25": ["Gejza", "m"],
  "01-26": ["Tamara", "z"], "01-27": ["Bohuš", "m"], "01-28": ["Alfonz", "m"],
  "01-29": ["Gašpar", "m"], "01-30": ["Ema", "z"], "01-31": ["Emil", "m"],
  // Február
  "02-01": ["Tatiana", "z"], "02-02": ["Erik", "m"], "02-03": ["Blažej", "m"],
  "02-04": ["Veronika", "z"], "02-05": ["Agáta", "z"], "02-06": ["Dorota", "z"],
  "02-07": ["Vanda", "z"], "02-08": ["Zoja", "z"], "02-09": ["Zdenko", "m"],
  "02-10": ["Gabriela", "z"], "02-11": ["Dezider", "m"], "02-12": ["Perla", "z"],
  "02-13": ["Arpád", "m"], "02-14": ["Valentín", "m"], "02-15": ["Pravoslav", "m"],
  "02-16": ["Ida", "z"], "02-17": ["Miloslava", "z"], "02-18": ["Jaromír", "m"],
  "02-19": ["Vlasta", "z"], "02-20": ["Lívia", "z"], "02-21": ["Eleonóra", "z"],
  "02-22": ["Etela", "z"], "02-23": ["Roman", "m"], "02-24": ["Matej", "m"],
  "02-25": ["Frederik", "m"], "02-26": ["Viktor", "m"], "02-27": ["Alexander", "m"],
  "02-28": ["Zlatica", "z"], "02-29": ["Radomír", "m"],
  // Marec
  "03-01": ["Albín", "m"], "03-02": ["Anežka", "z"], "03-03": ["Bohumil", "m"],
  "03-04": ["Kazimír", "m"], "03-05": ["Fridrich", "m"], "03-06": ["Radoslav", "m"],
  "03-07": ["Tomáš", "m"], "03-08": ["Alan", "m"], "03-09": ["Františka", "z"],
  "03-10": ["Branislav", "m"], "03-11": ["Angela", "z"], "03-12": ["Gregor", "m"],
  "03-13": ["Vlastimil", "m"], "03-14": ["Matilda", "z"], "03-15": ["Svetlana", "z"],
  "03-16": ["Boleslav", "m"], "03-17": ["Ľubica", "z"], "03-18": ["Eduard", "m"],
  "03-19": ["Jozef", "m"], "03-20": ["Víťazoslav", "m"], "03-21": ["Blahoslav", "m"],
  "03-22": ["Beňadik", "m"], "03-23": ["Adrián", "m"], "03-24": ["Gabriel", "m"],
  "03-25": ["Marián", "m"], "03-26": ["Emanuel", "m"], "03-27": ["Alena", "z"],
  "03-28": ["Soňa", "z"], "03-29": ["Miroslav", "m"], "03-30": ["Vieroslava", "z"],
  "03-31": ["Benjamín", "m"],
  // Apríl
  "04-01": ["Hugo", "m"], "04-02": ["Zita", "z"], "04-03": ["Richard", "m"],
  "04-04": ["Izidor", "m"], "04-05": ["Miroslava", "z"], "04-06": ["Irena", "z"],
  "04-07": ["Zoltán", "m"], "04-08": ["Albert", "m"], "04-09": ["Milena", "z"],
  "04-10": ["Igor", "m"], "04-11": ["Július", "m"], "04-12": ["Estera", "z"],
  "04-13": ["Aleš", "m"], "04-14": ["Justína", "z"], "04-15": ["Fedor", "m"],
  "04-16": ["Dana", "z"], "04-17": ["Rudolf", "m"], "04-18": ["Valér", "m"],
  "04-19": ["Jela", "z"], "04-20": ["Marcel", "m"], "04-21": ["Ervín", "m"],
  "04-22": ["Slavomír", "m"], "04-23": ["Vojtech", "m"], "04-24": ["Juraj", "m"],
  "04-25": ["Marek", "m"], "04-26": ["Jaroslava", "z"], "04-27": ["Jaroslav", "m"],
  "04-28": ["Jarmila", "z"], "04-29": ["Lea", "z"], "04-30": ["Anastázia", "z"],
  // Máj
  "05-02": ["Žigmund", "m"], "05-03": ["Galina", "z"], "05-04": ["Florián", "m"],
  "05-05": ["Lesana", "z"], "05-06": ["Herman", "m"], "05-07": ["Monika", "z"],
  "05-08": ["Ingrida", "z"], "05-09": ["Roland", "m"], "05-10": ["Viktória", "z"],
  "05-11": ["Blažena", "z"], "05-12": ["Pankrác", "m"], "05-13": ["Servác", "m"],
  "05-14": ["Bonifác", "m"], "05-15": ["Žofia", "z"], "05-16": ["Svetozár", "m"],
  "05-17": ["Gizela", "z"], "05-18": ["Viola", "z"], "05-19": ["Gertrúda", "z"],
  "05-20": ["Bernard", "m"], "05-21": ["Zina", "z"], "05-22": ["Júlia", "z"],
  "05-23": ["Želmíra", "z"], "05-24": ["Ela", "z"], "05-25": ["Urban", "m"],
  "05-26": ["Dušan", "m"], "05-27": ["Iveta", "z"], "05-28": ["Viliam", "m"],
  "05-29": ["Vilma", "z"], "05-30": ["Ferdinand", "m"], "05-31": ["Petronela", "z"],
  // Jún
  "06-01": ["Žaneta", "z"], "06-02": ["Xénia", "z"], "06-03": ["Karolína", "z"],
  "06-04": ["Lenka", "z"], "06-05": ["Laura", "z"], "06-06": ["Norbert", "m"],
  "06-07": ["Róbert", "m"], "06-08": ["Medard", "m"], "06-09": ["Stanislava", "z"],
  "06-10": ["Margaréta", "z"], "06-11": ["Dobroslava", "z"], "06-12": ["Zlatko", "m"],
  "06-13": ["Anton", "m"], "06-14": ["Vasil", "m"], "06-15": ["Vít", "m"],
  "06-16": ["Blanka", "z"], "06-17": ["Adolf", "m"], "06-18": ["Vratislav", "m"],
  "06-19": ["Alfréd", "m"], "06-20": ["Valéria", "z"], "06-21": ["Alojz", "m"],
  "06-22": ["Paulína", "z"], "06-23": ["Sidónia", "z"], "06-24": ["Ján", "m"],
  "06-25": ["Tadeáš", "m"], "06-26": ["Adriána", "z"], "06-27": ["Ladislav", "m"],
  "06-28": ["Beáta", "z"], "06-29": ["Peter a Pavol", "m"], "06-30": ["Melánia", "z"],
  // Júl
  "07-01": ["Diana", "z"], "07-02": ["Berta", "z"], "07-03": ["Miloslav", "m"],
  "07-04": ["Prokop", "m"], "07-06": ["Patrik", "m"], "07-07": ["Oliver", "m"],
  "07-08": ["Ivan", "m"], "07-09": ["Lujza", "z"], "07-10": ["Amália", "z"],
  "07-11": ["Milota", "z"], "07-12": ["Nina", "z"], "07-13": ["Margita", "z"],
  "07-14": ["Kamil", "m"], "07-15": ["Henrich", "m"], "07-16": ["Drahomír", "m"],
  "07-17": ["Bohuslav", "m"], "07-18": ["Kamila", "z"], "07-19": ["Dušana", "z"],
  "07-20": ["Iľja", "m"], "07-21": ["Daniel", "m"], "07-22": ["Magdaléna", "z"],
  "07-23": ["Oľga", "z"], "07-24": ["Vladimír", "m"], "07-25": ["Jakub", "m"],
  "07-26": ["Anna", "z"], "07-27": ["Božena", "z"], "07-28": ["Krištof", "m"],
  "07-29": ["Marta", "z"], "07-30": ["Libuša", "z"], "07-31": ["Ignác", "m"],
  // August
  "08-01": ["Božidara", "z"], "08-02": ["Gustáv", "m"], "08-03": ["Jerguš", "m"],
  "08-04": ["Dominik", "m"], "08-05": ["Hortenzia", "z"], "08-06": ["Jozefína", "z"],
  "08-07": ["Štefánia", "z"], "08-08": ["Oskar", "m"], "08-09": ["Ľubomíra", "z"],
  "08-10": ["Vavrinec", "m"], "08-11": ["Zuzana", "z"], "08-12": ["Darina", "z"],
  "08-13": ["Ľubomír", "m"], "08-14": ["Mojmír", "m"], "08-15": ["Marcela", "z"],
  "08-16": ["Leonard", "m"], "08-17": ["Milica", "z"], "08-18": ["Elena", "z"],
  "08-19": ["Lýdia", "z"], "08-20": ["Anabela", "z"], "08-21": ["Jana", "z"],
  "08-22": ["Tichomír", "m"], "08-23": ["Filip", "m"], "08-24": ["Bartolomej", "m"],
  "08-25": ["Ľudovít", "m"], "08-26": ["Samuel", "m"], "08-27": ["Silvia", "z"],
  "08-28": ["Augustín", "m"], "08-29": ["Nikola", "z"], "08-30": ["Ružena", "z"],
  "08-31": ["Nora", "z"],
  // September
  "09-02": ["Linda", "z"], "09-03": ["Belo", "m"], "09-04": ["Rozália", "z"],
  "09-05": ["Regina", "z"], "09-06": ["Alica", "z"], "09-07": ["Marianna", "z"],
  "09-08": ["Miriam", "z"], "09-09": ["Martina", "z"], "09-10": ["Oleg", "m"],
  "09-11": ["Bystrík", "m"], "09-12": ["Mária", "z"], "09-13": ["Ctibor", "m"],
  "09-14": ["Ľudomil", "m"], "09-16": ["Ľudmila", "z"], "09-17": ["Olympia", "z"],
  "09-18": ["Eugénia", "z"], "09-19": ["Konštantín", "m"], "09-20": ["Ľuboslav", "m"],
  "09-21": ["Matúš", "m"], "09-22": ["Móric", "m"], "09-23": ["Zdenka", "z"],
  "09-24": ["Ľuboš", "m"], "09-25": ["Vladislav", "m"], "09-26": ["Edita", "z"],
  "09-27": ["Cyprián", "m"], "09-28": ["Václav", "m"], "09-29": ["Michal", "m"],
  "09-30": ["Jarolím", "m"],
  // Október
  "10-01": ["Arnold", "m"], "10-02": ["Levoslav", "m"], "10-03": ["Stela", "z"],
  "10-04": ["František", "m"], "10-05": ["Viera", "z"], "10-06": ["Natália", "z"],
  "10-07": ["Eliška", "z"], "10-08": ["Brigita", "z"], "10-09": ["Dionýz", "m"],
  "10-10": ["Slavomíra", "z"], "10-11": ["Valentína", "z"], "10-12": ["Maximilián", "m"],
  "10-13": ["Koloman", "m"], "10-14": ["Boris", "m"], "10-15": ["Terézia", "z"],
  "10-16": ["Vladimíra", "z"], "10-17": ["Hedviga", "z"], "10-18": ["Lukáš", "m"],
  "10-19": ["Kristián", "m"], "10-20": ["Vendelín", "m"], "10-21": ["Uršuľa", "z"],
  "10-22": ["Sergej", "m"], "10-23": ["Alojzia", "z"], "10-24": ["Kvetoslava", "z"],
  "10-25": ["Aurel", "m"], "10-26": ["Demeter", "m"], "10-27": ["Sabína", "z"],
  "10-28": ["Dobromila", "z"], "10-29": ["Klára", "z"], "10-30": ["Šimon", "m"],
  "10-31": ["Aurélia", "z"],
  // November
  "11-03": ["Hubert", "m"], "11-04": ["Karol", "m"], "11-05": ["Imrich", "m"],
  "11-06": ["Renáta", "z"], "11-07": ["René", "m"], "11-08": ["Bohumír", "m"],
  "11-09": ["Teodor", "m"], "11-10": ["Tibor", "m"], "11-11": ["Martin", "m"],
  "11-12": ["Svätopluk", "m"], "11-13": ["Stanislav", "m"], "11-14": ["Irma", "z"],
  "11-15": ["Leopold", "m"], "11-16": ["Agnesa", "z"], "11-17": ["Klaudia", "z"],
  "11-18": ["Eugen", "m"], "11-19": ["Alžbeta", "z"], "11-20": ["Félix", "m"],
  "11-21": ["Elvíra", "z"], "11-22": ["Cecília", "z"], "11-23": ["Klement", "m"],
  "11-24": ["Emília", "z"], "11-25": ["Katarína", "z"], "11-26": ["Kornel", "m"],
  "11-27": ["Milan", "m"], "11-28": ["Henrieta", "z"], "11-29": ["Vratko", "m"],
  "11-30": ["Ondrej", "m"],
  // December
  "12-01": ["Edmund", "m"], "12-02": ["Bibiána", "z"], "12-03": ["Oldrich", "m"],
  "12-04": ["Barbora", "z"], "12-05": ["Oto", "m"], "12-06": ["Mikuláš", "m"],
  "12-07": ["Ambróz", "m"], "12-08": ["Marína", "z"], "12-09": ["Izabela", "z"],
  "12-10": ["Radúz", "m"], "12-11": ["Hilda", "z"], "12-12": ["Otília", "z"],
  "12-13": ["Lucia", "z"], "12-14": ["Branislava", "z"], "12-15": ["Ivica", "z"],
  "12-16": ["Albína", "z"], "12-17": ["Kornélia", "z"], "12-18": ["Sláva", "z"],
  "12-19": ["Judita", "z"], "12-20": ["Dagmara", "z"], "12-21": ["Bohdan", "m"],
  "12-22": ["Adela", "z"], "12-23": ["Nadežda", "z"], "12-26": ["Štefan", "m"],
  "12-27": ["Filoména", "z"], "12-28": ["Ivana", "z"], "12-29": ["Milada", "z"],
  "12-30": ["Dávid", "m"], "12-31": ["Silvester", "m"],
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Dnešný ISO dátum (`YYYY-MM-DD`) v pásme Europe/Bratislava. */
function dnesIsoBratislava(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Zostaví záznam menín pre daný ISO dátum. */
function pre(iso: string): Meniny {
  const mmdd = iso.slice(5);
  const zaznam = KALENDAR[mmdd];
  return {
    mmdd,
    iso,
    meno: zaznam ? zaznam[0] : null,
    rod: zaznam ? zaznam[1] : null,
  };
}

/** Posunie ISO dátum o `dni` dní (poludnie UTC = bezpečné voči DST). */
function posun(iso: string, dni: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d, 12) + dni * 86_400_000);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** Meniny na dnes a zajtra (pás na Domove). */
export function meninyDnesZajtra(): { dnes: Meniny; zajtra: Meniny } {
  const iso = dnesIsoBratislava();
  return { dnes: pre(iso), zajtra: pre(posun(iso, 1)) };
}

/** Meniny na dnešok + najbližších `pocet` dní (blok na Ponuke). */
export function meninyNajblizsie(pocet = 7): Meniny[] {
  const iso = dnesIsoBratislava();
  return Array.from({ length: pocet }, (_, i) => pre(posun(iso, i)));
}

/** Slovenský názov dňa v týždni pre ISO dátum (pre blok na Ponuke). */
export function denVTyzdni(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dni = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
  return dni[new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay()];
}
