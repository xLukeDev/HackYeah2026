"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { MessageCircle, Flag, PlusCircle, ArrowRight } from "lucide-react";
import UserProfileHeader from "./user-panel/UserProfileHeader";
import UserReviewsTab from "./user-panel/UserReviewsTab";
import UserReportsTab from "./user-panel/UserReportsTab";
import UserNewReportForm from "./user-panel/UserNewReportForm";

export default function UserPanel() {
  const {
    currentUser,
    places,
    reviews,
    reports,
    deleteReview,
    addReport,
    setActiveView,
    openAuthModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"reviews" | "reports" | "new-report">("reviews");

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <MessageCircle className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">Zaloguj się, aby zobaczyć swój panel</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            W panelu mieszkańca możesz zarządzać swoimi opiniami, zgłoszeniami barier oraz zbierać punkty za weryfikację dostępności.
          </p>
          <Button
            onClick={openAuthModal}
            className="mt-6 bg-blue-700 font-bold text-white hover:bg-blue-800"
          >
            Zaloguj się teraz
          </Button>
        </div>
      </div>
    );
  }

  // Filter reviews written by this user (or fallback to author match)
  const myReviews = reviews.filter(
    (r) =>
      r.userId === currentUser.id ||
      r.author.toLowerCase().includes(currentUser.name.toLowerCase().split(" ")[0])
  );

  // Filter reports submitted by this user
  const myReports = reports.filter(
    (r) =>
      r.userId === currentUser.id ||
      r.userName.toLowerCase().includes(currentUser.name.toLowerCase().split(" ")[0])
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Profile Header */}
      <UserProfileHeader
        currentUser={currentUser}
        reviewsCount={myReviews.length}
        reportsCount={myReports.length}
      />

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "reviews"
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Moje opinie ({myReviews.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "reports"
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Flag className="h-4 w-4" />
            Moje zgłoszenia barier ({myReports.length})
          </button>
          <button
            onClick={() => setActiveTab("new-report")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "new-report"
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Zgłoś barierę / udogodnienie
          </button>
        </div>

        <Button
          variant="outline"
          onClick={() => setActiveView("explore")}
          className="text-xs font-semibold text-slate-700 hover:text-blue-700"
        >
          Powrót do mapy <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Active Tab Content */}
      {activeTab === "reviews" && (
        <UserReviewsTab
          reviews={myReviews}
          deleteReview={deleteReview}
          onExplore={() => setActiveView("explore")}
        />
      )}

      {activeTab === "reports" && (
        <UserReportsTab
          reports={myReports}
          onNewReport={() => setActiveTab("new-report")}
        />
      )}

      {activeTab === "new-report" && (
        <UserNewReportForm
          places={places}
          onSubmitReport={addReport}
          onSuccessDone={() => setActiveTab("reports")}
        />
      )}
    </div>
  );
}
