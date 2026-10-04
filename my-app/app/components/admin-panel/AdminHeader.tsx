"use client";

import { UserProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from "lucide-react";

interface AdminHeaderProps {
  currentUser: UserProfile;
  placesCount: number;
  pendingOwnerPlacesCount: number;
  pendingReportsCount: number;
  reviewsCount: number;
}

export default function AdminHeader({
  currentUser,
  placesCount,
  pendingOwnerPlacesCount,
  pendingReportsCount,
  reviewsCount,
}: AdminHeaderProps) {
  return (
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
              Weryfikuj zgłoszenia mieszkańców, certyfikuj lokale zgłoszone przez zarządców i nadzoruj dostępność w Krakowie.
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm border border-white/15">
          <div className="text-center">
            <span className="block text-2xl font-black text-white">{placesCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Obiektów</span>
          </div>
          <div className="text-center border-l border-white/15 pl-3 sm:pl-4">
            <span className="block text-2xl font-black text-amber-300">{pendingOwnerPlacesCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-amber-200 font-semibold">Lokali do audytu</span>
          </div>
          <div className="text-center border-l border-white/15 pl-3 sm:pl-4">
            <span className="block text-2xl font-black text-white">{pendingReportsCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Zgłoszeń barier</span>
          </div>
          <div className="text-center border-l border-white/15 pl-3 sm:pl-4">
            <span className="block text-2xl font-black text-white">{reviewsCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">Opinii</span>
          </div>
        </div>
      </div>
    </div>
  );
}
