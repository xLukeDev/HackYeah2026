"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Place, Review, Report, UserProfile, UserRole, OwnerNotification } from "./types";
import {
  INITIAL_PLACES,
  INITIAL_REVIEWS,
  INITIAL_REPORTS,
  DEMO_USERS,
} from "./initial-data";
import { resolveKrakowAddress } from "./krakow-address-resolver";

export type ActiveView = "explore" | "user-panel" | "owner-panel" | "admin-panel";

interface AppContextType {
  currentUser: UserProfile | null;
  activeView: ActiveView;
  places: Place[];
  reviews: Review[];
  reports: Report[];
  notifications: OwnerNotification[];
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
  deletePlace: (
    placeId: string,
    reason?: string
  ) => { ownerNotified: boolean; ownerName?: string; placeName: string };
  dismissNotification: (notificationId: string) => void;
  openReviewForPlace: (place: Place) => void;
  closeReviewModal: () => void;
  isSyncingPlaces: boolean;
  lastSyncedSource: string;
  syncPlacesFromOSM: () => Promise<void>;
  selectedPlaceId: string;
  setSelectedPlaceId: (id: string) => void;
  showPlaceOnMap: (placeId: string) => void;
  verifyPlace: (
    placeId: string,
    status: "zatwierdzony" | "odrzucony" | "do_poprawy",
    notes?: string
  ) => void;
  simulateOwnerSubmission: () => Place;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "dostepne_miasto_user_v4",
  PLACES: "dostepne_miasto_places_v4",
  REVIEWS: "dostepne_miasto_reviews_v4",
  REPORTS: "dostepne_miasto_reports_v4",
  SYNCED: "dostepne_miasto_synced_v4",
  NOTIFICATIONS: "dostepne_miasto_notifications_v4",
};

function sanitizePlace(p: Place): Place {
  if (!p.address || p.address.includes("współrzędne")) {
    return {
      ...p,
      address: resolveKrakowAddress(
        undefined,
        typeof p.lat === "number" ? p.lat : 50.0617,
        typeof p.lng === "number" ? p.lng : 19.9373,
        p.name
      ),
    };
  }
  return p;
}

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
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("owner-zgloszenie-1");

  const showPlaceOnMap = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setActiveView("explore");
    if (typeof window !== "undefined") {
      setTimeout(() => {
        const el = document.getElementById("mapa");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const [places, setPlaces] = useState<Place[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.PLACES);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(sanitizePlace);
          }
        } catch {}
      }
    }
    return INITIAL_PLACES.map(sanitizePlace);
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

  const [notifications, setNotifications] = useState<OwnerNotification[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return [
      {
        id: "notif-demo-1",
        recipientOwnerId: "owner-1",
        recipientOwnerName: "Jan Nowak (Właściciel)",
        placeId: "archive-demo-1",
        placeName: "Kawiarnia Bracka Retro",
        placeAddress: "ul. Bracka 14, 31-005 Kraków",
        type: "place_deleted",
        title: "Usunięcie lokalu z rejestru miejskiego",
        message: 'Twój lokal "Kawiarnia Bracka Retro" został usunięty z rejestru miejskiego przez administratora.',
        reason: "Zgłoszenie trwałego zamknięcia lokalu gastronomicznego i wymeldowania działalności.",
        date: "2026-09-29",
        read: false,
      },
    ];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }, [notifications]);

  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const deletePlace = (placeId: string, reason?: string) => {
    const targetPlace = places.find((p) => p.id === placeId);
    if (!targetPlace) return { ownerNotified: false, placeName: "" };

    const placeName = targetPlace.name;
    const hasOwner = Boolean(targetPlace.ownerId || targetPlace.submittedByOwnerName);

    if (hasOwner) {
      const newNotif: OwnerNotification = {
        id: `notif-${Date.now()}`,
        recipientOwnerId: targetPlace.ownerId || "owner-1",
        recipientOwnerName: targetPlace.submittedByOwnerName || "Właściciel lokalu",
        placeId: targetPlace.id,
        placeName: targetPlace.name,
        placeAddress: targetPlace.address,
        type: "place_deleted",
        title: "Usunięcie lokalu z rejestru miejskiego",
        message: `Twój lokal "${targetPlace.name}" (${targetPlace.address}) został usunięty z rejestru miejskiego przez Urząd Miasta Krakowa.`,
        reason:
          reason?.trim() ||
          "Wycofanie wpisu ze względu na niespełnianie standardów dostępności architektonicznej lub nieaktualne dane.",
        date: new Date().toISOString().slice(0, 10),
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);
    }

    setPlaces((prev) => {
      const updated = prev.filter((p) => p.id !== placeId);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedPlaceId === placeId) {
      const remaining = places.filter((p) => p.id !== placeId);
      if (remaining.length > 0) {
        setSelectedPlaceId(remaining[0].id);
      }
    }

    return {
      ownerNotified: hasOwner,
      ownerName: targetPlace.submittedByOwnerName,
      placeName,
    };
  };

  const [isSyncingPlaces, setIsSyncingPlaces] = useState(false);
  const [lastSyncedSource, setLastSyncedSource] = useState<string>("OpenStreetMap");

  const syncPlacesFromOSM = async () => {
    setIsSyncingPlaces(true);
    try {
      const res = await fetch("/api/places");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.places) && data.places.length > 0) {
          const sanitized = data.places.map(sanitizePlace);
          setPlaces(sanitized);
          setLastSyncedSource(
            data.source === "openstreetmap-live"
              ? "OpenStreetMap Live"
              : "OpenStreetMap Kraków"
          );
          localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(sanitized));
          localStorage.setItem(STORAGE_KEYS.SYNCED, "true");
        }
      }
    } catch {
      // Gracefully fallback to baseline
    } finally {
      setIsSyncingPlaces(false);
    }
  };

  // First-run real-time synchronization from OpenStreetMap API route
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clean legacy storage keys to wipe old cached places with raw coordinates
    localStorage.removeItem("dostepne_miasto_places");
    localStorage.removeItem("dostepne_miasto_reviews");
    localStorage.removeItem("dostepne_miasto_reports");
    localStorage.removeItem("dostepne_miasto_places_v2");
    localStorage.removeItem("dostepne_miasto_reviews_v2");
    localStorage.removeItem("dostepne_miasto_reports_v2");
    localStorage.removeItem("dostepne_miasto_places_v3");
    localStorage.removeItem("dostepne_miasto_reviews_v3");
    localStorage.removeItem("dostepne_miasto_reports_v3");
    localStorage.removeItem("dostepne_miasto_synced_v3");

    const hasSynced = localStorage.getItem(STORAGE_KEYS.SYNCED);
    if (!hasSynced) {
      const timer = setTimeout(() => {
        void syncPlacesFromOSM();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

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
      ownedPlaceIds: role === "owner" ? ["owner-zgloszenie-1", "mcdonalds-rynek", "teatr-slowackiego"] : undefined,
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
    const fallbackLat = 50.0614 + (Math.random() - 0.5) * 0.015;
    const fallbackLng = 19.9383 + (Math.random() - 0.5) * 0.02;

    const newPlace: Place = {
      ...placeData,
      id: newId,
      lat: Number.isFinite(placeData.lat) ? placeData.lat : fallbackLat,
      lng: Number.isFinite(placeData.lng) ? placeData.lng : fallbackLng,
      rating: 5.0,
      reviewsCount: 1,
    };
    setPlaces((prev) => [newPlace, ...prev]);
    return newPlace;
  };

  const verifyPlace = (
    placeId: string,
    status: "zatwierdzony" | "odrzucony" | "do_poprawy",
    notes?: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const verifier = currentUser?.name || "Administrator Miejski";

    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id !== placeId) return p;
        const isApproved = status === "zatwierdzony";
        return {
          ...p,
          verified: isApproved,
          verificationStatus: status,
          verificationNotes:
            notes ||
            (isApproved
              ? "Obiekt zweryfikowany pozytywnie w rejestrze miejskim."
              : "Wymaga uzupełnienia dokumentacji lub modyfikacji barier."),
          verifiedAt: today,
          verifiedBy: verifier,
          accessibility: p.accessibility.map((a) => ({
            ...a,
            reliability: isApproved ? ("Potwierdzone" as const) : a.reliability,
            source: isApproved ? `Weryfikacja miejska (${verifier})` : a.source,
            date: today,
          })),
        };
      })
    );
  };

  const simulateOwnerSubmission = (): Place => {
    const simulationVenues = [
      {
        name: "Kawiarnia Literacka Mozaika",
        category: "restauracje" as const,
        categoryLabel: "Restauracje",
        address: "ul. Bracka 5, 31-005 Kraków",
        hours: "09:00 - 21:00",
        lat: 50.0595,
        lng: 19.9365,
        features: [
          "Wejście bezprogowe (poziom 0)",
          "Pętla indukcyjna (strefa obsługi / sala)",
          "Toaleta przystosowana (z uchwytami)",
          "Przyjazne dla psa przewodnika / asystującego",
        ],
        desc: "Nowo zgłoszony lokal przez właściciela. Kawiarnia po remoncie dostosowana dla osób ze szczególnymi potrzebami.",
      },
      {
        name: "Bistro Przyjazne Zabłocie",
        category: "restauracje" as const,
        categoryLabel: "Restauracje",
        address: "ul. Przemysłowa 12, 30-701 Kraków",
        hours: "11:00 - 22:00",
        lat: 50.0485,
        lng: 19.9620,
        features: [
          "Podjazd / rampa z poręczami",
          "Szerokie ciągi komunikacyjne (min. 120 cm)",
          "Ciche godziny / strefa wyciszenia sensorycznego",
        ],
        desc: "Lokal gastronomiczny na Zabłociu z bezprogową rampą i strefą relaksu sensorycznego.",
      },
      {
        name: "Galeria Sztuki Pod Baranami",
        category: "kultura" as const,
        categoryLabel: "Kultura",
        address: "Rynek Główny 27, 31-010 Kraków",
        hours: "10:00 - 19:00",
        lat: 50.0614,
        lng: 19.9361,
        features: [
          "Winda dostosowana do wózków",
          "Audiodeskrypcja (menu / przewodnik)",
          "Ścieżki dotykowe i linie naprowadzające",
        ],
        desc: "Prywatna przestrzeń wystawiennicza z audiodeskrypcją zgłoszona przez kuratora do certyfikacji miejskiej.",
      },
    ];

    const pick = simulationVenues[Math.floor(Math.random() * simulationVenues.length)];
    const newId = `owner-sim-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);

    const newPlace: Place = {
      id: newId,
      name: `${pick.name} #${Math.floor(Math.random() * 900 + 100)}`,
      category: pick.category,
      categoryLabel: pick.categoryLabel,
      address: pick.address,
      hours: pick.hours,
      features: pick.features,
      accessibility: pick.features.map((f) => ({
        label: f,
        value: "Zgłoszone w deklaracji właściciela",
        source: "Zgłoszenie właściciela obiektu",
        date: today,
        reliability: "Do sprawdzenia" as const,
      })),
      x: 50,
      y: 50,
      lat: pick.lat,
      lng: pick.lng,
      description: pick.desc,
      ownerId: currentUser?.role === "owner" ? currentUser.id : "owner-1",
      verified: false,
      verificationStatus: "oczekuje",
      submittedByOwnerName:
        currentUser?.role === "owner"
          ? `${currentUser.name} (Właściciel)`
          : "Jan Nowak (Właściciel)",
      rating: 5.0,
      reviewsCount: 1,
    };

    setPlaces((prev) => [newPlace, ...prev]);

    if (currentUser?.role === "owner") {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              ownedPlaceIds: [...(prev.ownedPlaceIds || []), newId],
            }
          : prev
      );
    }

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
        isSyncingPlaces,
        lastSyncedSource,
        syncPlacesFromOSM,
        verifyPlace,
        simulateOwnerSubmission,
        notifications,
        deletePlace,
        dismissNotification,
        selectedPlaceId,
        setSelectedPlaceId,
        showPlaceOnMap,
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
