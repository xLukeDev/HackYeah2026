"use client";

import { useState } from "react";
import { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin } from "lucide-react";

interface AdminPlacesRegistryProps {
  places: Place[];
  onAddNewPlace: (placeData: {
    name: string;
    category: Place["category"];
    categoryLabel: string;
    address: string;
    hours: string;
    x: number;
    y: number;
    description: string;
    features: string[];
    accessibility: Place["accessibility"];
    verified: boolean;
  }) => void;
  onExplore: (placeId: string) => void;
}

export default function AdminPlacesRegistry({
  places,
  onAddNewPlace,
  onExplore,
}: AdminPlacesRegistryProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Place["category"]>("restauracje");
  const [newAddress, setNewAddress] = useState("");
  const [newHours, setNewHours] = useState("09:00 - 20:00");
  const [newDescription, setNewDescription] = useState("");

  const handleCreatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) return;

    const categoryLabels: Record<Place["category"], string> = {
      restauracje: "Restauracje",
      kultura: "Kultura",
      sport: "Sport i Rekreacja",
      zdrowie: "Zdrowie i Urzędy",
    };

    onAddNewPlace({
      name: newName.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      address: newAddress.trim(),
      hours: newHours,
      x: 50,
      y: 50,
      description: newDescription || "Nowo dodany obiekt miejski weryfikowany pod kątem dostępności.",
      features: ["Wejście bezprogowe (poziom 0)", "Toaleta przystosowana"],
      accessibility: [
        {
          label: "Wejście bezprogowe",
          value: "Dostępne",
          source: "Urząd Miasta",
          date: new Date().toISOString().slice(0, 10),
          reliability: "Potwierdzone",
        },
      ],
      verified: true,
    });

    setNewName("");
    setNewAddress("");
    setNewDescription("");
    setShowAddModal(false);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Miejska Baza Danych
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Katalog obiektów w Krakowie ({places.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dodawaj nowe obiekty użyteczności publicznej lub edytuj istniejące.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-700 font-bold text-white hover:bg-purple-800 rounded-xl text-xs"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Dodaj nowy obiekt do bazy
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <div
            key={place.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/40 p-4"
          >
            <div>
              <div className="flex items-start justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  {place.categoryLabel}
                </span>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                  Zweryfikowany
                </Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{place.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" /> {place.address}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {place.features.slice(0, 3).map((feat) => (
                  <span
                    key={feat}
                    className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700"
                  >
                    {feat}
                  </span>
                ))}
                {place.features.length > 3 && (
                  <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold text-purple-700">
                    +{place.features.length - 3} więcej
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] text-slate-400">
              <span>Ocena: {place.rating || 5}.0 ({place.reviewsCount || 1} opinii)</span>
              <button
                type="button"
                className="flex items-center gap-1 font-bold text-purple-700 hover:text-purple-900 hover:underline transition-colors"
                onClick={() => onExplore(place.id)}
              >
                <MapPin className="h-3.5 w-3.5" />
                Pokaż na mapie
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Place Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Dodaj nowy obiekt miejski do rejestru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Wprowadź dane instytucji, kawiarni lub punktu obsługi mieszkańców.
            </p>

            <form onSubmit={handleCreatePlace} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Nazwa lokalu / obiektu</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="np. Nowa Biblioteka Miejska"
                  required
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-purple-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Kategoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Place["category"])}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-purple-700"
                  >
                    <option value="restauracje">Restauracje</option>
                    <option value="kultura">Kultura</option>
                    <option value="sport">Sport</option>
                    <option value="zdrowie">Zdrowie i Urzędy</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Godziny otwarcia</label>
                  <input
                    type="text"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    placeholder="08:00 - 20:00"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Adres w Krakowie</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="np. ul. Karmelicka 12, Kraków"
                  required
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-purple-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Opis obiektu i dostępności</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Krótki opis przestrzeni, udogodnień i wejścia..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-purple-700"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs"
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-700 font-bold text-white hover:bg-purple-800 text-xs"
                >
                  Zapisz i opublikuj w rejestrze
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
