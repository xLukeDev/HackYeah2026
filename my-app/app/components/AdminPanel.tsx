"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Place, Report } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  Plus,
  Trash2,
  Search,
  Filter,
  Users,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

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
  } = useApp();

  const [reportFilter, setReportFilter] = useState<"all" | "pending" | "resolved">("pending");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);

  // New place form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Place["category"]>("restauracje");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newHours, setNewHours] = useState("09:00 - 20:00");
  const [newDescription, setNewDescription] = useState("");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <ShieldAlert className="mx-auto h-12 w-12 text-purple-700 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">
            Panel Administratora Miejskiego
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Dostęp zastrzeżony dla Wydziału Polityki Społecznej i ds. Dostępności Urzędu Miasta Krakowa oraz certyfikowanych audytorów.
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
  const displayedReports = reports.filter((r) => {
    if (reportFilter === "pending") return r.status === "Oczekujące";
    if (reportFilter === "resolved") return r.status === "Potwierdzone" || r.status === "Odrzucone";
    return true;
  });

  const handleResolve = (
    reportId: string,
    status: Report["status"]
  ) => {
    const note = adminNotes[reportId] || "Rozpatrzono przez Administratora Miejskiego.";
    updateReportStatus(reportId, status, note);
  };

  const handleCreatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) return;

    const categoryLabels: Record<Place["category"], string> = {
      restauracje: "Restauracje",
      kultura: "Kultura",
      sport: "Sport i Rekreacja",
      zdrowie: "Zdrowie i Urzędy",
    };

    addNewPlace({
      name: newName.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      address: newAddress.trim(),
      hours: newHours,
      phone: newPhone || "+48 12 000 00 00",
      x: 50,
      y: 50,
      description: newDescription || "Nowo dodany obiekt miejski weryfikowany pod kątem dostępności.",
      features: ["Wejście bezprogowe (poziom 0)", "Toaleta przystosowana"],
      accessibility: [
        {
          label: "Wejście bezprogowe",
          value: "Dostępne",
          source: "Urząd Miasta",
          date: new Date().toISOString().slice(0, 10),
          reliability: "Potwierdzone",
        },
      ],
      verified: true,
    });

    setNewName("");
    setNewAddress("");
    setNewDescription("");
    setShowAddPlaceModal(false);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg border border-purple-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">Panel Administratora Miejskiego</h1>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-xs font-semibold">
                  Nadzór i Moderacja
                </Badge>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Zalogowano jako: <strong>{currentUser.name}</strong> ({currentUser.badge})
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Weryfikuj zgłoszenia mieszkańców, zarządzaj bazą lokali i zatwierdzaj certyfikaty dostępności.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm border border-white/15">
            <div className="text-center">
              <span className="block text-2xl font-black text-white">{places.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Obiektów</span>
            </div>
            <div className="text-center border-l border-white/15 pl-4">
              <span className="block text-2xl font-black text-amber-300">{pendingReports.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Do weryfikacji</span>
            </div>
            <div className="text-center border-l border-white/15 pl-4">
              <span className="block text-2xl font-black text-white">{reviews.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Opinii</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Verification Queue Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Kolejka moderacyjna
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Zgłoszenia barier i weryfikacje cech ({displayedReports.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Przeanalizuj zgłoszenie mieszkańca i zaktualizuj stan infrastruktury w bazie.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setReportFilter("pending")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  reportFilter === "pending"
                    ? "bg-purple-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Oczekujące ({pendingReports.length})
              </button>
              <button
                onClick={() => setReportFilter("resolved")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  reportFilter === "resolved"
                    ? "bg-purple-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Rozpatrzone
              </button>
              <button
                onClick={() => setReportFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  reportFilter === "all"
                    ? "bg-purple-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Wszystkie
              </button>
            </div>
          </div>

          {displayedReports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
              Brak zgłoszeń w tej kategorii. Wszystkie sprawy zostały rozpatrzone na bieżąco!
            </div>
          ) : (
            <div className="space-y-4">
              {displayedReports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-shadow hover:bg-white hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-[10px]">
                          {rep.category}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          Zgłosił: <strong>{rep.userName}</strong> ({rep.createdAt})
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {rep.title}
                      </h3>
                      <p className="text-xs font-semibold text-blue-700 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5" /> Dotyczy obiektu: {rep.placeName}
                      </p>
                    </div>

                    <Badge
                      className={`text-xs font-bold ${
                        rep.status === "Potwierdzone"
                          ? "bg-emerald-100 text-emerald-800"
                          : rep.status === "Oczekujące"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {rep.status}
                    </Badge>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-700">
                    {rep.description}
                  </p>

                  {rep.notes && (
                    <div className="mt-3 rounded-xl bg-purple-50 border border-purple-200 p-2.5 text-xs text-purple-900">
                      <strong>Notatka urzędowa:</strong> {rep.notes}
                    </div>
                  )}

                  {/* Actions for pending reports */}
                  {rep.status === "Oczekujące" && (
                    <div className="mt-4 border-t border-slate-200 pt-3">
                      <div className="mb-2">
                        <input
                          type="text"
                          value={adminNotes[rep.id] || ""}
                          onChange={(e) =>
                            setAdminNotes((prev) => ({
                              ...prev,
                              [rep.id]: e.target.value,
                            }))
                          }
                          placeholder="Dodaj notatkę inspekcyjną (np. Sprawdzono w terenie, przekazano do zarządcy)..."
                          className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none focus:border-purple-600"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleResolve(rep.id, "Potwierdzone")}
                          className="bg-emerald-600 font-bold text-white hover:bg-emerald-700 h-8 text-xs"
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Zatwierdź jako Potwierdzone
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleResolve(rep.id, "W realizacji")}
                          className="bg-blue-600 font-bold text-white hover:bg-blue-700 h-8 text-xs"
                        >
                          <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                          Skieruj do zarządcy obiektu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(rep.id, "Odrzucone")}
                          className="text-slate-600 hover:text-red-700 h-8 text-xs"
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Odrzuć
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Places Registry Management Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Miejska Baza Danych
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Katalog obiektów w Krakowie ({places.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dodawaj nowe obiekty użyteczności publicznej lub edytuj istniejące.
              </p>
            </div>
            <Button
              onClick={() => setShowAddPlaceModal(true)}
              className="bg-purple-700 font-bold text-white hover:bg-purple-800 rounded-xl text-xs"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Dodaj nowy obiekt do bazy
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <div
                key={place.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/40 p-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      {place.categoryLabel}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                      Zweryfikowany
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{place.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" /> {place.address}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {place.features.slice(0, 3).map((feat) => (
                      <span
                        key={feat}
                        className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700"
                      >
                        {feat}
                      </span>
                    ))}
                    {place.features.length > 3 && (
                      <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold text-purple-700">
                        +{place.features.length - 3} więcej
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] text-slate-400">
                  <span>Ocena: {place.rating || 5}.0 ({place.reviewsCount || 1} opinii)</span>
                  <span className="font-bold text-purple-700 cursor-pointer hover:underline" onClick={() => setActiveView("explore")}>
                    Zobacz na mapie
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Reviews Moderation Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Moderacja Treści
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Wszystkie opinie mieszkańców ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dbaj o kulturę wypowiedzi i merytoryczność ocen dostępności.
            </p>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rev.author}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {rev.role}
                    </Badge>
                    <span className="text-slate-400">• {rev.place} •</span>
                    <span className="text-slate-400">{rev.date}</span>
                  </div>
                  <p className="mt-1.5 text-slate-700 leading-normal">“{rev.text}”</p>
                </div>

                <button
                  onClick={() => deleteReview(rev.id)}
                  className="shrink-0 text-slate-400 hover:text-red-600 transition-colors p-1"
                  title="Usuń opinię jako moderator"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Place Modal */}
      {showAddPlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAddPlaceModal(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Dodaj nowy obiekt miejski do rejestru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Wprowadź dane instytucji, kawiarni lub punktu obsługi mieszkańców.
            </p>

            <form onSubmit={handleCreatePlace} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Nazwa lokalu / obiektu</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="np. Nowa Biblioteka Miejska"
                  required
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-purple-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Kategoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Place["category"])}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-purple-700"
                  >
                    <option value="restauracje">Restauracje</option>
                    <option value="kultura">Kultura</option>
                    <option value="sport">Sport</option>
                    <option value="zdrowie">Zdrowie i Urzędy</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Godziny otwarcia</label>
                  <input
                    type="text"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    placeholder="08:00 - 20:00"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Adres w Krakowie</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="np. ul. Karmelicka 12, Kraków"
                  required
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-purple-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Opis obiektu i dostępności</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Krótki opis przestrzeni, udogodnień i wejścia..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-purple-700"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddPlaceModal(false)}
                  className="text-xs"
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-700 font-bold text-white hover:bg-purple-800 text-xs"
                >
                  Zapisz i opublikuj w rejestrze
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
