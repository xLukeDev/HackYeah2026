"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  HeartPulse,
  Landmark,
  MapPin,
  MessageCircle,
  Minus,
  Moon,
  Navigation,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Sun,
  User,
  Users,
  UtensilsCrossed,
  X,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  UserCheck,
  Award,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApp } from "@/lib/app-context";
import { Place } from "@/lib/types";
import AuthModal from "./components/AuthModal";
import ReviewForm from "./components/ReviewForm";
import QuickVerifyModal from "./components/QuickVerifyModal";
import UserPanel from "./components/UserPanel";
import OwnerPanel from "./components/OwnerPanel";
import AdminPanel from "./components/AdminPanel";
import { AccessibilityIcon } from "@/components/AccessibilityIcon";
import dynamic from "next/dynamic";

const OSMMap = dynamic(() => import("@/components/OSMMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
      Ładowanie mapy OpenStreetMap...
    </div>
  ),
});

const CATEGORIES = [
  {
    id: "restauracje",
    title: "Jedzenie",
    desc: "Lokale bez barier",
    count: 42,
    icon: UtensilsCrossed,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    id: "kultura",
    title: "Kultura",
    desc: "Teatry i muzea",
    count: 28,
    icon: Landmark,
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: "sport",
    title: "Ruch",
    desc: "Sport i rekreacja",
    count: 19,
    icon: Activity,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    id: "zdrowie",
    title: "Zdrowie",
    desc: "Pomoc i urzędy",
    count: 35,
    icon: HeartPulse,
    color: "bg-sky-50 text-sky-700",
  },
];

const FILTERS = [
  { id: "bezprogowe", label: "Wejście bezprogowe" },
  { id: "podjazd", label: "Podjazd / rampa" },
  { id: "winda", label: "Winda" },
  { id: "toaleta", label: "Toaleta przystosowana" },
  { id: "indukcyjna", label: "Pętla indukcyjna" },
  { id: "audio", label: "Audiodeskrypcja" },
  { id: "pjm", label: "Tłumacz PJM" },
  { id: "pies", label: "Pies asystujący" },
];

export default function Home() {
  const {
    currentUser,
    places,
    reviews,
    activeView,
    setActiveView,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    logoutUser,
    switchRole,
  } = useApp();

  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState<0 | 1 | 2>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(places[0]?.id || "1");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  const filteredPlaces = places.filter((place) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      [place.name, place.address, place.categoryLabel, place.description].some(
        (value) => value.toLowerCase().includes(q)
      );
    const matchCategory =
      !selectedCategory || place.category === selectedCategory;
    const matchFeature =
      !selectedFeature ||
      place.features.some((feature) =>
        feature.toLowerCase().includes(selectedFeature.toLowerCase())
      );
    return matchSearch && matchCategory && matchFeature;
  });

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        highContrast ? "bg-black text-yellow-300" : "bg-[#f6f9fc] text-slate-900"
      } ${
        fontScale === 0
          ? "text-[15px]"
          : fontScale === 1
          ? "text-[17px] leading-relaxed"
          : "text-[19px] leading-loose"
      }`}
    >
      {/* Header bar */}
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
                Dostępne<span className="text-blue-700">Miasto</span>
              </div>
              <div className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400 sm:block">
                Kraków bez barier
              </div>
            </div>
          </div>

          {/* Navigation Views Switcher */}
          <nav className="hidden items-center gap-2 text-xs font-bold md:flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveView("explore")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeView === "explore"
                  ? "bg-white text-blue-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              Eksploruj mapę
            </button>
            <button
              onClick={() => setActiveView("user-panel")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeView === "user-panel"
                  ? "bg-white text-blue-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Panel Mieszkańca
            </button>
            <button
              onClick={() => setActiveView("owner-panel")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeView === "owner-panel"
                  ? "bg-white text-blue-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Panel Właściciela
            </button>
            <button
              onClick={() => setActiveView("admin-panel")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeView === "admin-panel"
                  ? "bg-white text-blue-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Panel Admina
            </button>
          </nav>

          {/* Right Controls: Accessibility + User Session */}
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
                          setActiveView("user-panel");
                          setShowUserMenu(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl p-2 font-medium transition-colors ${
                          activeView === "user-panel"
                            ? "bg-blue-50 text-blue-800 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <UserCheck className="h-4 w-4 text-blue-600" />
                        Panel Mieszkańca (Opinie i zgłoszenia)
                      </button>
                      <button
                        onClick={() => {
                          setActiveView("owner-panel");
                          setShowUserMenu(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl p-2 font-medium transition-colors ${
                          activeView === "owner-panel"
                            ? "bg-blue-50 text-blue-800 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <Building2 className="h-4 w-4 text-blue-600" />
                        Panel Właściciela (Audyt lokali)
                      </button>
                      <button
                        onClick={() => {
                          setActiveView("admin-panel");
                          setShowUserMenu(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl p-2 font-medium transition-colors ${
                          activeView === "admin-panel"
                            ? "bg-purple-50 text-purple-800 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <ShieldAlert className="h-4 w-4 text-purple-600" />
                        Panel Administratora (Weryfikacja)
                      </button>
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

      {/* Main Content Rendered Based On Active View */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-5 py-8 lg:px-8 lg:py-10">
        {activeView === "user-panel" && <UserPanel />}
        {activeView === "owner-panel" && <OwnerPanel />}
        {activeView === "admin-panel" && <AdminPanel />}

        {activeView === "explore" && (
          <>
            {/* Search Hero */}
            <section
              id="szukaj"
              className="relative overflow-hidden rounded-[32px] bg-[#0b4f87] px-6 py-10 text-white shadow-[0_16px_40px_rgba(11,79,135,0.16)] lg:px-12 lg:py-14"
            >
              <div className="absolute right-[-80px] top-[-110px] h-72 w-72 rounded-full border-[36px] border-cyan-300/20" />
              <div className="absolute bottom-[-150px] right-[22%] h-64 w-64 rounded-full border-[24px] border-white/10" />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-100/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" /> Społeczność Krakowa działa
                  </div>
                  <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    Miasto, w którym każdy może być u siebie.
                  </h1>
                  <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-blue-100">
                    Znajdź sprawdzone miejsca bez barier architektonicznych, poznaj opinie innych osób i pomóż budować bardziej otwarty Kraków.
                  </p>

                  {/* Search input */}
                  <div className="mt-7 flex max-w-2xl items-center rounded-2xl bg-white p-1.5 shadow-lg">
                    <Search className="ml-3 h-5 w-5 shrink-0 text-blue-700" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Szukaj lokalu, adresu, windy, pętli indukcyjnej..."
                      className="h-12 min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="h-11 rounded-xl bg-blue-700 px-5 text-xs sm:text-sm font-bold text-white hover:bg-blue-800"
                    >
                      Szukaj
                    </Button>
                  </div>

                  {/* Quick Feature Filter Pills */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {FILTERS.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() =>
                          setSelectedFeature(selectedFeature === filter.id ? null : filter.id)
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                          selectedFeature === filter.id
                            ? "border-white bg-white text-blue-900 font-bold shadow-xs"
                            : "border-white/30 text-blue-50 hover:bg-white/10"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Hero Badge Info */}
                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {["MK", "JN", "AW", "TP"].map((initials, index) => (
                        <div
                          key={initials}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0b4f87] text-[10px] font-bold ${
                            [
                              "bg-cyan-200 text-cyan-900",
                              "bg-amber-200 text-amber-900",
                              "bg-white text-blue-800",
                              "bg-blue-200 text-blue-900",
                            ][index]
                          }`}
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-cyan-100 font-semibold">Społeczność aktywna</span>
                  </div>
                  <p className="mt-5 text-3xl font-black">1 248 osób</p>
                  <p className="mt-1 text-sm text-blue-100">
                    dzieli się dziś wiedzą o dostępności miejsc w Krakowie
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
                    <div>
                      <span className="block text-2xl font-bold">{places.length}</span>
                      <span className="text-xs text-blue-200">Zmapowanych obiektów</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-bold">{reviews.length}</span>
                      <span className="text-xs text-blue-200">Szczegółowych opinii</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Categories Grid */}
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                    className={`flex flex-col items-start rounded-3xl border p-5 text-left transition-all ${
                      isSelected
                        ? "border-blue-700 bg-white shadow-md ring-2 ring-blue-700/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${cat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900 text-base">{cat.title}</h3>
                    <p className="text-xs text-slate-500">{cat.desc}</p>
                    <span className="mt-2 text-[11px] font-bold text-blue-700">
                      {cat.count} obiektów
                    </span>
                  </button>
                );
              })}
            </section>

            {/* Interactive Map and Selected Place Card */}
            <section id="mapa" className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Lokalizator obiektów miejskich
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                    Mapa OpenStreetMap Krakowa
                  </h2>
                  <p className="text-xs text-slate-500">
                    Przeglądaj i lokalizuj dostępne miejsca na oficjalnym podkładzie OpenStreetMap.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                  Znaleziono: {filteredPlaces.length} miejsc
                </span>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                {/* OpenStreetMap Component */}
                <div className="w-full">
                  <OSMMap
                    places={filteredPlaces}
                    selectedPlace={selectedPlace}
                    onSelectPlace={(place) => setSelectedPlaceId(place.id)}
                  />
                </div>

                {/* Selected Place Details Card with Action Buttons */}
                <Card className="rounded-3xl border-slate-200 bg-white shadow-xs flex flex-col justify-between">
                  <div>
                    <CardHeader className="border-b border-slate-100 pb-4">
                      <div className="flex items-center justify-between">
                        <Badge className="border-0 bg-blue-50 text-blue-700 font-bold text-xs">
                          {selectedPlace.categoryLabel}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          ID obiektu: #{selectedPlace.id}
                        </span>
                      </div>
                      <CardTitle className="pt-2 text-xl font-bold text-slate-900">
                        {selectedPlace.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        <MapPin className="mr-1 inline h-3.5 w-3.5 text-blue-700" />
                        {selectedPlace.address}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      {/* Rating & reviews */}
                      <div className="flex items-center gap-1.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(selectedPlace.rating || 5)
                                ? "fill-current"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs font-bold text-slate-800">
                          {selectedPlace.rating || 4.8} · {selectedPlace.reviewsCount || 12} opinii
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-600">
                        {selectedPlace.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 border-y border-slate-100 py-3 text-xs text-slate-600">
                        <span>
                          <Clock className="mr-1 inline h-3.5 w-3.5 text-blue-700" />
                          {selectedPlace.hours}
                        </span>
                        <span>
                          <Phone className="mr-1 inline h-3.5 w-3.5 text-blue-700" />
                          {selectedPlace.phone}
                        </span>
                      </div>

                      {/* Accessibility Profile List */}
                      <div>
                        <div className="mb-2.5 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Zweryfikowane cechy ({selectedPlace.features.length})
                          </span>
                          <button
                            onClick={() => setShowVerifyModal(true)}
                            className="text-xs font-bold text-blue-700 hover:underline"
                          >
                            + Zaznacz / Zgłoś opcje
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                          {selectedPlace.features.map((feature) => (
                            <span
                              key={feature}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800"
                            >
                              <AccessibilityIcon name={feature} className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Card Action Buttons: Add Review + Verify Features */}
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl space-y-2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowReviewModal(true)}
                        className="h-10 flex-1 bg-blue-700 text-xs font-bold text-white hover:bg-blue-800 rounded-xl"
                      >
                        <MessageCircle className="mr-1.5 h-4 w-4" />
                        Dodaj opinię i oceń
                      </Button>
                      <Button
                        onClick={() => setShowVerifyModal(true)}
                        variant="outline"
                        className="h-10 border-blue-300 text-blue-800 hover:bg-blue-50 text-xs font-bold rounded-xl"
                      >
                        <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                        Zaznacz opcje
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Community Reviews Section */}
            <section id="opinie" className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Głos Społeczności
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                    Najnowsze doświadczenia mieszkańców ({reviews.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Opinie pomagają zaplanować bezpieczny dzień osobom z niepełnosprawnościami.
                  </p>
                </div>
                <Button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-blue-700 font-bold text-white hover:bg-blue-800 text-xs rounded-xl"
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  Napisz recenzję
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.slice(0, 6).map((review) => (
                  <article
                    key={review.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${review.accent}`}
                          >
                            {review.initials}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900">{review.author}</h3>
                            <p className="text-[10px] text-slate-400">{review.date}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            review.role === "Właściciel"
                              ? "border-blue-200 bg-blue-50 text-blue-700 text-[10px]"
                              : review.role === "Audytor"
                              ? "border-purple-200 bg-purple-50 text-purple-700 text-[10px]"
                              : "border-cyan-200 bg-cyan-50 text-cyan-700 text-[10px]"
                          }
                        >
                          {review.role}
                        </Badge>
                      </div>

                      <p className="mt-3 text-xs font-bold text-blue-700">{review.place}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        “{review.text}”
                      </p>

                      {review.verifiedFeatures && review.verifiedFeatures.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {review.verifiedFeatures.slice(0, 2).map((vf) => (
                            <span
                              key={vf}
                              className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700"
                            >
                              <Check className="h-2.5 w-2.5 text-emerald-600" />
                              {vf}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Official Owner Reply */}
                      {review.ownerReply && (
                        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/80 p-2.5 text-[11px]">
                          <span className="font-bold text-blue-900 block">
                            {review.ownerReply.author}:
                          </span>
                          <p className="text-slate-700 mt-0.5">{review.ownerReply.text}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2 text-amber-500">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= review.rating ? "fill-current" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Ocena: {review.rating}.0
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Quick Action Cards (For Residents & Place Owners) */}
            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-[#dff7f5] p-7 border border-cyan-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-xs">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Panel Mieszkańca i Twoje Punkty
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Przeglądaj swoje zgłoszone bariery, wystawione opinie, zdobywaj odznaki weryfikatora i pomagaj budować bezpieczne miasto.
                </p>
                <Button
                  onClick={() => setActiveView("user-panel")}
                  className="mt-5 bg-cyan-700 text-xs font-bold text-white hover:bg-cyan-800 rounded-xl"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Otwórz Panel Mieszkańca
                </Button>
              </div>

              <div className="rounded-3xl bg-[#e5edff] p-7 border border-blue-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-xs">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Panel Właściciela Obiektu
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Zarządzaj udogodnieniami swojego lokalu, odpowiadaj na recenzje gości i pobierz oficjalny Certyfikat Dostępności 2026.
                </p>
                <Button
                  onClick={() => setActiveView("owner-panel")}
                  className="mt-5 bg-blue-700 text-xs font-bold text-white hover:bg-blue-800 rounded-xl"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Otwórz Panel Właściciela
                </Button>
              </div>
            </section>
          </>
        )}

        {/* Modals */}
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

        {showReviewModal && (
          <ReviewForm
            place={selectedPlace}
            onClose={() => setShowReviewModal(false)}
            authorName={currentUser?.name}
          />
        )}

        {showVerifyModal && (
          <QuickVerifyModal
            place={selectedPlace}
            isOpen={showVerifyModal}
            onClose={() => setShowVerifyModal(false)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-xs text-slate-400 sm:flex-row lg:px-8">
          <p>© 2026 DostępneMiasto Kraków · Urząd Miasta Krakowa · HackYeah 2026</p>
          <div className="flex gap-5">
            <button
              className="hover:text-blue-700"
              onClick={() => setActiveView("admin-panel")}
            >
              Strefa Administratora
            </button>
            <button
              className="hover:text-blue-700"
              onClick={() => alert("Deklaracja dostępności cyfrowej zgodnie z WCAG 2.1 AA.")}
            >
              Deklaracja dostępności
            </button>
            <button
              className="hover:text-blue-700"
              onClick={() => alert("Infolinia miejska ds. dostępności: 12 616 55 55")}
            >
              Infolinia 12 616 55 55
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
