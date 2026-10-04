"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import OwnerHeader from "./owner-panel/OwnerHeader";
import OwnerNotificationsBanner from "./owner-panel/OwnerNotificationsBanner";
import OwnerRegisterPlaceForm from "./owner-panel/OwnerRegisterPlaceForm";
import OwnerVerificationBanner from "./owner-panel/OwnerVerificationBanner";
import OwnerAccessibilityAudit from "./owner-panel/OwnerAccessibilityAudit";
import OwnerPlaceDetailsForm from "./owner-panel/OwnerPlaceDetailsForm";
import OwnerCertificateCard from "./owner-panel/OwnerCertificateCard";
import OwnerReviewsList from "./owner-panel/OwnerReviewsList";

export default function OwnerPanel() {
  const {
    currentUser,
    places,
    reviews,
    notifications,
    dismissNotification,
    updatePlaceFeatures,
    updatePlaceDetails,
    addOwnerReply,
    addNewPlace,
    openAuthModal,
    switchRole,
  } = useApp();

  const isOwner = currentUser?.role === "owner";

  // Get places owned by this user (or fallback to first 2 places)
  const ownedPlaces = places.filter((p) =>
    currentUser?.ownedPlaceIds?.includes(p.id) || p.ownerId === currentUser?.id
  ).length > 0
    ? places.filter((p) =>
        currentUser?.ownedPlaceIds?.includes(p.id) || p.ownerId === currentUser?.id
      )
    : places.slice(0, 2);

  const [selectedPlaceId, setSelectedPlaceId] = useState(ownedPlaces[0]?.id || places[0]?.id);
  const currentPlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  // Local state for feature checkboxes
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    currentPlace ? currentPlace.features : []
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Edit details state
  const [hours, setHours] = useState(currentPlace?.hours || "");
  const [description, setDescription] = useState(currentPlace?.description || "");
  const [detailsSaved, setDetailsSaved] = useState(false);

  // If not logged in as owner, show prompt
  if (!currentUser || !isOwner) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <Building2 className="mx-auto h-12 w-12 text-blue-700 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">
            Panel Właściciela i Zarządcy Obiektu
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Zaloguj się jako właściciel lokalu, aby audytować cechy dostępności, odpowiadać na opinie gości i pobrać certyfikat dostępności miejskiej.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={openAuthModal}
              className="bg-blue-700 font-bold text-white hover:bg-blue-800"
            >
              Zaloguj się jako Właściciel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceChange = (placeId: string) => {
    setSelectedPlaceId(placeId);
    const p = places.find((item) => item.id === placeId);
    if (p) {
      setSelectedFeatures(p.features);
      setHours(p.hours);
      setDescription(p.description);
    }
  };

  const handleToggleFeature = (label: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const handleSaveFeatures = () => {
    updatePlaceFeatures(currentPlace.id, selectedFeatures);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlaceDetails(currentPlace.id, { hours, description });
    setDetailsSaved(true);
    setTimeout(() => setDetailsSaved(false), 2000);
  };

  const handlePlaceRegistered = (newPlace: Place) => {
    setSelectedPlaceId(newPlace.id);
    setSelectedFeatures(newPlace.features);
    setHours(newPlace.hours);
    setDescription(newPlace.description);
  };

  // Filter reviews for the currently selected place
  const placeReviews = reviews.filter((r) => r.placeId === currentPlace.id);

  // Filter notifications for this owner
  const ownerNotifications = notifications.filter(
    (n) => !n.recipientOwnerId || n.recipientOwnerId === currentUser.id
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header Banner */}
      <OwnerHeader
        currentUser={currentUser}
        places={ownedPlaces}
        selectedPlaceId={currentPlace.id}
        onPlaceChange={handlePlaceChange}
      />

      {/* Municipal Administrative Notifications */}
      <OwnerNotificationsBanner
        notifications={ownerNotifications}
        onDismiss={dismissNotification}
      />

      {/* Register New Place Form Section */}
      <OwnerRegisterPlaceForm
        currentUser={currentUser}
        addNewPlace={addNewPlace}
        onPlaceRegistered={handlePlaceRegistered}
      />

      {/* Main Grid: 2 Columns */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Verification Banner, Accessibility Checklist & Place Details */}
        <div className="space-y-8 lg:col-span-2">
          {/* Municipal Verification Status Banner */}
          <OwnerVerificationBanner
            currentPlace={currentPlace}
            onSimulateAdmin={() => switchRole("admin")}
          />

          {/* Accessibility Checklist Box */}
          <OwnerAccessibilityAudit
            currentPlace={currentPlace}
            selectedFeatures={selectedFeatures}
            savedSuccess={savedSuccess}
            onToggleFeature={handleToggleFeature}
            onSaveFeatures={handleSaveFeatures}
          />

          {/* Place Details Form */}
          <OwnerPlaceDetailsForm
            hours={hours}
            description={description}
            detailsSaved={detailsSaved}
            onHoursChange={setHours}
            onDescriptionChange={setDescription}
            onSubmit={handleSaveDetails}
          />
        </div>

        {/* Right Col: Certificate Card + Place Reviews */}
        <div className="space-y-8">
          <OwnerCertificateCard
            currentPlace={currentPlace}
            featuresCount={selectedFeatures.length}
            onSwitchToAdmin={() => switchRole("admin")}
          />

          <OwnerReviewsList
            currentPlace={currentPlace}
            reviews={placeReviews}
            onSendReply={addOwnerReply}
          />
        </div>
      </div>
    </div>
  );
}
