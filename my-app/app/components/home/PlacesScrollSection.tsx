"use client";

import { useState } from "react";
import { Place } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  ShieldCheck,
  Clock,
  Star,
  Tag,
  ChevronDown,
  Navigation,
} from "lucide-react";
import { AccessibilityIcon } from "@/components/AccessibilityIcon";

interface PlacesScrollSectionProps {
  places: Place[];
  selectedPlaceId: string;
  onSelectPlace: (placeId: string) => void;
}

export default function PlacesScrollSection({
  places,
  selectedPlaceId,
  onSelectPlace,
}: PlacesScrollSectionProps) {
  // Show first 6 places on first glance, load more as user clicks or scrolls
  const [displayCount, setDisplayCount] = useState(6);

  const displayedPlaces = places.slice(0, displayCount);
  const hasMore = displayCount < places.length;

  const handleShowMore = () => {
    setDisplayCount((prev) => Math.min(prev + 6, places.length));
  };

  const handleFocusOnMap = (placeId: string) => {
    onSelectPlace(placeId);
    const mapElement = document.getElementById("mapa");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold text-blue-700">
            Katalog Dostępności
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Miejsca w Krakowie ({places.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Wybrane punkty na pierwszy rzut oka. Przewijaj listę w dół, aby odkryć kolejne lokalizacje.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Wyświetlanie: {Math.min(displayCount, places.length)} z {places.length}
        </span>
      </div>

      {/* Grid of Places */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedPlaces.map((place) => {
          const isSelected = place.id === selectedPlaceId;
          const isCertified = place.verified || place.verificationStatus === "zatwierdzony";

          return (
            <Card
              key={place.id}
              className={`rounded-2xl transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
              }`}
            >
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="border-0 bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {place.categoryLabel}
                    </Badge>
                    {isCertified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" /> Certyfikat
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="h-3 w-3" /> Weryfikacja
                      </span>
                    )}
                  </div>

                  <CardTitle className="pt-2 text-base font-bold text-slate-900 line-clamp-1">
                    {place.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 line-clamp-1">
                    <MapPin className="mr-1 inline h-3 w-3 text-blue-700" />
                    {place.address}
                  </CardDescription>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-amber-500 pt-1">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-bold text-slate-800">
                      {place.rating || 4.8}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({place.reviewsCount || 10})
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>

                  {/* Key Features */}
                  <div className="flex flex-wrap gap-1">
                    {place.features.slice(0, 3).map((feat) => (
                      <span
                        key={feat}
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"
                      >
                        <AccessibilityIcon name={feat} className="h-3 w-3 text-emerald-700 shrink-0" />
                        <span className="truncate max-w-[120px]">{feat}</span>
                      </span>
                    ))}
                    {place.features.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium self-center">
                        +{place.features.length - 3} więcej
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                      {place.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600"
                        >
                          <Tag className="h-2 w-2 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>

              {/* Action */}
              <div className="p-4 pt-0">
                <Button
                  onClick={() => handleFocusOnMap(place.id)}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full h-8 text-xs font-bold rounded-xl transition-colors ${
                    isSelected
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "border-slate-200 text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <Navigation className="mr-1.5 h-3.5 w-3.5" />
                  {isSelected ? "Wybrane na mapie" : "Pokaż na mapie"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Show more button when scrolling */}
      {hasMore && (
        <div className="flex justify-center pt-2 pb-6">
          <Button
            onClick={handleShowMore}
            variant="outline"
            className="h-10 px-6 rounded-2xl border-blue-200 bg-white text-xs font-bold text-blue-700 hover:bg-blue-50 shadow-xs"
          >
            <ChevronDown className="mr-2 h-4 w-4" />
            Załaduj kolejne miejsca ({places.length - displayCount} pozostało)
          </Button>
        </div>
      )}
    </section>
  );
}
