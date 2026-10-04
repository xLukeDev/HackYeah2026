"use client";

import { useState } from "react";
import { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  MapPin,
  FileCheck,
  CheckSquare,
  Square,
  Building,
} from "lucide-react";

interface AdminOwnerVerificationQueueProps {
  places: Place[];
  onVerifyPlace: (
    placeId: string,
    status: "zatwierdzony" | "do_poprawy" | "odrzucony",
    notes?: string
  ) => void;
  onSimulateOwnerSubmission: () => Place;
  onExplore?: (placeId: string) => void;
}

export default function AdminOwnerVerificationQueue({
  places,
  onVerifyPlace,
  onSimulateOwnerSubmission,
  onExplore,
}: AdminOwnerVerificationQueueProps) {
  const [filter, setFilter] = useState<"pending" | "approved" | "needs_fix" | "all">("pending");
  const [auditNotes, setAuditNotes] = useState<Record<string, string>>({});
  const [checklists, setChecklists] = useState<Record<string, Record<string, boolean>>>({});
  const [simulationSuccessMessage, setSimulationSuccessMessage] = useState<string | null>(null);

  const auditChecklistItems = [
    { id: "step_free", label: "Wejście bezprogowe (poziom 0 lub uskok max 2 cm)" },
    { id: "door_width", label: "Szerokość drzwi wejściowych min. 90 cm w świetle" },
    { id: "corridors", label: "Szerokie ciągi komunikacyjne i manewrowe (min. 120-150 cm)" },
    { id: "toilet", label: "Dostosowana toaleta z atestowanymi uchwytami i dzwonkiem" },
    { id: "loop", label: "Pętla indukcyjna na stanowisku obsługi przetestowana miernikiem" },
    { id: "guide_dog", label: "Wstęp i zaplecze dla psa przewodnika / asystującego" },
  ];

  const quickNotes = [
    "Pozytywny wynik audytu terenowego. Obiekt spełnia Standard Dostępności Miasta Krakowa.",
    "Wymagana niwelacja progu wejściowego lub montaż stałego podjazdu z poręczami.",
    "Pętla indukcyjna sprawna, zalecane dodanie piktogramu informacyjnego przy wejściu.",
    "Dostępne po wcześniejszym uzgodnieniu telefonicznym lub asyście personelu.",
  ];

  const ownerSubmittedPlaces = places.filter(
    (p) => p.ownerId || p.verificationStatus || p.submittedByOwnerName || !p.verified
  );

  const pendingOwnerPlaces = ownerSubmittedPlaces.filter(
    (p) =>
      p.verificationStatus === "oczekuje" ||
      (!p.verified && p.verificationStatus !== "odrzucony" && p.verificationStatus !== "do_poprawy")
  );

  const approvedOwnerPlaces = ownerSubmittedPlaces.filter(
    (p) => p.verificationStatus === "zatwierdzony" || (p.verified && !p.verificationStatus)
  );

  const needsFixOwnerPlaces = ownerSubmittedPlaces.filter(
    (p) => p.verificationStatus === "do_poprawy"
  );

  const displayedPlaces = ownerSubmittedPlaces.filter((p) => {
    if (filter === "pending") {
      return (
        p.verificationStatus === "oczekuje" ||
        (!p.verified && p.verificationStatus !== "odrzucony" && p.verificationStatus !== "do_poprawy")
      );
    }
    if (filter === "approved") {
      return p.verificationStatus === "zatwierdzony" || (p.verified && !p.verificationStatus);
    }
    if (filter === "needs_fix") {
      return p.verificationStatus === "do_poprawy";
    }
    return true;
  });

  const handleSimulate = () => {
    const newPlace = onSimulateOwnerSubmission();
    setSimulationSuccessMessage(
      `Pomyślnie wygenerowano nowe zgłoszenie od właściciela dla obiektu: "${newPlace.name}". Zgłoszenie trafiło na początek kolejki audytora.`
    );
    setFilter("pending");
    setTimeout(() => setSimulationSuccessMessage(null), 6000);
  };

  const toggleAuditCheck = (placeId: string, itemId: string) => {
    setChecklists((prev) => ({
      ...prev,
      [placeId]: {
        ...prev[placeId],
        [itemId]: !prev[placeId]?.[itemId],
      },
    }));
  };

  return (
    <section className="rounded-3xl border-2 border-purple-200 bg-white p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Oficjalny Rejestr Miejski
            </span>
            <Badge className="bg-purple-100 text-purple-900 border-purple-300 font-bold text-[10px]">
              Audyt Terenowy & Certyfikacja
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Weryfikacja Nowych Lokali (Zgłoszenia Właścicieli)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Przeanalizuj deklarację właściciela lokalu, wypełnij kartę inspekcyjną i nadaj oficjalny certyfikat dostępności lub wskaż niezbędne poprawki.
          </p>
        </div>

        <Button
          onClick={handleSimulate}
          className="bg-purple-700 font-bold text-white hover:bg-purple-800 shadow-sm text-xs rounded-xl h-10 px-4"
        >
          <Zap className="mr-1.5 h-4 w-4 text-amber-300" />
          Symuluj nowe zgłoszenie od właściciela
        </Button>
      </div>

      {simulationSuccessMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-900">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="flex-1">{simulationSuccessMessage}</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === "pending"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Oczekujące na audyt ({pendingOwnerPlaces.length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === "approved"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Zatwierdzone / Certyfikowane ({approvedOwnerPlaces.length})
          </button>
          <button
            onClick={() => setFilter("needs_fix")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === "needs_fix"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Wymaga poprawek ({needsFixOwnerPlaces.length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Wszystkie ({ownerSubmittedPlaces.length})
          </button>
        </div>

        <span className="text-xs text-slate-500">
          Wyświetlane obiekty: <strong className="text-purple-700">{displayedPlaces.length}</strong>
        </span>
      </div>

      {displayedPlaces.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/20 p-8 text-center text-xs text-slate-500">
          <Building className="mx-auto h-8 w-8 text-purple-400 mb-2" />
          <p className="font-semibold text-slate-700">Brak zgłoszeń w tej kategorii.</p>
          <p className="text-slate-400 mt-1">
            Użyj przycisku „Symuluj nowe zgłoszenie od właściciela” powyżej, aby dodać testowy lokal do weryfikacji.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedPlaces.map((place) => {
            const isPending =
              place.verificationStatus === "oczekuje" ||
              (!place.verified && place.verificationStatus !== "odrzucony" && place.verificationStatus !== "do_poprawy");
            const isApproved =
              place.verificationStatus === "zatwierdzony" || (place.verified && !place.verificationStatus);
            const isNeedsFix = place.verificationStatus === "do_poprawy";
            const isRejected = place.verificationStatus === "odrzucony";

            const currentChecklist = checklists[place.id] || {};
            const noteValue =
              auditNotes[place.id] !== undefined
                ? auditNotes[place.id]
                : place.verificationNotes || "";

            return (
              <div
                key={place.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                  isPending
                    ? "border-amber-300 bg-amber-50/20 shadow-xs"
                    : isApproved
                    ? "border-emerald-200 bg-emerald-50/15"
                    : isNeedsFix
                    ? "border-orange-200 bg-orange-50/15"
                    : "border-slate-200 bg-slate-50/30"
                }`}
              >
                {/* Header of the submission */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-[10px]">
                        {place.categoryLabel || place.category}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        Zgłosił zarządca: <strong>{place.submittedByOwnerName || "Właściciel obiektu"}</strong>
                      </span>
                      {place.verifiedAt && (
                        <span className="text-xs text-slate-400">
                          • Decyzja: {place.verifiedAt} ({place.verifiedBy || "Administrator"})
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-purple-700 shrink-0" />
                        {place.address} • Godziny: {place.hours}
                      </span>
                      {onExplore && (
                        <button
                          type="button"
                          onClick={() => onExplore(place.id)}
                          className="font-bold text-purple-700 hover:text-purple-900 hover:underline transition-colors ml-1 text-xs inline-flex items-center gap-0.5"
                        >
                          (Pokaż na mapie)
                        </button>
                      )}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {isPending && (
                      <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs font-bold py-1 px-2.5">
                        <Clock className="h-3.5 w-3.5 mr-1 inline" />
                        Oczekuje na audyt
                      </Badge>
                    )}
                    {isApproved && (
                      <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs font-bold py-1 px-2.5">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1 inline" />
                        Certyfikowany (Zatwierdzony)
                      </Badge>
                    )}
                    {isNeedsFix && (
                      <Badge className="bg-orange-100 text-orange-900 border-orange-300 text-xs font-bold py-1 px-2.5">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1 inline" />
                        Wymaga poprawek zarządcy
                      </Badge>
                    )}
                    {isRejected && (
                      <Badge className="bg-red-100 text-red-900 border-red-300 text-xs font-bold py-1 px-2.5">
                        <XCircle className="h-3.5 w-3.5 mr-1 inline" />
                        Odrzucone
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description & Declared Features */}
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Deklaracja i opis lokalu od właściciela:
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-xl p-3">
                      {place.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Deklarowane udogodnienia ({place.features.length}):
                    </h4>
                    <div className="flex flex-wrap gap-1.5 bg-white border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto">
                      {place.features.map((feat) => (
                        <span
                          key={feat}
                          className="inline-flex items-center gap-1 rounded-lg bg-purple-50 border border-purple-200 px-2 py-1 text-[10px] font-semibold text-purple-900"
                        >
                          <CheckCircle2 className="h-3 w-3 text-purple-600" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Auditor Field Inspection Checklist */}
                <div className="mt-4 rounded-xl border border-purple-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-purple-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Karta Inspekcyjna Audytora Miejskiego (Kryteria Dostępności)
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700">
                      Sprawdzono: {Object.values(currentChecklist).filter(Boolean).length} / {auditChecklistItems.length}
                    </span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {auditChecklistItems.map((item) => {
                      const isChecked = !!currentChecklist[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleAuditCheck(place.id, item.id)}
                          className={`flex items-start gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors ${
                            isChecked
                              ? "border-purple-600 bg-purple-50 text-purple-900 font-semibold"
                              : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {isChecked ? (
                            <CheckSquare className="h-4 w-4 text-purple-700 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className="text-[11px] leading-snug">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Verification Protocol Notes & Presets */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Urzędowa Notatka z Audytu i Uzasadnienie Decyzji:
                    </label>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>Szablony:</span>
                      {quickNotes.slice(0, 2).map((qNote, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setAuditNotes((prev) => ({
                              ...prev,
                              [place.id]: qNote,
                            }))
                          }
                          className="text-purple-700 hover:underline font-semibold"
                        >
                          #{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={noteValue}
                    onChange={(e) =>
                      setAuditNotes((prev) => ({
                        ...prev,
                        [place.id]: e.target.value,
                      }))
                    }
                    placeholder="Wprowadź oficjalne podsumowanie audytu terenowego, numer decyzji lub uwagi dla zarządcy..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-purple-700"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
                  <div className="text-[11px] text-slate-500">
                    Zatwierdzenie lokalu natychmiast odblokuje oficjalny Certyfikat Dostępności w panelu właściciela.
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        onVerifyPlace(
                          place.id,
                          "zatwierdzony",
                          noteValue || "Pozytywny audyt Urzędu Miasta. Obiekt spełnia wymogi i otrzymuje oficjalny certyfikat dostępności."
                        )
                      }
                      className="bg-emerald-600 font-bold text-white hover:bg-emerald-700 text-xs h-9 rounded-xl shadow-xs"
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Zatwierdź i Certyfikuj Lokal
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        onVerifyPlace(
                          place.id,
                          "do_poprawy",
                          noteValue || "Wymagane usunięcie barier architektonicznych przed ponownym audytem."
                        )
                      }
                      className="bg-amber-600 font-bold text-white hover:bg-amber-700 text-xs h-9 rounded-xl shadow-xs"
                    >
                      <AlertTriangle className="mr-1.5 h-4 w-4" />
                      Wymaga poprawek (Zwróć właścicielowi)
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onVerifyPlace(
                          place.id,
                          "odrzucony",
                          noteValue || "Lokal nie spełnia wymogów dostępności architektonicznej."
                        )
                      }
                      className="border-slate-200 text-slate-600 hover:text-red-700 hover:border-red-300 text-xs h-9 rounded-xl"
                    >
                      <XCircle className="mr-1.5 h-4 w-4" />
                      Odrzuć zgłoszenie
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
