"use client";

import { UtensilsCrossed, Landmark, Activity, HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CATEGORIES = [
  {
    id: "restauracje",
    title: "Gastronomia",
    desc: "Restauracje i kawiarnie",
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

interface CategoryGridProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

export default function CategoryGrid({
  selectedCategory,
  setSelectedCategory,
}: CategoryGridProps) {
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
            className={`group flex flex-col justify-between rounded-3xl border p-5 text-left transition-all ${
              isSelected
                ? "border-blue-700 bg-white ring-2 ring-blue-700 shadow-md"
                : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${cat.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] font-bold ${
                  isSelected ? "bg-blue-100 text-blue-900 border-blue-300" : ""
                }`}
              >
                {cat.count}
              </Badge>
            </div>
            <div className="mt-5">
              <h3 className="font-bold text-slate-900 text-sm">{cat.title}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{cat.desc}</p>
            </div>
          </button>
        );
      })}
    </section>
  );
}
