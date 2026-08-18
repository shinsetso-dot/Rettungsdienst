import { useState, useMemo, useEffect, useRef } from "react";
import {
  Syringe,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ListChecks,
  Pill,
  Info,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Baby,
  ArrowRightLeft,
  Sun,
  Moon,
  Activity,
  Ambulance,
  MessageSquarePlus,
  Trash2,
  LogOut,
  Music2,
  Wind,
  HeartPulse,
  Users,
  PackagePlus,
  Plus,
  X,
} from "lucide-react";
function AuthForm({ onAuthenticated }) {
  const [modus, setModus] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const istLogin = modus === "login";
  function handleSubmit(e) { e.preventDefault(); onAuthenticated?.(); }
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1220", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 360, width: "100%", padding: 24, borderRadius: 14, border: "1px solid #212C42", background: "#0E1728", color: "#E8ECF4" }}>
        <div style={{ fontSize: 11, color: "#FBBF24", fontWeight: 700, marginBottom: 14, letterSpacing: "0.04em" }}>VORSCHAU — LOGIN IST HIER SIMULIERT</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <button type="button" onClick={() => setModus("login")} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #212C42", background: istLogin ? "#131B2E" : "transparent", color: "#E8ECF4", fontWeight: 700, cursor: "pointer" }}>Login</button>
          <button type="button" onClick={() => setModus("registrieren")} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #212C42", background: !istLogin ? "#131B2E" : "transparent", color: "#E8ECF4", fontWeight: 700, cursor: "pointer" }}>Registrieren</button>
        </div>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 12, color: "#8A93A6" }}>Benutzername</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", marginTop: 4, marginBottom: 12, borderRadius: 8, border: "1px solid #212C42", background: "transparent", color: "#E8ECF4" }} />
          {!istLogin && (
            <>
              <label style={{ fontSize: 12, color: "#8A93A6" }}>E-Mail (nur Kontoerstellung)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", marginTop: 4, marginBottom: 12, borderRadius: 8, border: "1px solid #212C42", background: "transparent", color: "#E8ECF4" }} />
            </>
          )}
          <label style={{ fontSize: 12, color: "#8A93A6" }}>Passwort</label>
          <input type="password" value={passwort} onChange={(e) => setPasswort(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", marginTop: 4, marginBottom: 16, borderRadius: 8, border: "1px solid #212C42", background: "transparent", color: "#E8ECF4" }} />
          <button type="submit" style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: "none", background: "#2DD4BF", color: "#0B1220", fontWeight: 700, cursor: "pointer" }}>{istLogin ? "Anmelden" : "Konto erstellen"}</button>
        </form>
      </div>
    </div>
  );
}


// ============================================================
// STATUS-SYSTEM:
// - dosisQuelle: "sop"  → Dosierungslogik stammt aus der vom
//   Nutzer hochgeladenen offiziellen SOP-Karte (K9, V26.1)
// - dosisQuelle: "demo" → generischer Platzhalterwert, nicht
//   aus einer geprüften Quelle
//
// AMPULLEN-PRÜFUNG (pro Medikament, siehe jeweiliges Objekt):
// - handelsname:     tatsächlich beim Träger geführtes Präparat
//                     (z. B. "Dormicum" statt nur "Midazolam")
// - ampulleGeprueft: true, sobald ein Verantwortlicher bestätigt
//                     hat, dass Konzentration/Ampullengröße in
//                     diesem Objekt mit der Fachinformation des
//                     tatsächlich geführten Präparats übereinstimmt
// - geprueftVon:      Name der prüfenden Person (z. B. ÄLRD-
//                     Vertretung / Medizinprodukteverantwortliche)
// - geprueftAm:       Datum der Prüfung, Format "YYYY-MM-DD"
//
// Standardwert für alle vier Felder ist "ungeprüft" (false/null).
// Diese Felder werden bewusst NICHT über die App-Oberfläche
// editierbar gemacht, sondern nur im Quellcode gepflegt — jede
// Freigabe soll über Commit/Pull-Request nachvollziehbar sein
// (Autor, Zeitpunkt, Reviewer laut Git-Historie), statt in einer
// unsichtbar veränderbaren Laufzeit-Datenbank zu verschwinden.
// Die App zeigt den Status nur an, sie ändert ihn nicht selbst.
// ============================================================

// Einsatzstichworte für die Schnellauswahl beim Start des Einsatz-Timers.
// algoId verweist auf die passende Karte in ALGORITHMEN; "PAEDIATRISCH" öffnet
// stattdessen die Pädiatrie-Übersicht; null = kein automatisches Öffnen.
const EINSATZSTICHWORTE = [
  { label: "Atemnot / COPD", algoId: "atemnot-erwachsene", farbe: "#60A5FA" },
  { label: "ACS / Brustschmerz", algoId: "acs", farbe: "#F87171" },
  { label: "Schlaganfall", algoId: "schlaganfall", farbe: "#A78BFA" },
  { label: "Krampfanfall", algoId: "krampfanfall", farbe: "#FBBF24" },
  { label: "Hypoglykämie", algoId: "hypoglykaemie-erw", farbe: "#34D399" },
  { label: "Anaphylaxie", algoId: "anaphylaxie", farbe: "#FF6A3D" },
  { label: "Sepsis / Infektion", algoId: "sepsis", farbe: "#F87171" },
  { label: "Bradykardie", algoId: "bradykardie", farbe: "#60A5FA" },
  { label: "Hypertensiver Notfall", algoId: "hypertensiv", farbe: "#FBBF24" },
  { label: "Vergiftung (CO)", algoId: "co-vergiftung-ohne-spco", farbe: "#94A3B8" },
  { label: "Opioid-Notfall", algoId: "opioid-komplikation", farbe: "#F472B6" },
  { label: "Schmerzen", algoId: "schmerz-uebersicht", farbe: "#FBBF24" },
  { label: "Übelkeit", algoId: "starke-uebelkeit", farbe: "#4ADE80" },
  { label: "Pädiatrisch", algoId: "PAEDIATRISCH", farbe: "#34D399" },
  { label: "Trauma", algoId: "TRAUMA_EXTERN", farbe: "#8B5CF6" },
];

const MEDIKAMENTE = [
  {
    id: "adrenalin_im",
    kontraindikationen: ["Bei vitaler Indikation (Anaphylaxie Grad II-IV) keine absolute Kontraindikation", "Relative Vorsicht: schwere Tachyarrhythmie, KHK — Nutzen überwiegt im Notfall"],
    name: "Adrenalin i.m. (Anaphylaxie)",
    gruppe: "Anaphylaxie — Grad II–III",
    konzentration: "1 mg / 1 ml (unverdünnt)",
    mgPerMl: 1,
    modus: "kg",
    kgFaktor: 0.01,
    max: 0.6,
    hinweis: "< 30 kgKG: 0,01 mg/kgKG · 30–60 kgKG: 0,1 mg/10 kgKG · > 60 kgKG: 0,6 mg fix. 1x Wdh. nach 5 Min. möglich.",
    bekannteAbweichung: "Die separate M2-Referenzseite des SOP-Dokuments nennt bei >60 kgKG abweichend 0,5 mg statt der hier (wie im Algorithmus K9 selbst) verwendeten 0,6 mg. Vor Anwendung im lokalen SOP-Original gegenprüfen.",
    farbe: "#FF6A3D",
    dosisQuelle: "sop",
    handelsname: "Suprarenin",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "adrenalin_iv",
    kontraindikationen: ["Bei Reanimation keine Kontraindikation (vitale Indikation)"],
    name: "Adrenalin i.v./i.o. (Reanimation)",
    gruppe: "Reanimation",
    konzentration: "1 mg / 10 ml (1:10.000)",
    mgPerMl: 0.1,
    modus: "fix_oder_kg",
    fixErwachsen: 1,
    kgKind: 0.01,
    max: null,
    hinweis: "Alle 3–5 min wiederholen.",
    farbe: "#FF6A3D",
    dosisQuelle: "demo",
    handelsname: "Suprarenin",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "dimetinden",
    kontraindikationen: ["Engwinkelglaukom", "Neu-/Frühgeborene", "Schwere Leberfunktionsstörung", "Gleichzeitige MAO-Hemmer-Therapie"],
    name: "Dimetinden",
    gruppe: "Anaphylaxie — H1-Blocker",
    konzentration: "4 mg / 4 ml",
    mgPerMl: 1,
    modus: "kg",
    kgFaktor: 0.1,
    max: null,
    hinweis: "0,1 mg/kgKG i.v. Alternative zu Clemastin.",
    farbe: "#A78BFA",
    dosisQuelle: "sop",
    handelsname: "Fenistil",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "clemastin",
    kontraindikationen: ["Engwinkelglaukom", "Prostatahyperplasie mit Restharnbildung", "Neugeborene/Frühgeborene", "Akuter Asthmaanfall (anticholinerge Wirkung)"],
    name: "Clemastin",
    gruppe: "Anaphylaxie — H1-Blocker",
    konzentration: "2 mg / 5 ml",
    mgPerMl: 0.4,
    modus: "fix_oder_kg",
    fixErwachsen: 2,
    kgKind: 0.03,
    max: null,
    hinweis: "Erwachsene: 2 mg fix i.v. · Kinder > 1 Jahr: 0,03 mg/kgKG i.v. Alternative zu Dimetinden.",
    farbe: "#A78BFA",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "prednisolon_anaphylaxie",
    kontraindikationen: ["Bei vitaler Indikation (Anaphylaxie) keine absolute Kontraindikation", "Relative Vorsicht: unbehandelte schwere Infektion"],
    name: "Prednisolon — Anaphylaxie (K9)",
    gruppe: "Anaphylaxie",
    konzentration: "250 mg / 5 ml (50 mg/ml)",
    mgPerMl: 50,
    modus: "fix",
    fixErwachsen: 250,
    max: 250,
    hinweis: "250 mg i.v., nur bei Rebound-Symptomatik (nicht Ersttherapie, Adrenalin geht immer vor).",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "prednisolon_asthma_erwachsene",
    kontraindikationen: ["Bei vitaler Indikation keine absolute Kontraindikation", "Relative Vorsicht: unbehandelte schwere Infektion"],
    name: "Prednisolon — Asthma Erwachsene (K5)",
    gruppe: "Akute obstruktive Atemwegserkrankung — Erwachsene",
    konzentration: "250 mg / 5 ml (50 mg/ml) — für 100 mg i.v. entsprechend aufziehen; alternativ p.o.",
    mgPerMl: 50,
    modus: "fix",
    fixErwachsen: 100,
    max: 100,
    hinweis: "100 mg p.o. oder i.v.",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "prednisolon_asthma_kind",
    kontraindikationen: ["Bei vitaler Indikation keine absolute Kontraindikation", "Relative Vorsicht: unbehandelte schwere Infektion"],
    name: "Prednisolon — Asthma Kind bis 12 J. (K6)",
    gruppe: "Akute obstruktive Atemwegserkrankung — Kind",
    konzentration: "Supp. 100 mg rektal",
    mgPerMl: 100,
    modus: "fix",
    fixErwachsen: 100,
    max: 100,
    hinweis: "100 mg rektal (1 Zäpfchen). Hinweis: Die App zeigt hier \"ml\" an — gemeint ist 1 Zäpfchen, keine Flüssigkeitsmenge.",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "prednisolon_krupp_rektal",
    kontraindikationen: ["Bei vitaler Indikation keine absolute Kontraindikation", "Relative Vorsicht: unbehandelte schwere Infektion"],
    name: "Prednisolon — Krupp rektal (K7)",
    gruppe: "Extrapulmonale Atemwegsobstruktion / Krupp (Kind)",
    konzentration: "Supp. 100 mg rektal",
    mgPerMl: 100,
    modus: "fix",
    fixErwachsen: 100,
    max: 100,
    hinweis: "100 mg rektal (1 Zäpfchen), Erstwahl falls noch nicht verabreicht. Hinweis: \"ml\" = 1 Zäpfchen, keine Flüssigkeitsmenge.",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "prednisolon_krupp_iv",
    kontraindikationen: ["Bei vitaler Indikation keine absolute Kontraindikation", "Relative Vorsicht: unbehandelte schwere Infektion"],
    name: "Prednisolon — Krupp i.v. (K7)",
    gruppe: "Extrapulmonale Atemwegsobstruktion / Krupp (Kind)",
    konzentration: "250 mg / 5 ml (50 mg/ml) — Alternativampulle, ungeprüft ob im Bereich tatsächlich geführt",
    mgPerMl: 50,
    modus: "kg",
    kgFaktor: 2,
    max: null,
    hinweis: "2 mg/kgKG i.v., alternativ zur rektalen Gabe (z. B. bei bereits liegendem Zugang). Die SOP nennt hier keine Maximaldosis — bei größeren Kindern/Jugendlichen die resultierende mg-Zahl kritisch gegen die rektale Fixdosis (100 mg) abwägen.",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "amiodaron",
    kontraindikationen: ["Bekannte Jodallergie", "Schwere Schilddrüsenfunktionsstörung", "Kardiogener Schock (Ausnahme: Reanimation)", "AV-Block ohne Schrittmacher"],
    name: "Amiodaron — M3",
    gruppe: "Reanimation (VF/pVT)",
    konzentration: "150 mg / 3 ml (50 mg/ml)",
    mgPerMl: 50,
    modus: "fix_oder_kg",
    fixErwachsen: 300,
    kgKind: 5,
    max: 300,
    maxKind: 150,
    hinweis: "Erstgabe nach 3. Schock: Erwachsene 300 mg i.v./i.o., Kinder 5 mg/kgKG i.v./i.o. Wiederholung (1x) nach dem 5. Schock: Erwachsene 150 mg, Kinder ebenfalls gedeckelt auf max. 150 mg gesamt.",
    farbe: "#FF6A3D",
    dosisQuelle: "sop",
    handelsname: "Cordarex",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "midazolam_iv",
    kontraindikationen: ["Myasthenia gravis", "Bewusstseinsstörung mit GCS<12 durch Alkohol/Drogen/Psychopharmaka", "Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Midazolam i.v. — M16",
    gruppe: "Status epilepticus / Sedierung",
    konzentration: "5 mg / 5 ml (1 mg/ml) — PUR, nicht verdünnen",
    mgPerMl: 1,
    modus: "kg",
    kgFaktor: 0.1,
    max: 5,
    hinweis: "Fraktioniert in 1–2-mg-Schritten bis max. 5 mg Bolusgabe (SOP: <50 kgKG 1 mg/10 kg, ≥50 kgKG praktisch immer der 5-mg-Deckel). Wdh. nach 2 Min. falls keine Wirkung. Antidot: Flumazenil 0,5 mg/5 ml.",
    bekannteAbweichung: "Der Algorithmus K10 selbst nennt im Fließtext zwei unterschiedliche Raten (0,2 mg/kgKG in der Überschrift vs. 1 mg/10 kgKG im Kleingedruckten) und begrenzt auf max. 5 mg. Die separate M16-Referenzseite nennt abweichend max. 10 mg (nur bei <40 kgKG 5 mg). Vor Anwendung im lokalen SOP-Original gegenprüfen.",
    farbe: "#2DD4BF",
    dosisQuelle: "sop",
    handelsname: "Dormicum",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "midazolam_nasal",
    kontraindikationen: ["Myasthenia gravis", "Bewusstseinsstörung mit GCS<12 durch Alkohol/Drogen/Psychopharmaka", "Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Midazolam nasal — M16",
    gruppe: "Status epilepticus / Sedierung",
    konzentration: "15 mg / 3 ml (5 mg/ml) — höchste Konzentration für nasale Gabe verwenden, PUR",
    mgPerMl: 5,
    modus: "kg",
    kgFaktor: 0.2,
    max: 5,
    hinweis: "0,2 mg/kgKG nasal, harter Deckel bei 5 mg (auch <40 kgKG max. 5 mg). Max. 1–1,5 ml pro Nasenloch. Wdh. nach 4 Min. falls keine Wirkung. Antidot: Flumazenil 0,5 mg/5 ml.",
    bekannteAbweichung: "Die separate M16-Referenzseite nennt abweichend max. 10 mg (nur bei <40 kgKG 5 mg) statt des hier (wie im Algorithmus K10) verwendeten 5-mg-Deckels. Vor Anwendung im lokalen SOP-Original gegenprüfen.",
    farbe: "#2DD4BF",
    dosisQuelle: "sop",
    handelsname: "Dormicum",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "esketamin",
    kontraindikationen: ["Bewusstseinsstörung/Einfluss psychoaktiver Substanzen (GCS<12)", "Akute KHK (bei Esketamin-Monotherapie)", "Maligner Hypertonus", "Manifeste Hyperthyreose", "Hypertensive Entgleisung", "Schwangerschaft (relativ)", "Aktuelle psychogene Erkrankung (akut)"],
    name: "Esketamin — M9",
    gruppe: "Analgesie (ausschließlich traumatisch bedingter starker Schmerz)",
    konzentration: "5 mg/ml — 1 Amp. (50 mg/2 ml) auf 10 ml verdünnen (ergibt 5 mg/ml)",
    mgPerMl: 5,
    modus: "kg",
    kgFaktor: 0.125,
    max: null,
    hinweis: "Erstgabe i.v.: 0,125-0,250 mg/kgKG langsam titrierend (nasal: 0,250-0,500 mg/kgKG). Wdh. frühestens nach 2 Min., gleiche Dosis. Insgesamt max. 0,5 mg/kgKG. Kein spezifisches Antidot bekannt.",
    farbe: "#F472B6",
    dosisQuelle: "sop",
    handelsname: "Ketanest S",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "nalbuphin",
    kontraindikationen: ["Bewusstseinsstörung mit GCS<12", "Kreislaufinstabilität (Hf<50, RRsyst<100 mmHg)", "Schwere Nieren-/Leberschäden", "Aktuelle Therapie mit µ-Agonisten (Morphin, Fentanyl, Methadon)", "Kinder unter 18 Monaten"],
    name: "Nalbuphin — M18",
    gruppe: "Analgesie (starke Schmerzen, traumat./nichttraumat.)",
    konzentration: "1 mg/ml — 1 Amp. (20 mg/2 ml) auf 20 ml verdünnen",
    mgPerMl: 1,
    modus: "kg",
    kgFaktor: 0.2,
    max: 20,
    hinweis: "12-65 J.: 0,2 mg/kgKG · <12 o. >65 J.: 0,1 mg/kgKG (Erstgabe, hier nicht automatisch unterschieden — Alter beachten!). Langsame Gabe über 30 Sek. Wdh. frühestens nach 6 Min. (0,1 mg/kgKG), max. 20 mg gesamt. Antidot: Naloxon.",
    farbe: "#FB923C",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "glukose40",
    kontraindikationen: ["Nur bei gesicherter/hochwahrscheinlicher Hypoglykämie", "Cave: paravasale Injektion (Gewebsnekrose-Gefahr)"],
    name: "Glukose 40% — M12",
    gruppe: "Hypoglykämie (K8)",
    konzentration: "40 g / 100 ml (400 mg/ml)",
    mgPerMl: 400,
    modus: "fix_oder_kg",
    fixErwachsen: 8000,
    kgKind: 200,
    max: 8000,
    hinweis: "Erwachsene: 8 g fix i.v. Kinder <12 J.: 0,2 g/kgKG (kein dokumentiertes Maximum in der SOP für Kinder — bei sehr hohem Körpergewicht klinisch prüfen). Wiederholung alle 3 Min. bis BZ im Normbereich.",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "ass",
    kontraindikationen: ["Allergie gegenüber Wirkstoff/Substanzklasse (Asthma, COPD-Verschlimmerung)", "Akute gastrointestinale Ulcera", "Schwangerschaft"],
    name: "ASS (Acetylsalicylsäure) — M1",
    gruppe: "Akutes Koronarsyndrom (K1)",
    konzentration: "100 mg/ml nach Auflösen (5 ml-Ampulle Wasser)",
    mgPerMl: 100,
    modus: "fix",
    fixErwachsen: 250,
    max: 250,
    hinweis: "75-250 mg i.v. bzw. 150-300 mg p.o. Vor PCI-Anmeldung, nach Heparin 5000 I.E.",
    farbe: "#F87171",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "salbutamol",
    kontraindikationen: ["Überdosierung mit ß-Mimetika", "Tachykardie >150/min", "Tachyarrhythmie", "Kinder <4 Jahre"],
    name: "Salbutamol Fertiginhalat",
    gruppe: "Obstruktive Atemwegserkrankung (K5/K6)",
    konzentration: "Kind: 1 Amp. à 1,25 mg/2,5 ml · Erw.: 2 Amp. à 1,25 mg/2,5 ml (=2,5 mg/5 ml)",
    mgPerMl: 0.5,
    modus: "fix_oder_kg",
    fixErwachsen: 2.5,
    kgKind: null,
    kindFix: 1.25,
    max: 2.5,
    hinweis: "Kind: 1 Amp., bei >20 kg nach 15 min. wiederholbar. Erw.: 2 Amp. mit O2 vernebeln, nach 15 min. wiederholen.",
    farbe: "#34D399",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "ipratropiumbromid",
    kontraindikationen: ["Kinder <6 Jahre", "Bekannte Überempfindlichkeit gegen Atropin/Atropin-Derivate"],
    name: "Ipratropiumbromid Fertiginhalat",
    gruppe: "Obstruktive Atemwegserkrankung (K5/K6)",
    konzentration: "Kind: 1 Amp. à 0,25 mg/2 ml · Erw.: 2 Amp. à 0,25 mg/2 ml (=0,5 mg/4 ml)",
    mgPerMl: 0.125,
    modus: "fix_oder_kg",
    fixErwachsen: 0.5,
    kindFix: 0.25,
    max: 0.5,
    hinweis: "Kind: nach jeweils 20 min. 2x wiederholbar. Erw.: mit O2 vernebeln, nach 30 min. wiederholbar.",
    farbe: "#34D399",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "adrenalin-vernebelt",
    kontraindikationen: ["Nie ohne begleitendes Steroid geben", "Relative Vorsicht: schwere Tachyarrhythmie"],
    name: "Adrenalin vernebelt (Krupp)",
    gruppe: "Extrapulmonale Atemwegsobstruktion (K7)",
    konzentration: "5 mg vernebeln (Zubereitung je nach Verneblersystem)",
    mgPerMl: 1,
    modus: "fix",
    fixErwachsen: 5,
    max: 5,
    hinweis: "Nur bei Schweregrad III–IV. Schnelle, aber kurze Wirksamkeit — immer in Kombination mit Steroid (Prednisolon).",
    farbe: "#F87171",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "reproterol",
    kontraindikationen: ["Tachyarrhythmie", "Frischer Myokardinfarkt", "Hypertrophe obstruktive Kardiomyopathie"],
    name: "Reproterol i.v.",
    gruppe: "Status asthmaticus (Notarzt-Maßnahme, K5/K6)",
    konzentration: "0,09 mg i.v.",
    mgPerMl: 0.09,
    modus: "fix",
    fixErwachsen: 0.09,
    max: 0.09,
    hinweis: "Nur durch Notarzt. Wiederholung nach 10 min. möglich.",
    farbe: "#60A5FA",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "akrinor",
    kontraindikationen: ["Hypertone Kreislaufsituation", "Tachykarde Herzrhythmusstörungen", "Engwinkelglaukom", "Prostatahyperplasie mit Restharnbildung", "Phäochromozytom"],
    name: "Akrinor (Cafedrin/Theodrenalin)",
    gruppe: "Nicht Teil des offiziellen M1–M28-SOP-Katalogs — Kreislaufstabilisierung",
    konzentration: "1 Amp. = 2 ml (200 mg Cafedrin + 10 mg Theodrenalin), üblich verdünnt auf 10 ml",
    mgPerMl: 1,
    modus: "fix",
    fixErwachsen: 1,
    max: 2,
    einheitML: true,
    hinweis: "Fraktioniert 1–2 ml (unverdünnt) bzw. nach Verdünnung 1–2 ml der 10-ml-Lösung i.v. titrieren, nach Wirkung. Kein mg-Einzelwert, da Kombinationspräparat — Wert hier bildet nur ml-Titrationsschritt ab, kein SOP-Bestandteil dieses RD-Bereichs.",
    farbe: "#94A3B8",
    dosisQuelle: "extern",
    handelsname: "Akrinor",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "metoprolol",
    kontraindikationen: ["Kardiogener Schock", "Höhergradiger AV-Block", "Symptomatische Bradykardie", "Dekompensierte Herzinsuffizienz", "Schweres Asthma bronchiale"],
    name: "Metoprolol (Beloc)",
    gruppe: "Nicht Teil des offiziellen M1–M28-SOP-Katalogs — Betablocker",
    konzentration: "5 mg / 5 ml (1 mg/ml)",
    mgPerMl: 1,
    modus: "fix",
    fixErwachsen: 5,
    max: 15,
    hinweis: "5 mg langsam i.v., ggf. Wiederholung bis max. 15 mg. Kein SOP-Bestandteil dieses RD-Bereichs — nur nach ärztlicher Anordnung/Rücksprache.",
    farbe: "#94A3B8",
    dosisQuelle: "extern",
    handelsname: "Beloc",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "verapamil",
    kontraindikationen: ["WPW-Syndrom mit Vorhofflimmern", "Höhergradiger AV-Block", "Kardiogener Schock", "Dekompensierte Herzinsuffizienz", "Gleichzeitige Betablocker-Gabe i.v."],
    name: "Verapamil (Isoptin)",
    gruppe: "Nicht Teil des offiziellen M1–M28-SOP-Katalogs — Kalziumantagonist",
    konzentration: "5 mg / 2 ml (2,5 mg/ml)",
    mgPerMl: 2.5,
    modus: "fix",
    fixErwachsen: 5,
    max: 10,
    hinweis: "5 mg langsam i.v. über 2 Min., ggf. nach 15–30 Min. weitere 5–10 mg. Kein SOP-Bestandteil dieses RD-Bereichs — nur nach ärztlicher Anordnung/Rücksprache.",
    farbe: "#94A3B8",
    dosisQuelle: "extern",
    handelsname: "Isoptin",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "furosemid",
    kontraindikationen: ["Ausgeprägte Hypovolämie/Exsikkose", "Anurie", "Bekannte Sulfonamid-Überempfindlichkeit (relativ)"],
    name: "Furosemid (Lasix)",
    gruppe: "Nicht Teil des offiziellen M1–M28-SOP-Katalogs — Schleifendiuretikum",
    konzentration: "40 mg / 4 ml (10 mg/ml)",
    mgPerMl: 10,
    modus: "fix",
    fixErwachsen: 40,
    max: 40,
    hinweis: "20–40 mg langsam i.v. Kein SOP-Bestandteil dieses RD-Bereichs — nur nach ärztlicher Anordnung/Rücksprache.",
    farbe: "#94A3B8",
    dosisQuelle: "extern",
    handelsname: "Lasix",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "metoclopramid",
    kontraindikationen: ["Kinder < 1 Jahr", "Mechanischer Ileus/GI-Perforation/-Blutung", "Bekannte extrapyramidale Störungen/Epilepsie (relativ)", "Phäochromozytom"],
    name: "Metoclopramid (MCP)",
    gruppe: "Nicht Teil des offiziellen M1–M28-SOP-Katalogs — Antiemetikum",
    konzentration: "10 mg / 2 ml (5 mg/ml)",
    mgPerMl: 5,
    modus: "fix",
    fixErwachsen: 10,
    max: 10,
    hinweis: "10 mg langsam i.v. Kein SOP-Bestandteil dieses RD-Bereichs — nur nach ärztlicher Anordnung/Rücksprache.",
    farbe: "#94A3B8",
    dosisQuelle: "extern",
    handelsname: "MCP",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "atropin",
    kontraindikationen: ["Tachykarde Herzrhythmusstörungen", "Engwinkelglaukom (relativ, bei vitaler Indikation kein Ausschluss)", "Bekannte Überempfindlichkeit"],
    name: "Atropin — M4",
    gruppe: "Bedrohliche Bradykardie mit Symptomen",
    konzentration: "1 mg / 1 ml",
    mgPerMl: 1,
    modus: "fix",
    fixErwachsen: 0.5,
    max: 3,
    hinweis: "0,5 mg i.v., Wiederholung alle 3-5 Min. bis max. 3 mg. KEINE Gabe bei AV-Block II Mobitz/III (Gefahr des totalen AV-Blocks).",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "heparin",
    kontraindikationen: ["Akute Blutung", "Bekannte Heparin-induzierte Thrombozytopenie (HIT)", "Schwere Gerinnungsstörung", "Frisches Schädel-Hirn-Trauma/OP"],
    name: "Heparin",
    gruppe: "ACS (Begleitmedikation)",
    konzentration: "5000 IE / 0,2 ml",
    mgPerMl: 25000,
    modus: "fix",
    fixErwachsen: 5000,
    max: 5000,
    einheitIE: true,
    hinweis: "i.v. Bolus bei V.a. ACS, falls SOP vorsieht.",
    farbe: "#F87171",
    dosisQuelle: "demo",
    handelsname: "Liquemin",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "glyceroltrinitrat",
    kontraindikationen: ["Bekannte Aortenstenose oder HOCM", "PDE5-Hemmer (z.B. Viagra) in letzten 48h", "Rechtsventrikulärer Myokardinfarkt", "Hf <50 oder >130/min", "RR <150 mmHg (ACS/Linksherzinsuff.)"],
    name: "Glyceroltrinitrat — M13",
    gruppe: "ACS / Linksherzinsuffizienz / Hypertensiver Notfall",
    konzentration: "Nitrolingual Pumpspray, 0,4 mg/Hub",
    mgPerMl: 0.4,
    modus: "fix",
    fixErwachsen: 0.4,
    max: 1.2,
    hinweis: "1 Hub s.l., Wdh. frühestens nach 3 Min. (max. 3 Hübe = 1,2 mg). Bei eindeutigem STEMI nicht empfohlen.",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "urapidil",
    kontraindikationen: ["Aortenisthmusstenose", "Arteriovenöse Shunts", "Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Urapidil — M26",
    gruppe: "Hypertensiver Notfall (K4)",
    konzentration: "25 mg/5 ml bzw. 50 mg/10 ml",
    mgPerMl: 5,
    modus: "fix",
    fixErwachsen: 5,
    max: 25,
    hinweis: "5 mg über 1 Min., Wiederholung nach 3 Min. möglich bis max. 25 mg. Vorsichtiger Beginn — individuelle Reaktion nicht vorhersehbar.",
    farbe: "#A78BFA",
    dosisQuelle: "sop",
    handelsname: "Ebrantil",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "naloxon_iv",
    kontraindikationen: ["Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Naloxon i.v. (fraktioniert) — M19",
    gruppe: "Opioidüberdosierung (K20)",
    konzentration: "1 Amp. (0,4 mg/1 ml) auf 10 ml verdünnt = 0,04 mg/ml — NICHT die unverdünnte Ampullenkonzentration verwenden!",
    mgPerMl: 0.04,
    modus: "fix",
    fixErwachsen: 0.1,
    max: null,
    hinweis: "Schrittdosis (nicht Gesamtdosis): fraktionierte Gabe in 0,1-mg-Schritten (= 2,5 ml der verdünnten Lösung) bis suffiziente Spontanatmung/Schutzreflexe/Vigilanz erreicht sind. Wdh. frühestens nach 2 Min., gleiche Schrittdosis. Kürzere Halbwertszeit als Opioide — Nachbeobachtung zwingend erforderlich!",
    farbe: "#F87171",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "naloxon_nasal",
    kontraindikationen: ["Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Naloxon nasal (Fertigspray) — K20",
    gruppe: "Opioidüberdosierung (K20)",
    konzentration: "Fertigspray 1,8 mg/Hub (Schreibweise im Quelldokument uneinheitlich: Nyoxid®/Nyxoid®)",
    mgPerMl: 1.8,
    modus: "fix",
    fixErwachsen: 1.8,
    max: 1.8,
    hinweis: "1 Hub nasal, Fertigdosis ohne Titration. Hinweis: Die App zeigt hier \"ml\" an — gemeint ist 1 Hub, keine Flüssigkeitsmenge. Nasale Gabe bevorzugt bei schwierigem Venenstatus/Eigenschutz.",
    farbe: "#F87171",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "butylscopolamin",
    kontraindikationen: ["Engwinkelglaukom", "Blasenentleerungsstörung mit Restharn", "Mechanische Stenosen im Magen-Darm-Kanal", "Tachyarrhythmie", "Megacolon", "Akutes Lungenödem"],
    name: "Butylscopolamin — M5",
    gruppe: "Abdomineller Schmerz / Gallenkolik (K16a)",
    konzentration: "20 mg / 1 ml",
    mgPerMl: 20,
    modus: "fix",
    fixErwachsen: 20,
    max: 20,
    hinweis: "20 mg i.v. langsam. Bei V.a. Gallenkolik. Bei Nierenkolik nicht empfohlen (AWMF).",
    farbe: "#34D399",
    dosisQuelle: "sop",
    handelsname: "Buscopan",
    ampulleGeprueft: true,
    geprueftVon: "Konzentration mit vorliegendem Produktfoto abgeglichen (keine formale Validierung)",
    geprueftAm: "17.08.2026",
  },
  {
    id: "dimenhydrinat",
    kontraindikationen: ["Akuter Asthma-Anfall", "Engwinkelglaukom", "Phäochromozytom", "Prostatahyperplasie", "Krampfanfälle (Epilepsie, Eklampsie)"],
    name: "Dimenhydrinat — M7",
    gruppe: "Starke Übelkeit (K17)",
    konzentration: "62 mg / 10 ml",
    mgPerMl: 6.2,
    modus: "fix_oder_kg",
    fixErwachsen: 62,
    kindFix: null,
    kgKind: 1.25,
    max: 62,
    hinweis: "Erw./Jugendl.: max. 62 mg. Kinder 6-14 J.: 1,25 mg/kgKG. Langsam i.v. oder in VEL.",
    farbe: "#34D399",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "thiamin",
    kontraindikationen: ["Überempfindlichkeit gegenüber dem Wirkstoff"],
    name: "Thiamin (Vitamin B1) — M25",
    gruppe: "Unklare Bewusstseinsstörung bei fraglicher Mangelernährung",
    konzentration: "100 mg / 2 ml",
    mgPerMl: 50,
    modus: "fix",
    fixErwachsen: 100,
    max: 100,
    hinweis: "100 mg vorsichtig und langsam i.v. — bei unklarer Bewusstseinsstörung mit/vor Glucose-Gabe (V.a. Alkoholerkrankung, Kachexie).",
    farbe: "#A3A3A3",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
  {
    id: "glucose",
    kontraindikationen: ["Hyperglykämie"],
    name: "Glucose 40% — M12",
    gruppe: "Symptomatische Hypoglykämie",
    konzentration: "40% — 4 g / 10 ml",
    mgPerMl: 400,
    modus: "fix_oder_kg",
    fixErwachsen: 8000,
    kindFix: null,
    kgKind: 200,
    max: 8000,
    maxKind: 8000,
    hinweis: "Erwachsene: 8 g i.v. (lokale Darreichungsvorgabe beachten). Kinder ≤12 J.: 0,2 g/kgKG. Wiederholung frühestens nach 3 Min. bis BZ im Normbereich.",
    farbe: "#4ADE80",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: false,
    geprueftVon: null,
    geprueftAm: null,
  },
];

// Hessen-Landesalgorithmen (V4.0, gültig ab 01.03.2025) — eigenständiger
// Datensatz, komplett getrennt von den Darmstadt/Darmstadt-Dieburg/
// Bergstraße/Groß-Gerau-Algorithmen oben. IDs bewusst mit "h-" prefixiert,
// damit auch bei künftigen Änderungen keine Überschneidung mit den
// DA/DI-IDs entstehen kann.
// Hessen-Landesmedikamente (M1–M28, V4.0) — eigener, komplett getrennter
// Datensatz von den Bgs/Da/DaDi/GG-Medikamenten oben. Nicht alle Werte sind
// identisch mit der Bgs/Da/DaDi/GG-Version, siehe Hinweistexte pro Eintrag!
const MEDIKAMENTE_HESSEN = [
  {
    id: "h-adrenalin_im",
    kontraindikationen: ["Bei vitaler Indikation keine", "Allergie gegenüber dem Wirkstoff/der Substanzklasse"],
    name: "Adrenalin i.m. (Anaphylaxie) — M2",
    gruppe: "Anaphylaxie",
    konzentration: "1 mg / 1 ml (unverdünnt)",
    mgPerMl: 1,
    modus: "kg",
    kgFaktor: 0.01,
    max: 0.6,
    hinweis: "<30 kgKG: 0,01 mg/kgKG · 30–60 kgKG: 0,3–0,6 mg · >60 kgKG: 0,6 mg (Hessen: fix, KEIN Abfall wie bei Bgs/Da/DaDi/GG!).",
    farbe: "#FF6A3D",
    dosisQuelle: "sop",
    handelsname: "Suprarenin",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-adrenalin_iv",
    kontraindikationen: ["Bei vitaler Indikation keine", "Allergie gegenüber dem Wirkstoff/der Substanzklasse"],
    name: "Adrenalin i.v./i.o. (Reanimation) — M2",
    gruppe: "Kreislaufstillstand — CPR",
    konzentration: "1 mg / 10 ml (1:10.000, verdünnt aus 1 mg/1 ml)",
    mgPerMl: 0.1,
    modus: "fix_oder_kg",
    fixErwachsen: 1,
    kindFix: null,
    kgKind: 0.01,
    hinweis: "Erw./Jugendl.: 1 mg i.v./i.o. alle 3-5 Min. Kind: 0,01 mg/kgKG i.v./i.o.",
    farbe: "#FF6A3D",
    dosisQuelle: "sop",
    handelsname: "Suprarenin",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-amiodaron",
    kontraindikationen: ["Bei vitaler Indikation keine", "Allergie gegenüber dem Wirkstoff/der Substanzklasse"],
    name: "Amiodaron — M3",
    gruppe: "Kreislaufstillstand (VF/pVT) — CPR",
    konzentration: "150 mg / 3 ml (50 mg/ml)",
    mgPerMl: 50,
    modus: "fix_oder_kg",
    fixErwachsen: 300,
    kindFix: null,
    kgKind: 5,
    maxKind: 300,
    hinweis: "Erw.: 2 Amp. = 300 mg nach 3. Defibrillation, Repetition 1 Amp. = 150 mg möglich. Kind: 5 mg/kgKG i.v./i.o. nach 3. Defibrillation, Repetition gleiche Dosis nach 5. Defibrillation.",
    farbe: "#A78BFA",
    dosisQuelle: "sop",
    handelsname: "Cordarex",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-atropin",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "AV-Block Grad 2 Typ Mobitz (außer Erstgabe)"],
    name: "Atropin — M4",
    gruppe: "Bedrohliche Bradykardie mit Symptomen",
    konzentration: "1 mg / 1 ml (bzw. 0,5 mg/ml je nach Präparat — Ampulle prüfen!)",
    mgPerMl: 1,
    modus: "fix",
    fixErwachsen: 0.5,
    max: 3,
    hinweis: "0,5 mg i.v., Wiederholung bis max. 3,0 mg möglich.",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: "Atropinsulfat",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-butylscopolamin",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Grüner Star (Engwinkelglaukom)", "Blasenentleerungsstörung mit Restharnbildung", "Mechanische Stenosen im Magen-Darm-Kanal", "Tachyarrhythmie", "Megacolon", "Akutes Lungenödem", "Schwere Zerebralsklerose"],
    name: "Butylscopolamin — M5",
    gruppe: "Kolikartige Schmerzen",
    konzentration: "20 mg / 1 ml",
    mgPerMl: 20,
    modus: "fix",
    fixErwachsen: 20,
    max: 20,
    hinweis: "20 mg i.v., langsam.",
    farbe: "#34D399",
    dosisQuelle: "sop",
    handelsname: "Buscopan",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-clemastin",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "<1 Lebensjahr", "Grüner Star (Engwinkelglaukom)", "Phäochromozytom", "Porphyrie", "Symptomatische Prostatahypertrophie", "Leber- und Niereninsuffizienz"],
    name: "Clemastinfumarat — M6",
    gruppe: "Anaphylaxie",
    konzentration: "2 mg / 2 ml",
    mgPerMl: 1,
    modus: "fix_oder_kg",
    fixErwachsen: 2,
    kindFix: null,
    kgKind: 0.03,
    maxKind: 2,
    hinweis: "Erwachsene: langsam i.v. unter Kontrolle der Herzfrequenz (Einmalgabe meist ausreichend). Kinder >1 LJ: 0,03 mg/kgKG.",
    farbe: "#F472B6",
    dosisQuelle: "sop",
    handelsname: "Tavegil",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-dimenhydrinat",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Akuter Asthma-Anfall", "Engwinkelglaukom", "Phäochromozytom", "Porphyrie", "Prostatahyperplasie", "Krampfanfälle (Epilepsie, Eklampsie)"],
    name: "Dimenhydrinat — M7",
    gruppe: "Übelkeit/Erbrechen",
    konzentration: "62 mg / 10 ml",
    mgPerMl: 6.2,
    modus: "fix_oder_kg",
    fixErwachsen: 62,
    kindFix: null,
    kgKind: 1.25,
    max: 62,
    hinweis: "Erw./Jugendl.: max. 62 mg. Kinder 6-14 J.: 1,25 mg/kgKG. Langsam i.v. oder in VEL.",
    farbe: "#4ADE80",
    dosisQuelle: "sop",
    handelsname: "Vomex A",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-dimetinden",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "<1 Lebensjahr", "Grüner Star (Engwinkelglaukom)", "Phäochromozytom", "Porphyrie", "Symptomatische Prostatahypertrophie"],
    name: "Dimetindenmaleat — M8",
    gruppe: "Anaphylaxie",
    konzentration: "4 mg / 4 ml",
    mgPerMl: 1,
    modus: "fix_oder_kg",
    fixErwachsen: 4,
    kindFix: null,
    kgKind: 0.1,
    maxKind: 4,
    hinweis: "Erwachsene: langsam i.v. unter Kontrolle der Herzfrequenz. Kinder >1 LJ: 0,1 mg/kgKG, ab 40 kgKG 1 Ampulle (4 mg).",
    farbe: "#F472B6",
    dosisQuelle: "sop",
    handelsname: "Fenistil",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-esketamin",
    kontraindikationen: ["Bewusstseinsstörung/Einfluss psychoaktiver Substanzen (GCS<12)", "Akute ischämische Herzerkrankung (Monotherapie)", "Manifeste Hyperthyreose", "Hypertensive Entgleisung", "Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Schwangerschaft (relativ)"],
    name: "Esketamin — M9",
    gruppe: "Analgesie (traumatisch bedingter starker Schmerz)",
    konzentration: "10 mg/ml — 1 Amp. (50 mg/2 ml) auf 5 ml verdünnt (Hessen: ergibt 10 mg/ml!)",
    mgPerMl: 10,
    modus: "kg",
    kgFaktor: 0.25,
    max: null,
    hinweis: "i.v.: 0,125–0,250 mg/kgKG. Nasal: 0,250–0,500 mg/kgKG (höhere Dosis nötig). Wdh. frühestens nach 2 Min. Kein spezifisches Antidot.",
    farbe: "#F472B6",
    dosisQuelle: "sop",
    handelsname: "Ketanest S",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-fentanyl",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Bewusstseinsstörung/Einfluss psychoaktiver Substanzen (GCS<12)", "Atemstörung (AF<10/min, SpO2<90%)", "Kreislaufinstabilität (Hf<50, RRsyst<100 mmHg)", "Eingeschränkte Zugänglichkeit zum Patienten"],
    name: "Fentanyl — M10 (nur Hessen)",
    gruppe: "Analgesie (traumatisch bedingter starker Schmerz)",
    konzentration: "0,05 mg/ml — 1 Amp. (0,5 mg/10 ml oder 0,1 mg/2 ml), unverdünnt",
    mgPerMl: 0.05,
    modus: "kg",
    kgFaktor: 0.001,
    max: null,
    hinweis: "0,001 mg/kgKG (=1 µg/kgKG), langsam über 30 Sek. Wdh. frühestens nach 2 Min., gleiche Dosis. Antidot: Naloxon.",
    farbe: "#F472B6",
    dosisQuelle: "sop",
    handelsname: "Fentanyl-Janssen",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-flumazenil",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Epilepsiepatienten mit Mischintoxikation (Benzodiazepine als Schutzmedikation)"],
    name: "Flumazenil — M11 (nur Hessen)",
    gruppe: "Antidot bei Benzodiazepin-Überdosierung",
    konzentration: "0,5 mg / 5 ml (0,1 mg/ml)",
    mgPerMl: 0.1,
    modus: "fix",
    fixErwachsen: 0.2,
    max: 0.5,
    hinweis: "0,2 mg initial (in 15 Sek.), Wiederholung in 0,1-mg-Schritten bis max. 0,5 mg.",
    farbe: "#94A3B8",
    dosisQuelle: "sop",
    handelsname: "Anexate",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-glucose",
    kontraindikationen: ["Hyperglykämie"],
    name: "Glucose 40% — M12",
    gruppe: "Symptomatische Hypoglykämie",
    konzentration: "40% — 4 g / 10 ml",
    mgPerMl: 400,
    modus: "fix",
    fixErwachsen: 8000,
    max: 8000,
    hinweis: "8 g i.v. (lokale Darreichungsvorgabe beachten). Bei Kindern 1:1 mit NaCl 0,9% verdünnen — kein expliziter g/kgKG-Wert auf der Hessen-Quellseite, örtliche Vorgabe/Klinikstandard für Kinder beachten! Wdh. frühestens nach 3 Min.",
    farbe: "#4ADE80",
    dosisQuelle: "sop",
    handelsname: null,
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-glyceroltrinitrat",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Bekannte Aortenstenose oder HOCM", "PDE5-Hemmer-Einnahme (Viagra/Cialis/Levitra/Revatio) in den letzten 48 Std.", "Rechtsventrikulärer Myokardinfarkt", "Hf <50 oder >130/min.", "RR <150 mmHg bei Linksherzinsuffizienz", "RR <100 mmHg bei akutem Koronarsyndrom (Hessen: niedrigere Schwelle als Bgs/Da/DaDi/GG!)"],
    name: "Glyceroltrinitrat — M13",
    gruppe: "Angina pectoris / ACS / Linksherzinsuffizienz / Hypertensiver Notfall",
    konzentration: "0,4 mg / Hub (Pumpspray)",
    mgPerMl: 0.4,
    modus: "fix",
    fixErwachsen: 0.4,
    max: 1.2,
    einheitML: false,
    hinweis: "1 Hub (0,4 mg) sublingual, Wdh. frühestens nach 3 Min., max. 3 Hübe (1,2 mg). Nicht bei eindeutigem ST-Hebungsinfarkt.",
    farbe: "#F87171",
    dosisQuelle: "sop",
    handelsname: "Nitrolingual",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-ipratropiumbromid",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Schwangerschaft"],
    name: "Ipratropiumbromid — M14",
    gruppe: "Akute obstruktive Atemwegserkrankung",
    konzentration: "0,25 mg / 2 ml",
    mgPerMl: 0.125,
    modus: "fix_oder_kg",
    fixErwachsen: 0.5,
    kindFix: 0.25,
    kgKind: 0,
    maxKind: 1,
    max: 1,
    hinweis: "Erw./Kind >12 J.: 2 Amp. (0,5 mg in 4 ml) mit O2 vernebeln, nach 30 Min. wiederholbar. Kind bis 12 J.: 1 Amp. (0,25 mg in 2 ml) mit O2 vernebeln, nach 20 Min. wiederholbar. Tageshöchstdosis 1 mg.",
    farbe: "#60A5FA",
    dosisQuelle: "sop",
    handelsname: "Atrovent",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-levetiracetam",
    kontraindikationen: ["Bekannte Überempfindlichkeit gegen Levetiracetam", "Bekanntes Long-QT-Syndrom"],
    name: "Levetiracetam — M15 (nur Hessen)",
    gruppe: "Benzodiazepin-refraktärer Status epilepticus",
    konzentration: "500 mg / 5 ml (100 mg/ml)",
    mgPerMl: 100,
    modus: "kg",
    kgFaktor: 30,
    max: 2000,
    hinweis: "30 mg/kgKG als Kurzinfusion (mind. 100 ml NaCl 0,9%, über 10 Min.). Maximaldosis 2000 mg. Keine Einschränkung durch Vorbehandlung mit Antiepileptika.",
    farbe: "#FBBF24",
    dosisQuelle: "sop",
    handelsname: "Keppra",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-midazolam_status_iv",
    kontraindikationen: ["Myasthenia gravis", "Bewusstseinsstörung mit GCS<12 durch Alkohol/Drogen/Psychopharmaka", "Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Midazolam i.v. (Status epilepticus) — M16",
    gruppe: "Status epilepticus",
    konzentration: "5 mg / 1 ml",
    mgPerMl: 5,
    modus: "kg",
    kgFaktor: 0.1,
    max: 5,
    hinweis: "Bis 50 kgKG: 1 mg/10 kgKG (=0,1 mg/kgKG). Über 50 kgKG: 5 mg fix. Wdh. nach 2 Min. Antidot: Flumazenil.",
    farbe: "#2DD4BF",
    dosisQuelle: "sop",
    handelsname: "Dormicum",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-midazolam_status_nasal",
    kontraindikationen: ["Myasthenia gravis", "Bewusstseinsstörung mit GCS<12 durch Alkohol/Drogen/Psychopharmaka", "Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Midazolam nasal (Status epilepticus) — M16",
    gruppe: "Status epilepticus",
    konzentration: "15 mg / 3 ml (5 mg/ml)",
    mgPerMl: 5,
    modus: "kg",
    kgFaktor: 0.1,
    max: 5,
    hinweis: "Bis 50 kgKG: 1 mg/10 kgKG (=0,1 mg/kgKG). Über 50 kgKG: 5 mg fix. Wdh. nach 4 Min. Antidot: Flumazenil.",
    farbe: "#2DD4BF",
    dosisQuelle: "sop",
    handelsname: "Dormicum",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-midazolam_co_esketamin_iv",
    kontraindikationen: ["Myasthenia gravis", "Bewusstseinsstörung mit GCS<12 durch Alkohol/Drogen/Psychopharmaka", "Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Midazolam i.v. (Co-Medikament bei Esketamin) — M16",
    gruppe: "Analgesie mit Esketamin (fakultative Co-Medikation)",
    konzentration: "5 mg / 1 ml",
    mgPerMl: 5,
    modus: "kg",
    kgFaktor: 0.02,
    max: 1,
    hinweis: "10-50 kgKG: 0,2 mg/10 kgKG (=0,02 mg/kgKG) langsam i.v. >50 kgKG: 1 mg fix. NICHT obligat — nur fakultative Co-Analgesie/Prophylaxe gegen Esketamin-Alpträume.",
    farbe: "#2DD4BF",
    dosisQuelle: "sop",
    handelsname: "Dormicum",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-midazolam_co_esketamin_nasal",
    kontraindikationen: ["Myasthenia gravis", "Bewusstseinsstörung mit GCS<12 durch Alkohol/Drogen/Psychopharmaka", "Allergie gegenüber Wirkstoff/Substanzklasse"],
    name: "Midazolam nasal (Co-Medikament bei Esketamin) — M16",
    gruppe: "Analgesie mit Esketamin (fakultative Co-Medikation)",
    konzentration: "15 mg / 3 ml (5 mg/ml)",
    mgPerMl: 5,
    modus: "kg",
    kgFaktor: 0.04,
    max: 2,
    hinweis: "10-50 kgKG: 0,4 mg/10 kgKG (=0,04 mg/kgKG). >50 kgKG: 2 mg fix. NICHT obligat — nur fakultative Co-Analgesie/Prophylaxe gegen Esketamin-Alpträume.",
    farbe: "#2DD4BF",
    dosisQuelle: "sop",
    handelsname: "Dormicum",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-morphin",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Bewusstseinsstörung/Einfluss psychoaktiver Substanzen (GCS<12)", "Atemstörung (AF<10/min, SpO2<90%)", "Kreislaufinstabilität (Hf<50, RRsyst<100 mmHg)", "Eingeschränkte Zugänglichkeit zum Patienten", "Schwangerschaft"],
    name: "Morphin — M17 (nur Hessen)",
    gruppe: "Analgesie (starke Schmerzen)",
    konzentration: "1 mg/ml — 1 Amp. (10 mg/1 ml) auf 10 ml verdünnt",
    mgPerMl: 1,
    modus: "kg",
    kgFaktor: 0.04,
    max: null,
    hinweis: "0,04 mg/kgKG, langsam über 30 Sek. Wdh. frühestens nach 2 Min. Antidot: Naloxon.",
    farbe: "#FB923C",
    dosisQuelle: "sop",
    handelsname: "Morphin",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-nalbuphin",
    kontraindikationen: ["Bewusstseinsstörung mit GCS<12", "Kreislaufinstabilität (Hf<50, RRsyst<100 mmHg)", "Schwere Nieren-/Leberschäden", "Aktuelle Therapie mit µ-Agonisten (Morphin, Fentanyl, Methadon)", "Kinder unter 18 Monaten"],
    name: "Nalbuphin — M18",
    gruppe: "Analgesie (starke Schmerzen, traumat./nichttraumat.)",
    konzentration: "2 mg/ml — 1 Amp. (20 mg/2 ml) auf 10 ml verdünnt (Hessen: ergibt 2 mg/ml!)",
    mgPerMl: 2,
    modus: "kg",
    kgFaktor: 0.2,
    max: null,
    hinweis: "0,1–0,2 mg/kgKG, langsam über 30 Sek. Wdh. frühestens nach 6 Min., gleiche Dosis. Antidot: Naloxon.",
    farbe: "#FB923C",
    dosisQuelle: "sop",
    handelsname: "Nubain",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-paracetamol",
    kontraindikationen: ["Allergie gegenüber Paracetamol oder anderen NSAID/NSAR", "Leberfunktionsstörung", "Schwere Nierenerkrankung", "Blutbildungsstörung angeboren/erworben", "Epilepsie mit Einnahme von Antiepileptika", "Schwangerschaft (relative Kontraindikation)"],
    name: "Paracetamol — M20",
    gruppe: "Schmerz (NRS>5) / hohes Fieber",
    konzentration: "1000 mg / 100 ml (10 mg/ml), Perfalgan",
    mgPerMl: 10,
    modus: "fix_oder_kg",
    fixErwachsen: 1000,
    kindFix: null,
    kgKind: 15,
    maxKind: 1000,
    max: 1000,
    hinweis: "Ab 1. LJ (>10–50 kgKG): 15 mg/kgKG. >50 kgKG: 1000 mg = 100 ml. Kurzinfusion über 15 Min. Alternative: Metamizol möglich.",
    farbe: "#60A5FA",
    dosisQuelle: "sop",
    handelsname: "Perfalgan",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-piritramid",
    kontraindikationen: ["Bekannte Überempfindlichkeit auf Piritramid/Opiate", "Bewusstseinsstörung/Einfluss psychoaktiver Substanzen (GCS<12)", "Atemstörung (AF<10/min, SpO2<90%)", "Kreislaufinstabilität (Hf<50, RRsyst<100 mmHg)", "Eingeschränkte Zugänglichkeit zum Patienten", "Schwangerschaft"],
    name: "Piritramid — M21 (nur Hessen)",
    gruppe: "Analgesie (traumatisch bedingter starker Schmerz)",
    konzentration: "1,5 mg/ml — 1 Amp. (15 mg/2 ml) auf 10 ml verdünnt",
    mgPerMl: 1.5,
    modus: "kg",
    kgFaktor: 0.06,
    max: null,
    hinweis: "0,06 mg/kgKG, langsam über 30 Sek. Wdh. frühestens nach 2 Min. Antidot: Naloxon.",
    farbe: "#FB923C",
    dosisQuelle: "sop",
    handelsname: "Dipidolor",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-prednisolon_kind_rectal",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse"],
    name: "Prednison/-solon rectal (Kind) — M22",
    gruppe: "Extrapulmonale Atemwegsobstruktion / obstruktive AWE / Anaphylaxie (Kind)",
    konzentration: "100 mg Zäpfchen",
    mgPerMl: 100,
    modus: "fix",
    fixErwachsen: 100,
    max: 100,
    einheitML: true,
    hinweis: "1 Zäpfchen (100 mg) tief rectal einführen/lassen.",
    farbe: "#F472B6",
    dosisQuelle: "sop",
    handelsname: "Rectodelt",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-prednisolon_iv",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse"],
    name: "Solu Decortin H i.v. — M22",
    gruppe: "Obstruktive AWE / Anaphylaxie",
    konzentration: "250 mg Trockensubstanz + 5 ml H2O",
    mgPerMl: 50,
    modus: "fix",
    fixErwachsen: 250,
    max: 250,
    hinweis: "250 mg i.v.",
    farbe: "#F472B6",
    dosisQuelle: "sop",
    handelsname: "Solu Decortin H",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-salbutamol",
    kontraindikationen: ["Überdosierung mit β-Mimetika", "Tachykardie größer 150/min.", "Allergie gegenüber dem Wirkstoff/der Substanzklasse", "Kreißende Schwangere", "Vorsicht bei schweren Herzerkrankungen, unbehandelter Hypertonie, Hyperthyreose, Phäochromozytom"],
    name: "Salbutamol — M23",
    gruppe: "Akute obstruktive Atemwegserkrankung",
    konzentration: "1,25 mg / 2,5 ml",
    mgPerMl: 0.5,
    modus: "fix_oder_kg",
    fixErwachsen: 2.5,
    kindFix: 1.25,
    kgKind: 0,
    maxKind: 2.5,
    max: 2.5,
    hinweis: "Erw./Kind >12 J.: 2 Amp. (2,5 mg in 5 ml) mit 5-10 l O2/min vernebeln. Kind bis 12 J.: 1 Amp. (1,25 mg in 2,5 ml). Nach 15 Min. wiederholbar.",
    farbe: "#60A5FA",
    dosisQuelle: "sop",
    handelsname: "Salbutamol",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-thiamin",
    kontraindikationen: ["Überempfindlichkeit gegen den Wirkstoff"],
    name: "Thiamin (Vitamin B1) — M25",
    gruppe: "Unklare Bewusstseinsstörung (Status epilepticus, Delir, Koma) bei fraglicher Mangelernährung",
    konzentration: "100 mg / 2 ml",
    mgPerMl: 50,
    modus: "fix",
    fixErwachsen: 100,
    max: 100,
    hinweis: "100 mg vorsichtig und langsam i.v. — vor/mit Glucose-Gabe bei unklarer Bewusstseinsstörung.",
    farbe: "#A3A3A3",
    dosisQuelle: "sop",
    handelsname: "Vitamin B1-ratiopharm",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-urapidil",
    kontraindikationen: ["Aortenisthmusstenose", "Arteriovenöse Shunts", "Allergie gegenüber dem Wirkstoff/der Substanzklasse"],
    name: "Urapidil — M26",
    gruppe: "Hypertensiver Notfall (RR syst >220 mmHg, diast >120 mmHg, Puls 50-150/min — Hessen: höhere Schwelle als Bgs/Da/DaDi/GG!)",
    konzentration: "25 mg/5 ml bzw. 50 mg/10 ml",
    mgPerMl: 5,
    modus: "fix",
    fixErwachsen: 5,
    max: null,
    hinweis: "5 mg über 1 Min., Wiederholung nach 3 Min. möglich, wenn Bedingungen erfüllt.",
    farbe: "#A78BFA",
    dosisQuelle: "sop",
    handelsname: "Ebrantil",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-ass",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse (Asthma, COPD-Verschlimmerung)", "Akute gastrointestinale Ulcera", "Schwangerschaft"],
    name: "Acetylsalicylsäure — M1",
    gruppe: "Akutes Koronarsyndrom",
    konzentration: "100 mg / ml nach Auflösen (Trockensubstanz + 5 ml Wasser)",
    mgPerMl: 100,
    modus: "fix",
    fixErwachsen: 250,
    max: 250,
    hinweis: "250 mg i.v. / 300 mg p.o.",
    farbe: "#F87171",
    dosisQuelle: "sop",
    handelsname: "Aspirin",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-naloxon",
    kontraindikationen: ["Allergie gegenüber dem Wirkstoff/der Substanzklasse"],
    name: "Naloxon — M19",
    gruppe: "Opioid-Komplikationsmanagement",
    konzentration: "0,4 mg/1 ml unverdünnt (nasal) bzw. auf 10 ml verdünnt = 0,04 mg/ml (i.v.)",
    mgPerMl: 0.04,
    modus: "fix",
    fixErwachsen: 0.1,
    max: 2,
    hinweis: "Nasal: 1 Hub. i.v.: fraktioniert in 0,1-mg-Schritten (=2,5 ml verdünnt) bis suffiziente Spontanatmung/Schutzreflexe/Vigilanz. Wdh. frühestens nach 2 Min. Kürzere Halbwertszeit als Opioid — Nachbeobachtung erforderlich.",
    farbe: "#94A3B8",
    dosisQuelle: "sop",
    handelsname: "Naloxon",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
  {
    id: "h-adrenalin-vernebelt",
    kontraindikationen: ["Bei vitaler Indikation keine", "Allergie gegenüber dem Wirkstoff/der Substanzklasse"],
    name: "Adrenalin vernebelt (Krupp) — M2",
    gruppe: "Extrapulmonale Atemwegsobstruktion (Kind)",
    konzentration: "5 mg vernebeln (Zubereitung je nach Verneblersystem)",
    mgPerMl: 1,
    modus: "fix",
    fixErwachsen: 5,
    max: 5,
    einheitML: true,
    hinweis: "5 mg unverdünnt mit 5-10 l O2 vernebeln.",
    farbe: "#34D399",
    dosisQuelle: "sop",
    handelsname: "Suprarenin",
    ampulleGeprueft: true,
    geprueftVon: "Direkt aus Original-Hessen-M-Seite (Teil 2, V4.0) übernommen",
    geprueftAm: "18.08.2026",
  },
];

// ═══════════════════════════════════════════════════════════════
// TRAUMA-ORIENTIERUNGSKARTE — bewusst KEIN Bestandteil der
// regionalen DA/DI- oder Hessen-SOP (die haben dafür keinen eigenen
// Algorithmus, nur K16b "Traumatischer Schmerz" = reine Schmerztherapie).
// Quelle: S3-Leitlinie Polytrauma/Schwerverletzten-Behandlung (DGU,
// 4. Auflage, AWMF-Registernummer 187-023). Enthält NUR allgemeine,
// über Sekundärquellen belegbare Grundprinzipien — KEINE Dosierungen,
// KEINE exakten Zahlenschwellen, da der volle 483-Seiten-Originaltext
// nicht vorlag. Für die vollständige Leitlinie: awmf.org, Reg-Nr. 187-023.
// ═══════════════════════════════════════════════════════════════
const TRAUMA_REFERENZ = {
  titel: "Trauma — Orientierungshilfe (externe Quelle)",
  quelleName: "S3-Leitlinie Polytrauma/Schwerverletzten-Behandlung",
  quelleDetail: "Deutsche Gesellschaft für Unfallchirurgie (DGU), 4. Auflage, AWMF-Reg.-Nr. 187-023",
  farbe: "#8B5CF6",
  punkte: [
    "Kein Bestandteil eurer regionalen SOP (weder DA/DI noch Hessen) — eigenständige, überregionale Fachgesellschafts-Leitlinie.",
    "Strukturierte Erstuntersuchung nach dem cABCDE-Schema: c = catastrophic haemorrhage (lebensbedrohliche Blutung zuerst stillen), dann Airway, Breathing, Circulation, Disability, Exposure.",
    "Prähospitale Blutstillung hat in der aktuellen Auflage ein eigenes neues Kapitel bekommen — Tourniquet/Druckverband bei stark blutenden Extremitätenverletzungen so früh wie möglich.",
    "Volumentherapie: bei unkontrollierbarer Blutung eher zurückhaltend dosieren (Kreislauf auf niedrig-stabilem Niveau halten, um die Blutung nicht zu verstärken) — AUSNAHME Schädel-Hirn-Trauma mit Hypotension: hier Volumentherapie mit dem Ziel Normotonie, da Minderperfusion des Gehirns vermieden werden muss.",
    "Schmerzbehandlung ist ebenfalls ein neues eigenes Kapitel der aktuellen Auflage — Analgesie bei Traumapatienten nicht aufschieben.",
    "Für alle konkreten Zahlenwerte, Dosierungen und Detailalgorithmen: Original-Leitlinie unter awmf.org (Reg.-Nr. 187-023) konsultieren — diese Karte ersetzt das Original nicht.",
  ],
};

const ALGORITHMEN_HESSEN = [
  {
    id: "h-k1-acs",
    titel: "Akutes Koronarsyndrom (K1)",
    farbe: "#F87171",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "22.10.2024",
    bildUrl: "images/hessen/K1_akutes-koronarsyndrom.webp",
    medikamente: [
      { id: "h-glyceroltrinitrat", wann: "Bei RRsys >150 mmHg & Hf 50-130/min" },
      { id: "h-ass", wann: "Nach Nitrogabe" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k2-linksherzinsuffizienz",
    titel: "Linksherzinsuffizienz mit akuter Dyspnoe (K2)",
    farbe: "#FB923C",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K2_linksherzinsuffizienz-dyspnoe.webp",
    medikamente: [
      { id: "h-glyceroltrinitrat", wann: "Falls RRsys >150 mmHg & Hf 50-130/min" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k3-bradykardie",
    titel: "Bedrohliche Bradykardie mit Symptomen (K3)",
    farbe: "#60A5FA",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K3_bradykardie.webp",
    medikamente: [
      { id: "h-atropin", wann: "Kein AV-Block II Mobitz (außer Erstgabe)" },
      { id: "h-adrenalin_iv", wann: "Bei fortbestehender symptomatischer Bradykardie" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k4-hypertensiv",
    titel: "Hypertensiver Notfall (K4)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K4_hypertensiver-notfall.webp",
    medikamente: [
      { id: "h-urapidil", wann: "Vorsichtiger Beginn, Titrierung bis max. 25 mg" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k5-atemnot-erwachsene",
    titel: "Akute obstruktive Atemwegserkrankung — Erw./Kind >12 J. (K5)",
    farbe: "#60A5FA",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K5_obstruktive-atemwege-erwachsene.webp",
    medikamente: [
      { id: "h-salbutamol", wann: "Erstmaßnahme" },
      { id: "h-ipratropiumbromid", wann: "Bei ausbleibender Besserung" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k6-atemnot-kind",
    titel: "Akute obstruktive Atemwegserkrankung — Kind bis 12 J. (K6)",
    farbe: "#34D399",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K6_obstruktive-atemwege-kind.webp",
    medikamente: [
      { id: "h-salbutamol", wann: "Erstmaßnahme" },
      { id: "h-ipratropiumbromid", wann: "Bei ausbleibender Besserung" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k7-extrapulmonale-awo",
    titel: "Extrapulmonale Atemwegsobstruktion — Kind (K7)",
    farbe: "#34D399",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K7_extrapulmonale-atemwegsobstruktion.webp",
    medikamente: [
      { id: "h-adrenalin-vernebelt", wann: "Schweregrad III-IV" },
      { id: "h-prednisolon_kind_rectal", wann: "Falls noch nicht verabreicht" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k8-hypoglykaemie",
    titel: "Symptomatische Hypoglykämie (K8)",
    farbe: "#4ADE80",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K8_hypoglykaemie.webp",
    medikamente: [
      { id: "h-thiamin", wann: "Bei V.a. alkoholassoziierter Bewusstlosigkeit" },
      { id: "h-glucose", wann: "Wenn Patient nicht wach/schluckfähig" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k9-anaphylaxie",
    titel: "Anaphylaktische Reaktion (K9)",
    farbe: "#FF6A3D",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K9_anaphylaxie.webp",
    medikamente: [
      { id: "h-adrenalin_im", wann: "Bei schwerer Symptomatik: sofort i.m." },
      { id: "h-prednisolon_iv", wann: "Solu Decortin H — Erwachsene i.v." },
      { id: "h-prednisolon_kind_rectal", wann: "Kind — Zäpfchen rectal" },
      { id: "h-dimetinden", wann: "H1-Blocker" },
      { id: "h-clemastin", wann: "H1-Blocker, alternativ zu Dimetinden" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k10-krampfanfall",
    titel: "Status epilepticus (K10)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K10_status-epilepticus.webp",
    medikamente: [
      { id: "h-midazolam_status_iv", wann: "Bei liegendem/möglichem venösem Zugang" },
      { id: "h-midazolam_status_nasal", wann: "Kein venöser Zugang vorhanden/möglich" },
      { id: "h-levetiracetam", wann: "Bei Benzodiazepin-refraktärem Verlauf, i.v.-Zugang nötig" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k11-schlaganfall",
    titel: "Schlaganfall (K11)",
    farbe: "#A78BFA",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K11_schlaganfall.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k12-cpr-erwachsene",
    titel: "Kreislaufstillstand Erwachsene — CPR (K12)",
    farbe: "#FF6A3D",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K12_cpr-erwachsene.webp",
    medikamente: [
      { id: "h-adrenalin_iv", wann: "Nach 3. Schock bzw. baldmöglichst, alle 3-5 Min." },
      { id: "h-amiodaron", wann: "Nach 3. Schock (VF/pVT), Repetition nach 5. Schock" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k13-cpr-kind",
    titel: "Kreislaufstillstand Kind — CPR (K13)",
    farbe: "#34D399",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K13_cpr-kind.webp",
    medikamente: [
      { id: "h-adrenalin_iv", wann: "Nach 3. Schock bzw. baldmöglichst, alle 3-5 Min." },
      { id: "h-amiodaron", wann: "Nach 3. Schock (VF/pVT), Repetition nach 5. Schock" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k14-neugeborenes",
    titel: "Erstversorgung Neugeborenes (K14)",
    farbe: "#60A5FA",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K14_neugeborenes.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k15-post-reanimationsphase",
    titel: "Post-Reanimationsphase (K15)",
    farbe: "#22C55E",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K15_post-reanimationsphase.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k16-schmerz-uebersicht",
    titel: "Starke Schmerzzustände — Übersicht (K16)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K16_starke-schmerzzustaende.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k16a-schmerz-abdominell",
    titel: "Abdomineller Schmerz (K16a)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K16a_schmerz-abdominell.webp",
    medikamente: [
      { id: "h-butylscopolamin", wann: "Bei V.a. Gallenkolik" },
      { id: "h-nalbuphin", wann: "Analgesie" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k16b-schmerz-traumatisch",
    titel: "Traumatischer Schmerz (K16b)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K16b_schmerz-traumatisch.webp",
    medikamente: [
      { id: "h-esketamin", wann: "Ausschließlich bei traumatisch bedingten starken Schmerzen" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k16c-schmerz-thorakal",
    titel: "Thorakaler Schmerz (K16c)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K16c_schmerz-thorakal.webp",
    medikamente: [
      { id: "h-nalbuphin", wann: "Opioid-Analgesie bei thorakalem Schmerz" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k17-starke-uebelkeit",
    titel: "Starke Übelkeit (K17)",
    farbe: "#4ADE80",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K17_starke-uebelkeit.webp",
    medikamente: [
      { id: "h-dimenhydrinat", wann: "Nach venösem Zugang + VEL-Infusion" },
    ],
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k18-sepsis",
    titel: "Sepsis — septischer Schock (K18)",
    farbe: "#F87171",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K18_sepsis.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-k19-co-vergiftung",
    titel: "Kohlenmonoxid-Vergiftung (K19)",
    farbe: "#94A3B8",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/K19_co-vergiftung.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-p1-io-zugang",
    titel: "Intraossärer Zugang — i.o., Reanimation (P1)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/P1_io-zugang.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-p2-cpap",
    titel: "CPAP-Anwendung (P2)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/P2_cpap.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-p3-extraglottischer-atemweg",
    titel: "Extraglottischer Atemweg (P3)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/P3_extraglottischer-atemweg.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-p4-thoraxentlastungspunktion",
    titel: "Thoraxentlastungspunktion — Reanimation (P4)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/P4_thoraxentlastungspunktion.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-p5-sauerstoffgabe",
    titel: "Sauerstoffgabe (P5)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/P5_sauerstoffgabe.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-v1a-bleibt-vor-ort-fall",
    titel: "Patient bleibt vor Ort — welcher Fall? (V1a)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/V1a_bleibt-vor-ort-welcher-fall.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-v1b-bleibt-vor-ort-bedingungen",
    titel: "Patient bleibt vor Ort — welche Bedingungen? (V1b)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/V1b_bleibt-vor-ort-welche-bedingungen.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-v2-isobar",
    titel: "Standard der Patientenübergabe: ISOBAR (V2)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/V2_isobar.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-v3a-vorsichtung-prior",
    titel: "Vorsichtung PRIOR (V3a)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/V3a_vorsichtung-prior.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "h-v3b-vorsichtung-mstart",
    titel: "Vorsichtung mSTART (V3b)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Land Hessen"],
    version: "V4.0",
    stand: "19.02.2025",
    bildUrl: "images/hessen/V3b_vorsichtung-mstart.webp",
    schritte: ["Original-Hessenalgorithmus (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
];

const ALGORITHMEN = [
  {
    id: "anaphylaxie",
    titel: "Anaphylaktische Reaktion (K9)",
    farbe: "#F87171",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K9_anaphylaxie.webp",
    medikamente: [
      { id: "adrenalin_im", wann: "GRAD II–IV: sofort i.m., 1x Wdh. nach 5 Min. möglich" },
      { id: "prednisolon_anaphylaxie", wann: "GRAD II–IV: 250 mg i.v. — GRAD I nur bei Rebound" },
      { id: "dimetinden", wann: "GRAD II–IV, alternativ zu Clemastin — H1-Blocker" },
      { id: "clemastin", wann: "GRAD II–IV, alternativ zu Dimetinden — H1-Blocker" },
    ],
    schritte: [
      "Basisalgorithmus → Allergenzufuhr stoppen",
      "Einteilung nach Schweregrad:",
      "· Grad I (leicht): Pruritus, Flush, Urtikaria, Angioödem und/oder isolierte abdominelle Symptome (Übelkeit, viszerale Schmerzen, Erbrechen)",
      "· Grad II–III (schwer): Schock, Bewusstlosigkeit, Obstruktion obere/untere Atemwege = ABCD-Problem",
      "· Grad IV: Kreislaufstillstand = Reanimation",
      "GRAD I: venöser Zugang, langsame VEL-Infusion → H1-Blocker i.v. nur bei Hautsymptomen, Prednisolon 250 mg i.v. nur bei Rebound",
      "GRAD I weiter: bei Übelkeit/abdominellem Schmerz eigener Algorithmus möglich, sonst ärztliche Weiterbehandlung sicherstellen",
      "GRAD II–III: NA alarmieren → Adrenalin i.m. (<30 kg: 0,01 mg/kgKG · 30–60 kg: 0,1 mg/10 kgKG · >60 kg: 0,6 mg), 1x Wdh. nach 5 Min. möglich",
      "GRAD II–III bei Schock: venöser Zugang möglichst zügig → 1000 ml VEL-Infusion, Reevaluation",
      "GRAD II–III bei Schock (Fortsetzung): Adrenalin i.v. + Prednisolon 250 mg i.v. + Dimetinden 0,1 mg/kgKG i.v. ODER Clemastin (Erw. 2 mg / Kinder >1 Jahr 0,03 mg/kgKG i.v.) → Transport",
      "GRAD II–III ohne Schock, aber mit Atemwegsobstruktion: eigener Algorithmus obere/untere Atemwege → venöser Zugang wenn noch nicht gelegt → Transport",
      "GRAD IV: NA alarmieren → Reanimationsalgorithmus",
      "Durchgehend: Arztkontakt sicherstellen",
    ],
  },
  {
    id: "cpr-erwachsene",
    titel: "Kreislaufstillstand Erwachsene — CPR (K12)",
    farbe: "#FF6A3D",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K12_cpr-erwachsene.webp",
    medikamente: [
      { id: "adrenalin_iv", wann: "Nach 3. Schock (VF/pVT) bzw. baldmöglichst (PEA/Asystolie), alle 3-5 Min." },
      { id: "amiodaron", wann: "Nach 3. Schock (nur VF/pVT), Repetition nach 5. Schock" },
    ],
    medikamente: [
      { id: "adrenalin_iv", wann: "Nach dem 3. Schock, danach alle 3–5 Min. wiederholen (bei Asystolie/PEA: baldmöglichst, dann alle 3–5 Min.)" },
      { id: "amiodaron", wann: "Nach dem 3. Schock, Wiederholung (1x) 150 mg nach dem 5. Schock" },
    ],
    diagramm: {
      intro: ["Basisalgorithmus", "Atemwege freimachen · CPR 30:2 · Defibrillator/EKG/AED anschließen (parallel: NA alarmieren)", "Rhythmusanalyse"],
      aeste: [
        {
          titel: "VF / pVT — Schock indiziert",
          farbe: "#EF4444",
          schritte: [
            "1x Schock — Energie gemäß Herstellerangabe des Defibrillators (abhängig von Modell/Impulsform)",
            "Sofort CPR 30:2 für 2 Min. (bei gesichertem Atemweg: HDM durchgehend)",
            "Nach 3. Schock: Adrenalin 1 mg i.v./i.o., dann alle 3–5 Min.",
            "Nach 3. Schock: Amiodaron 300 mg i.v./i.o., Wdh. 150 mg nach 5. Schock",
          ],
        },
        {
          titel: "ROSC",
          farbe: "#22C55E",
          schritte: [
            "Postreanimationsphase nach ABCDE",
            "Kontrollierte Beatmung, Oxygenierung & Kapnographie, 12-Kanal-EKG",
            "Cuffdruck LT kontrollieren, auslösende Faktoren behandeln",
            "Behandlung reversibler Ursachen → Sedierung → Narkose → Katecholamine",
            "Temperaturkontrolle → Transport in geeignete Klinik",
          ],
        },
        {
          titel: "Asystolie / PEA — Schock nicht indiziert",
          farbe: "#94A3B8",
          schritte: [
            "Sofort CPR 30:2 für 2 Min. (bei gesichertem Atemweg: HDM durchgehend)",
            "Schnellstmöglich Adrenalin 1 mg i.v./i.o., dann alle 3–5 Min.",
          ],
        },
      ],
      outro: ["Während der CPR: Unterbrechungen minimieren, reversible Ursachen (4H/HITS) suchen, i.v./i.o.-Zugang, 100% O2"],
    },
    schritte: [
      "Basisalgorithmus → Atemwege freimachen, CPR 30:2, Defibrillator/EKG-Monitor/AED anschließen — parallel: NA alarmieren",
      "Rhythmusanalyse → 3 Äste: VF/pVT (Schock indiziert) · ROSC · Asystolie/PEA (Schock nicht indiziert)",
      "VF/pVT: 1x Schock, Energie gemäß Herstellerangabe des Defibrillators (abhängig von Modell/Impulsform)",
      "VF/pVT: sofort CPR 30:2 für 2 Min. (bei gesichertem Atemweg: HDM durchgehend)",
      "VF/pVT: nach dem 3. Schock Adrenalin 1 mg i.v./i.o., danach alle 3–5 Min. wiederholen",
      "VF/pVT: nach dem 3. Schock Amiodaron 300 mg i.v./i.o., Wdh. (1x) 150 mg nach dem 5. Schock",
      "Asystolie/PEA: sofort CPR 30:2 für 2 Min. (bei gesichertem Atemweg: HDM durchgehend)",
      "Asystolie/PEA: baldmöglichst Adrenalin 1 mg i.v./i.o., alle 3–5 Min. wiederholen",
      "ROSC: Postreanimationsphase nach ABCDE — kontrollierte Beatmung, Oxygenierung & Kapnographie, 12-Kanal-EKG, Cuffdruck LT kontrollieren, auslösende Faktoren behandeln",
      "ROSC weiter: Behandlung reversibler Ursachen → Sedierung → Narkose → Katecholamine → Temperaturkontrolle → Transport in geeignete Klinik",
      "Während der CPR: Unterbrechungen planen, reversible Ursachen prüfen, optimale CPR-Qualität (Frequenz/Tiefe/Entlastung), Atemwegsmanagement mit Magensonde, Pulsoxymetrie & Kapnographie, i.v./i.o.-Zugang, Beatmung mit 100% O2",
      "Reversible Ursachen (4Hs & HITS): Hypoxie, Hypovolämie, Hypoglykämie (zusätzlich zu den ERC-Guidelines), Hypo-/Hyperthermie, Hypo-/Hyperkaliämie, Herzbeuteltamponade, Intoxikation, Thrombembolie, Spannungspneumothorax",
      "Beachte: besondere Bedingungen bei einem Herz-Kreislauf-Stillstand durch ein Trauma",
    ],
  },
  {
    id: "cpr-kind",
    titel: "Kreislaufstillstand Kind — CPR (K13)",
    farbe: "#34D399",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K13_cpr-kind.webp",
    medikamente: [
      { id: "adrenalin_iv", wann: "Nach 3. Schock (VF/pVT) bzw. baldmöglichst (PEA/Asystolie), alle 3-5 Min." },
      { id: "amiodaron", wann: "Nach 3. Schock (nur VF/pVT), Repetition nach 5. Schock, max. 150 mg" },
    ],
    medikamente: [
      { id: "adrenalin_iv", wann: "Nach dem 3. Schock, danach alle 3–5 Min. wiederholen (bei Asystolie/PEA: baldestmöglich, dann alle 3–5 Min.)" },
      { id: "amiodaron", wann: "Nach dem 3. Schock, Wiederholung (1x) nach dem 5. Schock" },
    ],
    diagramm: {
      intro: ["Basisalgorithmus", "Atemwege freimachen · CPR (5 initiale Beatmungen, dann 15:2) · Defibrillator/EKG anschließen (parallel: NA alarmieren)", "Rhythmusanalyse"],
      aeste: [
        {
          titel: "VF / pVT — Schock indiziert",
          farbe: "#EF4444",
          schritte: [
            "1x Schock 4 J/kgKG, ab 6. Schock 8 J/kgKG per AED",
            "Sofort CPR 15:2 für 2 Min. (bei gesichertem Atemweg: HDM durchgehend)",
            "Nach 3. Schock: Adrenalin 0,01 mg/kgKG i.v./i.o., dann alle 3–5 Min.",
            "Nach 3. Schock: Amiodaron 5 mg/kgKG i.v./i.o., Wdh. nach 5. Schock",
          ],
        },
        {
          titel: "ROSC",
          farbe: "#22C55E",
          schritte: [
            "Postreanimationsphase nach ABCDE",
            "Kontrollierte Beatmung, Oxygenierung & Kapnographie, 12-Kanal-EKG",
            "Cuffdruck SGA kontrollieren, auslösende Faktoren behandeln",
            "Behandlung reversibler Ursachen → Sedierung → Narkose → Katecholamine",
            "Temperaturkontrolle → Transport in geeignete Klinik",
          ],
        },
        {
          titel: "Asystolie / PEA — Schock nicht indiziert",
          farbe: "#94A3B8",
          schritte: [
            "Sofort CPR 15:2 für 2 Min. (bei gesichertem Atemweg: HDM durchgehend)",
            "Baldestmöglich Adrenalin 0,01 mg/kgKG i.v./i.o., dann alle 3–5 Min.",
          ],
        },
      ],
      outro: ["Gewicht (Abschätzung): Neugeb. 4 kg · 1 J. 10 kg · 3 J. 15 kg · 6 J. 20 kg · 10 J. 30 kg"],
    },
    schritte: [
      "Basisalgorithmus → Atemwege freimachen, CPR (5 initiale Beatmungen, dann 15:2), Defibrillator/EKG-Monitor anschließen — parallel: NA alarmieren",
      "Gewicht Kinder (Abschätzung): Neugeborenes 4 kg (NLS-Algorithmus) · 1 Jahr 10 kg · 3 Jahre 15 kg · 6 Jahre 20 kg · 10 Jahre 30 kg",
      "Rhythmusanalyse → 3 Äste: VF/pVT (Schock indiziert) · ROSC · Asystolie/PEA (Schock nicht indiziert)",
      "VF/pVT: 1x Schock 4 J/kgKG, ab dem 6. Schock 8 J/kgKG per AED",
      "VF/pVT: sofort CPR 15:2 für 2 Min. (bei gesichertem Atemweg: HDM durchgehend)",
      "VF/pVT: nach dem 3. Schock Adrenalin 0,01 mg/kgKG i.v./i.o., danach alle 3–5 Min. wiederholen",
      "VF/pVT: nach dem 3. Schock Amiodaron 5 mg/kgKG i.v./i.o., Wdh. (1x) nach dem 5. Schock",
      "Asystolie/PEA: sofort CPR 15:2 für 2 Min. (bei gesichertem Atemweg: HDM durchgehend)",
      "Asystolie/PEA: baldestmöglich Adrenalin 0,01 mg/kgKG i.v./i.o., alle 3–5 Min. wiederholen",
      "ROSC: Postreanimationsphase nach ABCDE — kontrollierte Beatmung, Oxygenierung & Kapnographie, 12-Kanal-EKG, Cuffdruck SGA kontrollieren, auslösende Faktoren behandeln",
      "ROSC weiter: Behandlung reversibler Ursachen → Sedierung → Narkose → Katecholamine → Temperaturkontrolle → Transport in geeignete Klinik",
      "Während der CPR: gleiche Prinzipien wie bei Erwachsenen (Unterbrechungen planen, reversible Ursachen, Atemwegsmanagement mit Magensonde, i.v./i.o.-Zugang, 100% O2)",
      "Reversible Ursachen (4Hs & HITS): Hypoxie, Hypovolämie, Hypoglykämie (zusätzlich zu den ERC-Guidelines), Hypo-/Hyperthermie, Hypo-/Hyperkaliämie, Herzbeuteltamponade, Intoxikation, Thrombembolie, Spannungspneumothorax",
      "Beachte: besondere Bedingungen bei einem Herz-Kreislauf-Stillstand durch ein Trauma",
    ],
  },
  {
    id: "cpr-neugeborenes",
    titel: "Erstversorgung Neugeborenes (K14)",
    farbe: "#60A5FA",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K14_neugeborenes.webp",
    schritte: [
      "Vor der Geburt: Teambriefing und Equipmentcheck",
      "Basisalgorithmus → Geburt",
      "Wenn möglich verzögert abnabeln (Alternative: Ausstreichen der Nabelschnur). Trocknen, Stimulieren, Wärmen. Uhr starten/Zeit notieren",
      "Beurteilen: Muskeltonus, Atmung, Herzfrequenz?",
      "Bei Schnappatmung/keine Atmung: Atemwege öffnen, 5 Initialbeatmungen (initialer Spitzendruck 25 cm H2O, verlängerte Inspiration/-sdruck halten), Pulsoxymetrie ± EKG erwägen",
      "Wiederbeurteilung: kein Anstieg der Herzfrequenz? → Hebt sich der Brustkorb unter Beatmung?",
      "Brustkorb hebt sich NICHT: Kopf repositionieren, 2-Hände-Esmarch-Handgriff, Atemhilfen erwägen, initiale Beatmung wiederholen, erneut wiederbeurteilen",
      "Brustkorb hebt sich: bei keiner feststellbaren Herzfrequenz oder <60/min → Beginn Herzdruckmassage, Verhältnis Herzdruckmassage:Beatmung 3:1, Sauerstoff 100%",
      "Alle 30 Sekunden Herzfrequenz beurteilen — bei weiterhin keiner/<60/min: CPR fortführen, i.v./i.o.-Zugang und Medikamente erwägen",
      "In jeder Phase: \"Brauche ich Hilfe?\" — NA alarmieren, Temperaturkontrolle durchgehend",
      "Akzeptable präduktale SpO2: 2 Min. 65% · 3 Min. 70% · 4 Min. 80% · 5 Min. 85% · 10 Min. 90%",
      "Andere/reversible Ursachen bedenken: (Spannungs-)Pneumothorax, Hypovolämie, angeborene Fehlbildungen",
      "Abschluss: Information an Eltern / Teamdebriefing",
    ],
  },
  {
    id: "krampfanfall",
    titel: "Status epilepticus (K10)",
    farbe: "#2DD4BF",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K10_status-epilepticus.webp",
    medikamente: [{ id: "midazolam_iv", wann: "Bei liegendem/möglichem venösem Zugang, Erstgabe fraktioniert" }, { id: "midazolam_nasal", wann: "Kein venöser Zugang vorhanden/möglich" }],
    schritte: [
      "Definition Status epilepticus (DGN): Krampfanfall länger als 5 Min. oder mind. 2 Anfälle hintereinander ohne Bewusstsein dazwischen",
      "Basismaßnahmen: Schutz vor weiteren Verletzungen, Aspirationsschutz, ggf. stabile Seitenlage",
      "Venöser Zugang vorhanden/möglich? Ja → Midazolam i.v. (5 mg/5 ml), 0,2 mg/kgKG fraktioniert in 1–2-mg-Schritten (max. 5 mg Bolusgabe; <50 kgKG: 1 mg/10 kg). Falls binnen 2 Min. keine Wirkung: 1x wiederholen",
      "Nein → Midazolam nasal (15 mg/3 ml — höchste Konzentration verwenden), 0,2 mg/kgKG (max. 5 mg, auch <40 kgKG max. 5 mg). Falls binnen 4 Min. keine Wirkung: 1x wiederholen",
      "Anfall beendet? Ja → Fortsetzen der Standardtherapie, Transport",
      "Nein → NA alarmieren. Venösen Zugang falls noch nicht erfolgt erwägen",
      "Bei Persistenz: Levetiracetam 60 mg/kgKG (max. 4500 mg) über 10 Min. einleiten",
      "Bei weiterer Dosissteigerung Benzodiazepine nötig: erneut Levetiracetam 60 mg/kgKG (max. 4500 mg) in 10 Min., ggf. Narkoseeinleitung (Thiopental oder Propofol) inkl. Relaxierung zur Atemwegssicherung",
      "Differentialdiagnose bedenken, Fremdanamnese einholen",
      "Cave: gute Überwachung nötig — A- und B-Problem durch Midazolam auslösbar! Antidot Flumazenil nur sehr kritisch in Erwägung ziehen",
    ],
  },
  {
    id: "acs",
    titel: "Akutes Koronarsyndrom (K1)",
    farbe: "#60A5FA",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K1_akutes-koronarsyndrom.webp",
    medikamente: [{ id: "glyceroltrinitrat", wann: "Bei RRsys >150 mmHg und Hf 50-130/min, vor ASS" }, { id: "ass", wann: "Nach Nitrogabe, vor Heparin" }],
    diagramm: {
      intro: ["Basisalgorithmus", "12-Kanal-EKG (ggf. um V7-9/V3r-V6r ergänzen), spätestens 10 min nach Eintreffen"],
      aeste: [
        {
          titel: "STEMI / OMI / STEMI-Äquivalent → Ja",
          farbe: "#EF4444",
          schritte: ["NA alarmieren", "Venöser Zugang, langsame VEL-Infusion", "Weiter mit Standardtherapie-Ast"],
        },
        {
          titel: "EKG/Beschwerdebild spricht für koronare Ursache",
          farbe: "#60A5FA",
          schritte: [
            "NA-Alarmierung prüfen (Instabilitätskriterien beachten)",
            "RRsys >150 mmHg & Hf 50-130/min? → Nitrogabe 1 Hub s.l. (0,4mg), Wdh. frühestens nach 3 Min. (max. 3 Hübe)",
            "ASS p.o. (300mg) oder i.v. (250mg)",
            "ggf. Analgesie (K16c)",
            "Heparin 5000 I.E.",
          ],
        },
        {
          titel: "Kein Hinweis auf koronare Ursache",
          farbe: "#94A3B8",
          schritte: ["Standardtherapie nach Beschwerdebild"],
        },
      ],
      outro: [
        "STEMI/OMI/STEMI-Äquivalent? Ja → geeignete Zielklinik mit PCI-Möglichkeit festlegen, PCI anmelden",
        "STEMI/OMI/STEMI-Äquivalent? Nein → geeignete Zielklinik festlegen",
        "Transport",
      ],
    },
    schritte: [
      "Basisalgorithmus → 12-Kanal-EKG (ggf. um V7-9/V3r-V6r ergänzen), spätestens 10 min nach Eintreffen",
      "STEMI/OMI/STEMI-Äquivalent? Ja → NA alarmieren, venöser Zugang mit langsamer VEL-Infusion",
      "Nein → EKG/Beschwerdebild spricht für koronare Ursache? Nein → Standardtherapie",
      "Ja → NA-Alarmierung prüfen (Instabilitätskriterien: Hf>130 o. <50, RR<100 o. >180, Kollaps/Synkope, akute Herzinsuffizienz, maligne Rhythmusstörung, Schmerzen ≥7)",
      "RRsys >150 mmHg und Hf 50-130/min? Ja → Nitrogabe 1 Hub s.l. (0,4 mg), Wdh. frühestens nach 3 Min., max. 3 Hübe",
      "ASS p.o. (300 mg) oder i.v. (250 mg)",
      "ggf. Analgesie (K16c Thorakaler Schmerz)",
      "Heparin 5000 I.E.",
      "STEMI/OMI/STEMI-Äquivalent? Ja → geeignete Zielklinik mit PCI-Möglichkeit festlegen, PCI anmelden. Nein → geeignete Zielklinik festlegen",
      "Transport",
      "Typische Symptome: Schwere/Druck/Enge im Brustkorb, oft Ausstrahlung Arm/Bauch/Kopf/Rücken, atem-/bewegungsunabhängig, vegetative Symptome (Kaltschweiß). Untypisch: oft bei Diabetikern, bei Frauen",
    ],
  },
  {
    id: "bradykardie",
    titel: "Bedrohliche Bradykardie mit Symptomen (K3)",
    farbe: "#FBBF24",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    medikamente: [
      { id: "atropin", wann: "Kein AV-Block II Mobitz/III → 0,5 mg i.v., Wdh. alle 3-5 Min. bis max. 3 mg" },
      { id: "adrenalin_iv", wann: "Bei fortbestehender symptomatischer Bradykardie — Pushdose/Spritzenpumpe" },
    ],
    bildUrl: "images/da-di/K3_bradykardie.webp",
    schritte: [
      "Basisalgorithmus → NA alarmieren",
      "AV-Block II Typ Mobitz oder AV-Block III? Ja → KEINE Atropingabe (Gefahr des totalen AV-Blocks) — direkt zu Pushdose/Spritzenpumpe",
      "Nein → Atropin 0,5 mg i.v.",
      "Besserungstendenz nach 2 Min.? Ja → weiter beobachten, ggf. Atropin-Wiederholung alle 3-5 Min. bis max. 3 mg bei fortbestehender symptomatischer Bradykardie",
      "Nein/bei AV-Block II Mobitz/III → Pushdose: Adrenalin 1:100 verdünnt, langsam 1 ml (10µg) i.v., wiederholbar nach 3 Min. (überbrückend bis Spritzenpumpe verfügbar)",
      "Nach 3 Min. → Spritzenpumpe: Adrenalin 1:100 verdünnt, Laufgeschwindigkeit anpassen (Ziel Hf 50/min), zwischen 12-72 ml/h = 2-12 µg/min",
      "Bei fortbestehender symptomatischer Bradykardie: ggf. Wechsel von Atropin auf Adrenalin, Vorbereitung transthorakales Pacing, Reanimationsbereitschaft",
      "Ärztliche Entscheidung über weitere antibradykarde bzw. kausale Therapie → Transport",
      "Cave: Bradykardien können Folge respiratorischer oder sonstiger Ursachen sein — diese vor symptomatischer Behandlung ausschließen und ggf. beheben!",
      "Symptome z.B.: Schläfrigkeit, Schwindel, Übelkeit, Atemnot, Synkopen, Verschlechterung vorbestehender Herzinsuffizienz",
    ],
  },
  {
    id: "hypertensiv",
    titel: "Hypertensiver Notfall (K4)",
    farbe: "#A78BFA",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K4_hypertensiver-notfall.webp",
    medikamente: [{ id: "urapidil", wann: "Wenn keine Begleitsymptome mit eigenem Algorithmus vorliegen" }],
    schritte: [
      "Basisalgorithmus → Begleitsymptome, die in eigenem Algorithmus behandelt werden? (ACS/K1, Linksherzinsuffizienz/K2, Schlaganfall ≥220/120 mmHg/K11)",
      "Ja → zum jeweiligen Algorithmus wechseln",
      "Nein → Urapidil 5 mg i.v. über 1 Min., Wiederholung nach 3 Min. bis max. 25 mg",
      "RRsys um 10-15% gesenkt oder RRsys/RRdia unterhalb der oberen Grenzwerte? Ja → Transport",
      "Nein → NA alarmieren o. TNA konsultieren → ärztliche Entscheidung über weitere Therapie → Transport",
      "Definition: kritische RR-Erhöhung — RRsys ≥180 mmHg und/oder RRdiast ≥110 mmHg (Schwangere: RRsys >160/RRdiast >110; Schlaganfall: ≥220 syst. und/oder ≥120 diast.) + Organsymptomatik (z.B. Angina pectoris, Dyspnoe, Kopfschmerzen, Sehstörungen, Schwindel, Übelkeit)",
      "Ziel ist NICHT die optimale Blutdruckeinstellung, sondern die Absenkung von Extremwerten um ca. 10-15%!",
      "Abgrenzung Hypertensive Entgleisung: RR >180/110 ohne akute Symptome — kein eigentlicher Notfall, außerklinische Akuttherapie i.d.R. nicht erforderlich, Transport zur ärztlichen Vorstellung",
    ],
  },
  {
    id: "hypoglykaemie-erw",
    titel: "Symptomatische Hypoglykämie (K8)",
    farbe: "#FBBF24",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "01.02.2026",
    bildUrl: "images/da-di/K8_hypoglykaemie.webp",
    medikamente: [
      { id: "thiamin", wann: "Bei V.a. alkoholassoziierter Bewusstlosigkeit, vor/mit Glucose" },
      { id: "glucose", wann: "Wenn Patient nicht wach/schluckfähig" },
    ],
    schritte: [
      "Basisalgorithmus → ggf. weitere Insulinzufuhr stoppen (Insulinpumpe?)",
      "Patient wach und schluckfähig? Ja → Glukose/schnellwirksame Kohlenhydrate oral bis BZ im Normbereich",
      "Nein → venöser Zugang, langsame VEL-Infusion",
      "ggf. Thiamin 100 mg i.v. (bei V.a. alkoholassoziierter Bewusstlosigkeit, Alkoholerkrankung, Kachexie)",
      "Glukose i.v.: Erwachsene 8g, Kinder ≤12 J. 0,2 g/kgKG, Wiederholung alle 3 Min. bis BZ im Normbereich",
      "Besserung? Ja → Arztkontakt sicherstellen. Nein → NA alarmieren",
      "Definition symptomatische Hypoglykämie: Erwachsene BZ <60 mg/dl (3,0 mmol/l), Kinder <45 mg/dl, Neugeborene <50 mg/dl (nur orientierend — entscheidend ist die individuelle Symptomatik)",
      "Hinweis: Patienten z.T. mit Eigenmedikation ausgestattet (z.B. Glucagon)",
    ],
  },
  {
    id: "schlaganfall",
    titel: "Schlaganfall (K11)",
    farbe: "#EF4444",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K11_schlaganfall.webp",
    schritte: [
      "Basisalgorithmus → Sauerstoffgabe",
      "Venöser Zugang auf der nicht betroffenen Seite, langsame VEL-Infusion 500 ml",
      "Begleitsymptome mit eigenem Algorithmus? Ja → Hypoglykämie (K8) oder Hypertensiver Notfall ≥220/120 mmHg (K4)",
      "Nein → Beginn ≤24h? Nein → Transport Stroke Unit (SU)",
      "Ja → FAST4D ≥4? Nein → Transport Stroke Unit (SU)",
      "Ja → Zeitverlust bis Thrombektomiezentrum (TZ) <10 Min.? Ja → Transport TZ. Nein → Transport Stroke Unit (SU)",
      "FAST4D: Face+Diplopic images (Doppelbilder) · Arm+Deficit in field of view (Gesichtsfelddefekt) · Speech+Dizziness/vertigo (Dreh-/Schwankschwindel) · Time+Dysmetria/ataxia (Dysmetrie/Ataxie)",
      "Notarztnachforderung bei bewusstlosem Patienten mit mind. 1 Kriterium: pathologische Atmung, Aspirationshinweis, SpO2 <94% trotz O2, RR <90 mmHg, stärkste Kopfschmerzen, vitale Bedrohung, progredienter/fluktuierender Verlauf",
    ],
  },
  {
    id: "sepsis",
    titel: "Sepsis — septischer Schock (K18)",
    farbe: "#EF4444",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K18_sepsis.webp",
    schritte: [
      "Basisalgorithmus → Patient instabil? Ja → NA alarmieren",
      "Nein → Peripher-venöser Zugang und VEL-Infusion",
      "NEWS2-Score erheben: Score ≤4 → Patient stabil? Ja → Transport. Nein → weiter wie Score ≥5",
      "Score ≥5 → ggf. präklinische Laborparameter (z.B. Laktat, PCT)",
      "Notarztnachforderung kritisch prüfen: RR nach Flüssigkeitsgabe ≤90 mmHg syst.",
      "VEL-Infusion 500-1000 ml, ggf. 2. peripher-venöser Zugang, O2-Gabe großzügig",
      "Patient stabil? Ja → Transport. Nein → NA alarmieren",
      "Notarzt: Katecholamingabe, Mittel der Wahl Noradrenalin (5 Amp = 5mg + 45ml NaCl 0,9% in 50ml-Spritzenpumpe, Dosierung 0,014-0,28 µg/kg/min, Ziel MAD ≥65 mmHg)",
      "Mögliche Symptome: Hypothermie, Fieber, Tachypnoe, Hf >100/min, Hypotonie RRsys <100 mmHg, Vigilanzminderung",
      "CAVE: Vorerkrankungen bei Score-Erhebung berücksichtigen (COPD, Laktatazidose, Diabetes, Nieren-/Leber-/Herzerkrankung, Tumorleiden)",
    ],
  },
  {
    id: "atemnot-kind",
    titel: "Obstruktive Atemwegserkrankung — Kind bis 12 J. (K6)",
    farbe: "#34D399",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K6_obstruktive-atemwege-kind.webp",
    medikamente: [
      { id: "salbutamol", wann: "Erstmaßnahme" },
      { id: "ipratropiumbromid", wann: "Bei ausbleibender Besserung nach Salbutamol" },
      { id: "prednisolon_krupp_rektal", wann: "Bei ausbleibender Besserung" },
    ],
    schritte: [
      "Basisalgorithmus → Anaphylaxie? Ja → Anaphylaxie-Algorithmus (K9)",
      "Nein → Salbutamol Fertiginhalat 1 Amp. à 1,25 mg in 2,5 ml (Zubereitung je nach Verneblersystem), bei >20 kg nach 15 min. wiederholbar",
      "Besserung? Ja → weiter zu \"Nachlassen der Symptome?\"",
      "Nein → Ipratropiumbromid Fertiginhalat 1 Amp. à 0,25 mg in 2 ml, nach jeweils 20 min. 2x wiederholbar",
      "→ Prednisolon Supp. 100 mg rektal",
      "Nachlassen der Symptome? Nein → NA alarmieren → venöser Zugang (wenn unproblematisch möglich, langsame VEL-Infusion)",
      "Notarzt (schwerer Asthmaanfall/Status asthmaticus): venöser Zugang (sehr kritisch abwägen), langsame VEL-Infusion, Prednisolon i.v. (Eltern bereits 100 mg rektal gegeben?), ggf. Magnesiumsulfat i.v., ggf. Reproterol i.v., ggf. endotracheale Intubation/Beatmung",
      "Ja → Transport",
      "Kontraindikationen Salbutamol: Überdosierung mit ß-Mimetika, Tachykardie >150/min, Tachyarrhythmie, Kinder <4 Jahre",
      "Kontraindikation Ipratropiumbromid: Kinder <6 Jahre",
      "Warnzeichen: \"silent chest\" (kein Atemgeräusch), Kind \"schweigt\" = hochgradige Gefährdung, SpO2 <90%",
    ],
  },
  {
    id: "atemnot-erwachsene",
    titel: "Obstruktive Atemwegserkrankung — Erw./Kind >12 J. (K5)",
    farbe: "#60A5FA",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K5_obstruktive-atemwege-erwachsene.webp",
    medikamente: [
      { id: "salbutamol", wann: "Erstmaßnahme" },
      { id: "ipratropiumbromid", wann: "Bei ausbleibender Besserung nach Salbutamol" },
      { id: "prednisolon_asthma_erwachsene", wann: "Bei ausbleibender Besserung" },
    ],
    schritte: [
      "Basisalgorithmus → Anaphylaxie? Ja → Anaphylaxie-Algorithmus (K9)",
      "Nein → venöser Zugang (wenn zeitnah möglich), ggf. langsame VEL-Infusion",
      "Salbutamol Fertiginhalat 2 Amp. à 1,25 mg in 2,5 ml (= 2,5 mg in 5 ml) mit O2 vernebeln, nach 15 min. wiederholen",
      "Besserung? Ja → weiter zu \"Nachlassen der Symptome?\"",
      "Nein → Ipratropiumbromid Fertiginhalat 2 Amp. à 0,25 mg in 2 ml (= 0,5 mg in 4 ml) mit O2 vernebeln, nach 30 min. wiederholbar",
      "→ ggf. Prednisolon 100 mg p.o. oder i.v.",
      "Nachlassen der Symptome? Nein → NA alarmieren",
      "Notarzt (schwerer Asthmaanfall/Status asthmaticus): ggf. Prednisolon, ggf. Reproterol 0,09 mg i.v. (Wdh. nach 10 min.), ggf. Magnesiumsulfat i.v. 2 g in 20 min., ggf. NIV durch erfahrenen Anwender, endotracheale Intubation/Beatmung",
      "Ja → Transport",
      "Kontraindikationen: Überdosierung mit ß-Mimetika, Tachykardie/Tachyarrhythmie >150/min",
      "Hinweis: ggf. direkte Ipratropiumbromid-Gabe bei vorausgegangener Selbstmedikation mit ß-Mimetika",
    ],
  },
  {
    id: "krupp",
    titel: "Extrapulmonale Atemwegsobstruktion — Kind & Anaphylaxie Erw. (K7)",
    farbe: "#F87171",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K7_extrapulmonale-atemwegsobstruktion.webp",
    medikamente: [
      { id: "adrenalin-vernebelt", wann: "Schweregrad III-IV" },
      { id: "prednisolon_krupp_rektal", wann: "Falls noch nicht verabreicht" },
    ],
    schritte: [
      "Basisalgorithmus → Anaphylaxie? Ja → Anaphylaxie-Algorithmus (K9)",
      "Nein → Schweregrad einschätzen",
      "Grad I–II: bellender Husten, Heiserkeit, leiser Stridor bei Erregung → direkt zu Steroid (siehe unten)",
      "Grad III–IV: Dyspnoe in Ruhe bzw. hochgradige Dyspnoe, Zyanose, Bradykardie/Somnolenz → NA alarmieren",
      "Grad III–IV: Adrenalin 5 mg vernebeln (Zubereitung je nach Verneblersystem)",
      "Steroid (falls noch nicht verabreicht): Prednisolon 100 mg rektal, ggf. Prednisolon i.v. (2 mg/kgKG)",
      "Nachlassen der Symptome? Nein → NA alarmieren",
      "Notarzt: venöser Zugang (sehr kritisch abwägen), langsame VEL-Infusion, ggf. Optimierung der Maskenbeatmung (z. B. 2-Helfer-Methode), ggf. endotracheale Intubation/Beatmung (Tubus 0,5 mm kleiner)",
      "Ja → Transport",
      "Cave: bei schweren kruppartigen Bildern an Epiglottitis denken (Alter, Sprache, sitzend, Speichel, Sepsis) — immer Notarztbegleitung!",
      "Adrenalin: schnell, aber kurz wirksam, nie ohne Steroid. Steroid: mittelfristig stabilisierend, seltener Intubation nötig",
    ],
  },
  {
    id: "schock-volumen",
    titel: "Hypovolämischer / hypervolämischer Schock",
    farbe: "#A78BFA",
    quelle: "demo",
    rdBereiche: null,
    version: null,
    stand: null,
    bildUrl: null,
    schritte: [
      "Hinweis: kein eigener K-Algorithmus im 2026-SOP-Dokument — allgemeines Fachwissen, kein Ersatz für Leitlinie/SOP deines Rettungsdienstbereichs",
      "Schockzeichen: Tachykardie, Hypotonie, verlängerte Rekapillarisierungszeit, kalte/blasse/marmorierte Haut, Vigilanzminderung, Tachypnoe",
      "Hypovolämischer Schock (Volumenmangel): Ursachen z.B. Blutung (innere/äußere), Flüssigkeitsverlust (Erbrechen/Durchfall/Verbrennung)",
      "Maßnahmen Hypovolämie: Blutungskontrolle wo möglich (Druckverband/Tourniquet), Schocklagerung erwägen, venöser Zugang (möglichst großlumig), zügige VEL-Infusion, Wärmeerhalt, zügiger Transport in geeignete Zielklinik",
      "Hypervolämischer Schock/kardiogene Dekompensation durch Volumenüberladung: Ursachen z.B. Herzinsuffizienz, Niereninsuffizienz mit Anurie, zu schnelle/zu große Infusionsgabe",
      "Maßnahmen Hypervolämie: Oberkörperhochlagerung, Sauerstoffgabe nach Bedarf, KEINE zusätzliche Volumengabe, ggf. bestehende Infusion drosseln/stoppen, NA nachfordern",
      "Bei unklarer Schockursache: NA alarmieren, Basismonitoring (RR/Hf/SpO2/EKG), Ursachensuche nach ABCDE",
    ],
  },
  {
    id: "linksherzinsuffizienz",
    titel: "Linksherzinsuffizienz mit akuter Dyspnoe (K2)",
    farbe: "#FB923C",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K2_linksherzinsuffizienz-dyspnoe.webp",
    medikamente: [
      { id: "glyceroltrinitrat", wann: "Falls RRsys >150 mmHg & Hf 50-130/min" },
    ],
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "post-reanimationsphase",
    titel: "Post-Reanimationsphase (K15)",
    farbe: "#22C55E",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K15_post-reanimationsphase.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "schmerz-uebersicht",
    titel: "Starke Schmerzzustände — Übersicht (K16)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K16_starke-schmerzzustaende.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "schmerz-abdominell",
    titel: "Abdomineller Schmerz (K16a)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K16a_schmerz-abdominell.webp",
    medikamente: [
      { id: "butylscopolamin", wann: "Bei V.a. Gallenkolik" },
      { id: "nalbuphin", wann: "Analgesie, ggf. mit Butylscopolamin kombiniert" },
    ],
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "schmerz-traumatisch",
    titel: "Traumatischer Schmerz (K16b)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K16b_schmerz-traumatisch.webp",
    medikamente: [
      { id: "esketamin", wann: "Ausschließlich bei traumatisch bedingten starken Schmerzen" },
    ],
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "schmerz-thorakal",
    titel: "Thorakaler Schmerz (K16c)",
    farbe: "#FBBF24",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K16c_schmerz-thorakal.webp",
    medikamente: [
      { id: "nalbuphin", wann: "Opioid-Analgesie bei thorakalem Schmerz" },
    ],
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "starke-uebelkeit",
    titel: "Starke Übelkeit (K17)",
    farbe: "#4ADE80",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K17_starke-uebelkeit.webp",
    medikamente: [
      { id: "dimenhydrinat", wann: "Nach venösem Zugang + VEL-Infusion" },
    ],
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "co-vergiftung-ohne-spco",
    titel: "Kohlenmonoxid-Vergiftung — ohne SpCO-Messung (K19a)",
    farbe: "#94A3B8",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K19a_co-vergiftung-ohne-spco.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "co-vergiftung-mit-spco",
    titel: "Kohlenmonoxid-Vergiftung — mit SpCO-Messung (K19b)",
    farbe: "#94A3B8",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K19b_co-vergiftung-mit-spco.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "opioid-komplikation",
    titel: "Opioid-Komplikationsmanagement ab 14 Jahren (K20)",
    farbe: "#F472B6",
    kategorie: "K",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/K20_opioid-komplikationsmanagement.webp",
    medikamente: [
      { id: "naloxon_nasal", wann: "Bei Atemdepression, Kreislaufdepression oder Bewusstseinsverlust" },
      { id: "naloxon_iv", wann: "Alternative bei liegendem venösem Zugang" },
    ],
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "p1-io-zugang",
    titel: "Intraossärer Zugang — i.o., Reanimation (P1)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/P1_io-zugang.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "p2-cpap-niv",
    titel: "CPAP/NIV-Anwendung (P2)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/P2_cpap-niv.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "p3-extraglottischer-atemweg",
    titel: "Extraglottischer Atemweg (P3)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/P3_extraglottischer-atemweg.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "p4-thoraxentlastungspunktion",
    titel: "Thoraxentlastungspunktion — Reanimation (P4)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/P4_thoraxentlastungspunktion.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "p5-sauerstoffgabe",
    titel: "Sauerstoffgabe (P5)",
    farbe: "#38BDF8",
    kategorie: "P",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/P5_sauerstoffgabe.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "v1a-bleibt-vor-ort-welcher-fall",
    titel: "Patient bleibt vor Ort — welcher Fall? (V1a)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/V1a_bleibt-vor-ort-welcher-fall.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "v1b-bleibt-vor-ort-welche-bedingungen",
    titel: "Patient bleibt vor Ort — welche Bedingungen? (V1b)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/V1b_bleibt-vor-ort-welche-bedingungen.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "v2-isobar",
    titel: "Standard der Patientenübergabe: ISOBAR (V2)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/V2_isobar.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "v3a-vorsichtung-prior",
    titel: "Vorsichtung PRIOR (V3a)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/V3a_vorsichtung-prior.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
  {
    id: "v3b-vorsichtung-mstart",
    titel: "Vorsichtung mSTART (V3b)",
    farbe: "#A3A3A3",
    kategorie: "V",
    quelle: "sop",
    rdBereiche: ["Bergstraße", "Darmstadt", "Darmstadt-Dieburg", "Groß-Gerau"],
    version: "V1.5",
    stand: "31.01.2026",
    bildUrl: "images/da-di/V3b_vorsichtung-mstart.webp",
    schritte: ["Original-SOP-Karte (Bild) — Diagrammdaten noch nicht digitalisiert, siehe Bild-Ansicht"],
  },
];

// ============================================================
// Pädiatrie-Farbzonen (Broselow-artiges Konzept, wie in der
// Beispiel-App gezeigt): jede Farbzone repräsentiert eine
// typische Alters-/Gewichts-/Größenspanne mit zugehörigen
// Atemwegs-Materialgrößen. Werte sind generische, allgemein
// bekannte pädiatrische Referenzgrößen (angelehnt an gängige
// Formeln/Tabellen wie Broselow/APLS) — KEIN Ersatz für eine
// geprüfte Fachinformation oder Trainingsmaterial. Ungeprüft.
// ============================================================

const PEDIATRIE_ZONEN = [
  {
    farbe: "Grau", hex: "#9CA3AF", textDunkel: false, hfMin: 100, hfMax: 180, rrMin: 60, rrMax: 90, afMin: 30, afMax: 60, hbMin: 140, hbMax: 200,
    alterMonate: 0, groesseCm: 50, gewicht: 3,
    tubusOhneCuff: 3.0, tubusMitCuff: 2.5, tiefeOral: 9, tiefeNasal: 11,
    larynxmaske: 1, iGel: 1, larynxtubus: 0, guedel: "000 (4)", spatelMiller: 0,
  },
  {
    farbe: "Rosa", hex: "#F472B6", textDunkel: false, hfMin: 100, hfMax: 160, rrMin: 70, rrMax: 100, afMin: 30, afMax: 60, hbMin: 100, hbMax: 140,
    alterMonate: 6, groesseCm: 63, gewicht: 6,
    tubusOhneCuff: 3.5, tubusMitCuff: 3.0, tiefeOral: 10, tiefeNasal: 12,
    larynxmaske: 1.5, iGel: 1.5, larynxtubus: 1, guedel: "00 (5)", spatelMiller: 1,
  },
  {
    farbe: "Rot", hex: "#EF4444", textDunkel: false, hfMin: 100, hfMax: 150, rrMin: 70, rrMax: 110, afMin: 30, afMax: 40, hbMin: 100, hbMax: 140,
    alterMonate: 12, groesseCm: 77, gewicht: 10,
    tubusOhneCuff: 4.0, tubusMitCuff: 3.5, tiefeOral: 12, tiefeNasal: 14,
    larynxmaske: 2, iGel: 2, larynxtubus: 1, guedel: "0 (6)", spatelMiller: 1,
  },
  {
    farbe: "Lila", hex: "#A78BFA", textDunkel: false, hfMin: 95, hfMax: 140, rrMin: 80, rrMax: 110, afMin: 25, afMax: 35, hbMin: 105, hbMax: 145,
    alterMonate: 24, groesseCm: 87, gewicht: 12,
    tubusOhneCuff: 4.5, tubusMitCuff: 4.0, tiefeOral: 13, tiefeNasal: 15,
    larynxmaske: 2, iGel: 2, larynxtubus: 2, guedel: "1 (7)", spatelMiller: 1,
  },
  {
    farbe: "Gelb", hex: "#FBBF24", textDunkel: true, hfMin: 80, hfMax: 120, rrMin: 85, rrMax: 115, afMin: 20, afMax: 30, hbMin: 110, hbMax: 150,
    alterMonate: 48, groesseCm: 102, gewicht: 16,
    tubusOhneCuff: 5.0, tubusMitCuff: 4.5, tiefeOral: 14, tiefeNasal: 17,
    larynxmaske: 2.5, iGel: 2.5, larynxtubus: 2, guedel: "2 (8)", spatelMiller: 2,
  },
  {
    farbe: "Weiß", hex: "#F1F5F9", textDunkel: true, hfMin: 75, hfMax: 115, rrMin: 90, rrMax: 115, afMin: 18, afMax: 26, hbMin: 115, hbMax: 150,
    alterMonate: 72, groesseCm: 117, gewicht: 20,
    tubusOhneCuff: 5.5, tubusMitCuff: 5.0, tiefeOral: 15, tiefeNasal: 18,
    larynxmaske: 2.5, iGel: 2.5, larynxtubus: 2.5, guedel: "2 (8)", spatelMiller: 2,
  },
  {
    farbe: "Blau", hex: "#60A5FA", textDunkel: false, hfMin: 70, hfMax: 110, rrMin: 95, rrMax: 120, afMin: 16, afMax: 24, hbMin: 115, hbMax: 150,
    alterMonate: 96, groesseCm: 130, gewicht: 25,
    tubusOhneCuff: 6.0, tubusMitCuff: 5.5, tiefeOral: 16, tiefeNasal: 19,
    larynxmaske: 3, iGel: 3, larynxtubus: 3, guedel: "3 (9)", spatelMiller: 2,
  },
  {
    farbe: "Orange", hex: "#FB923C", textDunkel: false, hfMin: 65, hfMax: 105, rrMin: 100, rrMax: 120, afMin: 14, afMax: 22, hbMin: 120, hbMax: 155,
    alterMonate: 126, groesseCm: 145, gewicht: 32,
    tubusOhneCuff: 6.5, tubusMitCuff: 6.0, tiefeOral: 17, tiefeNasal: 20,
    larynxmaske: 3, iGel: 3, larynxtubus: 3, guedel: "3 (9)", spatelMiller: 3,
  },
  {
    farbe: "Grün", hex: "#34D399", textDunkel: false, hfMin: 60, hfMax: 100, rrMin: 100, rrMax: 130, afMin: 12, afMax: 20, hbMin: 120, hbMax: 160,
    alterMonate: 144, groesseCm: 157, gewicht: 40,
    tubusOhneCuff: 7.0, tubusMitCuff: 6.5, tiefeOral: 18, tiefeNasal: 21,
    larynxmaske: 4, iGel: 4, larynxtubus: 4, guedel: "4 (10)", spatelMiller: 3,
  },
];

// Lineare Interpolation zwischen den beiden Nachbar-Zonen einer
// kontinuierlichen Schieberposition (0 … Zonenanzahl-1).
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function zonenGrenzen(zonePos) {
  const lower = Math.max(0, Math.min(Math.floor(zonePos), PEDIATRIE_ZONEN.length - 1));
  const upper = Math.min(lower + 1, PEDIATRIE_ZONEN.length - 1);
  const t = zonePos - lower;
  return { lower, upper, t };
}

function interpNum(zonePos, feld, rundenAuf = 0.5) {
  const { lower, upper, t } = zonenGrenzen(zonePos);
  const val = lerp(PEDIATRIE_ZONEN[lower][feld], PEDIATRIE_ZONEN[upper][feld], t);
  return Math.round(val / rundenAuf) * rundenAuf;
}


function formatAlter(monate) {
  const gerundet = Math.round(monate);
  if (gerundet < 1) return "Neugeboren";
  if (gerundet < 12) return `${gerundet} Monat${gerundet === 1 ? "" : "e"}`;
  const jahre = Math.floor(gerundet / 12);
  const restMonate = gerundet % 12;
  if (restMonate === 0) return `${jahre} Jahr${jahre === 1 ? "" : "e"}`;
  return `${jahre} J. ${restMonate} Mon.`;
}

function round(n, d = 2) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

// ============================================================
// EKG-Referenzbibliothek. Die Kurven sind eigene, schematische
// Illustrationen (per SVG generiert) — KEINE echten Patienten-
// EKGs, kein externer Bildbezug. Symptome/Zielbehandlung sind
// allgemeines Lehrbuchwissen zur präklinischen Erstversorgung —
// KEIN Ersatz für Fachinformation, Leitlinien oder die SOPs
// deines Rettungsdienstbereichs.
// ============================================================

// Deterministischer Pseudo-Zufall (immer gleiches Bild, kein Flackern)
function machRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Erzeugt Punkte für eine schematische EKG-Kurve je nach Rhythmustyp.
function ekgPunkte(opts, breite = 300) {
  const rand = machRandom(7);
  const pts = [];
  if (opts.flach) {
    for (let x = 0; x <= breite; x += 4) pts.push([x, 50 + (rand() - 0.5) * 2]);
    return pts;
  }
  if (opts.chaotisch) {
    for (let x = 0; x <= breite; x += 3) pts.push([x, 50 + (rand() - 0.5) * opts.amplitude * 2]);
    return pts;
  }
  if (opts.saegezahn) {
    let x = 0;
    while (x < breite) {
      pts.push([x, 50]);
      pts.push([x + opts.zyklus * 0.7, 50 - opts.amplitude]);
      pts.push([x + opts.zyklus, 50]);
      x += opts.zyklus;
    }
    return pts;
  }
  if (opts.sinus) {
    for (let x = 0; x <= breite; x += 2) {
      const amp = opts.amplitudeModuliert
        ? opts.amplitude * (0.35 + 0.65 * Math.abs(Math.sin(x / opts.modPeriode)))
        : opts.amplitude;
      pts.push([x, 50 + amp * Math.sin((x / opts.zyklus) * 2 * Math.PI)]);
    }
    return pts;
  }
  // Schlag-basiert (P-QRS-T), z. B. Sinusrhythmus, Tachykardien, AV-Blöcke
  let x = 0;
  let i = 0;
  while (x < breite) {
    let zyklus = opts.zyklus;
    if (opts.unregelmaessig) zyklus = zyklus * (0.65 + rand() * 0.7);
    const beatUeberspringen = opts.jedenNtenAuslassen && i % opts.jedenNtenAuslassen === opts.jedenNtenAuslassen - 1;
    const x0 = x;
    pts.push([x0, 50]);
    if (opts.hatP) {
      pts.push([x0 + zyklus * 0.1, 50]);
      pts.push([x0 + zyklus * 0.14, 44]);
      pts.push([x0 + zyklus * 0.18, 50]);
    }
    const prAbstand = opts.prLang ? zyklus * 0.36 : zyklus * 0.22;
    if (!beatUeberspringen) {
      const qx = x0 + prAbstand;
      pts.push([qx, 50]);
      pts.push([qx + opts.qrsBreite * 0.28, 58]);
      pts.push([qx + opts.qrsBreite * 0.5, 50 - opts.qrsHoehe]);
      pts.push([qx + opts.qrsBreite * 0.75, 60]);
      pts.push([qx + opts.qrsBreite, 50]);
      if (opts.hatT) {
        pts.push([qx + opts.qrsBreite + zyklus * 0.12, 50]);
        pts.push([qx + opts.qrsBreite + zyklus * 0.2, 44]);
        pts.push([qx + opts.qrsBreite + zyklus * 0.28, 50]);
      }
    }
    pts.push([x0 + zyklus, 50]);
    x += zyklus;
    i++;
  }
  return pts;
}

function EkgStrip({ opts, farbe = "#22C55E" }) {
  const punkte = ekgPunkte(opts);
  const punkteStr = punkte.map((p) => `${round(p[0], 1)},${round(p[1], 1)}`).join(" ");
  return (
    <svg viewBox="0 0 300 100" style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="none">
      <rect x="0" y="0" width="300" height="100" fill="#1a0a0e" />
      {Array.from({ length: 15 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="100" stroke="#3a1520" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 20} x2="300" y2={i * 20} stroke="#3a1520" strokeWidth="0.5" />
      ))}
      <polyline points={punkteStr} fill="none" stroke={farbe} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const EKG_BILDER = [
  {
    id: "sinusrhythmus",
    titel: "Normaler Sinusrhythmus",
    ekgOpts: { hatP: true, hatT: true, zyklus: 50, qrsBreite: 10, qrsHoehe: 35 },
    ekgFarbe: "#22C55E",
    symptome: ["Meist asymptomatisch", "Regelmäßiger Puls 60–100/min"],
    zielbehandlung: ["Keine spezifische Therapie nötig", "Basis-Monitoring fortführen"],
  },
  {
    id: "vf",
    titel: "Kammerflimmern (VF)",
    ekgOpts: { chaotisch: true, amplitude: 22 },
    ekgFarbe: "#F87171",
    symptome: ["Bewusstlosigkeit", "Kein tastbarer Puls", "Kreislaufstillstand"],
    zielbehandlung: ["Sofortige CPR", "Frühestmögliche Defibrillation", "Adrenalin nach 3. Schock"],
    algoLink: "cpr-erwachsene",
  },
  {
    id: "pvt",
    titel: "Pulslose ventrikuläre Tachykardie (pVT)",
    ekgOpts: { hatP: false, hatT: false, zyklus: 34, qrsBreite: 18, qrsHoehe: 30 },
    ekgFarbe: "#F87171",
    symptome: ["Bewusstlosigkeit", "Kein tastbarer Puls trotz Kammeraktion"],
    zielbehandlung: ["Wie Kammerflimmern behandeln: CPR + Defibrillation"],
    algoLink: "cpr-erwachsene",
  },
  {
    id: "vflutter",
    titel: "Kammerflattern",
    ekgOpts: { sinus: true, amplitude: 30, zyklus: 22 },
    ekgFarbe: "#FB923C",
    symptome: ["Hämodynamisch meist instabil", "Übergang zu Kammerflimmern häufig"],
    zielbehandlung: ["Bei Pulslosigkeit: CPR + Defibrillation", "Bei Puls: NA nachfordern, Kardioversion erwägen"],
  },
  {
    id: "torsade",
    titel: "Torsade de Pointes",
    ekgOpts: { sinus: true, amplitude: 26, zyklus: 16, amplitudeModuliert: true, modPeriode: 40 },
    ekgFarbe: "#FB923C",
    symptome: ["Anfallsartiger Schwindel/Synkope", "Kann in Kammerflimmern übergehen"],
    zielbehandlung: ["Magnesiumsulfat i.v. erwägen (NA)", "Auslösende Medikamente/Elektrolytstörung suchen", "Bei Pulslosigkeit: CPR + Defibrillation"],
  },
  {
    id: "asystolie",
    titel: "Asystolie",
    ekgOpts: { flach: true },
    ekgFarbe: "#F87171",
    symptome: ["Bewusstlosigkeit", "Kein Puls", "Keine elektrische Aktivität"],
    zielbehandlung: ["CPR fortführen", "Adrenalin alle 3–5 min", "Reversible Ursachen (4H/HITS) suchen"],
    algoLink: "cpr-erwachsene",
  },
  {
    id: "pea",
    titel: "Pulslose elektrische Aktivität (PEA)",
    ekgOpts: { hatP: true, hatT: true, zyklus: 48, qrsBreite: 10, qrsHoehe: 28 },
    ekgFarbe: "#F87171",
    symptome: ["Bewusstlosigkeit, kein Puls", "Geordnete EKG-Aktivität ohne Auswurf"],
    zielbehandlung: ["CPR fortführen", "Gezielt nach reversibler Ursache suchen (4H/HITS)", "Adrenalin alle 3–5 min"],
    algoLink: "cpr-erwachsene",
  },
  {
    id: "svt",
    titel: "Supraventrikuläre Tachykardie (SVT)",
    ekgOpts: { hatP: false, hatT: true, zyklus: 26, qrsBreite: 8, qrsHoehe: 28 },
    ekgFarbe: "#FBBF24",
    symptome: ["Palpitationen", "Schwindel", "Schmalkomplex-Tachykardie meist regelmäßig"],
    zielbehandlung: ["Vagale Manöver versuchen (wenn stabil)", "Bei Instabilität: NA nachfordern, Kardioversion erwägen"],
  },
  {
    id: "vhflimmern",
    titel: "Vorhofflimmern",
    ekgOpts: { hatP: false, hatT: true, zyklus: 40, qrsBreite: 9, qrsHoehe: 28, unregelmaessig: true },
    ekgFarbe: "#FBBF24",
    symptome: ["Unregelmäßiger Puls (\"absolute Arrhythmie\")", "Palpitationen, ggf. asymptomatisch"],
    zielbehandlung: ["Frequenz-/Kreislaufkontrolle", "Bei Instabilität: NA nachfordern", "Keine präklinische Kardioversion ohne NA"],
  },
  {
    id: "vhflattern",
    titel: "Vorhofflattern",
    ekgOpts: { saegezahn: true, amplitude: 14, zyklus: 14 },
    ekgFarbe: "#FBBF24",
    symptome: ["Regelmäßige Tachykardie", "\"Sägezahnmuster\" der P-Wellen"],
    zielbehandlung: ["Monitoring, Transport", "Bei Instabilität: NA nachfordern"],
  },
  {
    id: "avblock1",
    titel: "AV-Block I°",
    ekgOpts: { hatP: true, hatT: true, zyklus: 50, qrsBreite: 10, qrsHoehe: 32, prLang: true },
    ekgFarbe: "#60A5FA",
    symptome: ["Meist asymptomatisch", "Zufallsbefund im EKG"],
    zielbehandlung: ["Keine akute präklinische Therapie nötig", "Transport mit Monitoring"],
  },
  {
    id: "avblock2m1",
    titel: "AV-Block II° (Mobitz I / Wenckebach)",
    ekgOpts: { hatP: true, hatT: true, zyklus: 44, qrsBreite: 10, qrsHoehe: 32, jedenNtenAuslassen: 4 },
    ekgFarbe: "#60A5FA",
    symptome: ["Meist gutartig, oft asymptomatisch", "Gelegentlich Schwindel"],
    zielbehandlung: ["Meist keine akute Therapie", "Bei Symptomatik: NA nachfordern"],
  },
  {
    id: "avblock2m2",
    titel: "AV-Block II° (Mobitz II)",
    ekgOpts: { hatP: true, hatT: true, zyklus: 44, qrsBreite: 10, qrsHoehe: 32, jedenNtenAuslassen: 3 },
    ekgFarbe: "#60A5FA",
    symptome: ["Risiko für Progression zu AV-Block III°", "Schwindel, Synkopen möglich"],
    zielbehandlung: ["NA nachfordern", "Bei Bradykardie/Instabilität: Atropin erwägen, transkutaner Schrittmacher vorbereiten"],
    algoLink: "bradykardie",
  },
  {
    id: "avblock3",
    titel: "AV-Block III° (kompletter Block)",
    ekgOpts: { hatP: true, hatT: false, zyklus: 70, qrsBreite: 14, qrsHoehe: 26, prLang: true },
    ekgFarbe: "#60A5FA",
    symptome: ["Schwindel, Synkopen (Adam-Stokes-Anfall)", "Sehr niedrige Herzfrequenz"],
    zielbehandlung: ["NA nachfordern", "Bei Instabilität: Atropin, transkutane Schrittmachertherapie vorbereiten"],
    algoLink: "bradykardie",
  },
];

// ============================================================
// Pädiatrische Reanimations-Faktoren — Werte aus den vom Nutzer
// hochgeladenen Screenshots (PEDI-App, REA-Tab) übernommen.
// Alle Faktoren sind pro kgKG, außer wo anders vermerkt.
// Ungeprüft gegen Fachinformation — Quelle: Nutzer-Screenshot.
// ============================================================
const REA_FAKTOREN = {
  adrenalinIv: { faktor: 0.01, einheit: "mg", label: "Adrenalin i.v./i.o.", info: "10 µg/kg" },
  adrenalinTracheal: { faktor: 0.1, einheit: "mg", label: "Adrenalin tracheal", info: "0,1 mg/kg" },
  amiodaron: { faktor: 5, einheit: "mg", label: "Amiodaron i.v./i.o.", info: "5 mg/kg" },
  atropin: { faktor: 0.02, einheit: "mg", label: "Atropin i.v./i.o.", info: "20 µg/kg" },
  volumenbolus: { faktor: 10, einheit: "ml", label: "Volumenbolus i.v./i.o.", info: "10 ml/kg" },
  adenosin1: { faktor: 0.1, einheit: "mg", label: "Adenosin i.v. 1. Dosis", info: "0,1 mg/kg" },
  adenosin2: { faktor: 0.2, einheit: "mg", label: "Adenosin i.v. 2. Dosis", info: "0,2 mg/kg" },
  lidocain: { faktor: 1, einheit: "mg", label: "Lidocain i.v./i.o.", info: "1 mg/kg" },
};

function flussigkeitsbedarf(kg) {
  // Holliday-Segar (4-2-1-Regel), ml/h
  const a = Math.min(kg, 10) * 4;
  const b = Math.max(0, Math.min(kg - 10, 10)) * 2;
  const c = Math.max(0, kg - 20) * 1;
  return Math.round(a + b + c);
}

function energiebedarf(kg) {
  // 100-50-20-Regel, kcal/d
  const a = Math.min(kg, 10) * 100;
  const b = Math.max(0, Math.min(kg - 10, 10)) * 50;
  const c = Math.max(0, kg - 20) * 20;
  return Math.round(a + b + c);
}

// Extrahiert den K/P/V/M-Code aus Titel bzw. Name (z. B. "(K16a)" oder "— M2"),
// damit Algorithmen/Medikamente über beide Regionen hinweg verglichen werden
// können, obwohl die internen IDs unterschiedlich benannt sind.
function extrahiereCode(text) {
  if (!text) return null;
  const m = text.match(/\(([A-Za-z]{1,2}\d+[a-z]?)\)/) || text.match(/—\s*([A-Za-z]{1,2}\d+[A-Za-z]?)\b/);
  return m ? m[1].toUpperCase() : null;
}

const DA_DI_ALGO_CODES = new Set(ALGORITHMEN.map((a) => extrahiereCode(a.titel)).filter(Boolean));
const HESSEN_ALGO_CODES = new Set(ALGORITHMEN_HESSEN.map((a) => extrahiereCode(a.titel)).filter(Boolean));
const DA_DI_MED_CODES = new Set(MEDIKAMENTE.map((m) => extrahiereCode(m.name)).filter(Boolean));
const HESSEN_MED_CODES = new Set(MEDIKAMENTE_HESSEN.map((m) => extrahiereCode(m.name)).filter(Boolean));

const REGION_FARBE = { darmstadt: "#FBBF24", hessen: "#14B8A6" };

// Liefert die Badge-Darstellung für ein Element: eigene Regionsfarbe, oder
// beide Farben (Gradient), falls derselbe K/P/V/M-Code auch in der jeweils
// anderen Region existiert (= inhaltlich deckungsgleiche SOP-Vorgabe).
function sopBadgeFarbe(text, eigeneRegion) {
  const code = extrahiereCode(text);
  const eigeneCodes = eigeneRegion === "hessen" ? HESSEN_ALGO_CODES : DA_DI_ALGO_CODES;
  const andereCodes = eigeneRegion === "hessen" ? DA_DI_ALGO_CODES : HESSEN_ALGO_CODES;
  const eigeneMedCodes = eigeneRegion === "hessen" ? HESSEN_MED_CODES : DA_DI_MED_CODES;
  const andereMedCodes = eigeneRegion === "hessen" ? DA_DI_MED_CODES : HESSEN_MED_CODES;
  const existiertAuchAnderswo =
    (code && (eigeneCodes.has(code) || eigeneMedCodes.has(code)) && (andereCodes.has(code) || andereMedCodes.has(code)));
  if (existiertAuchAnderswo) {
    return `linear-gradient(90deg, ${REGION_FARBE.darmstadt} 50%, ${REGION_FARBE.hessen} 50%)`;
  }
  return REGION_FARBE[eigeneRegion] || REGION_FARBE.darmstadt;
}

function berechneDosis(med, gewicht, istKind) {
  let mg;
  if (med.modus === "fix") {
    mg = med.fixErwachsen;
  } else if (med.modus === "kg") {
    mg = round(gewicht * med.kgFaktor, 3);
    if (med.max) mg = Math.min(mg, med.max);
  } else if (med.modus === "kg_gramm") {
    mg = round(gewicht * med.kgFaktor * 1000, 0);
    if (med.max) mg = Math.min(mg, med.max);
  } else if (med.modus === "fix_oder_kg") {
    if (istKind && med.kindFix !== undefined && med.kindFix !== null) {
      mg = med.kindFix;
    } else {
      mg = istKind ? round(gewicht * med.kgKind, 3) : med.fixErwachsen;
    }
    if (istKind && med.maxKind) mg = Math.min(mg, med.maxKind);
    if (!istKind && med.max) mg = Math.min(mg, med.max);
  }
  const ml = round(mg / med.mgPerMl, 2);
  return { mg, ml };
}

function formatZeit(sekunden) {
  const m = Math.floor(sekunden / 60);
  const s = sekunden % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Badge({ children, tone, bgOverride }) {
  const tones = {
    sop: { bg: "#FBBF24", fg: "#0B1220" },
    warn: { bg: "var(--badge-warn-bg)", fg: "var(--badge-warn-fg)", border: "var(--badge-warn-border)" },
    ok: { bg: "#16A34A", fg: "#F0FDF4" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        fontSize: 9.5,
        fontWeight: 700,
        color: t.fg,
        background: bgOverride || t.bg,
        border: t.border ? `1px solid ${t.border}` : "none",
        borderRadius: 5,
        padding: "1.5px 5px",
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function TimerCard({ label, icon, timer, elapsed, onStart, onStop, onReset, unterzeile }) {
  const farbe = timer.running ? "#EF4444" : "#22C55E";
  const Icon = icon;
  return (
    <div
      style={{
        flex: 1,
        background: `linear-gradient(160deg, ${farbe}26, ${farbe}0A)`,
        border: "1.5px solid",
        borderColor: `${farbe}77`,
        borderRadius: 18,
        padding: "14px 14px",
        boxShadow: `0 8px 28px -12px ${farbe}66, inset 0 1px 0 ${farbe}22`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        {Icon ? (
          <Icon size={17} color={farbe} strokeWidth={2.25} />
        ) : (
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 99,
              background: farbe,
            }}
          />
        )}
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: farbe,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 30,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: unterzeile ? 2 : 12,
        }}
      >
        {formatZeit(elapsed)}
      </div>
      {unterzeile && (
        <div style={{ fontSize: 10.5, color: farbe, fontWeight: 600, marginBottom: 10, minHeight: 13 }}>
          {unterzeile}
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={timer.running ? onStop : onStart}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 0",
            borderRadius: 10,
            border: "none",
            background: `linear-gradient(135deg, ${farbe}, ${farbe}CC)`,
            color: "#FFFFFF",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 4px 14px -4px ${farbe}88`,
          }}
        >
          {timer.running ? <Pause size={13} /> : <Play size={13} />}
          {timer.running ? "Stopp" : "Start"}
        </button>
        <button
          onClick={onReset}
          title="Zurücksetzen"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}

// Zähl-Widget für Atem-/Herzfrequenz: Nutzer tippt bei jedem Atemzug/Puls,
// nach Ablauf der gewählten Messdauer wird auf 1 Minute hochgerechnet.
function TapZaehler({ titel, einheit, farbe, Icon, normMin, normMax, warnMin, warnMax, dauerOptionen = [15, 30] }) {
  const [dauer, setDauer] = useState(dauerOptionen[0]);
  const [laeuft, setLaeuft] = useState(false);
  const [verstrichen, setVerstrichen] = useState(0);
  const [taps, setTaps] = useState(0);
  const [ergebnis, setErgebnis] = useState(null);
  const intervalRef = useRef(null);

  // Grün = Normbereich, Orange = leicht erhöht/erniedrigt, Rot = kritisch.
  // Ohne übergebene Schwellen bleibt es bei der Tab-Farbe (Fallback).
  function ergebnisFarbe(wert) {
    if (wert === null || normMin === undefined) return farbe;
    if (wert >= normMin && wert <= normMax) return "#22C55E";
    if (wert >= warnMin && wert <= warnMax) return "#F59E0B";
    return "#EF4444";
  }
  const farbeAktuell = ergebnis !== null ? ergebnisFarbe(ergebnis) : farbe;

  useEffect(() => {
    if (!laeuft) return;
    intervalRef.current = setInterval(() => {
      setVerstrichen((prev) => {
        const next = prev + 0.1;
        if (next >= dauer) {
          clearInterval(intervalRef.current);
          setLaeuft(false);
          setTaps((aktuelleTaps) => {
            setErgebnis(Math.round(aktuelleTaps * (60 / dauer)));
            return aktuelleTaps;
          });
          return dauer;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laeuft]);

  function starten() {
    clearInterval(intervalRef.current);
    setVerstrichen(0);
    setTaps(0);
    setErgebnis(null);
    setLaeuft(true);
  }

  function zuruecksetzen() {
    clearInterval(intervalRef.current);
    setLaeuft(false);
    setVerstrichen(0);
    setTaps(0);
    setErgebnis(null);
  }

  const restSekunden = Math.max(0, Math.ceil(dauer - verstrichen));

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        boxShadow: "var(--shadow-card)",
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        {Icon && <Icon size={17} color={farbe} strokeWidth={2.25} />}
        <span style={{ fontSize: 15, fontWeight: 700 }}>{titel}</span>
      </div>

      {!laeuft && ergebnis === null && (
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {dauerOptionen.map((d) => (
            <button
              key={d}
              onClick={() => setDauer(d)}
              style={{
                flex: 1,
                padding: "7px 0",
                borderRadius: 8,
                border: "1px solid",
                borderColor: dauer === d ? farbe : "var(--border)",
                background: dauer === d ? `${farbe}18` : "transparent",
                color: dauer === d ? farbe : "var(--text-muted)",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {d} Sek. messen
            </button>
          ))}
        </div>
      )}

      {ergebnis !== null ? (
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 800, color: farbeAktuell }}>
            {ergebnis}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {einheit} (hochgerechnet aus {taps}x in {dauer} Sek.)
          </div>
          {normMin !== undefined && (
            <div style={{ fontSize: 11, fontWeight: 700, color: farbeAktuell, marginTop: 4 }}>
              {farbeAktuell === "#22C55E" ? "Normbereich" : farbeAktuell === "#F59E0B" ? "Leicht abweichend" : "Kritisch — prüfen"}
              {" "}(Erw., Norm: {normMin}–{normMax}/min)
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={laeuft ? () => setTaps((t) => t + 1) : starten}
          style={{
            width: "100%",
            padding: "22px 0",
            borderRadius: 12,
            border: "2px solid",
            borderColor: farbe,
            background: laeuft ? `${farbe}22` : `${farbe}12`,
            color: farbe,
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            marginBottom: 10,
            userSelect: "none",
          }}
        >
          {laeuft ? (
            <>
              Tippen bei jedem {titel.includes("Atem") ? "Atemzug" : "Puls"} — {taps}
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>noch {restSekunden}s</div>
            </>
          ) : (
            `Start (${dauer} Sek.)`
          )}
        </button>
      )}

      {(laeuft || ergebnis !== null) && (
        <button
          onClick={zuruecksetzen}
          style={{
            width: "100%",
            padding: "8px 0",
            borderRadius: 9,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <RotateCcw size={12} /> Zurücksetzen
        </button>
      )}
    </div>
  );
}

function RettungsdienstDemoInner({ session, onLogout }) {
  const [tab, setTab] = useState("medikamente");
  const [darkMode, setDarkMode] = useState(true);
  const [gewicht, setGewicht] = useState(75);
  const [istKind, setIstKind] = useState(false);
  const [activeMed, setActiveMed] = useState("adrenalin_im");
  // Rechner ist standardmäßig eingeklappt — statische SOP-Tabelle ist die
  // Hauptansicht, der Rechner ein bewusst separater Zusatzschritt.
  const [rechnerOffen, setRechnerOffen] = useState(false);
  const [openAlgo, setOpenAlgo] = useState("anaphylaxie");
  // Region-Umschalter — steuert JETZT sowohl Algorithmen als auch Medikamente
  // (einheitlicher Schalter, damit beide SOP-Datensätze immer synchron
  // umschalten und niemals gemischt angezeigt werden).
  const [algoRegion, setAlgoRegion] = useState("darmstadt");
  const MEDIKAMENTE_AKTIV = algoRegion === "hessen" ? MEDIKAMENTE_HESSEN : MEDIKAMENTE;
  // true = die per Navigation (Einsatzauswahl, REA, Pädiatrie-/EKG-Links, MANV)
  // geöffnete Karte wird oben angepinnt. false = manuelles Anklicken in der
  // Liste selbst — Reihenfolge bleibt stabil, nichts springt.
  const [algoPinned, setAlgoPinned] = useState(false);
  const [zonePos, setZonePos] = useState(2);
  const [uebernommen, setUebernommen] = useState(false);
  const [kinderUnterTab, setKinderUnterTab] = useState("norm");
  const [stichwortDialog, setStichwortDialog] = useState(false);
  const [stichwortInput, setStichwortInput] = useState("");
  const [stichwortFreitext, setStichwortFreitext] = useState(false);
  const [einsatzStichwort, setEinsatzStichwort] = useState("");
  const [reaAuswahlDialog, setReaAuswahlDialog] = useState(false);
  const [reaLog, setReaLog] = useState([]);
  const [einsatzEndeDialog, setEinsatzEndeDialog] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  // Pflicht-Disclaimer beim ersten Start — pro Gerät gemerkt (localStorage).
  // Blockiert die App komplett, bis aktiv per Checkbox bestätigt wurde.
  const [disclaimerOk, setDisclaimerOk] = useState(() => {
    try {
      return localStorage.getItem("rd_disclaimer_ok_v1") === "true";
    } catch {
      return false;
    }
  });
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [impressumOffen, setImpressumOffen] = useState(false);
  const [traumaOffen, setTraumaOffen] = useState(false);

  function disclaimerBestaetigen() {
    try {
      localStorage.setItem("rd_disclaimer_ok_v1", "true");
    } catch {
      // Speicher nicht verfügbar — Bestätigung gilt dann nur für diese Sitzung.
    }
    setDisclaimerOk(true);
  }
  // Persönlicher Medikamenten-Zähler ("Karriere-Gadget") — rein lokal im
  // Browser gespeichert (localStorage), keine Server-Anbindung, minimaler
  // Speicherverbrauch (paar hundert Byte JSON).
  const [medZaehler, setMedZaehler] = useState(() => {
    try {
      const raw = localStorage.getItem("rd_medZaehler");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [medZaehlerDialog, setMedZaehlerDialog] = useState(false);
  const [medZaehlerLoeschenId, setMedZaehlerLoeschenId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("rd_medZaehler", JSON.stringify(medZaehler));
    } catch {
      // Speicher voll o.ä. — Zähler bleibt dann nur für die Sitzung erhalten.
    }
  }, [medZaehler]);

  function medZaehlerErhoehen(id) {
    setMedZaehler((z) => ({ ...z, [id]: (z[id] || 0) + 1 }));
  }
  function medZaehlerZuruecksetzen(id) {
    setMedZaehler((z) => {
      const neu = { ...z };
      delete neu[id];
      return neu;
    });
    setMedZaehlerLoeschenId(null);
  }
  const [feedbackKategorie, setFeedbackKategorie] = useState("Vorschlag");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackLaden, setFeedbackLaden] = useState(false);
  const [feedbackFehler, setFeedbackFehler] = useState(null);
  const [algoInfoSeen, setAlgoInfoSeen] = useState(false);
  const [freieDosisFaktor, setFreieDosisFaktor] = useState("");
  const [freieDosisKonz, setFreieDosisKonz] = useState("");
  const [freieDosisAufklappen, setFreieDosisAufklappen] = useState(false);

  // Zwei unabhängige globale Timer: Einsatz-Timer und REA-Timer
  const [einsatzTimer, setEinsatzTimer] = useState({ running: false, elapsed: 0, startedAt: null });
  const [reaTimer, setReaTimer] = useState({ running: false, elapsed: 0, startedAt: null });
  const [, forceTick] = useState(0);

  // ---- Metronom (CPR-Frequenz) ----
  const [metronomBpm, setMetronomBpm] = useState(110);
  const [metronomLaeuft, setMetronomLaeuft] = useState(false);
  const [metronomBeat, setMetronomBeat] = useState(false);
  const audioCtxRef = useRef(null);
  const metronomIntervalRef = useRef(null);

  function metronomKlick() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(0.27, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (err) {
      // Audio-Ausgabe optional — bei Fehler läuft das Metronom rein visuell weiter.
    }
    setMetronomBeat(true);
    setTimeout(() => setMetronomBeat(false), 100);
  }

  useEffect(() => {
    if (metronomIntervalRef.current) {
      clearInterval(metronomIntervalRef.current);
      metronomIntervalRef.current = null;
    }
    if (metronomLaeuft) {
      metronomKlick();
      metronomIntervalRef.current = setInterval(metronomKlick, Math.round(60000 / metronomBpm));
    }
    return () => {
      if (metronomIntervalRef.current) clearInterval(metronomIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metronomLaeuft, metronomBpm]);

  useEffect(() => {
    if (!einsatzTimer.running && !reaTimer.running) return;
    const interval = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [einsatzTimer.running, reaTimer.running]);

  function getElapsedGlobal(t) {
    if (t.running) return t.elapsed + Math.floor((Date.now() - t.startedAt) / 1000);
    return t.elapsed;
  }

  function toggleGlobalTimer(setter) {
    setter((prev) => {
      if (prev.running) {
        const elapsedNow = prev.elapsed + Math.floor((Date.now() - prev.startedAt) / 1000);
        return { running: false, elapsed: elapsedNow, startedAt: null };
      }
      return { running: true, elapsed: prev.elapsed, startedAt: Date.now() };
    });
  }

  function resetGlobalTimer(setter) {
    setter({ running: false, elapsed: 0, startedAt: null });
  }

  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  function gewichtUebernehmen() {
    const gewichtInterp = interpNum(zonePos, "gewicht", 1);
    setGewicht(gewichtInterp);
    setIstKind(true);
    setTab("medikamente");
    setUebernommen(true);
    setTimeout(() => setUebernommen(false), 2000);
    scrollToTop();
  }

  function einsatzStartAnfragen() {
    setStichwortInput("");
    setStichwortFreitext(false);
    setStichwortDialog(true);
  }

  function einsatzMitStichwortStarten() {
    const wort = stichwortInput.trim();
    setEinsatzStichwort(wort);
    setStichwortDialog(false);
    toggleGlobalTimer(setEinsatzTimer);
    const normalisiert = wort.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u");
    if (normalisiert.includes("pad")) {
      setTab("kinder");
      setKinderUnterTab("norm");
    }
    scrollToTop();
  }

  // Auswahl per Klick — startet den Einsatz-Timer UND klappt direkt den
  // passenden Algorithmus (Diagramm/Vorgehen/Medikamente) auf.
  function einsatzMitAlgorithmusStarten(label, algoId) {
    setEinsatzStichwort(label);
    setStichwortDialog(false);
    toggleGlobalTimer(setEinsatzTimer);
    if (algoId === "PAEDIATRISCH") {
      setTab("kinder");
      setKinderUnterTab("norm");
    } else if (algoId === "TRAUMA_EXTERN") {
      setTraumaOffen(true);
    } else if (algoId) {
      setAlgoRegion("darmstadt");
      setTab("algorithmen");
      setOpenAlgo(algoId);
      setAlgoPinned(true);
    }
    scrollToTop();
  }

  function reaStartAnfragen() {
    setReaAuswahlDialog(true);
  }

  // Reine Navigation zu einem Algorithmus, OHNE Timer zu starten — für
  // Verlinkungen wie Schock, die kein Kreislaufstillstand sind.
  function algorithmusOeffnen(algoId, kind = false) {
    setReaAuswahlDialog(false);
    setIstKind(kind);
    // Wichtig: REA-Algorithmen existieren aktuell nur in der Darmstadt-Liste.
    // Ohne diese Zeile bliebe die Karte unsichtbar, falls vorher auf "Hessen"
    // umgeschaltet war (dort ist die Liste noch leer) — dann würde trotz
    // korrekt gesetztem openAlgo scheinbar "nichts aufklappen".
    setAlgoRegion("darmstadt");
    setTab("algorithmen");
    setOpenAlgo(algoId);
    setAlgoPinned(true);
    scrollToTop();
  }

  function reaMitAlgorithmusStarten(algoId) {
    toggleGlobalTimer(setReaTimer);
    setEinsatzTimer((prev) => (prev.running ? prev : { running: true, elapsed: prev.elapsed, startedAt: Date.now() }));
    algorithmusOeffnen(algoId, algoId === "cpr-kind" || algoId === "cpr-neugeborenes");
  }

  function medikamentGeben(name, dosisText, mlText) {
    const jetzt = new Date();
    const zeit = `${String(jetzt.getHours()).padStart(2, "0")}:${String(jetzt.getMinutes()).padStart(2, "0")}:${String(jetzt.getSeconds()).padStart(2, "0")}`;
    setReaLog((prev) => [...prev, { name, dosisText, mlText, zeit }]);
  }

  function reaLogEintragLoeschen(index) {
    setReaLog((prev) => prev.filter((_, i) => i !== index));
  }

  function einsatzBeendenAnfragen() {
    if (reaLog.length > 0) {
      setEinsatzEndeDialog(true);
    } else {
      alleZuruecksetzen();
    }
  }

  function alleZuruecksetzen() {
    setEinsatzTimer({ running: false, elapsed: 0, startedAt: null });
    setReaTimer({ running: false, elapsed: 0, startedAt: null });
    setEinsatzStichwort("");
    setReaLog([]);
    setActiveMed(null);
    setOpenAlgo(null);
    setTab("medikamente");
    setIstKind(false);
    setGewicht(75);
    setZonePos(2);
    setKinderUnterTab("norm");
    setEinsatzEndeDialog(false);
    setEmailInput("");
    scrollToTop();
  }

  function reaProtokollSenden() {
    const zeilen = reaLog.map((e) => `${e.zeit} - ${e.name}: ${e.dosisText}${e.mlText ? ` (${e.mlText})` : ""}`).join("\n");
    const body = encodeURIComponent(
      `REA-Medikamentenprotokoll\nStichwort: ${einsatzStichwort || "-"}\n\n${zeilen}\n\n(Erstellt mit RD-Toolkit Demo - nur zur Nachvollziehbarkeit, kein offizielles Einsatzprotokoll)`
    );
    const to = emailInput.trim();
    window.location.href = `mailto:${to}?subject=${encodeURIComponent("REA-Medikamentenprotokoll")}&body=${body}`;
    alleZuruecksetzen();
  }

  // Sendet Feedback per Mailto — öffnet die Mail-App des Nutzers mit
  // vorausgefülltem Betreff/Text. Kein Backend, kein Konto nötig, funktioniert
  // garantiert überall dort, wo eine Mail-App eingerichtet ist.
  //
  // ADRESSE HIER EINTRAGEN:
  const FEEDBACK_EMAIL = "shinsetso@googlemail.com";

  async function feedbackSenden() {
    setFeedbackFehler(null);
    setFeedbackLaden(true);
    try {
      const betreff = encodeURIComponent(`RD-Toolkit Feedback: ${feedbackKategorie}`);
      const koerper = encodeURIComponent(
        `Kategorie: ${feedbackKategorie}\n\n${feedbackText}\n\n— Gesendet aus dem Rettungsdienst-Toolkit`
      );
      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${betreff}&body=${koerper}`;
      // Kurze Pause, damit die Mail-App Zeit hat sich zu öffnen, bevor der
      // Dialog hier zugeht — sonst wirkt es wie nichts wäre passiert.
      await new Promise((resolve) => setTimeout(resolve, 400));
      setFeedbackLaden(false);
      setFeedbackDialog(false);
      setFeedbackText("");
    } catch (err) {
      setFeedbackLaden(false);
      setFeedbackFehler("Mail-App konnte nicht geöffnet werden. Ist eine E-Mail-App eingerichtet?");
    }
  }

  const med = MEDIKAMENTE_AKTIV.find((m) => m.id === activeMed);
  const ergebnis = useMemo(
    () => (med ? berechneDosis(med, gewicht, istKind) : null),
    [med, gewicht, istKind]
  );

  // ═══════════════════════════════════════════════════════════════
  // PFLICHT-SPERRBILDSCHIRM — blockiert die App komplett, bis aktiv
  // bestätigt wurde. Kein Wegklicken ohne Häkchen möglich.
  // ═══════════════════════════════════════════════════════════════
  if (!disclaimerOk) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 15% 0%, #17233B 0%, #0B1220 55%)",
          padding: 20,
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            background: "#0E1728",
            border: "1px solid #212C42",
            borderRadius: 18,
            padding: 24,
            color: "#E8ECF4",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#FBBF2422",
              marginBottom: 14,
            }}
          >
            <AlertTriangle size={22} color="#FBBF24" />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>
            Wichtiger Hinweis vor der Nutzung
          </h1>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: "0 0 12px", color: "#C7CEDB" }}>
            Diese App ist ein <strong>reines Demonstrations- und Schulungstool zu
            Ausbildungszwecken.</strong> Sie ist <strong>kein Medizinprodukt</strong> und darf{" "}
            <strong>nicht für klinische Entscheidungen am Patienten</strong> verwendet werden.
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: "0 0 12px", color: "#C7CEDB" }}>
            Alle Inhalte (Algorithmen, Dosierungen, Referenzwerte) stammen aus SOP-Dokumenten,
            wurden aber <strong>nicht durch Dritte formal validiert</strong>. Zwischen
            verschiedenen Stellen desselben Original-Dokuments bestehen bekanntermaßen
            vereinzelt Widersprüche (z. B. abweichende Dosisangaben an unterschiedlichen
            Stellen) — diese sind an den jeweiligen Stellen in der App vermerkt, aber nicht
            abschließend aufgelöst.
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: "0 0 18px", color: "#C7CEDB" }}>
            Nutzung <strong>ausschließlich auf eigene Gefahr</strong>. Jeder Wert muss vor
            jeder tatsächlichen Anwendung eigenständig anhand der offiziellen, aktuell
            gültigen SOPs geprüft werden.
          </p>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 10,
              background: "#131B2E",
              border: "1px solid #212C42",
              marginBottom: 16,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={disclaimerChecked}
              onChange={(e) => setDisclaimerChecked(e.target.checked)}
              style={{ marginTop: 2, width: 18, height: 18, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12.5, lineHeight: 1.5, color: "#E8ECF4" }}>
              Ich habe diesen Hinweis gelesen und verstanden. Ich bestätige, dass ich alle
              Werte vor jeder Anwendung selbstständig anhand der offiziellen SOPs prüfe.
            </span>
          </label>
          <button
            onClick={disclaimerBestaetigen}
            disabled={!disclaimerChecked}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 10,
              border: "none",
              background: disclaimerChecked ? "linear-gradient(135deg, #FF6A3D, #FF8F6B)" : "#212C42",
              color: disclaimerChecked ? "#FFFFFF" : "#5B6478",
              fontSize: 14,
              fontWeight: 700,
              cursor: disclaimerChecked ? "pointer" : "not-allowed",
            }}
          >
            Verstanden — App öffnen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        colorScheme: darkMode ? "dark" : "light",
        background: darkMode
          ? "radial-gradient(circle at 15% 0%, #17233B 0%, #0B1220 55%)"
          : "radial-gradient(circle at 15% 0%, #EAF0FB 0%, #F4F6FA 55%)",
        color: "var(--text)",
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        display: "flex",
        justifyContent: "center",
        padding: "20px 14px 48px",
        ...(darkMode
          ? {
              "--bg": "#0B1220",
              "--card": "#0E1728",
              "--card-active": "#131B2E",
              "--text": "#E8ECF4",
              "--text-muted": "#8A93A6",
              "--text-secondary": "#C7CDDB",
              "--border": "#212C42",
              "--warn-bg": "#1C1408",
              "--warn-border": "#4A3216",
              "--warn-text": "#C9B98A",
              "--dim": "#3A4560",
              "--badge-warn-bg": "#3A1D1D",
              "--badge-warn-border": "#5C2626",
              "--badge-warn-fg": "#F87171",
              "--input-border": "#2C3A56",
              "--shadow-card": "0 4px 18px -8px rgba(0,0,0,0.55)",
            }
          : {
              "--bg": "#F4F6FA",
              "--card": "#FFFFFF",
              "--card-active": "#F1F5F9",
              "--text": "#1A2233",
              "--text-muted": "#64748B",
              "--text-secondary": "#374151",
              "--border": "#DCE3ED",
              "--warn-bg": "#FFF7E0",
              "--warn-border": "#F2CE84",
              "--warn-text": "#8A6D1F",
              "--dim": "#94A3B8",
              "--badge-warn-bg": "#FEE2E2",
              "--badge-warn-border": "#FCA5A5",
              "--badge-warn-fg": "#DC2626",
              "--input-border": "#CBD5E1",
              "--shadow-card": "0 4px 18px -8px rgba(30,41,59,0.16)",
            }),
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Einsatz- & REA-Timer — ganz oben, sofort verfügbar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <TimerCard
            label="Einsatz"
            icon={Ambulance}
            timer={einsatzTimer}
            elapsed={getElapsedGlobal(einsatzTimer)}
            onStart={einsatzStartAnfragen}
            onStop={einsatzBeendenAnfragen}
            onReset={() => {
              resetGlobalTimer(setEinsatzTimer);
              setEinsatzStichwort("");
            }}
            unterzeile={einsatzStichwort}
          />
          <TimerCard
            label="REA"
            icon={Activity}
            timer={reaTimer}
            elapsed={getElapsedGlobal(reaTimer)}
            onStart={reaStartAnfragen}
            onStop={() => toggleGlobalTimer(setReaTimer)}
            onReset={() => resetGlobalTimer(setReaTimer)}
          />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "linear-gradient(135deg, #FF6A3D, #FF8F6B)",
                boxShadow: "0 4px 14px -4px #FF6A3D88",
              }}
            >
              <Syringe size={17} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <span
              style={{
                fontSize: 12.5,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              RD-Toolkit · Demo
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setDarkMode((d) => !d)}
              title={darkMode ? "Helles Design" : "Dunkles Design"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMedZaehlerDialog(true)}
              title="Medikamenten-Zähler (persönliches Gadget)"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <PackagePlus size={16} />
            </button>
            <button
              onClick={() => setFeedbackDialog(true)}
              title="Feedback geben"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <MessageSquarePlus size={16} />
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Abmelden"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Dauerhaft sichtbarer Kurz-Disclaimer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 14,
            padding: "5px 2px",
          }}
        >
          <AlertTriangle size={11} color="#FBBF24" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.3 }}>
            Schulungstool, kein Medizinprodukt — vor Anwendung stets SOP selbst prüfen.
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "6px 0 16px", letterSpacing: "-0.01em" }}>
          Einsatzhilfen
        </h1>


        {/* Stichwort-Dialog beim Start des Einsatz-Timers */}
        {stichwortDialog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(11,18,32,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 20,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                background: "var(--card-active)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Einsatz starten</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.4 }}>
                Einsatzstichwort auswählen — öffnet direkt Algorithmus, Vorgehen und Medikamente.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 14,
                  maxHeight: "50vh",
                  overflowY: "auto",
                }}
              >
                {EINSATZSTICHWORTE.map((sw) => (
                  <button
                    key={sw.label}
                    onClick={() => einsatzMitAlgorithmusStarten(sw.label, sw.algoId)}
                    style={{
                      padding: "10px 10px",
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: sw.farbe,
                      background: `${sw.farbe}18`,
                      color: sw.farbe,
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      textAlign: "left",
                      lineHeight: 1.3,
                    }}
                  >
                    {sw.label}
                  </button>
                ))}
              </div>

              {!stichwortFreitext && (
                <button
                  onClick={() => setStichwortFreitext(true)}
                  style={{
                    width: "100%",
                    padding: "9px 0",
                    borderRadius: 10,
                    border: "1px dashed var(--border)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 4,
                  }}
                >
                  Anderes Stichwort eingeben…
                </button>
              )}

              {stichwortFreitext && (
                <>
                  <input
                    type="text"
                    autoFocus
                    value={stichwortInput}
                    onChange={(e) => setStichwortInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && einsatzMitStichwortStarten()}
                    placeholder="z. B. Trauma, Vergiftung, Sonstiges…"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid var(--input-border)",
                      background: "var(--card-active)",
                      color: "var(--text)",
                      fontSize: 14,
                      marginBottom: 14,
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setStichwortDialog(false)}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "transparent",
                        color: "var(--text-muted)",
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={einsatzMitStichwortStarten}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,
                        border: "1px solid #60A5FA",
                        background: "rgba(96,165,250,0.15)",
                        color: "#60A5FA",
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Start
                    </button>
                  </div>
                </>
              )}

              {!stichwortFreitext && (
                <button
                  onClick={() => setStichwortDialog(false)}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Abbrechen
                </button>
              )}
            </div>
          </div>
        )}

        {/* Medikamenten-Zähler-Dialog ("Karriere-Gadget") */}
        {medZaehlerDialog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(11,18,32,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 20,
            }}
            onClick={() => {
              setMedZaehlerDialog(false);
              setMedZaehlerLoeschenId(null);
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
                width: "100%",
                maxWidth: 380,
                maxHeight: "80vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Medikamenten-Zähler</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>
                    Rein privates Gadget — zählt, wie oft du auf ein Medikament getippt hast.
                    Nur lokal auf diesem Gerät gespeichert, keine Übertragung.
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMedZaehlerDialog(false);
                    setMedZaehlerLoeschenId(null);
                  }}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4, flexShrink: 0 }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ overflowY: "auto", marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {[...MEDIKAMENTE_AKTIV].sort((a, b) => a.name.localeCompare(b.name, "de")).map((m) => {
                  const anzahl = medZaehler[m.id] || 0;
                  const bestaetigen = medZaehlerLoeschenId === m.id;
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 10,
                        background: "var(--card-active)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{anzahl}× gegeben</div>
                      </div>
                      {bestaetigen ? (
                        <>
                          <button
                            onClick={() => medZaehlerZuruecksetzen(m.id)}
                            style={{ fontSize: 10.5, fontWeight: 700, padding: "6px 8px", borderRadius: 7, border: "1px solid #EF4444", background: "#EF444422", color: "#EF4444", cursor: "pointer" }}
                          >
                            Löschen?
                          </button>
                          <button
                            onClick={() => setMedZaehlerLoeschenId(null)}
                            style={{ fontSize: 10.5, fontWeight: 700, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}
                          >
                            Doch nicht
                          </button>
                        </>
                      ) : (
                        <>
                          {anzahl > 0 && (
                            <button
                              onClick={() => setMedZaehlerLoeschenId(m.id)}
                              title="Zähler zurücksetzen"
                              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", flexShrink: 0 }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => medZaehlerErhoehen(m.id)}
                            title="Hochzählen"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, border: "1px solid #FF6A3D", background: "#FF6A3D1F", color: "#FF6A3D", cursor: "pointer", flexShrink: 0 }}
                          >
                            <Plus size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Feedback-Dialog */}
        {feedbackDialog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(11,18,32,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 20,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                background: "var(--card-active)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Feedback geben</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.4 }}>
                Öffnet deine Mail-App mit vorausgefülltem Text — dort einfach senden.
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.04em" }}>
                KATEGORIE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {["Fehler/Bug", "Falsche Dosierung", "Algorithmus fehlt/falsch", "Verbesserungsvorschlag", "Sonstiges"].map((k) => (
                  <button
                    key={k}
                    onClick={() => setFeedbackKategorie(k)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 9,
                      border: "1px solid",
                      borderColor: feedbackKategorie === k ? "#FF6A3D" : "var(--border)",
                      background: feedbackKategorie === k ? "rgba(255,106,61,0.12)" : "transparent",
                      color: feedbackKategorie === k ? "#FF6A3D" : "var(--text-secondary)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.04em" }}>
                BEGRÜNDUNG
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Was genau ist dir aufgefallen?"
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--input-border)",
                  background: "var(--card-active)",
                  color: "var(--text)",
                  fontSize: 13,
                  marginBottom: 14,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />

              {feedbackFehler && (
                <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 10 }}>{feedbackFehler}</div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setFeedbackDialog(false)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={feedbackSenden}
                  disabled={!feedbackText.trim() || feedbackLaden}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 10,
                    border: "1px solid #FF6A3D",
                    background: "rgba(255,106,61,0.15)",
                    color: "#FF6A3D",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: feedbackText.trim() && !feedbackLaden ? "pointer" : "not-allowed",
                    opacity: feedbackText.trim() && !feedbackLaden ? 1 : 0.5,
                  }}
                >
                  {feedbackLaden ? "Sende…" : "Absenden"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Einsatz-Ende-Dialog: REA-Protokoll per Mail? */}
        {einsatzEndeDialog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(11,18,32,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 20,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                background: "var(--card-active)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Einsatz beenden</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.4 }}>
                Es wurden {reaLog.length} Medikamentengabe(n) protokolliert. REA-Protokoll per E-Mail
                senden, um nachzuvollziehen, was wann gegeben wurde?
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="E-Mail-Adresse (optional)"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--input-border)",
                  background: "var(--card-active)",
                  color: "var(--text)",
                  fontSize: 14,
                  marginBottom: 14,
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={alleZuruecksetzen}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Nicht senden
                </button>
                <button
                  onClick={reaProtokollSenden}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 10,
                    border: "1px solid #22C55E",
                    background: "rgba(34,197,94,0.15)",
                    color: "#22C55E",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Per Mail senden
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auswahl-Dialog beim Start des REA-Timers */}
        {reaAuswahlDialog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(11,18,32,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 20,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                background: "var(--card-active)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Reanimation starten</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.4 }}>
                Bei Kreislaufstillstand startet der REA-Timer automatisch mit.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {[
                  { id: "cpr-erwachsene", label: "Erwachsene", info: "Kreislaufstillstand Erwachsene — CPR (K12)", farbe: "#FF6A3D" },
                  { id: "cpr-kind", label: "Kind", info: "Kreislaufstillstand Kind — CPR (K13)", farbe: "#34D399" },
                  { id: "cpr-neugeborenes", label: "Neugeborenes", info: "Erstversorgung Neugeborenes (K14)", farbe: "#60A5FA" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => reaMitAlgorithmusStarten(opt.id)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: opt.farbe,
                      background: `${opt.farbe}18`,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: opt.farbe }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{opt.info}</div>
                    </div>
                    <ChevronRight size={16} color={opt.farbe} />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setReaAuswahlDialog(false)}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {[
            { id: "medikamente", label: "Medikamente", icon: Pill, farbe: "#FF6A3D" },
            { id: "kinder", label: "Pädiatrie", icon: Baby, farbe: "#34D399" },
            { id: "ekg", label: "EKG", icon: Activity, farbe: "#F87171" },
            { id: "algorithmen", label: "Algorithmen", icon: ListChecks, farbe: "#FBBF24" },
            { id: "manv", label: "MANV", icon: Users, farbe: "#EF4444" },
            { id: "metronom", label: "Metronom", icon: Music2, farbe: "#60A5FA" },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  padding: "9px 1px",
                  borderRadius: 13,
                  border: "1px solid",
                  borderColor: active ? t.farbe : "var(--border)",
                  background: active ? `linear-gradient(160deg, ${t.farbe}2E, ${t.farbe}12)` : "var(--card)",
                  color: active ? t.farbe : "var(--text-muted)",
                  fontSize: 9.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: active ? `0 6px 16px -8px ${t.farbe}99` : "none",
                  transition: "background 0.15s, box-shadow 0.15s",
                }}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ===================== TAB: MEDIKAMENTE ===================== */}
        {tab === "medikamente" && (
          <>
            {/* Regionsauswahl — identisch zum Algorithmen-Tab, EIN Schalter für beide */}
            <div
              style={{
                display: "flex",
                gap: 8,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-card)",
                padding: 6,
                marginBottom: 14,
              }}
            >
              {[
                { id: "darmstadt", label: "Bergstraße/Darmstadt/Darmstadt-Dieburg/Groß-Gerau", flex: 3, farbe: "#FBBF24" },
                { id: "hessen", label: "Hessen", flex: 1, farbe: "#14B8A6" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAlgoRegion(r.id)}
                  style={{
                    flex: r.flex,
                    padding: "9px 6px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: algoRegion === r.id ? r.farbe : "transparent",
                    background: algoRegion === r.id ? `${r.farbe}1F` : "transparent",
                    color: algoRegion === r.id ? r.farbe : "var(--text-muted)",
                    fontSize: 10,
                    lineHeight: 1.3,
                    fontWeight: 700,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* SpO2-Zielwerte / Sauerstoff-Referenz (M24, P5) — identisch in DA/DI & Hessen */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-card)",
                padding: 14,
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Wind size={15} color="#60A5FA" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>Sauerstoff — SpO2-Zielwerte (M24)</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                {[
                  { situation: "COPD", intervention: "SpO2 < 88 %", ziel: "88–92 %" },
                  { situation: "V.a. STEMI*", intervention: "SpO2 < 90 %", ziel: "90–96 %" },
                  { situation: "Sonstige", intervention: "SpO2 < 92 %", ziel: "92–96 %" },
                ].map((row) => (
                  <div
                    key={row.situation}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: "var(--card-active)",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ fontWeight: 600, flex: 1 }}>{row.situation}</span>
                    <span style={{ color: "var(--text-muted)", flex: 1, textAlign: "center" }}>
                      Intervention: {row.intervention}
                    </span>
                    <span style={{ color: "#60A5FA", fontWeight: 700, flex: 1, textAlign: "right" }}>
                      Ziel: {row.ziel}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 4px", lineHeight: 1.5 }}>
                *Besondere Empfehlung der Fachgesellschaft. Weitere Indikationen: Kohlenmonoxidvergiftung,
                Präoxygenierung bei drohendem Sauerstoffmangel.
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 4px", lineHeight: 1.5 }}>
                Dosierung je nach Zielwert — Medikamentenvernebler: 6 l/min. Bei Störung der CO2-Atemregulation
                (z. B. COPD): möglichst nur 2–4 l/min, engmaschige Überwachung von Atemtiefe und Frequenz.
              </p>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#FBBF24", margin: 0, lineHeight: 1.5 }}>
                ⚠ Vorsicht bei "einfachen" Pulsoxymeter-Sensoren: Messung kann fälschlich zu hohe
                Sättigungswerte anzeigen!
              </p>
            </div>

            {/* Gewichtseingabe */}
            <div
              style={{
                background: "var(--card-active)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 18,
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Körpergewicht</label>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600 }}>
                  {gewicht} <span style={{ fontSize: 14, color: "var(--text-muted)" }}>kg</span>
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={150}
                value={gewicht}
                onChange={(e) => setGewicht(Number(e.target.value))}
                style={{ width: "100%", marginTop: 12, accentColor: "#FF6A3D" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                {[
                  { label: "Erwachsen", val: false },
                  { label: "Kind", val: true },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setIstKind(opt.val)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: istKind === opt.val ? "#FF6A3D" : "var(--border)",
                      background: istKind === opt.val ? "rgba(255,106,61,0.12)" : "transparent",
                      color: istKind === opt.val ? "#FF6A3D" : "var(--text-muted)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Freie Dosisberechnung — eigenes mg/kgKG eingeben, z. B. für Medikamente
                aus den Hessen-Algorithmen, die noch nicht in der Liste unten stehen */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                boxShadow: "var(--shadow-card)",
                marginBottom: 16,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setFreieDosisAufklappen((v) => !v)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text)",
                }}
              >
                <span style={{ fontSize: 14.5, fontWeight: 600 }}>Freie Dosisberechnung</span>
                <ChevronDown
                  size={15}
                  color="var(--text-muted)"
                  style={{ transform: freieDosisAufklappen ? "rotate(180deg)" : "rotate(-90deg)", transition: "transform 0.15s" }}
                />
              </button>
              {freieDosisAufklappen && (
                <div style={{ padding: "0 14px 16px" }}>
                  <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
                    Für Medikamente, die (noch) nicht in der Liste unten stehen — z. B. aus
                    den Hessen-Algorithmen, sobald du sie hochlädst. Nutzt das oben
                    eingestellte Gewicht ({gewicht} kg).
                  </p>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Dosis (mg/kgKG)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={freieDosisFaktor}
                        onChange={(e) => setFreieDosisFaktor(e.target.value)}
                        placeholder="z. B. 0,1"
                        style={{
                          width: "100%",
                          marginTop: 4,
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--card-active)",
                          color: "var(--text)",
                          fontSize: 14,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Konzentration (mg/ml, optional)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={freieDosisKonz}
                        onChange={(e) => setFreieDosisKonz(e.target.value)}
                        placeholder="z. B. 1"
                        style={{
                          width: "100%",
                          marginTop: 4,
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--card-active)",
                          color: "var(--text)",
                          fontSize: 14,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      />
                    </div>
                  </div>
                  {freieDosisFaktor !== "" && !isNaN(Number(freieDosisFaktor)) && (
                    <div
                      style={{
                        background: "var(--card-active)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        padding: "12px 14px",
                        display: "flex",
                        gap: 20,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>GESAMTDOSIS</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700 }}>
                          {round(Number(freieDosisFaktor) * gewicht, 3)} mg
                        </div>
                      </div>
                      {freieDosisKonz !== "" && !isNaN(Number(freieDosisKonz)) && Number(freieDosisKonz) > 0 && (
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>VOLUMEN</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700 }}>
                            {round((Number(freieDosisFaktor) * gewicht) / Number(freieDosisKonz), 2)} ml
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <ShieldAlert size={13} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                      Selbst eingegebener Wert, keine hinterlegte SOP-Quelle. Immer gegen die
                      aktuelle Fachinformation/den Algorithmus prüfen.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Medikamentenliste — Ergebnis klappt direkt unter dem angeklickten Eintrag auf */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[...MEDIKAMENTE_AKTIV].sort((a, b) => a.name.localeCompare(b.name, "de")).map((m) => {
                const offen = activeMed === m.id;
                const ergebnisM = offen ? berechneDosis(m, gewicht, istKind) : null;
                return (
                  <div key={m.id}>
                    <button
                      onClick={() => {
                        setActiveMed(offen ? null : m.id);
                        setRechnerOffen(false);
                      }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "left",
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: offen ? "14px 14px 0 0" : 14,
                        border: "1px solid",
                        borderColor: offen ? m.farbe : "var(--border)",
                        boxShadow: offen ? "0 4px 16px -8px rgba(0,0,0,0.15)" : "none",
                        transition: "box-shadow 0.15s, border-radius 0.15s",
                        borderBottom: offen ? "none" : undefined,
                        background: offen ? "var(--card-active)" : "var(--card)",
                        cursor: "pointer",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14.5, fontWeight: 600 }}>{m.name}</span>
                          {m.dosisQuelle === "sop" && <Badge tone="sop" bgOverride={sopBadgeFarbe(m.name, algoRegion)}>SOP</Badge>}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>{m.gruppe}</div>
                      </div>
                      <ChevronDown
                        size={15}
                        color={m.farbe}
                        style={{
                          transform: offen ? "rotate(180deg)" : "rotate(-90deg)",
                          transition: "transform 0.15s",
                          flexShrink: 0,
                          marginLeft: 8,
                        }}
                      />
                    </button>

                    {/* Ergebnis — direkt unter dem geöffneten Medikament */}
                    {offen && ergebnisM && (
                      <div
                        style={{
                          background: "var(--card)",
                          border: `1px solid ${m.farbe}`,
                          borderTop: "none",
                          borderRadius: "0 0 12px 12px",
                          padding: 18,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.konzentration}</span>
                          {m.ampulleGeprueft ? (
                            <Badge tone="ok">
                              SOP-ABGEGLICHEN{m.geprueftAm ? ` · ${m.geprueftAm}` : ""}
                            </Badge>
                          ) : (
                            <Badge tone="warn">
                              <ShieldAlert size={9} style={{ marginRight: 3, marginBottom: -1 }} />
                              NICHT ABGEGLICHEN
                            </Badge>
                          )}
                        </div>
                        {m.ampulleGeprueft && (m.geprueftVon || m.handelsname) && (
                          <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: -6, marginBottom: 10 }}>
                            {m.handelsname ? `${m.handelsname} · ` : ""}
                            {m.geprueftVon ? `Quelle: ${m.geprueftVon} — keine Validierung durch Dritte` : ""}
                          </div>
                        )}
                        {!m.ampulleGeprueft && (
                          <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: -6, marginBottom: 10 }}>
                            Konzentration/Ampullengröße noch nicht gegen Fachinformation des tatsächlich geführten Präparats abgeglichen.
                          </div>
                        )}

                        {/* Statische SOP-Tabelle — die Hauptansicht. Zeigt exakt den
                            gedruckten Dosierungstext, keine live berechnete Zahl. */}
                        <div
                          style={{
                            background: "var(--card-active)",
                            border: `1px solid ${m.farbe}55`,
                            borderRadius: 10,
                            padding: "12px 14px",
                            marginBottom: 12,
                          }}
                        >
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: m.farbe, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>
                            Standard-Dosierung lt. SOP
                          </div>
                          <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>
                            {m.hinweis}
                          </div>
                        </div>

                        {m.bekannteAbweichung && (
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              background: "#F8717122",
                              border: "1px solid #F87171",
                              borderRadius: 10,
                              padding: "10px 12px",
                              marginBottom: 12,
                            }}
                          >
                            <AlertTriangle size={14} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 11.5, color: "var(--text)", lineHeight: 1.5 }}>
                              <strong style={{ color: "#F87171" }}>Bekannte Abweichung im SOP-Dokument:</strong>{" "}
                              {m.bekannteAbweichung}
                            </span>
                          </div>
                        )}

                        {/* Rechner — bewusst eingeklappt, kein automatisch sichtbares
                            Berechnungsergebnis. Nur zur Orientierung, ersetzt nicht die
                            eigenständige Prüfung anhand der Tabelle oben. */}
                        <button
                          onClick={() => setRechnerOffen((v) => !v)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: 9,
                            border: "1px dashed var(--border)",
                            background: "transparent",
                            color: "var(--text-muted)",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            marginBottom: rechnerOffen ? 10 : 0,
                          }}
                        >
                          <span>{rechnerOffen ? "Rechner ausblenden" : "Rechner anzeigen (nur zur Orientierung)"}</span>
                          <ChevronDown size={13} style={{ transform: rechnerOffen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                        </button>

                        {rechnerOffen && (
                        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, marginBottom: 4 }}>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.4 }}>
                          Automatisch berechnet aus Gewicht ({gewicht} kg) — kein Ersatz für die Tabelle oben, nur Rechenhilfe.
                        </div>
                        <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>
                              {m.modus === "kg_gramm" ? "MENGE" : m.einheitML ? "VOLUMEN (fraktioniert)" : "DOSIS"}
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: m.farbe }}>
                              {m.modus === "kg_gramm"
                                ? `${round(ergebnisM.mg / 1000, 1)} g`
                                : m.einheitIE
                                ? `${ergebnisM.mg} IE`
                                : m.einheitML
                                ? `${ergebnisM.mg} ml`
                                : `${ergebnisM.mg} mg`}
                            </div>
                          </div>
                          {!m.einheitML && (
                          <div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>VOLUMEN</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700 }}>
                              {ergebnisM.ml} ml
                            </div>
                          </div>
                          )}
                        </div>
                        </div>
                        )}

                        {m.kontraindikationen && m.kontraindikationen.length > 0 && (
                          <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                              <ShieldAlert size={13} color="#F87171" />
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#F87171", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                Kontraindikationen
                              </span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 5 }}>
                              {m.kontraindikationen.map((k, i) => (
                                <li key={i} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                  {k}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ===================== TAB: PÄDIATRIE ===================== */}
        {tab === "kinder" && (
          <div>
            <div
              style={{
                display: "flex",
                gap: 10,
                background: "var(--warn-bg)",
                border: "1px solid var(--warn-border)",
                borderRadius: 10,
                padding: "10px 12px",
                marginBottom: 16,
              }}
            >
              <AlertTriangle size={16} color="#FBBF24" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: "var(--warn-text)", margin: 0, lineHeight: 1.5 }}>
                Generische pädiatrische Referenzwerte (Broselow-artiges Konzept, stetig
                interpoliert) — ungeprüfte Demo-Werte, kein Ersatz für Fachinformation/
                Trainingsmaterial.
              </p>
            </div>

            {/* Werte-Anzeige */}
            <div
              style={{
                background: "var(--card)",
                border: `2px solid ${PEDIATRIE_ZONEN[Math.round(zonePos)].hex}`,
                borderRadius: 16,
                padding: "20px 20px 22px",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em" }}>ALTER</div>
                  <div style={{ fontSize: 22, fontWeight: 800, marginTop: 3, lineHeight: 1.15 }}>
                    {formatAlter(interpNum(zonePos, "alterMonate", 1))}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em" }}>GEWICHT</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, marginTop: 3 }}>
                    {interpNum(zonePos, "gewicht", 0.5)} kg
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em" }}>GRÖSSE</div>
                  <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                    ≈ {interpNum(zonePos, "groesseCm", 1)} cm
                  </div>
                </div>
              </div>

              {/* Farbschieber — flüssig ziehbar */}
              <div style={{ position: "relative", padding: "14px 0 6px" }}>
                <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 40, pointerEvents: "none" }}>
                  {PEDIATRIE_ZONEN.map((z) => (
                    <div key={z.farbe} style={{ flex: 1, background: z.hex }} />
                  ))}
                </div>
                <input
                  type="range"
                  min={0}
                  max={PEDIATRIE_ZONEN.length - 1}
                  step={0.01}
                  value={zonePos}
                  onChange={(e) => setZonePos(Number(e.target.value))}
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 0,
                    width: "100%",
                    height: 44,
                    opacity: 0,
                    cursor: "pointer",
                    margin: 0,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: `calc(${(zonePos / (PEDIATRIE_ZONEN.length - 1)) * 100}% - 12px)`,
                    width: 24,
                    height: 52,
                    borderRadius: 8,
                    background: "var(--text)",
                    border: "3px solid var(--card)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>klein</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>ziehen zum Anpassen</span>
                <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>groß</span>
              </div>

              <button
                onClick={gewichtUebernehmen}
                style={{
                  width: "100%",
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "1px solid #FF6A3D",
                  background: uebernommen ? "rgba(52,211,153,0.15)" : "rgba(255,106,61,0.12)",
                  borderColor: uebernommen ? "#34D399" : "#FF6A3D",
                  color: uebernommen ? "#34D399" : "#FF6A3D",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ArrowRightLeft size={14} />
                {uebernommen ? "Übernommen ✓" : `${interpNum(zonePos, "gewicht", 0.5)} kg in Medikamentenrechner übernehmen`}
              </button>
            </div>

            {/* Unter-Tab-Leiste, wie im Vorbild: NORM / MAT / REA / ANA / NOT */}
            <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
              {[
                { id: "norm", label: "NORM" },
                { id: "mat", label: "MAT" },
                { id: "rea", label: "REA" },
                { id: "ana", label: "ANA" },
                { id: "not", label: "NOT" },
              ].map((ut) => {
                const active = kinderUnterTab === ut.id;
                return (
                  <button
                    key={ut.id}
                    onClick={() => setKinderUnterTab(ut.id)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: active ? "#FF6A3D" : "var(--border)",
                      background: active ? "rgba(255,106,61,0.12)" : "var(--card)",
                      color: active ? "#FF6A3D" : "var(--text-muted)",
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                      cursor: "pointer",
                    }}
                  >
                    {ut.label}
                  </button>
                );
              })}
            </div>

            {/* NORM — Vitalwerte & Bedarfsrechner */}
            {kinderUnterTab === "norm" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  {
                    label: "Herzfrequenz", einheit: "/min",
                    wert: `${interpNum(zonePos, "hfMin", 1)}-${interpNum(zonePos, "hfMax", 1)}`,
                  },
                  {
                    label: "Systolischer Blutdruck", einheit: "mmHg",
                    wert: `${interpNum(zonePos, "rrMin", 1)}-${interpNum(zonePos, "rrMax", 1)}`,
                  },
                  {
                    label: "Atemfrequenz", einheit: "/min",
                    wert: `${interpNum(zonePos, "afMin", 1)}-${interpNum(zonePos, "afMax", 1)}`,
                  },
                  {
                    label: "Atemzugvolumen", unterzeile: "6 ml/kg", einheit: "ml",
                    wert: round(interpNum(zonePos, "gewicht", 0.1) * 6, 0),
                  },
                  {
                    label: "Blutvolumen", unterzeile: "70-95 ml/kg", einheit: "ml",
                    wert: round(interpNum(zonePos, "gewicht", 0.1) * 80, 0),
                  },
                  {
                    label: "Hämoglobin", einheit: "g/l",
                    wert: `${interpNum(zonePos, "hbMin", 1)}-${interpNum(zonePos, "hbMax", 1)}`,
                  },
                  {
                    label: "Flüssigkeitsbedarf", unterzeile: "(4-2-1)-Regel", einheit: "ml/h",
                    wert: flussigkeitsbedarf(interpNum(zonePos, "gewicht", 0.1)),
                  },
                  {
                    label: "Energiebedarf", unterzeile: "(100-50-20)-Regel", einheit: "kcal/d",
                    wert: energiebedarf(interpNum(zonePos, "gewicht", 0.1)),
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      boxShadow: "var(--shadow-card)",
                      padding: "10px 14px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14.5, color: "var(--text-secondary)", fontWeight: 500 }}>{row.label}</div>
                      {row.unterzeile && (
                        <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 1 }}>{row.unterzeile}</div>
                      )}
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, whiteSpace: "nowrap" }}>
                      {row.wert}{" "}
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        {row.einheit}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* MAT — Material-Tabelle, jeder Wert live interpoliert */}
            {kinderUnterTab === "mat" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Tubus ID (ohne Cuff)", key: "tubusOhneCuff", einheit: "mm", rund: 0.5 },
                  { label: "Tubus ID (mit Cuff)", key: "tubusMitCuff", einheit: "mm", rund: 0.5 },
                  { label: "Tubustiefe (oral)", key: "tiefeOral", einheit: "cm", rund: 0.5 },
                  { label: "Tubustiefe (nasal)", key: "tiefeNasal", einheit: "cm", rund: 0.5 },
                  { label: "Larynxmaske", key: "larynxmaske", einheit: "#", rund: 0.5 },
                  { label: "I-Gel", key: "iGel", einheit: "#", rund: 0.5 },
                  { label: "Larynxtubus", key: "larynxtubus", einheit: "#", rund: 0.5 },
                  { label: "Guedel", key: "guedel", einheit: "#(cm)", rund: null },
                  { label: "Spatel Miller", key: "spatelMiller", einheit: "#", rund: 0.5 },
                ].map((row) => {
                  const nearest = Math.round(zonePos);
                  const wert =
                    row.rund === null
                      ? PEDIATRIE_ZONEN[nearest][row.key]
                      : interpNum(zonePos, row.key, row.rund);
                  return (
                    <div
                      key={row.key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        boxShadow: "var(--shadow-card)",
                        padding: "10px 14px",
                      }}
                    >
                      <span style={{ fontSize: 14.5, color: "var(--text-secondary)", fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700 }}>
                        {wert}{" "}
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                          {row.einheit}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* REA — Reanimation, Faktoren aus Nutzer-Screenshot */}
            {kinderUnterTab === "rea" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    display: "flex", gap: 8, alignItems: "center",
                    background: "var(--warn-bg)", border: "1px solid var(--warn-border)", borderRadius: 10,
                    padding: "8px 12px", marginBottom: 4,
                  }}
                >
                  <Badge tone="sop">REF</Badge>
                  <span style={{ fontSize: 11, color: "var(--warn-text)" }}>Faktoren aus deinem Screenshot übernommen — Ampullenkonzentration weiterhin ungeprüft</span>
                </div>

                {(() => {
                  const kg = interpNum(zonePos, "gewicht", 0.1);
                  const rows = [
                    { label: "Beatmung", wert: "15:2", einheit: "c/v" },
                    { label: "Herzmassage", wert: "100-120", einheit: "c/min" },
                    { label: "Kardioversion 1st/2nd", wert: `${round(kg * 1, 0)} / ${round(kg * 2, 0)} / ${round(kg * 4, 0)}`, einheit: "J", unterzeile: "1-2-4 J/kg" },
                    { label: "Defibrillation 1st/2nd", wert: round(kg * 4, 0), einheit: "J", unterzeile: "4 J/kg" },
                    ...Object.values(REA_FAKTOREN).map((m) => ({
                      label: m.label,
                      wert: round(kg * m.faktor, m.faktor < 1 ? 3 : 1),
                      einheit: m.einheit,
                      unterzeile: m.info,
                    })),
                    { label: "Magnesiumsulfat i.v./i.o.", wert: `${round(kg * 25, 0)}-${round(kg * 50, 0)}`, einheit: "mg", unterzeile: "25-50 mg/kg" },
                  ];
                  return rows.map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        boxShadow: "var(--shadow-card)",
                        padding: "10px 14px",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 14.5, color: "var(--text-secondary)", fontWeight: 500 }}>{row.label}</div>
                        {row.unterzeile && (
                          <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 1 }}>{row.unterzeile}</div>
                        )}
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {row.wert}{" "}
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                          {row.einheit}
                        </span>
                      </span>
                    </div>
                  ));
                })()}
              </div>
            )}

            {/* ANA — Anästhesie-Kategorien (nur Übersicht, keine Werte berechnet) */}
            {kinderUnterTab === "ana" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Praemedikation", info: "Angst-/Sedierungsprotokoll vor Narkose" },
                  { label: "Narkoseeinleitung", info: "Medikamente & Dosierung zur Einleitung" },
                  { label: "Perfusoren", info: "Laufraten-Berechnung für Dauerinfusionen" },
                  { label: "Regionalanaesthesie", info: "Lokalanästhetika-Höchstdosen nach Gewicht" },
                  { label: "Maligne Hyperthermie", info: "Notfall-Therapieschema (Dantrolen etc.)" },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      boxShadow: "var(--shadow-card)",
                      padding: "12px 14px",
                    }}
                  >
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{row.label}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>{row.info}</div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", marginTop: 4 }}>
                  <Info size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                    Diese Kategorien sind in der Demo noch nicht mit Werten hinterlegt — sag mir, welche
                    davon du zuerst ausgebaut haben willst.
                  </p>
                </div>
              </div>
            )}

            {/* NOT — Notfallbilder, verlinkt zu vorhandenen Algorithmen wo möglich */}
            {kinderUnterTab === "not" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Anaphylaxie", info: "→ öffnet den Anaphylaxie-Algorithmus (K9)", link: "anaphylaxie" },
                  { label: "Asthmaanfall", info: "→ öffnet Obstruktive Atemwegserkrankung Kind (K6)", link: "atemnot-kind" },
                  { label: "Blutung", info: "→ öffnet Hypovolämischer/hypervolämischer Schock (Demo-Karte, kein SOP-Inhalt)", link: "schock-volumen" },
                  { label: "Hirndruck", info: "Kein passender Algorithmus im 2026-SOP-Dokument vorhanden — nicht verlinkt" },
                  { label: "Hypoglykaemie", info: "→ öffnet Symptomatische Hypoglykämie (K8)", link: "hypoglykaemie-erw" },
                  { label: "Infektion", info: "→ öffnet Sepsis — septischer Schock (K18)", link: "sepsis" },
                  { label: "Krampfanfall", info: "→ öffnet Status epilepticus (K10)", link: "krampfanfall" },
                  { label: "Nausea", info: "→ öffnet Starke Übelkeit (K17)", link: "starke-uebelkeit" },
                  { label: "Schmerzen", info: "→ öffnet Starke Schmerzzustände (K16)", link: "schmerz-uebersicht" },
                ].map((row) => (
                  <button
                    key={row.label}
                    onClick={
                      row.link
                        ? () => {
                            setAlgoRegion("darmstadt");
                            setTab("algorithmen");
                            setOpenAlgo(row.link);
                            setAlgoPinned(true);
                            scrollToTop();
                          }
                        : undefined
                    }
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "left",
                      width: "100%",
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      boxShadow: "var(--shadow-card)",
                      padding: "12px 14px",
                      cursor: row.link ? "pointer" : "default",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: row.link ? "#F87171" : "var(--text)" }}>{row.label}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>{row.info}</div>
                    </div>
                    {row.link && <ChevronRight size={16} color="#F87171" style={{ flexShrink: 0 }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: METRONOM ===================== */}
        {tab === "metronom" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                boxShadow: "var(--shadow-card)",
                padding: 18,
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                <Music2 size={17} color="#FF6A3D" strokeWidth={2.25} />
                <span style={{ fontSize: 15, fontWeight: 700 }}>CPR-Metronom</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 16 }}>
                SOP-Zielbereich Thoraxkompression: 100–120/min
              </div>

              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  border: "3px solid #FF6A3D",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: metronomBeat ? "rgba(255,106,61,0.35)" : "rgba(255,106,61,0.08)",
                  transform: metronomBeat ? "scale(1.08)" : "scale(1)",
                  transition: "background 0.08s, transform 0.08s",
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, color: "#FF6A3D" }}>
                  {metronomBpm}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 18 }}>
                <button
                  onClick={() => setMetronomBpm((b) => Math.max(60, b - 5))}
                  style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid var(--border)", background: "var(--card-active)", color: "var(--text)", fontSize: 18, fontWeight: 700, cursor: "pointer" }}
                >
                  −
                </button>
                <span style={{ fontSize: 12.5, color: "var(--text-muted)", minWidth: 70 }}>Schläge/min</span>
                <button
                  onClick={() => setMetronomBpm((b) => Math.min(160, b + 5))}
                  style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid var(--border)", background: "var(--card-active)", color: "var(--text)", fontSize: 18, fontWeight: 700, cursor: "pointer" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => setMetronomLaeuft((l) => !l)}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 10,
                  border: "1px solid #FF6A3D",
                  background: metronomLaeuft ? "rgba(239,68,68,0.15)" : "#FF6A3D",
                  borderColor: metronomLaeuft ? "#EF4444" : "#FF6A3D",
                  color: metronomLaeuft ? "#EF4444" : "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {metronomLaeuft ? <Pause size={15} /> : <Play size={15} />}
                {metronomLaeuft ? "Stopp" : "Start"}
              </button>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.4 }}>
                Ton benötigt einen ersten Tap auf „Start" (Browser-Vorgabe). Bei stummgeschaltetem Gerät
                bleibt die visuelle Pulsanzeige als Taktgeber nutzbar.
              </div>
            </div>

            <TapZaehler titel="Atemfrequenz" einheit="Atemzüge/min" farbe="#60A5FA" Icon={Wind} normMin={12} normMax={20} warnMin={8} warnMax={24} dauerOptionen={[30, 60]} />
            <TapZaehler titel="Herzfrequenz" einheit="Schläge/min" farbe="#F87171" Icon={HeartPulse} normMin={60} normMax={100} warnMin={50} warnMax={120} />
          </div>
        )}

        {/* ===================== TAB: EKG ===================== */}
        {tab === "ekg" && (
          <div>
            <div
              style={{
                display: "flex",
                gap: 10,
                background: "var(--warn-bg)",
                border: "1px solid var(--warn-border)",
                borderRadius: 10,
                padding: "10px 12px",
                marginBottom: 16,
              }}
            >
              <AlertTriangle size={16} color="#FBBF24" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: "var(--warn-text)", margin: 0, lineHeight: 1.5 }}>
                Die Kurven sind eigene, schematische Illustrationen zur Veranschaulichung —
                keine echten Patienten-EKGs. Symptome und Zielbehandlung sind allgemeines
                Lehrbuchwissen — kein Ersatz für Leitlinien, Fachinformation oder die SOPs
                deines Rettungsdienstbereichs. Die Interpretation eines EKGs bleibt immer
                deine ärztliche/fachliche Entscheidung.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {EKG_BILDER.map((e) => (
                <div
                  key={e.id}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    boxShadow: "var(--shadow-card)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: "10px 10px 6px" }}>
                    <EkgStrip opts={e.ekgOpts} farbe={e.ekgFarbe} />
                    <div style={{ fontSize: 9.5, color: "#94A3B8", marginTop: 4, textAlign: "right" }}>
                      Schematische Darstellung
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{e.titel}</div>

                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.04em", marginBottom: 4 }}>
                      SYMPTOME
                    </div>
                    <ul style={{ margin: "0 0 10px", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                      {e.symptome.map((s, i) => (
                        <li key={i} style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                          {s}
                        </li>
                      ))}
                    </ul>

                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#34D399", letterSpacing: "0.04em", marginBottom: 4 }}>
                      ZIELBEHANDLUNG PRÄKLINISCH
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                      {e.zielbehandlung.map((z, i) => (
                        <li key={i} style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                          {z}
                        </li>
                      ))}
                    </ul>

                    {e.algoLink && (
                      <button
                        onClick={() => {
                          // Gleicher Fix wie bei REA: ohne Rückstellung auf
                          // "darmstadt" bliebe die Karte unsichtbar, falls
                          // gerade "Hessen" (noch leer) ausgewählt ist.
                          setAlgoRegion("darmstadt");
                          setTab("algorithmen");
                          setOpenAlgo(e.algoLink);
                          setAlgoPinned(true);
                          scrollToTop();
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          width: "100%",
                          marginTop: 12,
                          padding: "9px 0",
                          borderRadius: 9,
                          border: "1px solid #FF6A3D",
                          background: "rgba(255,106,61,0.1)",
                          color: "#FF6A3D",
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Zum Algorithmus <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: ALGORITHMEN ===================== */}
        {tab === "algorithmen" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Regionsauswahl: Hessen vs. Darmstadt/Darmstadt-Dieburg/Bergstraße/Groß-Gerau */}
            <div
              style={{
                display: "flex",
                gap: 8,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-card)",
                padding: 6,
                marginBottom: 4,
              }}
            >
              {[
                { id: "darmstadt", label: "Bergstraße/Darmstadt/Darmstadt-Dieburg/Groß-Gerau", flex: 3, farbe: "#FBBF24" },
                { id: "hessen", label: "Hessen", flex: 1, farbe: "#14B8A6" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAlgoRegion(r.id)}
                  style={{
                    flex: r.flex,
                    padding: "9px 6px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: algoRegion === r.id ? r.farbe : "transparent",
                    background: algoRegion === r.id ? `${r.farbe}1F` : "transparent",
                    color: algoRegion === r.id ? r.farbe : "var(--text-muted)",
                    fontSize: 10,
                    lineHeight: 1.3,
                    fontWeight: 700,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Einmalige Hinweis-Meldung — poppt nur beim ersten Öffnen des Tabs auf */}
            {!algoInfoSeen && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  boxShadow: "var(--shadow-card)",
                  padding: "12px 14px",
                }}
              >
                <Info size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                    Die meisten Algorithmen (markiert „SOP") basieren auf den
                    2026er-Algorithmen für Bergstraße/Darmstadt/Darmstadt-Dieburg/
                    Groß-Gerau (Stand 31.01.2026). Das SOP-Dokument enthält weitere
                    Algorithmen (u. a. K2, K15–K20, P1–P5, V1–V3), die noch nicht in
                    dieser App abgebildet sind.
                  </p>
                  <button
                    onClick={() => setAlgoInfoSeen(true)}
                    style={{
                      marginTop: 8,
                      padding: "6px 14px",
                      borderRadius: 7,
                      border: "1px solid var(--border)",
                      background: "var(--card-active)",
                      color: "var(--text)",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Verstanden
                  </button>
                </div>
              </div>
            )}

            {algoRegion === "hessen" && ALGORITHMEN_HESSEN.length === 0 && (
              <div
                style={{
                  background: "var(--card)",
                  border: "1px dashed var(--border)",
                  borderRadius: 14,
                  padding: 18,
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                  Hessen-Algorithmen sind noch nicht hinterlegt. Sobald du die
                  Hessen-Landesalgorithmen hochlädst, erscheinen sie hier.
                </p>
              </div>
            )}

            {[...(algoRegion === "hessen" ? ALGORITHMEN_HESSEN : ALGORITHMEN)].sort((a, b) => {
              if (!algoPinned) return 0;
              if (a.id === openAlgo) return -1;
              if (b.id === openAlgo) return 1;
              return 0;
            }).map((a) => {
              const open = openAlgo === a.id;
              return (
                <div
                  key={a.id}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    boxShadow: "var(--shadow-card)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => {
                      setOpenAlgo(open ? null : a.id);
                      setAlgoPinned(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 16px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3, flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ width: 8, height: 8, borderRadius: 99, background: a.farbe, flexShrink: 0 }} />
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{a.titel}</span>
                        {a.quelle === "sop" && <Badge tone="sop" bgOverride={sopBadgeFarbe(a.titel, algoRegion)}>SOP</Badge>}
                      </div>
                      {a.stand && (
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 18 }}>
                          Bgs · Da · DaDi · GG — Stand {a.stand} ({a.version})
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      size={16}
                      color="var(--text-muted)"
                      style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}
                    />
                  </button>
                  {open && (
                    <div style={{ padding: "0 16px 16px" }}>
                      {a.medikamente && a.medikamente.length > 0 && (
                        <div
                          style={{
                            background: "#FEF9C3",
                            border: "2px solid #EAB308",
                            borderRadius: 12,
                            padding: "12px 14px",
                            marginBottom: 14,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <ShieldAlert size={14} color="#92400E" />
                            <span style={{ fontSize: 11.5, fontWeight: 800, color: "#92400E", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                              Medikamente für {istKind ? "Kind" : "Erwachsene"} ({gewicht} kg)
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {a.medikamente.map((eintrag) => {
                              const m = MEDIKAMENTE_AKTIV.find((x) => x.id === eintrag.id);
                              if (!m) return null;
                              const erg = berechneDosis(m, gewicht, istKind);
                              return (
                                <div
                                  key={eintrag.id}
                                  style={{
                                    background: "#FFFBEB",
                                    border: "1px solid #FDE68A",
                                    borderRadius: 8,
                                    padding: "8px 10px",
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: "#78350F", display: "flex", alignItems: "center", gap: 5 }}>
                                        {m.name}
                                        {!m.ampulleGeprueft && (
                                          <ShieldAlert size={12} color="#B45309" title="Ampulle/Konzentration ungeprüft" />
                                        )}
                                      </div>
                                      <div style={{ fontSize: 10.5, color: "#92400E" }}>{m.konzentration}</div>
                                    </div>
                                    <div
                                      style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 17,
                                        fontWeight: 800,
                                        color: "#78350F",
                                        textAlign: "right",
                                      }}
                                    >
                                      {m.einheitIE ? `${erg.mg} IE` : m.einheitML ? `${erg.mg} ml` : `${erg.mg} mg`}
                                      {!m.einheitML && <div style={{ fontSize: 12, fontWeight: 600 }}>{erg.ml} ml</div>}
                                    </div>
                                  </div>
                                  {eintrag.wann && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 5,
                                        marginTop: 6,
                                        paddingTop: 6,
                                        borderTop: "1px solid #FDE68A",
                                      }}
                                    >
                                      <span style={{ fontSize: 12, flexShrink: 0 }}>⏱</span>
                                      <span style={{ fontSize: 11.5, color: "#92400E", fontWeight: 600, lineHeight: 1.4 }}>
                                        {eintrag.wann}
                                      </span>
                                    </div>
                                  )}
                                  <button
                                    onClick={() =>
                                      medikamentGeben(
                                        m.name,
                                        m.einheitIE ? `${erg.mg} IE` : m.einheitML ? `${erg.mg} ml` : `${erg.mg} mg`,
                                        `${erg.ml} ml`
                                      )
                                    }
                                    style={{
                                      width: "100%",
                                      marginTop: 8,
                                      padding: "7px 0",
                                      borderRadius: 7,
                                      border: "1px solid #92400E",
                                      background: "#92400E",
                                      color: "#FFFBEB",
                                      fontSize: 12,
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    ✓ Jetzt gegeben — protokollieren
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ fontSize: 10, color: "#92400E", marginTop: 8, lineHeight: 1.4 }}>
                            Gewicht aus dem Medikamente-Tab übernommen — bei Kindern vor Gabe unbedingt prüfen/anpassen (z. B. über den Pädiatrie-Tab).
                          </div>
                        </div>
                      )}
                      {reaLog.length > 0 && (
                        <div
                          style={{
                            background: "var(--card-active)",
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            padding: "10px 12px",
                            marginBottom: 14,
                          }}
                        >
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.04em", marginBottom: 6 }}>
                            PROTOKOLL DIESES EINSATZES
                          </div>
                          {reaLog.map((e, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 8,
                                fontSize: 12,
                                color: "var(--text-secondary)",
                                lineHeight: 1.6,
                              }}
                            >
                              <span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#22C55E" }}>{e.zeit}</span> — {e.name}: {e.dosisText} ({e.mlText})
                              </span>
                              <button
                                onClick={() => reaLogEintragLoeschen(i)}
                                title="Eintrag löschen"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 22,
                                  height: 22,
                                  flexShrink: 0,
                                  borderRadius: 6,
                                  border: "1px solid var(--border)",
                                  background: "transparent",
                                  color: "var(--text-muted)",
                                  cursor: "pointer",
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {a.bildUrl ? (
                        <img
                          src={a.bildUrl}
                          alt={`Original-Seite: ${a.titel}`}
                          style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", display: "block" }}
                        />
                      ) : (
                        <div
                          style={{
                            background: "var(--card)",
                            border: "1px dashed var(--border)",
                            borderRadius: 12,
                            padding: 20,
                            textAlign: "center",
                          }}
                        >
                          <Info size={18} color="var(--text-muted)" style={{ marginBottom: 8 }} />
                          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                            Original-Seite als Bild noch nicht hinterlegt.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        )}

        {/* ===================== TAB: MANV ===================== */}
        {tab === "manv" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                background: "var(--warn-bg)",
                border: "1px solid var(--warn-border)",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <AlertTriangle size={16} color="#FBBF24" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: "var(--warn-text)", margin: 0, lineHeight: 1.5 }}>
                Verbindlich ist das Original-Bild unten, nicht ein zusammengefasster Text. Vorsichtung
                nach Grundregeln: Sichtungsteams bilden, max. 60 Sek. pro Patient, im Zweifel höher einstufen.
              </p>
            </div>

            {ALGORITHMEN.filter((a) => a.id === "v3a-vorsichtung-prior" || a.id === "v3b-vorsichtung-mstart").map((a) => (
              <div
                key={a.id}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 16,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 99, background: a.farbe, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{a.titel}</span>
                  {a.quelle === "sop" && <Badge tone="sop" bgOverride={sopBadgeFarbe(a.titel, algoRegion)}>SOP</Badge>}
                </div>
                {a.stand && (
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 16, marginBottom: 10 }}>
                    Bgs · Da · DaDi · GG — Stand {a.stand} ({a.version})
                  </div>
                )}
                {a.bildUrl && (
                  <img
                    src={a.bildUrl}
                    alt={`Original-Seite: ${a.titel}`}
                    style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", display: "block" }}
                  />
                )}
              </div>
            ))}

            <button
              onClick={() => {
                setAlgoRegion("darmstadt");
                setTab("algorithmen");
                setOpenAlgo("v1a-bleibt-vor-ort-welcher-fall");
                setAlgoPinned(true);
                scrollToTop();
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "12px 14px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>Verwandt: Patient bleibt vor Ort (V1a/V1b)</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>
                  Relevant für Nachsichtung/Entscheidung bei Grün-Patienten
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </button>
          </div>
        )}

        {/* Fußzeile */}
        <div
          style={{
            textAlign: "center",
            marginTop: 28,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, lineHeight: 1.6, fontWeight: 400 }}>
            Entwickelt durch NotSan und RettSan.
          </p>
          <p style={{ fontSize: 12, color: "var(--text)", margin: "4px 0 0", lineHeight: 1.6, fontWeight: 800 }}>
            Demo-Prototyp — kein zertifiziertes Medizinprodukt.
          </p>
          <p style={{ fontSize: 9.5, color: "var(--text-muted)", margin: "8px 0 0", lineHeight: 1.4 }}>
            Version 2026-08-18
          </p>
          <button
            onClick={() => setImpressumOffen(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 10.5,
              textDecoration: "underline",
              marginTop: 10,
              cursor: "pointer",
              padding: 4,
            }}
          >
            Impressum / Kontakt
          </button>
        </div>

        {/* Trauma-Referenz-Dialog — bewusst optisch klar anders als SOP-Karten */}
        {traumaOffen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(11,18,32,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
              padding: 20,
              overflowY: "auto",
            }}
            onClick={() => setTraumaOffen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 440,
                maxHeight: "85vh",
                overflowY: "auto",
                background: "var(--card-active)",
                border: `2px solid ${TRAUMA_REFERENZ.farbe}`,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  color: TRAUMA_REFERENZ.farbe,
                  background: `${TRAUMA_REFERENZ.farbe}22`,
                  border: `1px solid ${TRAUMA_REFERENZ.farbe}`,
                  borderRadius: 6,
                  padding: "3px 8px",
                  marginBottom: 10,
                }}
              >
                EXTERNE QUELLE — KEIN SOP-INHALT
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{TRAUMA_REFERENZ.titel}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 4, lineHeight: 1.4 }}>
                {TRAUMA_REFERENZ.quelleName}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.4 }}>
                {TRAUMA_REFERENZ.quelleDetail}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {TRAUMA_REFERENZ.punkte.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 12.5,
                      lineHeight: 1.55,
                      color: "var(--text)",
                    }}
                  >
                    <span style={{ color: TRAUMA_REFERENZ.farbe, fontWeight: 700, flexShrink: 0 }}>•</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setTraumaOffen(false)}
                style={{
                  width: "100%",
                  marginTop: 18,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Schließen
              </button>
            </div>
          </div>
        )}

        {/* Impressum-Dialog */}
        {impressumOffen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(11,18,32,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
              padding: 20,
            }}
            onClick={() => setImpressumOffen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 380,
                background: "var(--card-active)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Impressum / Kontakt</div>
              <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 10px" }}>
                Privates, nicht-kommerzielles Ausbildungs-/Demo-Projekt von Rettungsdienst-
                Personal für Rettungsdienst-Personal. Kein Angebot an die breite Öffentlichkeit.
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 10px" }}>
                Kontakt: <a href="mailto:shinsetso@googlemail.com" style={{ color: "#FF6A3D" }}>shinsetso@googlemail.com</a>
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                Hinweis: Dies ist ein vereinfachter Kontaktnachweis, kein vollständiges
                Impressum nach § 5 TDDDG (u. a. ohne ladungsfähige Anschrift), da die App
                bewusst nicht öffentlich beworben und nur über direkten Link geteilt wird.
              </p>
              <button
                onClick={() => setImpressumOffen(false)}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Schließen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RettungsdienstDemo() {
  const [eingeloggt, setEingeloggt] = useState(true);
  if (!eingeloggt) {
    return <AuthForm onAuthenticated={() => setEingeloggt(true)} />;
  }
  return (
    <RettungsdienstDemoInner
      session={{ user: { id: "vorschau" } }}
      onLogout={() => setEingeloggt(false)}
    />
  );
}
