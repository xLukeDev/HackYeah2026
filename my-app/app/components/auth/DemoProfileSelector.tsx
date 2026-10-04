"use client";

import { DEMO_USERS } from "@/lib/initial-data";
import { UserProfile } from "@/lib/types";
import { Zap, UserCheck, Building2, Shield } from "lucide-react";

interface DemoProfileSelectorProps {
  onSelectDemo: (demoUser: UserProfile) => void;
}

export default function DemoProfileSelector({
  onSelectDemo,
}: DemoProfileSelectorProps) {
  return (
    <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-cyan-50/40 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900">
          <Zap className="h-3.5 w-3.5 text-amber-500" /> Szybki wybór profilu (Tryb Demo)
        </span>
        <span className="rounded-full bg-blue-200/60 px-2 py-0.5 text-[10px] font-semibold text-blue-800">
          1 kliknięcie
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onSelectDemo(DEMO_USERS[0])}
          className="flex flex-col items-start rounded-xl border border-white bg-white/90 p-2.5 text-left shadow-xs hover:border-cyan-400 hover:bg-white hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-1.5 text-cyan-700 font-bold text-xs">
            <UserCheck className="h-3.5 w-3.5" /> Mieszkaniec
          </div>
          <span className="mt-1 text-xs font-semibold text-slate-900 group-hover:text-blue-700">Marta K.</span>
          <span className="text-[10px] text-slate-500">opinie i zgłoszenia</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectDemo(DEMO_USERS[1])}
          className="flex flex-col items-start rounded-xl border border-white bg-white/90 p-2.5 text-left shadow-xs hover:border-blue-400 hover:bg-white hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
            <Building2 className="h-3.5 w-3.5" /> Właściciel
          </div>
          <span className="mt-1 text-xs font-semibold text-slate-900 group-hover:text-blue-700">Jan Nowak</span>
          <span className="text-[10px] text-slate-500">audyt lokali</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectDemo(DEMO_USERS[2])}
          className="flex flex-col items-start rounded-xl border border-white bg-white/90 p-2.5 text-left shadow-xs hover:border-purple-400 hover:bg-white hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs">
            <Shield className="h-3.5 w-3.5" /> Admin
          </div>
          <span className="mt-1 text-xs font-semibold text-slate-900 group-hover:text-blue-700">Aleksandra W.</span>
          <span className="text-[10px] text-slate-500">weryfikacja i miasto</span>
        </button>
      </div>
    </div>
  );
}
