"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { ACCESSIBILITY_CATALOG } from "@/lib/initial-data";
import { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Send,
  Sparkles,
  Download,
  AlertCircle,
  Plus,
} from "lucide-react";
import { AccessibilityIcon } from "@/components/AccessibilityIcon";

export default function OwnerPanel() {
  const {
    currentUser,
    places,
    reviews,
    updatePlaceFeatures,
    updatePlaceDetails,
    addOwnerReply,
    openAuthModal,
    setActiveView,
  } = useApp();

  // If not logged in as owner, show prompt
  if (!currentUser || currentUser.role !== "owner") {
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

  // Get places owned by this user (or fallback to first 2 places)
  const ownedPlaces = places.filter((p) =>
    currentUser.ownedPlaceIds?.includes(p.id) || p.ownerId === currentUser.id
  ).length > 0
    ? places.filter((p) =>
        currentUser.ownedPlaceIds?.includes(p.id) || p.ownerId === currentUser.id
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
  const [phone, setPhone] = useState(currentPlace?.phone || "");
  const [description, setDescription] = useState(currentPlace?.description || "");
  const [detailsSaved, setDetailsSaved] = useState(false);

  // Owner reply input per review
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const handlePlaceChange = (placeId: string) => {
    setSelectedPlaceId(placeId);
    const p = places.find((item) => item.id === placeId);
    if (p) {
      setSelectedFeatures(p.features);
      setHours(p.hours);
      setPhone(p.phone);
      setDescription(p.description);
    }
  };

  const toggleFeature = (label: string) => {
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
    updatePlaceDetails(currentPlace.id, { hours, phone, description });
    setDetailsSaved(true);
    setTimeout(() => setDetailsSaved(false), 2000);
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyTexts[reviewId]?.trim();
    if (!text) return;
    addOwnerReply(reviewId, text);
    setReplyTexts((prev) => ({ ...prev, [reviewId]: "" }));
  };

  // Filter reviews for the currently selected place
  const placeReviews = reviews.filter((r) => r.placeId === currentPlace.id);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg border border-blue-400">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">Panel Właściciela Obiektu</h1>
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 text-xs font-semibold">
                  Zarządca zweryfikowany
                </Badge>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                Zalogowano jako: <strong>{currentUser.name}</strong> ({currentUser.email})
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Deklaruj udogodnienia, audytuj lokal i buduj zaufanie klientów ze szczególnymi potrzebami.
              </p>
            </div>
          </div>

          {/* Place Switcher */}
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm border border-white/15">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-200 mb-1">
              Wybierz zarządzany obiekt:
            </label>
            <select
              value={currentPlace.id}
              onChange={(e) => handlePlaceChange(e.target.value)}
              className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white border border-slate-700 outline-none"
            >
              {ownedPlaces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Accessibility Checklist & Details */}
        <div className="space-y-8 lg:col-span-2">
          {/* Accessibility Checklist Box */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Audyt i deklaracja udogodnień
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Dostępność: {currentPlace.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Zaznacz wszystkie cechy, które są obecnie w 100% sprawne i dostępne dla gości.
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                {selectedFeatures.length} aktywnych cech
              </span>
            </div>

            {savedSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Cechy dostępności zostały pomyślnie zaktualizowane w bazie miejskiej!
              </div>
            )}

            <div className="grid gap-2.5 sm:grid-cols-2">
              {ACCESSIBILITY_CATALOG.map((item) => {
                const isChecked = selectedFeatures.includes(item.label);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleFeature(item.label)}
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                      isChecked
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <AccessibilityIcon id={item.id} name={item.label} className="h-5 w-5 shrink-0 text-blue-700 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.category}
                        </span>
                        {isChecked && (
                          <CheckCircle2 className="h-4 w-4 text-blue-700" />
                        )}
                      </div>
                      <p className="text-xs font-bold mt-0.5 leading-snug">{item.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-500">
                Zmiany pojawią się natychmiast na interaktywnej mapie.
              </span>
              <Button
                onClick={handleSaveFeatures}
                className="bg-blue-700 font-bold text-white hover:bg-blue-800 rounded-xl px-5"
              >
                Zapisz cechy obiektu
              </Button>
            </div>
          </div>

          {/* Place Details Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Wizytówka i kontakt dla gości
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Ułatw osobom ze szczególnymi potrzebami bezpośredni kontakt przed wizytą.
            </p>

            {detailsSaved && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Dane kontaktowe i godziny zostały zaktualizowane!
              </div>
            )}

            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Godziny otwarcia
                  </label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="np. 08:00 - 22:00"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-blue-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Numer telefonu do asysty / rezerwacji
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+48 12 000 00 00"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Opis architektoniczny i wskazówki dojazdu
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Opisz jak najłatwiej dotrzeć z przystanku, czy jest dzwonek przy wejściu, jak wygląda korytarz..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 outline-none focus:border-blue-700"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-700 font-bold text-white hover:bg-blue-800 rounded-xl"
                >
                  Zaktualizuj dane wizytówki
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Reviews & Responses + Accessibility Certificate */}
        <div className="space-y-8">
          {/* Certificate Card */}
          <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/60 to-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Certyfikat Dostępności 2026
            </div>
            <h4 className="mt-2 text-lg font-black text-slate-900">
              {currentPlace.name}
            </h4>
            <p className="mt-1 text-xs text-slate-600">
              Poziom:{" "}
              <strong className="text-emerald-700 font-bold">
                {selectedFeatures.length >= 4 ? "Złoty Standard Dostępności" : "Srebrny Standard"}
              </strong>
            </p>

            <div className="mt-4 rounded-2xl bg-white border border-amber-200 p-4 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-emerald-600 mb-2" />
              <div className="text-xs font-bold text-slate-800">
                OFICJALNY ZNAK MIEJSKI
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Potwierdzono w miejskim rejestrze dostępności architektonicznej Krakowa.
              </p>
              <Button
                variant="outline"
                onClick={() => alert("Generowanie pliku certyfikatu PDF z kodem QR...")}
                className="mt-3 w-full border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-50"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Pobierz naklejkę na drzwi (PDF)
              </Button>
            </div>
          </div>

          {/* Place Reviews and Owner Responses */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Opinie gości obiektu ({placeReviews.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Odpowiadaj oficjalnie na opinie gości
                </p>
              </div>
              <span className="flex items-center gap-1 font-bold text-amber-600 text-xs">
                <Star className="h-3.5 w-3.5 fill-current" />
                {currentPlace.rating || 5}.0
              </span>
            </div>

            {placeReviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Brak opinii dla tego lokalu. Zachęć klientów do wystawienia recenzji!
              </p>
            ) : (
              <div className="space-y-4">
                {placeReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{rev.author}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3 w-3 ${s <= rev.rating ? "fill-current" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-slate-700 leading-relaxed">{rev.text}</p>

                    {/* Official Response */}
                    {rev.ownerReply ? (
                      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/90 p-2.5">
                        <span className="font-bold text-blue-900 block text-[11px]">
                          Twoja odpowiedź ({rev.ownerReply.date}):
                        </span>
                        <p className="text-slate-700 mt-0.5">{rev.ownerReply.text}</p>
                      </div>
                    ) : (
                      <div className="mt-3 pt-2 border-t border-slate-200">
                        <input
                          type="text"
                          value={replyTexts[rev.id] || ""}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({
                              ...prev,
                              [rev.id]: e.target.value,
                            }))
                          }
                          placeholder="Napisz odpowiedź właściciela..."
                          className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none focus:border-blue-700"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSendReply(rev.id)}
                          className="mt-2 h-7 bg-blue-700 text-[11px] font-bold text-white hover:bg-blue-800"
                        >
                          <Send className="mr-1 h-3 w-3" />
                          Odpowiedz oficjalnie
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
