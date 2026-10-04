"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./components/home/HomeView";
import UserPanel from "./components/UserPanel";
import OwnerPanel from "./components/OwnerPanel";
import AdminPanel from "./components/AdminPanel";
import AuthModal from "./components/auth/AuthModal";
import ReviewForm from "./components/ReviewForm";
import QuickVerifyModal from "./components/QuickVerifyModal";

export default function Home() {
  const {
    currentUser,
    places,
    activeView,
    isAuthModalOpen,
    closeAuthModal,
    isSyncingPlaces,
    syncPlacesFromOSM,
    selectedPlaceId,
    setSelectedPlaceId,
  } = useApp();

  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState<0 | 1 | 2>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  // Uprawnienia do widoków: tylko te panele, do których użytkownik ma dostęp
  const effectiveView = (() => {
    if (activeView === "admin-panel" && currentUser?.role !== "admin") return "explore";
    if (activeView === "owner-panel" && currentUser?.role !== "owner") return "explore";
    if (activeView === "user-panel" && !currentUser) return "explore";
    return activeView;
  })();

  const filteredPlaces = places.filter((place) => {
    // Zawsze uwzględniaj aktualnie wybrany obiekt (np. z panelu admina), aby punkt zawsze był na mapie
    if (place.id === selectedPlaceId) return true;

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      [
        place.name,
        place.address,
        place.categoryLabel,
        place.description,
        ...(place.tags || []),
      ].some((value) => value.toLowerCase().includes(q));
    const matchCategory =
      !selectedCategory || place.category === selectedCategory;
    const matchFeature =
      !selectedFeature ||
      place.features.some((feature) =>
        feature.toLowerCase().includes(selectedFeature.toLowerCase())
      );
    return matchSearch && matchCategory && matchFeature;
  });

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        highContrast ? "bg-black text-yellow-300" : "bg-[#f6f9fc] text-slate-900"
      } ${
        fontScale === 0
          ? "text-[15px]"
          : fontScale === 1
          ? "text-[17px] leading-relaxed"
          : "text-[19px] leading-loose"
      }`}
    >
      {/* Header bar / Navbar */}
      <Navbar
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontScale={fontScale}
        setFontScale={setFontScale}
      />

      {/* Main Content Rendered Based On Active View */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-5 py-8 lg:px-8 lg:py-10">
        {effectiveView === "user-panel" && <UserPanel />}
        {effectiveView === "owner-panel" && <OwnerPanel />}
        {effectiveView === "admin-panel" && <AdminPanel />}

        {effectiveView === "explore" && (
          <HomeView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
            filteredPlaces={filteredPlaces}
            selectedPlace={selectedPlace}
            setSelectedPlaceId={setSelectedPlaceId}
            isSyncingPlaces={isSyncingPlaces}
            onSyncPlaces={syncPlacesFromOSM}
            onOpenReview={() => setShowReviewModal(true)}
            onOpenVerify={() => setShowVerifyModal(true)}
          />
        )}

        {/* Modals */}
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

        {showReviewModal && (
          <ReviewForm
            place={selectedPlace}
            onClose={() => setShowReviewModal(false)}
            authorName={currentUser?.name}
          />
        )}

        {showVerifyModal && (
          <QuickVerifyModal
            place={selectedPlace}
            isOpen={showVerifyModal}
            onClose={() => setShowVerifyModal(false)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
