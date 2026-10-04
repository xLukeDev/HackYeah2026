# MapaBezBarier(Kraków) · HackYeah 2026

> **Społecznościowa platforma mapowania i weryfikacji dostępności architektonicznej oraz sensorycznej obiektów w Krakowie.**
> Tworzona z myślą o osobach z niepełnosprawnościami (ruchową, wzrokową, słuchową) oraz ze szczególnymi potrzebami sensorycznymi.

> [!IMPORTANT]
> **Zastrzeżenie dotyczące poprawności danych:**
> Dane prezentowane w platformie pochodzą z otwartych zasobów społecznościowych OpenStreetMap oraz zgłoszeń mieszkańców i właścicieli lokali. Mogą one zawierać rozbieżności ze stanem faktycznym (np. w wyniku niedawnych remontów lub przebudów) i przed przyznaniem oficjalnego Certyfikatu Dostępności wymagają audytu terenowego przeprowadzonego przez Urząd Miasta.
> 
> Oficjalna specyfikacja standardów dostępności architektonicznej, model danych i analiza prawna znajdują się w dokumencie [DOCS_PUBLIC.md](DOCS_PUBLIC.md).

---

## Główne Założenia Projektu

1. **Interaktywny Lokalizator Miejsc (OpenStreetMap + OpenLayers)**:
   - Wyszukiwanie i badanie obiektów na mapie bez zbędnego routingu – mapa służy do odkrywania miejsc i badania ich barier architektonicznych.
   - Oficjalne podkłady kafelkowe OpenStreetMap (pełna zgodność z licencją ODbL i wymaganą atrybucją).
   - Lekka biblioteka mapowa **OpenLayers (`ol`)** na licencji BSD-2-Clause.
   - **Dynamiczne poziomy szczegółowości (Zoom LOD):** Na widoku ogólnym (Zoom < 15) wyświetlane są kluczowe, certyfikowane punkty miejskie z zachowaniem czytelności. Przy przybliżaniu (Zoom ≥ 15) ujawniają się wszystkie lokalne obiekty w danym kwartale ulic.
   - **Kompaktowe pinezki bez kolizji:** Zwykłe punkty to estetyczne, 28-pikselowe okrągłe znaczniki kodowane kolorystycznie według kategorii z etykietą po najechaniu kursorem. Zaznaczony obiekt wyróżnia się powiększoną, pulsującą plakietką.

2. **Pobieranie Danych Real-Time i Resolver Adresów**:
   - Live scraper w endpointzie Next.js (`/api/places`) łączący się z serwerami Overpass QL.
   - **Buforowanie i zgodność z polityką serwerów OSM:** Wbudowany in-memory server cache z czasem życia 12 godzin (TTL) oraz dedykowany nagłówek `User-Agent`.
   - **Inteligentny Resolver Ulic Krakowa:** Rozwiązuje problem brakujących tagów adresowych w OpenStreetMap, gwarantując czytelną nazwę ulicy zamiast surowych współrzędnych geograficznych.
   - 4 oficjalne kategorie miejskie:
     - **Gastronomia:** Kawiarnia Bunkier Sztuki, Kawiarnia Noworolski, restauracje, bistra i kawiarnie studyjne.
     - **Kultura i Rozrywka:** Teatr im. J. Słowackiego, Muzeum Narodowe, Teatr Bagatela, Zamek Królewski na Wawelu, Kino Pod Baranami.
     - **Sport i Rekreacja:** OSiR Kolna, Com-Com Zone Nowa Huta, Park Wodny Kraków, Pływalnia KS Korona.
     - **Zdrowie i Urzędy:** Szpital Uniwersytecki w Prokocimiu, Centrum Medyczne Ujastek, Urząd Miasta Krakowa, apteki.

3. **Wyszukiwarka Wieloaspektowa (Nazwy, Tagi, Cechy, Adresy)**:
   - Wyszukiwanie równoległe po nazwach lokali, adresach, cechach architektonicznych oraz tagach kontekstowych.
   - Interaktywne pigułki popularnych tagów (`#kawa`, `#kawiarnia`, `#obiad`, `#burger`, `#pizza`, `#teatr`, `#muzeum`, `#basen`, `#apteka`).
   - Tokenizacja zapytań (np. wpisanie *kawiarnia rynek* znajduje kawiarnie w rejonie Rynku Głównego).

4. **System Weryfikacji Miejskiej i Metryka Dostępności**:
   - Każde miejsce zaimportowane ze scrapera lub zgłoszone przez użytkownika otrzymuje status oczekujący na weryfikację.
   - Audytor miejski weryfikuje zgłoszenia w terenie i zatwierdza parametry (szerokość drzwi, wysokość progu, parametry windy, pętla indukcyjna).

5. **Dedykowane Panele Użytkowników**:
   - **Panel Mieszkańca:** zgłaszanie barier architektonicznych, wystawianie opinii, zbieranie punktów zaangażowania i odznak weryfikatora.
   - **Panel Właściciela Obiektu:** deklaracja cech dostępności lokalu, generowanie Certyfikatu Dostępności oraz odbiór oficjalnych powiadomień urzędowych.
   - **Panel Administratora Miejskiego:** kolejka moderacyjna, zatwierdzanie weryfikacji terenowych z opcją „Pokaż na mapie” oraz usuwanie lokali z automatycznym powiadomieniem właściciela.

6. **Pełna Dostępność Cyfrowa (WCAG 2.1 AAA)**:
   - Oficjalny tryb wysokiego kontrastu (czarne tło, żółty tekst i obramowania `#ffff00`) zoptymalizowany dla osób słabowidzących.
   - Trzystopniowe skalowanie wielkości tekstu (`AA`, `A+`, `A++`).
   - Ścisła zasada No-Emoji – wyłącznie semantyczne wektory SVG z biblioteki Lucide React.

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
| **Menedżer pakietów** | pnpm | MIT |

---

## Uruchomienie Projektu

### Wymagania:
* Node.js >= 20.x
* pnpm (zalecana wersja >= 9.x)

### Krok po kroku:

1. **Wejście do katalogu aplikacji**:
   ```bash
   cd my-app
   ```

2. **Instalacja zależności**:
   ```bash
   pnpm install
   ```

3. **Uruchomienie serwera deweloperskiego**:
   ```bash
   pnpm run dev
   ```
   Aplikacja będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

4. **Budowanie produkcyjne i weryfikacja typów TypeScript**:
   ```bash
   pnpm run build
   pnpm run start
   ```

---

## Struktura Katalogów

```
HackYeah2026/
├── DOCS_PUBLIC.md                       # Oficjalna specyfikacja standardów, modelu danych i prawna
├── README.md                            # Przegląd projektu, instalacja i zastrzeżenia
└── my-app/
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...all]/route.ts   # Autentykacja Better-Auth
    │   │   ├── geocode/route.ts         # Geokodowanie adresów przez Nominatim OSM
    │   │   └── places/route.ts          # Live Scraper Overpass API z buforem 12h
    │   ├── components/
    │   │   ├── admin-panel/             # Panel administratora miejskiego
    │   │   │   ├── AdminMetricsGrid.tsx
    │   │   │   ├── AdminOwnerVerificationQueue.tsx
    │   │   │   ├── AdminPlacesRegistry.tsx # Rejestr z usuwaniem lokali i podglądem na mapie
    │   │   │   ├── AdminReportsModeration.tsx
    │   │   │   └── AdminReviewsModeration.tsx
    │   │   ├── auth/
    │   │   │   └── AuthModal.tsx        # Modal logowania i szybkiego wyboru ról demo
    │   │   ├── home/                    # Widok główny
    │   │   │   ├── CategoryGrid.tsx     # Kafelki kategorii
    │   │   │   ├── HeroSearch.tsx       # Wyszukiwarka z filtrami cech i pigułkami tagów
    │   │   │   ├── HomeView.tsx         # Główny widok eksploracji
    │   │   │   ├── MapSection.tsx       # Sekcja mapy z podglądem obiektu
    │   │   │   ├── PlaceDetailsCard.tsx # Szczegóły obiektu, źródła pomiarów i tagi
    │   │   │   └── PlacesScrollSection.tsx # Katalog obiektów z dynamicznym ładowaniem
    │   │   ├── owner-panel/             # Panel właściciela obiektu
    │   │   │   ├── OwnerNotificationsBanner.tsx # Powiadomienia urzędowe dla właściciela
    │   │   │   ├── OwnerNewPlaceForm.tsx
    │   │   │   ├── OwnerPlaceAuditCard.tsx
    │   │   │   └── OwnerPlacesList.tsx
    │   │   ├── user-panel/              # Panel mieszkańca
    │   │   │   ├── UserMyReportsList.tsx
    │   │   │   ├── UserMyReviewsList.tsx
    │   │   │   ├── UserReportBarrierForm.tsx
    │   │   │   └── UserStatsOverview.tsx
    │   │   ├── AdminPanel.tsx           # Wrapper panelu admina
    │   │   ├── Footer.tsx               # Dostępna stopka aplikacji
    │   │   ├── Navbar.tsx               # Pasek nawigacji, przełącznik ról i trybu kontrastu
    │   │   ├── OwnerPanel.tsx           # Wrapper panelu właściciela
    │   │   ├── QuickVerifyModal.tsx     # Szybka weryfikacja cech w terenie
    │   │   ├── ReviewForm.tsx           # Formularz ocen i recenzji
    │   │   └── UserPanel.tsx            # Wrapper panelu użytkownika
    │   ├── globals.css                  # Style globalne, Tailwind v4 i motyw wysokiego kontrastu
    │   ├── layout.tsx                   # Główny layout aplikacji
    │   ├── page.tsx                     # Kontroler widoków i wieloaspektowe filtrowanie
    │   └── providers.tsx                # Kontekst aplikacji
    ├── components/
    │   ├── AccessibilityIcon.tsx        # Semantyczny mapper ikon Lucide dla cech dostępności
    │   ├── OSMMap.tsx                   # Mapa OpenLayers z poziomami LOD i pinezkami bez kolizji
    │   └── ui/                          # Komponenty bazowe interfejsu
    ├── lib/
    │   ├── app-context.tsx              # Stan globalny (miejsca, powiadomienia, recenzje)
    │   ├── baseline-places.ts           # Krakowska baza referencyjna obiektów i tagów
    │   ├── initial-data.ts              # Profile testowe i definicje cech dostępności
    │   ├── krakow-address-resolver.ts   # Inteligentny moduł rozpoznawania krakowskich ulic
    │   └── types.ts                     # Definicje typów TypeScript
    └── package.json
```

---

## Profile Testowe (1-Click Demo)

W oknie logowania lub menu użytkownika można jednym kliknięciem przełączać role demonstracyjne:

1. **Marta Kowalska** (`user`) – Mieszkaniec / Tester Dostępności (340 pkt).
2. **Jan Nowak** (`owner`) – Właściciel Obiektu (zarządza m.in. Kawiarnią Bunkier Sztuki, Teatrem im. J. Słowackiego).
3. **Aleksandra Wiśniewska** (`admin`) – Oficer Dostępności Urzędu Miasta Krakowa (980 pkt).

---

## Legalność, Bezpieczeństwo i Licencje

* **Legalność danych i licencji:** Dane OpenStreetMap wykorzystywane są zgodnie z licencją Open Database License (ODbL 1.0) z wymaganą atrybucją.
* **Kafelki mapy:** Pobrane z oficjalnych serwerów OpenStreetMap zgodnie z polityką OpenStreetMap Tile Usage Policy.
* **Brak narzędzi śledzących:** Aplikacja nie implementuje żadnych zewnętrznych skryptów telemetrycznych ani cookies reklamowych podmiotów trzecich.
* **Bezpieczeństwo kodu:** Repozytorium nie zawiera żadnych niebezpiecznych skryptów, komercyjnych tokenów ani zamkniętych zależności. Każdy użytkownik może bezpiecznie sklonować kod i uruchomić go lokalnie.
