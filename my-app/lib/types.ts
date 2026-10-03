export type UserRole = "user" | "owner" | "admin";

export interface AccessibilityItem {
  label: string;
  value: string;
  source: string;
  date: string;
  reliability: "Potwierdzone" | "Zgłoszone" | "Do sprawdzenia";
}

export interface Place {
  id: string;
  name: string;
  category: "restauracje" | "kultura" | "sport" | "zdrowie";
  categoryLabel: string;
  address: string;
  hours: string;
  phone: string;
  features: string[];
  accessibility: AccessibilityItem[];
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  description: string;
  ownerId?: string;
  verified?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface Review {
  id: string;
  placeId: string;
  author: string;
  initials: string;
  role: "Mieszkaniec" | "Właściciel" | "Audytor";
  userId?: string;
  place: string;
  text: string;
  date: string;
  rating: number;
  accent: string;
  verifiedFeatures?: string[];
  ownerReply?: {
    author: string;
    text: string;
    date: string;
  };
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  placeId: string;
  placeName: string;
  category: string;
  title: string;
  description: string;
  status: "Oczekujące" | "Potwierdzone" | "Odrzucone" | "W realizacji";
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  initials: string;
  badge: string;
  points: number;
  ownedPlaceIds?: string[];
}
