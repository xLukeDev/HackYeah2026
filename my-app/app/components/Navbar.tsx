"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  MapPin,
  UserCheck,
  Building2,
  ShieldAlert,
  Sun,
  Moon,
  ChevronDown,
  Award,
  Zap,
  LogOut,
  User,
} from "lucide-react";

interface NavbarProps {
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  fontScale: 0 | 1 | 2;
  setFontScale: (scale: 0 | 1 | 2) => void;
}

export default function Navbar({
  highContrast,
  setHighContrast,
  fontScale,
  setFontScale,
}: NavbarProps) {
  const {
    currentUser,
    activeView,
    setActiveView,
    openAuthModal,
    logoutUser,
    switchRole,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);

  // Uprawnienia do widoków: tylko te panele, do których użytkownik ma dostęp
  const effectiveView = (() => {
    if (activeView === "admin-panel" && currentUser?.role !== "admin") return "explore";
    if (activeView === "owner-panel" && currentUser?.role !== "owner") return "explore";
    if (activeView === "user-panel" && !currentUser) return "explore";
    return activeView;
  })();

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur ${
        highContrast ? "border-yellow-400 bg-black" : "border-slate-200/80 bg-white/95"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveView("explore")}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-xs ${
              highContrast ? "bg-yellow-300 text-black" : "bg-blue-700 text-white"
            }`}
          >
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">
              MapaBezBarier
            </div>
            <div className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400 sm:block">
              Wersja Kraków (Demo)
            </div>
          </div>
        </div>

        {/* Navigation Views Switcher (Tylko panele, do których użytkownik ma uprawnienia) */}
        <nav className="hidden items-center gap-1.5 text-xs font-bold md:flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveView("explore")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              effectiveView === "explore"
                ? "bg-white text-blue-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            Eksploruj mapę
          </button>

          {currentUser?.role === "user" && (
            <button
              onClick={() => setActiveView("user-panel")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                effectiveView === "user-panel"
                  ? "bg-white text-blue-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Panel Mieszkańca
            </button>
          )}

          {currentUser?.role === "owner" && (
            <button
              onClick={() => setActiveView("owner-panel")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                effectiveView === "owner-panel"
                  ? "bg-white text-blue-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Panel Właściciela
            </button>
          )}

          {currentUser?.role === "admin" && (
            <button
              onClick={() => setActiveView("admin-panel")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                effectiveView === "admin-panel"
                  ? "bg-white text-purple-800 shadow-xs"
                  : "text-slate-600 hover:text-purple-900"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 text-purple-700" />
              Panel Administratora
            </button>
          )}
        </nav>

        {/* Right Controls: WCAG + User Session */}
        <div className="relative flex items-center gap-2">
          {/* Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              highContrast
                ? "border-yellow-300 bg-yellow-300 text-black"
                : "border-slate-200 text-slate-600 hover:border-blue-600"
            }`}
            title="Zmień kontrast (WCAG AAA)"
            aria-label="Zmień kontrast"
          >
            {highContrast ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Font Scale Toggle */}
          <div className="hidden items-center rounded-xl border border-slate-200 p-0.5 sm:flex">
            {(["AA", "A+", "A++"] as const).map((label, index) => (
              <button
                key={label}
                onClick={() => setFontScale(index as 0 | 1 | 2)}
                className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
                  fontScale === index
                    ? "bg-blue-700 text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                aria-pressed={fontScale === index}
              >
                {label}
              </button>
            ))}
          </div>

          {/* User Profile Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 hover:border-blue-600 transition-all shadow-xs"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                  {currentUser.initials}
                </div>
                <span className="hidden sm:inline font-bold">{currentUser.name}</span>
                <Badge
                  variant="outline"
                  className="hidden lg:inline text-[9px] px-1.5 py-0 border-blue-200 bg-blue-50 text-blue-700"
                >
                  {currentUser.role === "admin"
                    ? "Admin"
                    : currentUser.role === "owner"
                    ? "Właściciel"
                    : "Mieszkaniec"}
                </Badge>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-2xl">
                  <div className="mb-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm">
                        {currentUser.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                        <span className="inline-block mt-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.2">
                          {currentUser.badge}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="flex items-center justify-end gap-1 text-[11px] font-bold text-amber-600">
                        <Award className="h-3.5 w-3.5 text-amber-600" />
                        {currentUser.points} punktów społeczności
                      </span>
                    </div>
                  </div>

                  {/* Navigation inside dropdown */}
                  <div className="space-y-1 pb-3 border-b border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        setActiveView("explore");
                        setShowUserMenu(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl p-2 font-medium transition-colors ${
                        effectiveView === "explore"
                          ? "bg-blue-50 text-blue-800 font-bold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Eksploruj mapę Krakowa
                    </button>

                    {currentUser.role === "user" && (
                      <button
                        onClick={() => {
                          setActiveView("user-panel");
                          setShowUserMenu(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl p-2 font-medium transition-colors ${
                          effectiveView === "user-panel"
                            ? "bg-blue-50 text-blue-800 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <UserCheck className="h-4 w-4 text-blue-600" />
                        Panel Mieszkańca (Opinie i zgłoszenia)
                      </button>
                    )}

                    {currentUser.role === "owner" && (
                      <button
                        onClick={() => {
                          setActiveView("owner-panel");
                          setShowUserMenu(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl p-2 font-medium transition-colors ${
                          effectiveView === "owner-panel"
                            ? "bg-blue-50 text-blue-800 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <Building2 className="h-4 w-4 text-blue-600" />
                        Panel Właściciela (Audyt i certyfikacja)
                      </button>
                    )}

                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          setActiveView("admin-panel");
                          setShowUserMenu(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl p-2 font-medium transition-colors ${
                          effectiveView === "admin-panel"
                            ? "bg-purple-50 text-purple-800 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <ShieldAlert className="h-4 w-4 text-purple-600" />
                        Panel Administratora (Weryfikacja miejska)
                      </button>
                    )}
                  </div>

                  {/* Switch role quick demo */}
                  <div className="py-2.5 border-b border-slate-100">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <Zap className="h-3 w-3 text-amber-500" /> Przełącz rolę testową (Demo)
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                      <button
                        onClick={() => {
                          switchRole("user");
                          setShowUserMenu(false);
                        }}
                        className={`rounded-lg p-1.5 border text-center transition-all ${
                          currentUser.role === "user"
                            ? "bg-blue-700 text-white border-blue-700"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        Mieszkaniec
                      </button>
                      <button
                        onClick={() => {
                          switchRole("owner");
                          setShowUserMenu(false);
                        }}
                        className={`rounded-lg p-1.5 border text-center transition-all ${
                          currentUser.role === "owner"
                            ? "bg-blue-700 text-white border-blue-700"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        Właściciel
                      </button>
                      <button
                        onClick={() => {
                          switchRole("admin");
                          setShowUserMenu(false);
                        }}
                        className={`rounded-lg p-1.5 border text-center transition-all ${
                          currentUser.role === "admin"
                            ? "bg-purple-700 text-white border-purple-700"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        logoutUser();
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl p-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Wyloguj się
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={openAuthModal}
              className="h-10 rounded-xl bg-blue-700 px-4 text-xs font-bold text-white hover:bg-blue-800 shadow-sm"
            >
              <User className="mr-1.5 h-4 w-4" />
              Zaloguj się
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
