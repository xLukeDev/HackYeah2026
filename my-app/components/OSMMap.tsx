"use client";

import { useEffect, useRef } from "react";
import { Place } from "@/lib/types";
import { MapPin, Globe } from "lucide-react";

interface OSMMapProps {
  places: Place[];
  selectedPlace: Place;
  onSelectPlace: (place: Place) => void;
}

export default function OSMMap({
  places,
  selectedPlace,
  onSelectPlace,
}: OSMMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let isMounted = true;

    // Dynamically load leaflet on client side
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const initialLat = selectedPlace?.lat || 50.0614;
      const initialLng = selectedPlace?.lng || 19.9383;

      // Initialize map instance centered on Kraków
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false, // Custom placed zoom control
      });

      // Add zoom control at bottom-right
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      // Add official OpenStreetMap raster tiles with mandatory attribution
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Create a layer group for markers
      const markersLayer = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = markersLayer;

      // Render markers for all places
      updateMarkers(L, map, markersLayer, places, selectedPlace, onSelectPlace);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update markers when places or selectedPlace change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    import("leaflet").then((L) => {
      updateMarkers(
        L,
        mapInstanceRef.current,
        markersLayerRef.current,
        places,
        selectedPlace,
        onSelectPlace
      );
    });
  }, [places, selectedPlace, onSelectPlace]);

  // Pan to selected place when user selects a place from list or search
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlace?.lat || !selectedPlace?.lng)
      return;

    mapInstanceRef.current.flyTo(
      [selectedPlace.lat, selectedPlace.lng],
      15,
      {
        duration: 0.8,
      }
    );
  }, [selectedPlace?.id]);

  return (
    <div className="relative min-h-[480px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xs">
      {/* Map container */}
      <div ref={mapContainerRef} className="h-[480px] w-full z-0" />

      {/* Floating Info Badge on Top-Left */}
      <div className="absolute left-4 top-4 z-[400] flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 shadow-md backdrop-blur-sm">
        <Globe className="h-4 w-4 text-blue-700" />
        <span>OpenStreetMap · Kraków</span>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
          {places.length} punktów
        </span>
      </div>

      {/* OSM Source & License Notice (Explicitly fulfilling openstreetmap.org requirements) */}
      <div className="absolute left-4 bottom-4 z-[400] max-w-xs rounded-xl border border-slate-200 bg-white/95 p-2 text-[10px] text-slate-600 shadow-md backdrop-blur-sm hidden sm:block">
        <p className="font-bold text-slate-800 flex items-center gap-1">
          <MapPin className="h-3 w-3 text-blue-700" /> Podkład OpenStreetMap
        </p>
        <p className="mt-0.5 text-slate-500">
          Społecznościowe dane kartograficzne. Dane dostępne na licencji ODbL:{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline font-semibold"
          >
            openstreetmap.org
          </a>
        </p>
      </div>
    </div>
  );
}

function updateMarkers(
  L: any,
  map: any,
  markersLayer: any,
  places: Place[],
  selectedPlace: Place,
  onSelectPlace: (place: Place) => void
) {
  markersLayer.clearLayers();

  places.forEach((place) => {
    const lat = place.lat || 50.0614;
    const lng = place.lng || 19.9383;
    const isSelected = selectedPlace?.id === place.id;

    // Custom HTML Marker using Tailwind classes
    const iconHtml = `
      <div class="cursor-pointer transition-all transform duration-200 ${
        isSelected ? "scale-110 z-30" : "hover:scale-105 z-10"
      }">
        <div class="flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold shadow-lg ${
          isSelected
            ? "border-blue-700 bg-blue-700 text-white ring-4 ring-blue-300/50"
            : "border-slate-300 bg-white text-slate-800 hover:border-blue-500"
        }">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${
            isSelected ? "text-white" : "text-blue-700"
          }">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span class="truncate max-w-[120px]">${place.name}</span>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: "custom-osm-pin",
      iconSize: [140, 34],
      iconAnchor: [70, 17],
    });

    const marker = L.marker([lat, lng], { icon: customIcon });

    // When clicked, select this place
    marker.on("click", () => {
      onSelectPlace(place);
    });

    // Clean popup
    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
        <strong style="color: #0f172a; font-size: 13px;">${place.name}</strong>
        <p style="color: #64748b; margin: 2px 0 6px 0;">${place.address}</p>
        <div style="margin-bottom: 6px;">
          <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 6px; font-weight: bold; font-size: 10px;">
            ${place.categoryLabel}
          </span>
          <span style="color: #d97706; font-weight: bold; margin-left: 6px;">
            ★ ${place.rating || 5}.0
          </span>
        </div>
        <p style="color: #334155; font-size: 11px; margin: 0 0 6px 0;">${place.features.slice(0, 2).join(", ")}</p>
      </div>
    `);

    markersLayer.addLayer(marker);
  });
}
