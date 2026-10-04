# MapaBezBarier(Kraków) · HackYeah 2026

> **Społecznościowa platforma mapowania i weryfikacji dostępności architektonicznej oraz sensorycznej obiektów w Krakowie.**
> Tworzona z myślą o osobach z niepełnosprawnościami (ruchową, wzrokową, słuchową) oraz ze szczególnymi potrzebami sensorycznymi.

---

## Główne Założenia Projektu

1. **Interaktywny Lokalizator Miejsc (OpenStreetMap + OpenLayers)**:
   - Wyszukiwanie i badanie obiektów na mapie bez zbędnego routingu – mapa służy do odkrywania miejsc i badania ich barier architektonicznych.
   - Oficjalne podkłady kafelkowe OpenStreetMap (pełna zgodność z licencją ODbL i wymaganą atrybucją).
   - Lekka biblioteka mapowa **OpenLayers (`ol`)** na licencji BSD-2-Clause.
   - **Dynamiczne poziomy szczegółowości (Zoom LOD):** Na widoku ogólnym (Zoom < 15) wyświetlane są kluczowe, certyfikowane punkty miejskie z zachowaniem odstępów. Przy przybliżaniu (Zoom ≥ 15, scrollowanie kółkiem myszy) ujawniają się wszystkie lokalne obiekty w danym kwartale ulic.
   - **Kompaktowe pinezki bez kolizji:** Zwykłe punkty to estetyczne, 28-pikselowe okrągłe znaczniki kodowane kolorystycznie według kategorii z etykietą po najechaniu kursorem. Zaznaczony obiekt wyróżnia się powiększoną, pulsującą plakietką.

2. **Pobieranie Danych Real-Time z Otwartych Źródeł (OpenStreetMap Overpass API)**:
   - Live scraper w endpointzie Next.js (`/api/places`) łączący się z serwerami Overpass QL.
   - **Buforowanie i zgodność z polityką serwerów OSM:** Wbudowany in-memory server cache z czasem życia 12 godzin (TTL) oraz dedykowany nagłówek `User-Agent`, zapobiegający limitom zapytań (błędy 429).
   - Filtrowanie obiektów dla 4 kluczowych kategorii w Krakowie:
     - **Restauracje i Gastronomia:** McDonald's, KFC, Costa Coffee, Kawiarnia Bunkier Sztuki, Pasaż Bielaka, bistra i kawiarnie studyjne.
     - **Kultura i Rozrywka:** Teatr im. J. Słowackiego, Muzeum Narodowe, Teatr Bagatela, Teatr Groteska, Zamek Królewski na Wawelu, Kino Pod Baranami.
     - **Sport i Rekreacja:** OSiR Kolna, Com-Com Zone Nowa Huta, Park Wodny Kraków, Pływalnia KS Korona.
     - **Zdrowie i Urzędy:** Szpital Uniwersytecki w Prokocimiu, Centrum Medyczne Ujastek, Urząd Miasta Krakowa, apteki sieciowe (Dr. Max, Słoneczna).
   - Odczytywanie tagów dostępności mikromapowania OSM: `wheelchair`, `hearing_loop`, `toilets:wheelchair`, `blind`, `door:width` oraz adresów.

3. **System Weryfikacji Miejskiej i Metryka Dostępności**:
   - **Świeże dane nie są certyfikowane automatycznie:** Każde miejsce zaciągnięte ze scrapera OSM lub dodane przez użytkownika otrzymuje status `verificationStatus: "oczekuje"`.
   - Trafia do kolejki weryfikacyjnej audytora miejskiego w Panelu Administracyjnym.
   - **Metryka dostępności:** Każdy obiekt przechowuje szczegółowe wpisy pomiarowe (próg w cm, szerokość skrzydła drzwi, parametry windy, audytor, źródło i stopień wiarygodności).

4. **Wyszukiwarka Słów Kluczowych (Tagi)**:
   - Każde miejsce posiada zestaw kontekstowych tagów (np. `spektakl`, `teatr`, `burger`, `fast-food`, `basen`, `lekarz`).
   - Wyszukiwarka na stronie głównej automatycznie dopasowuje wyniki na podstawie nazwy, adresu, kategorii oraz słów kluczowych.

5. **Przeglądanie Progresywne (Katalog ze Scrollem)**:
   - Komponent katalogu pod mapą prezentuje pierwsze 6 obiektów na pierwszy rzut oka, umożliwiając ładowanie kolejnych w miarę przewijania strony w dół.
   - Przycisk „Pokaż na mapie” przy każdym obiekcie automatycznie centruje widok mapy i aktywuje dany punkt.

6. **Dedykowane Panele Użytkowników**:
   - **Panel Mieszkańca:** zgłaszanie barier architektonicznych, wystawianie opinii, zbieranie punktów zaangażowania (grywalizacja) i zdobywanie odznak weryfikatora.
   - **Panel Właściciela Obiektu:** deklaracja cech dostępności (audyt), oficjalne odpowiedzi na opinie klientów, edycja wizytówki i generowanie Certyfikatu Dostępności 2026.
   - **Panel Administratora Miejskiego:** kolejka moderacyjna zgłoszeń, zatwierdzanie weryfikacji terenowych z opcją „Pokaż na mapie”, moderacja opinii i rejestr obiektów.

7. **Pełna Dostępność Cyfrowa (WCAG 2.1 AA / AAA)**:
   - Przełącznik wysokiego kontrastu (czarne tło + żółty tekst).
   - Skalowanie wielkości tekstu (AA, A+, A++).
   - Ścisła zasada braku emotikonów – wyłącznie semantyczne ikony SVG z biblioteki Lucide React.
   - Obsługa pętli indukcyjnych, tłumacza Polskiego Języka Migowego (PJM), audiodeskrypcji i cichych godzin.

---

## Stos Technologiczny

| Warstwa | Technologia | Licencja |
|---|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) | MIT |
| **UI Library** | React 19 + TypeScript 5 | MIT |
| **Style** | Tailwind CSS v4 + Shadcn UI | MIT |
| **Mapa** | OpenLayers (`ol`) | BSD-2-Clause |
| **Dane kartograficzne** | OpenStreetMap | ODbL 1.0 |
| **Geokodowanie** | Nominatim OpenStreetMap | ODbL |
| **Ikony** | Lucide React | ISC |
| **Uwierzytelnianie** | Better-Auth + Better-SQLite3 | Apache 2.0 / MIT |
| **Baza danych** | SQLite (`data/app.db`) | Public Domain |
| **Menedżer pakietów** | pnpm / npm | MIT |

---

## Uruchomienie Projektu

### Wymagania:
* Node.js >= 20.x
* pnpm lub npm

### Krok po kroku:

1. **Wejście do katalogu projektu**:
   ```bash
   cd my-app
   ```

2. **Instalacja zależności**:
   ```bash
   npm install
   # lub: pnpm install
   ```

3. **Uruchomienie serwera deweloperskiego**:
   ```bash
   npm run dev
   # lub: pnpm run dev
   ```
   Aplikacja będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

4. **Budowanie produkcyjne i weryfikacja typów**:
   ```bash
   npm run build
   npm run start
   ```

---

## Struktura Katalogów

```
my-app/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts       # Autentykacja Better-Auth
│   │   ├── geocode/route.ts             # Geokodowanie adresów przez Nominatim OSM
│   │   └── places/route.ts              # Live Scraper Overpass API z buforem 12h
│   ├── components/
│   │   ├── admin-panel/                 # Zmodularyzowany panel administratora miejskiego
│   │   │   ├── AdminMetricsGrid.tsx     # Statystyki i wskaźniki weryfikacji
│   │   │   ├── AdminOwnerVerificationQueue.tsx # Kolejka zgłoszeń obiektów
│   │   │   ├── AdminPlacesRegistry.tsx  # Pełny rejestr z przyciskiem "Pokaż na mapie"
│   │   │   ├── AdminReportsModeration.tsx # Moderacja zgłoszeń barier
│   │   │   └── AdminReviewsModeration.tsx # Moderacja opinii
│   │   ├── auth/
│   │   │   └── AuthModal.tsx            # Modal logowania i szybkiego przełączania ról demo
│   │   ├── home/                        # Zmodularyzowana strona główna
│   │   │   ├── CategoryGrid.tsx         # Kafelki 4 głównych kategorii
│   │   │   ├── HeroSearch.tsx           # Wyszukiwarka z filtrami cech
│   │   │   ├── HomeView.tsx             # Główny widok eksploracji
│   │   │   ├── MapSection.tsx           # Sekcja mapy i karty obiektu
│   │   │   ├── PlaceDetailsCard.tsx     # Karta obiektu ze źródłami pomiarów i tagami
│   │   │   └── PlacesScrollSection.tsx  # Progresywny katalog obiektów ze scrollem
│   │   ├── owner-panel/                 # Zmodularyzowany panel właściciela
│   │   │   ├── OwnerNewPlaceForm.tsx    # Rejestracja nowego lokalu
│   │   │   ├── OwnerPlaceAuditCard.tsx  # Deklaracja cech i certyfikat
│   │   │   └── OwnerPlacesList.tsx      # Lista zarządzanych lokali
│   │   ├── user-panel/                  # Zmodularyzowany panel mieszkańca
│   │   │   ├── UserMyReportsList.tsx    # Zgłoszone bariery użytkownika
│   │   │   ├── UserMyReviewsList.tsx    # Wystawione opinie
│   │   │   ├── UserReportBarrierForm.tsx# Formularz zgłaszania barier
│   │   │   └── UserStatsOverview.tsx    # Punkty i odznaki weryfikatora
│   │   ├── AdminPanel.tsx               # Wrapper panelu admina
│   │   ├── Footer.tsx                   # Stopka aplikacji
│   │   ├── Navbar.tsx                   # Pasek nawigacji z dostępem zależnym od roli
│   │   ├── OwnerPanel.tsx               # Wrapper panelu właściciela
│   │   ├── QuickVerifyModal.tsx         # Szybka weryfikacja cech w terenie
│   │   ├── ReviewForm.tsx               # Dodawanie opinii i ocen gwiazdkowych
│   │   └── UserPanel.tsx                # Wrapper panelu użytkownika
│   ├── globals.css                      # Importy Tailwind v4 i OpenLayers CSS
│   ├── layout.tsx                       # Root layout z opakowaniem AppProvider
│   ├── page.tsx                         # Główny kontroler widoków i uprawnień
│   └── providers.tsx                    # Dostawca kontekstu stanu
├── components/
│   ├── AccessibilityIcon.tsx            # Semantyczny mapper ikon Lucide dla cech dostępności
│   ├── OSMMap.tsx                       # Mapa OpenLayers z poziomami LOD i pinezkami bez kolizji
│   └── ui/                              # Komponenty UI (Button, Badge, Card)
├── lib/
│   ├── app-context.tsx                  # Globalny stan React Context (miejsca, opinie, nawigacja)
│   ├── baseline-places.ts               # Baza referencyjna krakowskich obiektów wraz z tagami
│   ├── initial-data.ts                  # Katalog cech dostępności i profile demo
│   └── types.ts                         # Typy i interfejsy TypeScript (Place, AccessibilityItem, itp.)
├── PLACES.md                            # Zestawienie linków OpenStreetMap i Overpass Turbo
└── package.json
```

---

## Profile Testowe (1-Click Demo)

W oknie logowania lub menu użytkownika można jednym kliknięciem przełączać role:

1. **Marta Kowalska** (`user`) – Mieszkaniec / Tester Dostępności (340 pkt)
2. **Jan Nowak** (`owner`) – Właściciel Obiektu (zarządza m.in. McDonald's Rynek, Teatr Słowackiego)
3. **Aleksandra Wiśniewska** (`admin`) – Oficer Dostępności Urzędu Miasta Krakowa (980 pkt)

---

## Licencje i Prawa Autorskie

* **Dane kartograficzne**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, licencjonowane na warunkach Open Database License (ODbL 1.0).
* **Biblioteka mapowa**: OpenLayers (BSD-2-Clause).
* **Ikony**: Lucide React (ISC).
* **Kod źródłowy**: Projekt przygotowany w ramach HackYeah 2026.
