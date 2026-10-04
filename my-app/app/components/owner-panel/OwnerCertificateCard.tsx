"use client";

import { Place } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ShieldCheck, Download, Clock } from "lucide-react";

interface OwnerCertificateCardProps {
  currentPlace: Place;
  featuresCount: number;
  onSwitchToAdmin: () => void;
}

export default function OwnerCertificateCard({
  currentPlace,
  featuresCount,
  onSwitchToAdmin,
}: OwnerCertificateCardProps) {
  const isPlaceVerified =
    currentPlace.verified || currentPlace.verificationStatus === "zatwierdzony";

  return (
    <div
      className={`rounded-3xl border-2 p-6 shadow-sm transition-all ${
        isPlaceVerified
          ? "border-amber-300 bg-gradient-to-b from-amber-50/60 to-white"
          : "border-slate-200 bg-gradient-to-b from-slate-50 to-white opacity-90"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
            isPlaceVerified ? "text-amber-800" : "text-slate-500"
          }`}
        >
          <Award
            className={`h-4 w-4 ${isPlaceVerified ? "text-amber-500" : "text-slate-400"}`}
          />
          Certyfikat Dostępności 2026
        </div>
        <Badge
          className={`text-[10px] font-bold ${
            isPlaceVerified
              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
              : "bg-amber-100 text-amber-900 border-amber-300"
          }`}
        >
          {isPlaceVerified ? "Aktywny" : "Weryfikacja w toku"}
        </Badge>
      </div>

      <h4 className="mt-2 text-lg font-black text-slate-900">
        {currentPlace.name}
      </h4>
      <p className="mt-1 text-xs text-slate-600">
        Poziom:{" "}
        <strong className="text-emerald-700 font-bold">
          {featuresCount >= 4 ? "Złoty Standard Dostępności" : "Srebrny Standard"}
        </strong>
      </p>

      <div
        className={`mt-4 rounded-2xl border p-4 text-center ${
          isPlaceVerified
            ? "bg-white border-amber-200"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <ShieldCheck
          className={`mx-auto h-12 w-12 mb-2 ${
            isPlaceVerified ? "text-emerald-600" : "text-slate-400"
          }`}
        />
        <div className="text-xs font-bold text-slate-800">
          {isPlaceVerified ? "OFICJALNY ZNAK MIEJSKI" : "OCZEKUJE NA AUDYT MIEJSKI"}
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          {isPlaceVerified
            ? `Potwierdzono w miejskim rejestrze dostępności architektonicznej Krakowa (${currentPlace.verifiedAt || "2026-10-03"}).`
            : "Plik certyfikatu i naklejka z kodem QR na witrynę zostaną odblokowane po zatwierdzeniu przez Urząd Miasta."}
        </p>

        {isPlaceVerified ? (
          <Button
            variant="outline"
            onClick={() => alert("Generowanie oficjalnego pliku certyfikatu PDF z kodem QR...")}
            className="mt-3 w-full border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-50"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Pobierz naklejkę na drzwi (PDF)
          </Button>
        ) : (
          <div className="mt-3 space-y-2">
            <Button
              disabled
              variant="outline"
              className="w-full border-slate-200 text-xs font-semibold text-slate-400 cursor-not-allowed bg-slate-100"
            >
              <Clock className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
              Certyfikat zablokowany (wymaga audytu)
            </Button>
            <Button
              size="sm"
              onClick={onSwitchToAdmin}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] h-8 rounded-xl"
            >
              Przejdź do Admina, by zatwierdzić
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
