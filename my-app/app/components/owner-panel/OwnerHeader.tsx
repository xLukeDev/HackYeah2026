"use client";

import { UserProfile, Place } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

interface OwnerHeaderProps {
  currentUser: UserProfile;
  places: Place[];
  selectedPlaceId: string;
  onPlaceChange: (placeId: string) => void;
}

export default function OwnerHeader({
  currentUser,
  places,
  selectedPlaceId,
  onPlaceChange,
}: OwnerHeaderProps) {
  return (
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
            value={selectedPlaceId}
            onChange={(e) => onPlaceChange(e.target.value)}
            className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white border border-slate-700 outline-none"
          >
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
