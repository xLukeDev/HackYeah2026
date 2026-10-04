"use client";

import { useState } from "react";
import { ACCESSIBILITY_CATALOG } from "@/lib/initial-data";
import { Place, UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, MapPin, Send } from "lucide-react";

interface OwnerRegisterPlaceFormProps {
  currentUser: UserProfile;
  onPlaceRegistered: (place: Place) => void;
  addNewPlace: (placeData: {
    name: string;
    category: Place["category"];
    categoryLabel: string;
    address: string;
    hours: string;
    features: string[];
    accessibility: Place["accessibility"];
    x: number;
    y: number;
    description: string;
    ownerId?: string;
    verified?: boolean;
    verificationStatus?: "oczekuje" | "zatwierdzony" | "do_poprawy" | "odrzucony";
    submittedByOwnerName?: string;
  }) => Place;
}

export default function OwnerRegisterPlaceForm({
  currentUser,
  onPlaceRegistered,
  addNewPlace,
}: OwnerRegisterPlaceFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Place["category"]>("restauracje");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("09:00 - 20:00");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const toggleFeature = (feature: string) => {
    setFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature]
    );
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const categoryLabels: Record<Place["category"], string> = {
      restauracje: "Gastronomia",
      kultura: "Kultura",
      sport: "Sport i Rekreacja",
      zdrowie: "Zdrowie i Urzędy",
    };

    const newPlace = addNewPlace({
      name: name.trim(),
      category: category,
      categoryLabel: categoryLabels[category],
      address: address.trim(),
      hours: hours.trim(),
      features: features,
      accessibility: features.map((feature) => ({
        label: feature,
        value: "Zgłoszone przez zarządcę",
        source: "Zgłoszenie właściciela obiektu",
        date: new Date().toISOString().slice(0, 10),
        reliability: "Zgłoszone" as const,
      })),
      x: 50,
      y: 50,
      description:
        description.trim() ||
        "Opis zostanie uzupełniony przez zarządcę obiektu.",
      ownerId: currentUser.id,
      verified: false,
      verificationStatus: "oczekuje",
      submittedByOwnerName: `${currentUser.name} (Właściciel)`,
    });

    onPlaceRegistered(newPlace);
    setShowForm(false);
    setRegistrationSuccess(true);
    setName("");
    setAddress("");
    setDescription("");
    setFeatures([]);
    setTimeout(() => setRegistrationSuccess(false), 4000);
  };

  return (
    <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 shadow-xs sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Baza Dostępnego Miasta
          </span>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Zgłoś nowy lokal do platformy
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600">
            Dodaj wizytówkę swojego lokalu. Adres zostanie automatycznie przypisany do właściwego punktu na mapie.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowForm((curr) => !curr)}
          className="shrink-0 rounded-xl bg-blue-700 font-bold text-white hover:bg-blue-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Zamknij formularz" : "Zgłoś lokal"}
        </Button>
      </div>

      {registrationSuccess && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Lokal został dodany do Twoich obiektów. Możesz teraz uzupełnić jego audyt dostępności.
        </div>
      )}

      {showForm && (
        <form onSubmit={handleRegister} className="mt-6 space-y-5 border-t border-blue-200 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="reg-name" className="mb-1 block text-xs font-bold text-slate-700">
                Nazwa lokalu <span className="text-red-600">*</span>
              </label>
              <input
                id="reg-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="np. Kawiarnia Pod Wawelem"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label htmlFor="reg-category" className="mb-1 block text-xs font-bold text-slate-700">
                Kategoria <span className="text-red-600">*</span>
              </label>
              <select
                id="reg-category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value as Place["category"])}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-700"
              >
                <option value="restauracje">Gastronomia (Restauracje i Kawiarnie)</option>
                <option value="kultura">Kultura</option>
                <option value="sport">Sport i rekreacja</option>
                <option value="zdrowie">Zdrowie i urzędy</option>
              </select>
            </div>
            <div>
              <label htmlFor="reg-hours" className="mb-1 block text-xs font-bold text-slate-700">
                Godziny otwarcia <span className="text-red-600">*</span>
              </label>
              <input
                id="reg-hours"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="np. 08:00 - 22:00"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-700"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="reg-address" className="mb-1 block text-xs font-bold text-slate-700">
                Adres lokalu <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
                <input
                  id="reg-address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="np. ul. Starowiślna 84, Kraków"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-700"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="reg-desc" className="mb-1 block text-xs font-bold text-slate-700">
                Krótki opis
              </label>
              <input
                id="reg-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Najważniejsze informacje dla odwiedzających"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-slate-700">Dostępność lokalu</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ACCESSIBILITY_CATALOG.slice(0, 9).map((item) => {
                const isSelected = features.includes(item.label);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleFeature(item.label)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                      isSelected
                        ? "border-blue-600 bg-blue-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="rounded-xl font-bold"
            >
              Anuluj
            </Button>
            <Button type="submit" className="rounded-xl bg-blue-700 font-bold text-white hover:bg-blue-800">
              <Send className="mr-2 h-4 w-4" />
              Dodaj lokal do platformy
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
