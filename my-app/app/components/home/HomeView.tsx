"use client";

import { Place } from "@/lib/types";
import HeroSearch from "./HeroSearch";
import CategoryGrid from "./CategoryGrid";
import MapSection from "./MapSection";
import PlacesScrollSection from "./PlacesScrollSection";

interface HomeViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedFeature: string | null;
  setSelectedFeature: (feat: string | null) => void;
  filteredPlaces: Place[];
  selectedPlace: Place;
  setSelectedPlaceId: (id: string) => void;
  isSyncingPlaces: boolean;
  onSyncPlaces: () => Promise<void> | void;
  onOpenReview: () => void;
  onOpenVerify: () => void;
}

export default function HomeView({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedFeature,
  setSelectedFeature,
  filteredPlaces,
  selectedPlace,
  setSelectedPlaceId,
  isSyncingPlaces,
  onSyncPlaces,
  onOpenReview,
  onOpenVerify,
}: HomeViewProps) {
  return (
    <>
      {/* Search Hero */}
      <HeroSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
      />

      {/* Categories Grid */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Interactive Map & Place Details Section */}
      <MapSection
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        isSyncingPlaces={isSyncingPlaces}
        onSyncPlaces={onSyncPlaces}
        onSelectPlace={setSelectedPlaceId}
        onOpenReview={onOpenReview}
        onOpenVerify={onOpenVerify}
      />

      {/* Scrollable Places Section */}
      <PlacesScrollSection
        places={filteredPlaces}
        selectedPlaceId={selectedPlace.id}
        onSelectPlace={setSelectedPlaceId}
      />
    </>
  );
}
