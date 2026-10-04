"use client";

import { UserProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface UserProfileHeaderProps {
  currentUser: UserProfile;
  reviewsCount: number;
  reportsCount: number;
}

export default function UserProfileHeader({
  currentUser,
  reviewsCount,
  reportsCount,
}: UserProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
      <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-2xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-900 text-xl font-black shadow-md border-2 border-cyan-300">
            {currentUser.initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{currentUser.name}</h1>
              <Badge className="bg-cyan-400/20 text-cyan-200 border-cyan-300/30 text-xs font-semibold">
                {currentUser.roleLabel}
              </Badge>
            </div>
            <p className="text-xs text-blue-200 mt-1">{currentUser.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-300/30 px-2.5 py-0.5 text-xs font-bold text-amber-200">
                <Award className="h-3.5 w-3.5 text-amber-300" />
                {currentUser.badge}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:border-l sm:border-white/20 sm:pl-8">
          <div className="text-center">
            <span className="block text-3xl font-black tracking-tight text-white">
              {currentUser.points}
            </span>
            <span className="text-[11px] font-medium text-cyan-200 uppercase tracking-wider">
              Punkty Społeczności
            </span>
          </div>
          <div className="text-center border-l border-white/10 pl-4">
            <span className="block text-3xl font-black tracking-tight text-white">
              {reviewsCount}
            </span>
            <span className="text-[11px] font-medium text-cyan-200 uppercase tracking-wider">
              Opinie
            </span>
          </div>
          <div className="text-center border-l border-white/10 pl-4">
            <span className="block text-3xl font-black tracking-tight text-white">
              {reportsCount}
            </span>
            <span className="text-[11px] font-medium text-cyan-200 uppercase tracking-wider">
              Zgłoszenia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
