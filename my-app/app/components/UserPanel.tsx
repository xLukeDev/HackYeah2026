"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Flag,
  Award,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Clock,
  Building,
  ArrowRight,
  Star,
  MapPin,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function UserPanel() {
  const {
    currentUser,
    places,
    reviews,
    reports,
    deleteReview,
    addReport,
    setActiveView,
    openReviewForPlace,
    openAuthModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"reviews" | "reports" | "new-report">("reviews");

  // New report form state
  const [selectedPlaceId, setSelectedPlaceId] = useState(places[0]?.id || "");
  const [reportCategory, setReportCategory] = useState("Rampy i wejścia");
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

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

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDesc.trim()) return;

    addReport({
      placeId: selectedPlaceId,
      category: reportCategory,
      title: reportTitle.trim(),
      description: reportDesc.trim(),
    });

    setReportSuccess(true);
    setReportTitle("");
    setReportDesc("");
    setTimeout(() => {
      setReportSuccess(false);
      setActiveTab("reports");
    }, 1200);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-2xl" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-900 text-xl font-black shadow-md border-2 border-cyan-300">
              {currentUser.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{currentUser.name}</h1>
                <Badge className="bg-cyan-400/20 text-cyan-200 border-cyan-300/30 text-xs font-semibold">
                  {currentUser.roleLabel}
                </Badge>
              </div>
              <p className="text-xs text-blue-200 mt-1">{currentUser.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-300/30 px-2.5 py-0.5 text-xs font-bold text-amber-200">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  {currentUser.badge}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-white/20 sm:pl-8">
            <div className="text-center">
              <span className="block text-3xl font-black tracking-tight text-white">
                {currentUser.points}
              </span>
              <span className="text-[11px] font-medium text-cyan-200 uppercase tracking-wider">
                Punkty Społeczności
              </span>
            </div>
            <div className="text-center border-l border-white/10 pl-4">
              <span className="block text-3xl font-black tracking-tight text-white">
                {myReviews.length}
              </span>
              <span className="text-[11px] font-medium text-cyan-200 uppercase tracking-wider">
                Opinie
              </span>
            </div>
            <div className="text-center border-l border-white/10 pl-4">
              <span className="block text-3xl font-black tracking-tight text-white">
                {myReports.length}
              </span>
              <span className="text-[11px] font-medium text-cyan-200 uppercase tracking-wider">
                Zgłoszenia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
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

      {/* Tab: Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {myReviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <MessageCircle className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">Nie dodałeś jeszcze żadnej opinii</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Przeglądaj lokale na mapie i oceń ich dostępność. Za każdą zatwierdzoną opinię otrzymasz 25 punktów!
              </p>
              <Button
                onClick={() => setActiveView("explore")}
                className="mt-4 bg-blue-700 text-xs font-bold text-white hover:bg-blue-800"
              >
                Przejdź do wyszukiwarki miejsc
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {myReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-blue-700">{rev.place}</span>
                        <div className="mt-1 flex items-center gap-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= rev.rating ? "fill-current" : "text-slate-200"
                              }`}
                            />
                          ))}
                          <span className="ml-1.5 text-xs font-bold text-slate-700">
                            {rev.rating}.0
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-700">“{rev.text}”</p>

                    {rev.verifiedFeatures && rev.verifiedFeatures.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {rev.verifiedFeatures.map((feat) => (
                          <span
                            key={feat}
                            className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-800 border border-cyan-200"
                          >
                            <CheckCircle2 className="h-3 w-3 text-cyan-600" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}

                    {rev.ownerReply && (
                      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900">
                          <Building className="h-3.5 w-3.5 text-blue-700" />
                          {rev.ownerReply.author}
                          <span className="ml-auto text-[10px] font-normal text-blue-600">
                            {rev.ownerReply.date}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-700 leading-normal">
                          {rev.ownerReply.text}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[11px] text-slate-400">
                      ID opinii: {rev.id.slice(0, 8)}
                    </span>
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                      title="Usuń opinię"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {myReports.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Flag className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">Brak zgłoszeń barier</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Zauważyłeś brak podjazdu, awarię windy lub złą nawierzchnię? Zgłoś to, a urzędnicy i zarządca obiektu zajmą się sprawą.
              </p>
              <Button
                onClick={() => setActiveTab("new-report")}
                className="mt-4 bg-blue-700 text-xs font-bold text-white hover:bg-blue-800"
              >
                Dodaj pierwsze zgłoszenie
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {myReports.map((rep) => {
                const statusStyles = {
                  Oczekujące: "bg-amber-50 text-amber-800 border-amber-200",
                  Potwierdzone: "bg-emerald-50 text-emerald-800 border-emerald-200",
                  "W realizacji": "bg-blue-50 text-blue-800 border-blue-200",
                  Odrzucone: "bg-slate-100 text-slate-600 border-slate-200",
                }[rep.status];

                return (
                  <div
                    key={rep.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {rep.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">
                            {rep.title}
                          </h4>
                          <p className="text-xs font-semibold text-blue-700 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {rep.placeName}
                          </p>
                        </div>
                        <Badge variant="outline" className={`font-bold text-xs ${statusStyles}`}>
                          {rep.status === "Oczekujące" && <Clock className="mr-1 h-3 w-3" />}
                          {rep.status === "Potwierdzone" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {rep.status === "W realizacji" && <AlertTriangle className="mr-1 h-3 w-3" />}
                          {rep.status}
                        </Badge>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-slate-600">
                        {rep.description}
                      </p>

                      {rep.notes && (
                        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700">
                          <span className="font-bold text-slate-900">Notatka weryfikatora:</span>{" "}
                          {rep.notes}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                      <span>Zgłoszono: {rep.createdAt}</span>
                      <span>Aktualizacja: {rep.updatedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: New Report Form */}
      {activeTab === "new-report" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Formularz zgłoszenia bariery lub udogodnienia
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Twoje zgłoszenie trafi bezpośrednio do Panelu Administratora miejskiego oraz właściciela lokalu.
            </p>
          </div>

          {reportSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mb-2" />
              <h4 className="text-base font-bold text-slate-900">Zgłoszenie zostało pomyślnie wysłane!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Przyznano +15 punktów za wkład w mapowanie dostępności.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateReport} className="space-y-4 max-w-2xl">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Wybierz lokal
                </label>
                <select
                  value={selectedPlaceId}
                  onChange={(e) => setSelectedPlaceId(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800"
                >
                  {places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.address})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Kategoria zgłoszenia
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800"
                >
                  <option value="Rampy i wejścia">Wejścia, progi i podjazdy</option>
                  <option value="Winda i komunikacja pionowa">Windy i schody</option>
                  <option value="Toaleta dostosowana">Toaleta dla osób z niepełnosprawnością</option>
                  <option value="Pętla indukcyjna i dźwięk">Pętla indukcyjna i audiodeskrypcja</option>
                  <option value="Tłumacz PJM">Tłumacz Polskiego Języka Migowego</option>
                  <option value="Weryfikacja udogodnień">Weryfikacja istniejącego udogodnienia</option>
                  <option value="Inne">Inne zgłoszenie architektoniczne lub cyfrowe</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Tytuł zgłoszenia
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="np. Zepsuty podnośnik schodowy lub Za wysoki próg"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Szczegółowy opis problemu / sugestii
                </label>
                <textarea
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Opisz dokładnie, w którym miejscu występuje bariera, jakiego sprzętu dotyczy oraz jaka zmiana umożliwiłaby swobodny dostęp..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 outline-none focus:border-blue-700"
                />
              </div>

              <Button
                type="submit"
                className="h-11 bg-blue-700 font-bold text-white hover:bg-blue-800 px-6 rounded-xl"
              >
                Prześlij zgłoszenie (+15 pkt)
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
