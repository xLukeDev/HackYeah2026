"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Place, Review, Report, UserProfile, UserRole } from "./types";
import {
  INITIAL_PLACES,
  INITIAL_REVIEWS,
  INITIAL_REPORTS,
  DEMO_USERS,
} from "./initial-data";

export type ActiveView = "explore" | "user-panel" | "owner-panel" | "admin-panel";

interface AppContextType {
  currentUser: UserProfile | null;
  activeView: ActiveView;
  places: Place[];
  reviews: Review[];
  reports: Report[];
  isAuthModalOpen: boolean;
  selectedPlaceForReview: Place | null;
  setActiveView: (view: ActiveView) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginUser: (user: UserProfile) => void;
  logoutUser: () => void;
  switchRole: (role: UserRole) => void;
  addReview: (review: {
    placeId: string;
    text: string;
    rating: number;
    verifiedFeatures?: string[];
  }) => void;
  deleteReview: (reviewId: string) => void;
  addOwnerReply: (reviewId: string, text: string) => void;
  addReport: (report: {
    placeId: string;
    category: string;
    title: string;
    description: string;
  }) => void;
  updateReportStatus: (
    reportId: string,
    status: Report["status"],
    notes?: string
  ) => void;
  updatePlaceFeatures: (placeId: string, features: string[]) => void;
  updatePlaceDetails: (placeId: string, details: Partial<Place>) => void;
  addNewPlace: (place: Omit<Place, "id" | "rating" | "reviewsCount">) => Place;
  openReviewForPlace: (place: Place) => void;
  closeReviewModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "dostepne_miasto_user",
  PLACES: "dostepne_miasto_places",
  REVIEWS: "dostepne_miasto_reviews",
  REPORTS: "dostepne_miasto_reports",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    // Default demo user is Marta Kowalska (Mieszkaniec)
    return DEMO_USERS[0];
  });

  const [activeView, setActiveView] = useState<ActiveView>("explore");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlaceForReview, setSelectedPlaceForReview] = useState<Place | null>(null);

  const [places, setPlaces] = useState<Place[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.PLACES);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return INITIAL_PLACES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return INITIAL_REVIEWS;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return INITIAL_REPORTS;
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(places));
    }
  }, [places]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    }
  }, [reviews]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    }
  }, [reports]);

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setActiveView("explore");
  };

  const switchRole = (role: UserRole) => {
    const demo = DEMO_USERS.find((u) => u.role === role) || {
      id: `user-${role}`,
      name: role === "admin" ? "Admin Miejski" : role === "owner" ? "Właściciel Lokalu" : "Mieszkaniec",
      email: `${role}@dostepne-miasto.pl`,
      role,
      roleLabel: role === "admin" ? "Administrator" : role === "owner" ? "Właściciel Obiektu" : "Mieszkaniec",
      initials: role === "admin" ? "AM" : role === "owner" ? "WO" : "MK",
      badge: role === "admin" ? "Admin" : role === "owner" ? "Właściciel" : "Mieszkaniec",
      points: role === "admin" ? 999 : role === "owner" ? 150 : 340,
      ownedPlaceIds: role === "owner" ? ["1", "4"] : undefined,
    };
    setCurrentUser(demo);
    if (role === "admin") setActiveView("admin-panel");
    else if (role === "owner") setActiveView("owner-panel");
    else setActiveView("user-panel");
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openReviewForPlace = (place: Place) => setSelectedPlaceForReview(place);
  const closeReviewModal = () => setSelectedPlaceForReview(null);

  const addReview = ({
    placeId,
    text,
    rating,
    verifiedFeatures = [],
  }: {
    placeId: string;
    text: string;
    rating: number;
    verifiedFeatures?: string[];
  }) => {
    const targetPlace = places.find((p) => p.id === placeId);
    const placeName = targetPlace?.name || "Lokal";
    const authorName = currentUser?.name || "Anonimowy Mieszkaniec";
    const initials = currentUser?.initials || "AM";
    const role = currentUser?.role === "owner" ? "Właściciel" : currentUser?.role === "admin" ? "Audytor" : "Mieszkaniec";

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      placeId,
      author: authorName,
      initials,
      role,
      userId: currentUser?.id || "anon",
      place: placeName,
      text,
      date: "przed chwilą",
      rating,
      accent:
        role === "Właściciel"
          ? "bg-blue-100 text-blue-800"
          : role === "Audytor"
          ? "bg-purple-100 text-purple-800"
          : "bg-cyan-100 text-cyan-800",
      verifiedFeatures,
    };

    setReviews((prev) => [newRev, ...prev]);

    // Reward points to user
    if (currentUser) {
      setCurrentUser((prev) =>
        prev ? { ...prev, points: prev.points + 25 } : null
      );
    }

    // Update place review count & rating
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id !== placeId) return p;
        const currentCount = p.reviewsCount || 0;
        const currentRating = p.rating || 5;
        const newCount = currentCount + 1;
        const newRating = Number(
          ((currentRating * currentCount + rating) / newCount).toFixed(1)
        );
        // Also if user verified new features, add them to place.features if missing
        const combinedFeatures = Array.from(
          new Set([...p.features, ...verifiedFeatures])
        );
        return {
          ...p,
          rating: newRating,
          reviewsCount: newCount,
          features: combinedFeatures,
        };
      })
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const addOwnerReply = (reviewId: string, text: string) => {
    const responder = currentUser?.name || "Właściciel Obiektu";
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          ownerReply: {
            author: `${responder} (Właściciel)`,
            text,
            date: "przed chwilą",
          },
        };
      })
    );
  };

  const addReport = ({
    placeId,
    category,
    title,
    description,
  }: {
    placeId: string;
    category: string;
    title: string;
    description: string;
  }) => {
    const place = places.find((p) => p.id === placeId);
    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}`;

    const newRep: Report = {
      id: `rep-${Date.now()}`,
      userId: currentUser?.id || "anon",
      userName: currentUser?.name || "Mieszkaniec",
      placeId,
      placeName: place?.name || "Lokal",
      category,
      title,
      description,
      status: "Oczekujące",
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    setReports((prev) => [newRep, ...prev]);

    if (currentUser) {
      setCurrentUser((prev) =>
        prev ? { ...prev, points: prev.points + 15 } : null
      );
    }
  };

  const updateReportStatus = (
    reportId: string,
    status: Report["status"],
    notes?: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}`;

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          status,
          updatedAt: formattedDate,
          notes: notes !== undefined ? notes : r.notes,
        };
      })
    );
  };

  const updatePlaceFeatures = (placeId: string, features: string[]) => {
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id !== placeId) return p;
        return {
          ...p,
          features,
          accessibility: features.map((f) => {
            const existing = p.accessibility.find((a) => a.label === f);
            if (existing) return existing;
            return {
              label: f,
              value: "Dostępne",
              source: "Weryfikacja zarządcy",
              date: new Date().toISOString().slice(0, 10),
              reliability: "Potwierdzone" as const,
            };
          }),
        };
      })
    );
  };

  const updatePlaceDetails = (placeId: string, details: Partial<Place>) => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === placeId ? { ...p, ...details } : p))
    );
  };

  const addNewPlace = (placeData: Omit<Place, "id" | "rating" | "reviewsCount">): Place => {
    const newId = String(Date.now());
    const newPlace: Place = {
      ...placeData,
      id: newId,
      rating: 5.0,
      reviewsCount: 1,
    };
    setPlaces((prev) => [newPlace, ...prev]);
    return newPlace;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeView,
        places,
        reviews,
        reports,
        isAuthModalOpen,
        selectedPlaceForReview,
        setActiveView,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser,
        switchRole,
        addReview,
        deleteReview,
        addOwnerReply,
        addReport,
        updateReportStatus,
        updatePlaceFeatures,
        updatePlaceDetails,
        addNewPlace,
        openReviewForPlace,
        closeReviewModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
