"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface OwnerPlaceDetailsFormProps {
  hours: string;
  description: string;
  detailsSaved: boolean;
  onHoursChange: (hours: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OwnerPlaceDetailsForm({
  hours,
  description,
  detailsSaved,
  onHoursChange,
  onDescriptionChange,
  onSubmit,
}: OwnerPlaceDetailsFormProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        Wizytówka i kontakt dla gości
      </h3>
      <p className="text-xs text-slate-500 mb-5">
        Ułatw osobom ze szczególnymi potrzebami bezpośredni kontakt przed wizytą.
      </p>

      {detailsSaved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Dane kontaktowe i godziny zostały zaktualizowane!
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Godziny otwarcia
          </label>
          <input
            type="text"
            value={hours}
            onChange={(e) => onHoursChange(e.target.value)}
            placeholder="np. 08:00 - 22:00"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Opis architektoniczny i wskazówki dojazdu
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            placeholder="Opisz jak najłatwiej dotrzeć z przystanku, czy jest dzwonek przy wejściu, jak wygląda korytarz..."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 outline-none focus:border-blue-700"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-700 font-bold text-white hover:bg-blue-800 rounded-xl"
          >
            Zaktualizuj dane wizytówki
          </Button>
        </div>
      </form>
    </div>
  );
}
