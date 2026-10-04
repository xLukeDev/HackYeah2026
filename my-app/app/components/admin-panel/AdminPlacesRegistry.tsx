"use client";

import { useState } from "react";
import { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, ShieldCheck, Clock, AlertTriangle, XCircle, Trash2, Building2, Info, CheckCircle2 } from "lucide-react";

interface AdminPlacesRegistryProps {
  places: Place[];
  onAddNewPlace: (placeData: {
    name: string;
    category: Place["category"];
    categoryLabel: string;
    address: string;
    hours: string;
    x: number;
    y: number;
    description: string;
    features: string[];
    accessibility: Place["accessibility"];
    verified: boolean;
  }) => void;
  onDeletePlace?: (
    placeId: string,
    reason?: string
  ) => { ownerNotified: boolean; ownerName?: string; placeName: string };
  onExplore: (placeId: string) => void;
}

export default function AdminPlacesRegistry({
  places,
  onAddNewPlace,
  onDeletePlace,
  onExplore,
}: AdminPlacesRegistryProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Place["category"]>("restauracje");
  const [newAddress, setNewAddress] = useState("");
  const [newHours, setNewHours] = useState("09:00 - 20:00");
  const [newDescription, setNewDescription] = useState("");

  const handleCreatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) return;

    const categoryLabels: Record<Place["category"], string> = {
      restauracje: "Gastronomia",
      kultura: "Kultura",
      sport: "Sport i Rekreacja",
      zdrowie: "Zdrowie i Urzędy",
    };

    onAddNewPlace({
      name: newName.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      address: newAddress.trim(),
      hours: newHours,
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
    setShowAddModal(false);
  };

  const [statusFilter, setStatusFilter] = useState<"all" | "certified" | "pending" | "needs_fix">("all");
  const [placeToDelete, setPlaceToDelete] = useState<Place | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [notificationFeedback, setNotificationFeedback] = useState<string | null>(null);

  const certifiedCount = places.filter((p) => p.verified || p.verificationStatus === "zatwierdzony").length;
  const pendingCount = places.filter((p) => (!p.verified && p.verificationStatus !== "do_poprawy" && p.verificationStatus !== "odrzucony") || p.verificationStatus === "oczekuje").length;
  const needsFixCount = places.filter((p) => p.verificationStatus === "do_poprawy").length;

  const handleConfirmDelete = () => {
    if (!placeToDelete || !onDeletePlace) return;
    const res = onDeletePlace(placeToDelete.id, deleteReason);
    setNotificationFeedback(
      `Obiekt "${res.placeName}" został usunięty z rejestru miejskiego.${
        res.ownerNotified
          ? ` Właściciel (${res.ownerName || "Zarządca"}) został powiadomiony w swoim panelu.`
          : " Obiekt usunięty z bazy miejskiej."
      }`
    );
    setPlaceToDelete(null);
    setDeleteReason("");
  };

  const filteredPlaces = places.filter((p) => {
    const isCertified = p.verified || p.verificationStatus === "zatwierdzony";
    const isNeedsFix = p.verificationStatus === "do_poprawy";
    const isPending = !isCertified && !isNeedsFix && p.verificationStatus !== "odrzucony";

    if (statusFilter === "certified") return isCertified;
    if (statusFilter === "pending") return isPending;
    if (statusFilter === "needs_fix") return isNeedsFix;
    return true;
  });

  return (
    <div id="rejestr-lokali" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs scroll-mt-24">
      {notificationFeedback && (
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notificationFeedback}</span>
          </div>
          <button
            onClick={() => setNotificationFeedback(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 px-2 py-0.5 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            Zamknij
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Miejska Baza Danych
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Katalog obiektów w Krakowie ({places.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Przeglądaj statusy weryfikacji miejskiej lub rejestruj nowe instytucje.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-700 font-bold text-white hover:bg-purple-800 rounded-xl text-xs shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Dodaj nowy obiekt do bazy
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === "all"
              ? "bg-purple-700 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Wszystkie ({places.length})
        </button>
        <button
          onClick={() => setStatusFilter("certified")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === "certified"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Zweryfikowane ({certifiedCount})
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === "pending"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Oczekujące na audyt ({pendingCount})
        </button>
        {needsFixCount > 0 && (
          <button
            onClick={() => setStatusFilter("needs_fix")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "needs_fix"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Do poprawy ({needsFixCount})
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlaces.map((place) => {
          const isCertified = place.verified || place.verificationStatus === "zatwierdzony";
          const isNeedsFix = place.verificationStatus === "do_poprawy";
          const isRejected = place.verificationStatus === "odrzucony";
          const isPending = !isCertified && !isNeedsFix && !isRejected;

          return (
            <div
              key={place.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/40 p-4 transition-all hover:border-slate-300"
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    {place.categoryLabel}
                  </span>
                  {isCertified && (
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300 font-bold">
                      <ShieldCheck className="h-3 w-3 mr-1 inline" />
                      Zweryfikowany
                    </Badge>
                  )}
                  {isPending && (
                    <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-300 font-bold">
                      <Clock className="h-3 w-3 mr-1 inline" />
                      Oczekuje na audyt
                    </Badge>
                  )}
                  {isNeedsFix && (
                    <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-800 border-orange-300 font-bold">
                      <AlertTriangle className="h-3 w-3 mr-1 inline" />
                      Do poprawy
                    </Badge>
                  )}
                  {isRejected && (
                    <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-800 border-rose-300 font-bold">
                      <XCircle className="h-3 w-3 mr-1 inline" />
                      Odrzucony
                    </Badge>
                  )}
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
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    className="flex items-center gap-1 font-bold text-purple-700 hover:text-purple-900 hover:underline transition-colors cursor-pointer"
                    onClick={() => onExplore(place.id)}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Pokaż na mapie
                  </button>
                  {onDeletePlace && (
                    <button
                      type="button"
                      className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-800 hover:underline transition-colors cursor-pointer"
                      onClick={() => {
                        setPlaceToDelete(place);
                        setDeleteReason("");
                      }}
                      title="Usuń obiekt z rejestru miejskiego"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Usuń
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Place Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
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
                    <option value="restauracje">Gastronomia</option>
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
                  onClick={() => setShowAddModal(false)}
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

      {/* Delete Confirmation Modal */}
      {placeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setPlaceToDelete(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Usuwanie lokalu z rejestru miejskiego
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Operacja wykreśli obiekt z mapy i oficjalnej bazy dostępności.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 space-y-1 text-xs">
              <div className="font-bold text-slate-900">{placeToDelete.name}</div>
              <div className="text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-purple-700" />
                {placeToDelete.address}
              </div>
              <div className="text-slate-400 text-[11px] pt-1">
                Kategoria: {placeToDelete.categoryLabel} · ID: #{placeToDelete.id}
              </div>
            </div>

            {/* Owner info */}
            {placeToDelete.ownerId || placeToDelete.submittedByOwnerName ? (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 flex items-start gap-2.5">
                <Building2 className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Zarządca lokalu otrzyma powiadomienie:</span>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    Właściciel <strong>{placeToDelete.submittedByOwnerName || "Zarejestrowany właściciel"}</strong> zostanie poinformowany o usunięciu obiektu w swoim panelu.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  Obiekt publiczny z bazy OpenStreetMap (brak powiązanego profilu właściciela).
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Powód usunięcia (widoczny w powiadomieniu właściciela):
              </label>
              <textarea
                rows={3}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="np. Trwała likwidacja działalności, niespełnianie wymogów dostępności architektonicznej UMK, rozbieżność z audytem..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-rose-600 transition-colors"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPlaceToDelete(null)}
                className="flex-1 rounded-xl text-xs font-bold"
              >
                Anuluj
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                {placeToDelete.ownerId || placeToDelete.submittedByOwnerName
                  ? "Usuń i powiadom"
                  : "Potwierdź usunięcie"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
