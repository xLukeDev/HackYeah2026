"use client";

import dynamic from "next/dynamic";
import { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import PlaceDetailsCard from "./PlaceDetailsCard";

const OSMMap = dynamic(() => import("@/components/OSMMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
      Ładowanie mapy OpenStreetMap...
    </div>
  ),
});

interface MapSectionProps {
  places: Place[];
  selectedPlace: Place;
  isSyncingPlaces: boolean;
  onSyncPlaces: () => Promise<void> | void;
  onSelectPlace: (placeId: string) => void;
  onOpenReview: () => void;
  onOpenVerify: () => void;
}

export default function MapSection({
  places,
  selectedPlace,
  isSyncingPlaces,
  onSyncPlaces,
  onSelectPlace,
  onOpenReview,
  onOpenVerify,
}: MapSectionProps) {
  return (
    <section id="mapa" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-0.5 text-xs font-bold text-blue-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Krakowski System Informacji Przestrzennej
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
            Mapa OpenStreetMap Krakowa
          </h2>
          <p className="text-xs text-slate-500">
            Przeglądaj i lokalizuj dostępne miejsca na oficjalnym podkładzie OpenStreetMap.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => void onSyncPlaces()}
            disabled={isSyncingPlaces}
            variant="outline"
            className="h-9 rounded-xl border-blue-200 bg-white text-xs font-bold text-blue-700 hover:bg-blue-50 transition-all shadow-xs"
            title="Pobierz najświeższe obiekty z OpenStreetMap dla Krakowa"
          >
            <RefreshCw
              className={`mr-1.5 h-3.5 w-3.5 ${
                isSyncingPlaces ? "animate-spin text-blue-600" : "text-blue-700"
              }`}
            />
            {isSyncingPlaces ? "Pobieranie z OSM..." : "Pobierz na żywo z OSM"}
          </Button>
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">
            Znaleziono: {places.length} miejsc
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* OpenStreetMap Component */}
        <div className="w-full">
          <OSMMap
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={(place) => onSelectPlace(place.id)}
          />
        </div>

        {/* Selected Place Details Card with Action Buttons */}
        <PlaceDetailsCard
          place={selectedPlace}
          onOpenReview={onOpenReview}
          onOpenVerify={onOpenVerify}
        />
      </div>
    </section>
  );
}
