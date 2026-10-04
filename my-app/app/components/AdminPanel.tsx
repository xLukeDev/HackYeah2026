"use client";

import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import AdminHeader from "./admin-panel/AdminHeader";
import AdminOwnerVerificationQueue from "./admin-panel/AdminOwnerVerificationQueue";
import AdminReportsQueue from "./admin-panel/AdminReportsQueue";
import AdminPlacesRegistry from "./admin-panel/AdminPlacesRegistry";
import AdminReviewsModeration from "./admin-panel/AdminReviewsModeration";

export default function AdminPanel() {
  const {
    currentUser,
    places,
    reports,
    reviews,
    updateReportStatus,
    deleteReview,
    addNewPlace,
    openAuthModal,
    setActiveView,
    verifyPlace,
    simulateOwnerSubmission,
    showPlaceOnMap,
  } = useApp();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <ShieldAlert className="mx-auto h-12 w-12 text-purple-700 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">
            Panel Administratora Miejskiego
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Dostęp zastrzeżony dla Urzędu Miasta oraz certyfikowanych audytorów.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={openAuthModal}
              className="bg-purple-700 font-bold text-white hover:bg-purple-800"
            >
              Zaloguj się jako Administrator
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === "Oczekujące");
  const ownerSubmittedPlaces = places.filter(
    (p) => p.ownerId || p.verificationStatus || p.submittedByOwnerName || !p.verified
  );
  const pendingOwnerPlaces = ownerSubmittedPlaces.filter(
    (p) =>
      p.verificationStatus === "oczekuje" ||
      (!p.verified && p.verificationStatus !== "odrzucony" && p.verificationStatus !== "do_poprawy")
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header Banner & Metrics */}
      <AdminHeader
        currentUser={currentUser}
        placesCount={places.length}
        pendingOwnerPlacesCount={pendingOwnerPlaces.length}
        pendingReportsCount={pendingReports.length}
        reviewsCount={reviews.length}
      />

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* SECTION 1: Weryfikacja Nowych Lokali (Zgłoszenia Właścicieli) */}
        <AdminOwnerVerificationQueue
          places={places}
          onVerifyPlace={verifyPlace}
          onSimulateOwnerSubmission={simulateOwnerSubmission}
          onExplore={showPlaceOnMap}
        />

        {/* SECTION 2: Kolejka moderacyjna zgłoszeń barier */}
        <AdminReportsQueue
          reports={reports}
          onUpdateReportStatus={updateReportStatus}
        />

        {/* SECTION 3: Miejska Baza Danych (Katalog obiektów) */}
        <AdminPlacesRegistry
          places={places}
          onAddNewPlace={addNewPlace}
          onExplore={showPlaceOnMap}
        />

        {/* SECTION 4: Moderacja opinii mieszkańców */}
        <AdminReviewsModeration
          reviews={reviews}
          onDeleteReview={deleteReview}
        />
      </div>
    </div>
  );
}
