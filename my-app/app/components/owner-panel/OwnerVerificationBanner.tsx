"use client";

import { Place } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface OwnerVerificationBannerProps {
  currentPlace: Place;
  onSimulateAdmin: () => void;
}

export default function OwnerVerificationBanner({
  currentPlace,
  onSimulateAdmin,
}: OwnerVerificationBannerProps) {
  const isPlaceVerified =
    currentPlace.verified || currentPlace.verificationStatus === "zatwierdzony";
  const isPlacePending =
    currentPlace.verificationStatus === "oczekuje" ||
    (!currentPlace.verified &&
      currentPlace.verificationStatus !== "do_poprawy" &&
      currentPlace.verificationStatus !== "odrzucony");
  const isPlaceNeedsFix = currentPlace.verificationStatus === "do_poprawy";
  const isPlaceRejected = currentPlace.verificationStatus === "odrzucony";

  return (
    <div
      className={`rounded-3xl border p-5 sm:p-6 shadow-xs transition-all ${
        isPlaceVerified
          ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
          : isPlaceNeedsFix
          ? "bg-orange-50/70 border-orange-300 text-orange-950"
          : isPlaceRejected
          ? "bg-red-50/70 border-red-300 text-red-950"
          : "bg-amber-50/70 border-amber-300 text-amber-950"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`rounded-2xl p-3 shrink-0 ${
              isPlaceVerified
                ? "bg-emerald-600 text-white shadow-xs"
                : isPlaceNeedsFix
                ? "bg-orange-600 text-white shadow-xs"
                : isPlaceRejected
                ? "bg-red-600 text-white shadow-xs"
                : "bg-amber-600 text-white shadow-xs"
            }`}
          >
            {isPlaceVerified ? (
              <ShieldCheck className="h-6 w-6" />
            ) : isPlaceNeedsFix ? (
              <AlertTriangle className="h-6 w-6" />
            ) : isPlaceRejected ? (
              <XCircle className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                Procedura Audytu Urzędu Miasta Krakowa
              </span>
              <Badge
                className={`text-[10px] font-bold ${
                  isPlaceVerified
                    ? "bg-emerald-200 text-emerald-950 border-emerald-400"
                    : isPlaceNeedsFix
                    ? "bg-orange-200 text-orange-950 border-orange-400"
                    : isPlaceRejected
                    ? "bg-red-200 text-red-950 border-red-400"
                    : "bg-amber-200 text-amber-950 border-amber-400"
                }`}
              >
                {isPlaceVerified
                  ? "Lokal Zweryfikowany i Certyfikowany"
                  : isPlaceNeedsFix
                  ? "Wymaga poprawek audytora"
                  : isPlaceRejected
                  ? "Zgłoszenie odrzucone"
                  : "Weryfikacja w toku (Oczekuje na audyt)"}
              </Badge>
            </div>

            <p className="mt-1 text-xs font-semibold leading-relaxed">
              {isPlaceVerified
                ? `Lokal został oficjalnie potwierdzony przez: ${currentPlace.verifiedBy || "Urząd Miasta"} (${currentPlace.verifiedAt || "2026-10-03"}). Wszystkie deklarowane udogodnienia posiadają status urzędowej weryfikacji.`
                : isPlaceNeedsFix
                ? `Inspektor zgłosił uwagi: „${currentPlace.verificationNotes || "Wymagane usunięcie barier przed ponownym audytem."}”. Uzupełnij cechy i zapisz zmiany.`
                : isPlaceRejected
                ? `Decyzja odmowna: „${currentPlace.verificationNotes || "Lokal nie spełnia kryteriów architektonicznych."}”.`
                : "Zgłoszenie lokalu zostało zarejestrowane w Urzędzie Miasta. Certyfikat dostępności zostanie odblokowany po akceptacji deklaracji przez administratora miejskiego."}
            </p>

            {isPlaceVerified && currentPlace.verificationNotes && (
              <div className="mt-2 rounded-xl bg-white/80 border border-emerald-200 p-2.5 text-xs text-emerald-900">
                <strong>Notatka inspekcyjna:</strong> {currentPlace.verificationNotes}
              </div>
            )}
          </div>
        </div>

        {/* Quick simulation helper */}
        {isPlacePending && (
          <Button
            size="sm"
            onClick={onSimulateAdmin}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shrink-0 rounded-xl h-9 px-3.5 shadow-xs"
          >
            Symuluj audyt jako Admin
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
