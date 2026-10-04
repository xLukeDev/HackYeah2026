"use client";

import { useState, useEffect } from "react";
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

  // Synchronizacja trybu wysokiego kontrastu z elementem nadrzędnym HTML/BODY
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("dostepne_miasto_contrast");
    if (stored === "true") {
      setHighContrast(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
      document.body.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
      document.body.classList.remove("high-contrast");
    }
    localStorage.setItem("dostepne_miasto_contrast", String(highContrast));
  }, [highContrast]);

  // Skalowanie czcionki dla całego dokumentu
  useEffect(() => {
    if (typeof document === "undefined") return;
    const size = fontScale === 0 ? "16px" : fontScale === 1 ? "18px" : "20px";
    document.documentElement.style.fontSize = size;
  }, [fontScale]);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  // Uprawnienia do widoków: tylko te panele, do których użytkownik ma dostęp
  const effectiveView = (() => {
    if (activeView === "admin-panel" && currentUser?.role !== "admin") return "explore";
    if (activeView === "owner-panel" && currentUser?.role !== "owner") return "explore";
    if (activeView === "user-panel" && !currentUser) return "explore";
    return activeView;
  })();

  const filteredPlaces = places.filter((place) => {
    const rawQ = searchQuery.toLowerCase().trim();
    const cleanQ = rawQ.replace(/^#/, "");

    const matchCategory =
      !selectedCategory || place.category === selectedCategory;
    const matchFeature =
      !selectedFeature ||
      place.features.some((feature) =>
        feature.toLowerCase().includes(selectedFeature.toLowerCase())
      );

    if (!cleanQ) {
      if (place.id === selectedPlaceId) return true;
      return matchCategory && matchFeature;
    }

    const tokens = cleanQ.split(/\s+/).filter(Boolean);
    const searchableStrings = [
      place.name.toLowerCase(),
      place.address.toLowerCase(),
      place.categoryLabel.toLowerCase(),
      place.description.toLowerCase(),
      ...(place.tags || []).map((t) => t.toLowerCase()),
      ...place.features.map((f) => f.toLowerCase()),
      ...(place.accessibility || []).map((a) => `${a.label} ${a.value}`.toLowerCase()),
    ];

    const matchSearch = tokens.every((token) =>
      searchableStrings.some((str) => str.includes(token))
    );

    return matchSearch && matchCategory && matchFeature;
  });

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        highContrast ? "high-contrast bg-black text-yellow-300" : "bg-[#f6f9fc] text-slate-900"
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
