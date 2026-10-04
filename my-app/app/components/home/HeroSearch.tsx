"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ACCESSIBILITY_FILTERS = [
  { id: "bezprogowe", label: "Wejście bezprogowe" },
  { id: "podjazd", label: "Podjazd / rampa" },
  { id: "winda", label: "Winda" },
  { id: "toaleta", label: "Toaleta przystosowana" },
  { id: "indukcyjna", label: "Pętla indukcyjna" },
  { id: "audio", label: "Audiodeskrypcja" },
  { id: "pjm", label: "Tłumacz PJM" },
  { id: "pies", label: "Pies asystujący" },
];

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFeature: string | null;
  setSelectedFeature: (feature: string | null) => void;
}

export default function HeroSearch({
  searchQuery,
  setSearchQuery,
  selectedFeature,
  setSelectedFeature,
}: HeroSearchProps) {
  return (
    <section
      id="szukaj"
      className="relative overflow-hidden rounded-[32px] bg-[#0b4f87] px-6 py-10 text-white shadow-[0_16px_40px_rgba(11,79,135,0.16)] lg:px-12 lg:py-14"
    >
      <div className="absolute right-[-80px] top-[-110px] h-72 w-72 rounded-full border-[36px] border-cyan-300/20" />
      <div className="absolute bottom-[-150px] right-[22%] h-64 w-64 rounded-full border-[24px] border-white/10" />

      <div className="relative max-w-3xl">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-100/10 px-3 py-1 text-xs font-semibold text-cyan-100">
            <span className="h-2 w-2 rounded-full bg-cyan-300" /> Społeczność Krakowa działa
          </div>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Miasto, w którym każdy może być u siebie.
          </h1>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-blue-100">
            Znajdź sprawdzone miejsca bez barier architektonicznych, poznaj opinie innych osób i pomóż budować bardziej otwarty Kraków.
          </p>

          {/* Search input */}
          <div className="mt-7 flex max-w-2xl items-center rounded-2xl bg-white p-1.5 shadow-lg">
            <Search className="ml-3 h-5 w-5 shrink-0 text-blue-700" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj lokalu, adresu, windy, pętli indukcyjnej..."
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <Button
              onClick={() =>
                document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth" })
              }
              className="h-11 rounded-xl bg-blue-700 px-5 text-xs sm:text-sm font-bold text-white hover:bg-blue-800"
            >
              Szukaj
            </Button>
          </div>

          {/* Quick Feature Filter Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {ACCESSIBILITY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() =>
                  setSelectedFeature(selectedFeature === filter.id ? null : filter.id)
                }
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  selectedFeature === filter.id
                    ? "border-white bg-white text-blue-900 font-bold shadow-xs"
                    : "border-white/30 text-blue-50 hover:bg-white/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
