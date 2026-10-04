"use client";

import { UserProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Building2, ChevronDown, CheckSquare, Layers, MessageSquare, AlertCircle } from "lucide-react";

interface AdminHeaderProps {
  currentUser: UserProfile;
  placesCount: number;
  pendingOwnerPlacesCount: number;
  pendingReportsCount: number;
  reviewsCount: number;
  onGoToOwnerPanel?: () => void;
}

export default function AdminHeader({
  currentUser,
  placesCount,
  pendingOwnerPlacesCount,
  pendingReportsCount,
  reviewsCount,
  onGoToOwnerPanel,
}: AdminHeaderProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg border border-purple-400">
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
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Weryfikuj zgłoszenia mieszkańców, certyfikuj lokale zgłoszone przez zarządców i nadzoruj dostępność w Krakowie.
            </p>
          </div>
        </div>

        {/* Action Button & Quick Metrics */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button
            onClick={() => scrollToSection("rejestr-lokali")}
            className="h-12 px-5 rounded-2xl bg-white text-purple-950 font-bold hover:bg-purple-100 shadow-md transition-all text-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Building2 className="h-4 w-4 text-purple-700" />
            <span>Przejdź do rejestru lokali</span>
            <ChevronDown className="h-4 w-4 text-purple-500" />
          </Button>

          <div className="flex items-center justify-around gap-3 sm:gap-4 rounded-2xl bg-white/10 p-3 backdrop-blur-sm border border-white/15">
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-black text-white">{placesCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Obiektów</span>
            </div>
            <div className="text-center border-l border-white/15 pl-3 sm:pl-4">
              <span className="block text-xl sm:text-2xl font-black text-amber-300">{pendingOwnerPlacesCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-200 font-semibold">Do audytu</span>
            </div>
            <div className="text-center border-l border-white/15 pl-3 sm:pl-4">
              <span className="block text-xl sm:text-2xl font-black text-white">{pendingReportsCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Barier</span>
            </div>
            <div className="text-center border-l border-white/15 pl-3 sm:pl-4">
              <span className="block text-xl sm:text-2xl font-black text-white">{reviewsCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Opinii</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Jump Links */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-semibold text-purple-200 mr-1">Szybka nawigacja:</span>
        <button
          onClick={() => scrollToSection("kolejka-lokali")}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white transition-colors"
        >
          <CheckSquare className="h-3.5 w-3.5 text-amber-400" />
          Kolejka weryfikacji ({pendingOwnerPlacesCount})
        </button>
        <button
          onClick={() => scrollToSection("rejestr-lokali")}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white transition-colors"
        >
          <Layers className="h-3.5 w-3.5 text-purple-300" />
          Katalog obiektów ({placesCount})
        </button>
        <button
          onClick={() => scrollToSection("zgloszenia-barier")}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white transition-colors"
        >
          <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
          Zgłoszenia barier ({pendingReportsCount})
        </button>
        <button
          onClick={() => scrollToSection("opinie-mieszkancow")}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5 text-blue-300" />
          Moderacja opinii ({reviewsCount})
        </button>
      </div>
    </div>
  );
}
