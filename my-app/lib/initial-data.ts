import { Place, Review, Report, UserProfile } from "./types";
import { BASELINE_KRAKOW_PLACES } from "./baseline-places";

export const DEMO_USERS: UserProfile[] = [
  {
    id: "user-1",
    name: "Marta Kowalska",
    email: "marta@krakow.pl",
    role: "user",
    roleLabel: "Mieszkaniec / Tester Dostępności",
    initials: "MK",
    badge: "Strażnik Dostępności",
    points: 340,
  },
  {
    id: "owner-1",
    name: "Jan Nowak",
    email: "biuro@zarzadca.pl",
    role: "owner",
    roleLabel: "Właściciel Obiektu",
    initials: "JN",
    badge: "Zarządca Certyfikowany",
    points: 120,
    ownedPlaceIds: ["owner-zgloszenie-1", "mcdonalds-rynek", "teatr-slowackiego"],
  },
  {
    id: "admin-1",
    name: "Aleksandra Wiśniewska",
    email: "admin@krakow-dostepny.pl",
    role: "admin",
    roleLabel: "Administrator Miejski",
    initials: "AW",
    badge: "Oficer Dostępności Urzędu Miasta",
    points: 980,
  },
];

export const ACCESSIBILITY_CATALOG = [
  { id: "bezprogowe", label: "Wejście bezprogowe (poziom 0)", category: "Ruchowa", icon: "door-open" },
  { id: "podjazd", label: "Podjazd / rampa z poręczami", category: "Ruchowa", icon: "accessibility" },
  { id: "winda", label: "Winda dostosowana do wózków", category: "Ruchowa", icon: "arrow-up-down" },
  { id: "toaleta", label: "Toaleta przystosowana (z uchwytami)", category: "Ruchowa", icon: "bath" },
  { id: "szerokie_przejscia", label: "Szerokie ciągi komunikacyjne (min. 120 cm)", category: "Ruchowa", icon: "maximize" },
  { id: "parking", label: "Dedykowany parking dla niepełnosprawnych", category: "Ruchowa", icon: "car" },
  { id: "indukcyjna", label: "Pętla indukcyjna (strefa obsługi / sala)", category: "Słuchowa", icon: "volume-2" },
  { id: "pjm", label: "Obsługa w Polskim Języku Migowym (PJM)", category: "Słuchowa", icon: "languages" },
  { id: "napisy", label: "Napisy dla niesłyszących / transkrypcja", category: "Słuchowa", icon: "message-square" },
  { id: "audio", label: "Audiodeskrypcja (menu / przewodnik)", category: "Wzrokowa", icon: "headphones" },
  { id: "braille", label: "Oznaczenia w alfabecie Braille'a", category: "Wzrokowa", icon: "eye" },
  { id: "sciezki", label: "Ścieżki dotykowe i linie naprowadzające", category: "Wzrokowa", icon: "footprints" },
  { id: "pies", label: "Przyjazne dla psa przewodnika / asystującego", category: "Wzrokowa", icon: "heart-handshake" },
  { id: "ciche_godziny", label: "Ciche godziny / strefa wyciszenia sensorycznego", category: "Sensoryczna", icon: "volume-x" },
  { id: "miejsca_odpoczynku", label: "Miejsca siedzące do odpoczynku", category: "Ogólna", icon: "armchair" },
];

// Real authentic Kraków places with chains & landmark institutions
export const INITIAL_PLACES: Place[] = BASELINE_KRAKOW_PLACES;

// Fresh empty list of reviews and reports as requested
export const INITIAL_REVIEWS: Review[] = [];

export const INITIAL_REPORTS: Report[] = [];
