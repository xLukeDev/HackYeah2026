"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Place } from "@/lib/types";
import { MapPin, Globe, ZoomIn, ZoomOut, Layers } from "lucide-react";

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
  const viewRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(14);
  const [geocodedPlaces, setGeocodedPlaces] = useState<
    Record<string, { lat: number; lng: number }>
  >({});

  const getFallbackCoords = useCallback((place?: Place | null) => {
    if (!place) return { lat: 50.0614, lng: 19.9383 };
    if (Number.isFinite(place.lat) && Number.isFinite(place.lng)) {
      return { lat: place.lat as number, lng: place.lng as number };
    }
    let hash = 0;
    const str = (place.id || "") + (place.name || "");
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const latOffset = (((Math.abs(hash) % 1000) - 500) / 1000) * 0.015;
    const lngOffset = (((Math.abs(hash * 31) % 1000) - 500) / 1000) * 0.02;
    return {
      lat: 50.0614 + latOffset,
      lng: 19.9383 + lngOffset,
    };
  }, []);

  // Geocode places that lack coordinates
  useEffect(() => {
    const placesToGeocode = places.filter(
      (place) => !Number.isFinite(place.lat) || !Number.isFinite(place.lng)
    );
    if (placesToGeocode.length === 0) return;

    const controller = new AbortController();

    const geocodePlaces = async () => {
      for (const place of placesToGeocode) {
        try {
          const response = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: place.address }),
            signal: controller.signal,
          });
          if (!response.ok) continue;
          const coordinates = await response.json();
          if (
            Number.isFinite(coordinates.lat) &&
            Number.isFinite(coordinates.lng)
          ) {
            setGeocodedPlaces((current) => ({
              ...current,
              [place.id]: { lat: coordinates.lat, lng: coordinates.lng },
            }));
          }
        } catch {
          if (!controller.signal.aborted) continue;
        }
      }
    };

    void geocodePlaces();
    return () => controller.abort();
  }, [places]);

  // Initialize OpenLayers map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    let isMounted = true;

    (async () => {
      const [
        { default: Map },
        { default: View },
        { default: TileLayer },
        { default: OSM },
        { fromLonLat },
      ] = await Promise.all([
        import("ol/Map"),
        import("ol/View"),
        import("ol/layer/Tile"),
        import("ol/source/OSM"),
        import("ol/proj"),
      ]);

      if (!isMounted || !mapContainerRef.current) return;

      const initialLng = selectedPlace?.lng ?? 19.9383;
      const initialLat = selectedPlace?.lat ?? 50.0614;

      const view = new View({
        center: fromLonLat([initialLng, initialLat]),
        zoom: 14,
        minZoom: 10,
        maxZoom: 19,
      });

      const map = new Map({
        target: mapContainerRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view,
        controls: [],
      });

      // Zoom listener to dynamically filter LOD (level of detail)
      view.on("change:resolution", () => {
        const z = view.getZoom();
        if (typeof z === "number") {
          setCurrentZoom(Math.round(z * 10) / 10);
        }
      });

      // Controls from ol/control
      const { defaults: defaultControls } = await import("ol/control");
      defaultControls({ attribution: true, zoom: true, rotate: false })
        .getArray()
        .forEach((ctrl: any) => map.addControl(ctrl));

      mapInstanceRef.current = map;
      viewRef.current = view;
      setMapReady(true);
    })();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
        viewRef.current = null;
        setMapReady(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter visible places based on current zoom:
  // At zoom < 15 ("na pierwszy rzut oka"): show selected place + top certified landmarks spaced out
  // At zoom >= 15 ("jak będziemy scrollować / przybliżać"): show all places in the district
  const visiblePlaces = useMemo(() => {
    if (currentZoom >= 15) {
      return places;
    }

    const result: Place[] = [];
    const chosenCoords: { lat: number; lng: number }[] = [];

    // Always include selected place first
    if (selectedPlace) {
      result.push(selectedPlace);
      const c =
        geocodedPlaces[selectedPlace.id] ??
        (Number.isFinite(selectedPlace.lat) && Number.isFinite(selectedPlace.lng)
          ? { lat: selectedPlace.lat as number, lng: selectedPlace.lng as number }
          : getFallbackCoords(selectedPlace));
      if (c) chosenCoords.push(c);
    }

    // Pick top verified places avoiding heavy clustering at overview zoom
    for (const place of places) {
      if (selectedPlace && place.id === selectedPlace.id) continue;

      const coords =
        geocodedPlaces[place.id] ??
        (Number.isFinite(place.lat) && Number.isFinite(place.lng)
          ? { lat: place.lat as number, lng: place.lng as number }
          : getFallbackCoords(place));

      if (!coords) continue;

      // Keep ~350m spacing at zoom 14 so pins do not overlap
      const tooClose = chosenCoords.some(
        (chosen) =>
          Math.abs(chosen.lat - coords.lat) < 0.0032 &&
          Math.abs(chosen.lng - coords.lng) < 0.0042
      );

      if (!tooClose) {
        result.push(place);
        chosenCoords.push(coords);
      }

      if (result.length >= 14) break;
    }

    return result;
  }, [places, selectedPlace, currentZoom, geocodedPlaces, getFallbackCoords]);

  // Sync markers (overlays)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    (async () => {
      const [{ default: Overlay }, { fromLonLat }] = await Promise.all([
        import("ol/Overlay"),
        import("ol/proj"),
      ]);

      // Remove previous overlays
      overlaysRef.current.forEach((ov) => map.removeOverlay(ov));
      overlaysRef.current = [];

      for (const place of visiblePlaces) {
        const coords =
          geocodedPlaces[place.id] ??
          (Number.isFinite(place.lat) && Number.isFinite(place.lng)
            ? { lat: place.lat as number, lng: place.lng as number }
            : getFallbackCoords(place));

        if (!coords) continue;

        const isSelected = selectedPlace?.id === place.id;

        // Visual category settings
        const categoryTheme = (() => {
          switch (place.category) {
            case "restauracje":
              return {
                color: "#d97706",
                bg: "#fffbeb",
                svg: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`,
              };
            case "sport":
              return {
                color: "#059669",
                bg: "#ecfdf5",
                svg: `<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/>`,
              };
            case "zdrowie":
              return {
                color: "#e11d48",
                bg: "#fff1f2",
                svg: `<path d="M12 6v12M6 12h12"/>`,
              };
            case "kultura":
            default:
              return {
                color: "#4338ca",
                bg: "#eef2ff",
                svg: `<path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2z"/>`,
              };
          }
        })();

        // Create DOM element for marker
        const el = document.createElement("div");
        el.className = `ol-custom-pin ${isSelected ? "selected-pin" : ""}`;
        el.style.cssText = `
          cursor: pointer;
          transition: transform 0.15s ease;
          z-index: ${isSelected ? 300 : 20};
          pointer-events: auto;
          position: relative;
        `;

        if (isSelected) {
          // Highlighted pill for the selected active place
          el.innerHTML = `
            <div style="position: relative; display: flex; align-items: center;">
              <span style="
                position: absolute; inset: -6px;
                border-radius: 9999px;
                background: #3b82f6;
                opacity: 0.6;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                pointer-events: none;
              "></span>
              <div style="
                position: relative;
                display: flex; align-items: center; gap: 7px;
                border-radius: 9999px; border: 2.5px solid #1d4ed8;
                background: #1d4ed8;
                color: #ffffff;
                padding: 6px 14px 6px 10px;
                font-size: 12px; font-weight: 800;
                box-shadow: 0 6px 20px rgba(29, 78, 216, 0.45);
                white-space: nowrap;
                font-family: inherit;
                user-select: none;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                  viewBox="0 0 24 24" fill="#ffffff" stroke="#1d4ed8"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span style="overflow:hidden;text-overflow:ellipsis;max-width:180px">${place.name}</span>
              </div>
            </div>
          `;
        } else {
          // Sleek compact category pin (28px) with hover tooltip - prevents all marker collision
          el.innerHTML = `
            <div class="pin-box" style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div class="pin-tooltip" style="
                position: absolute;
                bottom: calc(100% + 7px);
                background: #0f172a;
                color: #ffffff;
                padding: 4px 9px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 700;
                white-space: nowrap;
                box-shadow: 0 4px 14px rgba(0,0,0,0.25);
                pointer-events: none;
                opacity: 0;
                transform: translateY(4px);
                transition: opacity 0.15s ease, transform 0.15s ease;
                z-index: 100;
                display: flex;
                flex-direction: column;
                align-items: center;
              ">
                <span>${place.name}</span>
                <span style="font-size: 9px; font-weight: 500; color: #94a3b8;">${place.categoryLabel}</span>
              </div>
              <div style="
                width: 28px;
                height: 28px;
                border-radius: 9999px;
                background: #ffffff;
                border: 2px solid ${categoryTheme.color};
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 7px rgba(0,0,0,0.18);
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="${categoryTheme.color}"
                  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  ${categoryTheme.svg}
                </svg>
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 5px solid ${categoryTheme.color};
                margin-top: -1px;
              "></div>
            </div>
          `;

          const tooltip = el.querySelector(".pin-tooltip") as HTMLElement | null;
          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.15)";
            el.style.zIndex = "150";
            if (tooltip) {
              tooltip.style.opacity = "1";
              tooltip.style.transform = "translateY(0)";
            }
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "";
            el.style.zIndex = "20";
            if (tooltip) {
              tooltip.style.opacity = "0";
              tooltip.style.transform = "translateY(4px)";
            }
          });
        }

        el.addEventListener("click", () => onSelectPlace(place));

        const overlay = new Overlay({
          element: el,
          position: fromLonLat([coords.lng, coords.lat]),
          positioning: isSelected ? "center-center" : "bottom-center",
          stopEvent: true,
        });

        map.addOverlay(overlay);
        overlaysRef.current.push(overlay);
      }

      map.updateSize();
    })();
  }, [
    visiblePlaces,
    selectedPlace,
    onSelectPlace,
    geocodedPlaces,
    getFallbackCoords,
    mapReady,
  ]);

  // Pan smoothly to selected place
  useEffect(() => {
    const view = viewRef.current;
    if (!view || !selectedPlace) return;

    const coords =
      geocodedPlaces[selectedPlace.id] ??
      (Number.isFinite(selectedPlace.lat) && Number.isFinite(selectedPlace.lng)
        ? { lat: selectedPlace.lat as number, lng: selectedPlace.lng as number }
        : getFallbackCoords(selectedPlace));

    if (!coords) return;

    import("ol/proj").then(({ fromLonLat }) => {
      mapInstanceRef.current?.updateSize();
      view.animate({
        center: fromLonLat([coords.lng, coords.lat]),
        zoom: Math.max(view.getZoom() || 14, 15.5),
        duration: 450,
      });
    });
  }, [selectedPlace?.id, geocodedPlaces, getFallbackCoords, mapReady]);

  const handleZoomIn = () => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.getZoom() || 14;
    view.animate({ zoom: current + 1, duration: 250 });
  };

  const handleZoomOut = () => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.getZoom() || 14;
    view.animate({ zoom: current - 1, duration: 250 });
  };

  return (
    <div className="relative min-h-[480px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xs">
      {/* Map container */}
      <div ref={mapContainerRef} className="h-[480px] w-full z-0" />

      {/* Floating Header Badge */}
      <div className="absolute left-4 top-4 z-[400] flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 shadow-md backdrop-blur-sm pointer-events-none">
        <Globe className="h-4 w-4 text-blue-700" />
        <span>OpenStreetMap · Kraków</span>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
          {places.length} punktów
        </span>
      </div>

      {/* Level of detail / Scroll zoom indicator */}
      <div className="absolute right-4 top-4 z-[400] hidden sm:flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-sm">
        <Layers className="h-3.5 w-3.5 text-blue-700" />
        {currentZoom < 15 ? (
          <span className="text-[11px] text-slate-600">
            Widok ogólny (Kluczowe miejsca) · <strong className="text-blue-700">Scrolluj kółkiem</strong>, by odkryć wszystkie
          </span>
        ) : (
          <span className="text-[11px] text-emerald-700 font-bold">
            Widok szczegółowy ({visiblePlaces.length} punktów w okolicy)
          </span>
        )}
      </div>

      {/* Quick custom zoom buttons */}
      <div className="absolute right-4 bottom-5 z-[400] flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          title="Przybliż (scroll w górę)"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Oddal (scroll w dół)"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* OSM attribution notice */}
      <div className="absolute left-4 bottom-4 z-[400] max-w-xs rounded-xl border border-slate-200 bg-white/95 p-2 text-[10px] text-slate-600 shadow-md backdrop-blur-sm hidden sm:block pointer-events-none">
        <p className="font-bold text-slate-800 flex items-center gap-1">
          <MapPin className="h-3 w-3 text-blue-700" /> Podkład OpenStreetMap
        </p>
        <p className="mt-0.5 text-slate-500">
          Dane dostępne na licencji ODbL:{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline font-semibold pointer-events-auto"
          >
            openstreetmap.org
          </a>
        </p>
      </div>
    </div>
  );
}
