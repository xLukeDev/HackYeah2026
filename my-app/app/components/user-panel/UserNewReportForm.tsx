"use client";

import { useState } from "react";
import { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface UserNewReportFormProps {
  places: Place[];
  onSubmitReport: (data: {
    placeId: string;
    category: string;
    title: string;
    description: string;
  }) => void;
  onSuccessDone: () => void;
}

export default function UserNewReportForm({
  places,
  onSubmitReport,
  onSuccessDone,
}: UserNewReportFormProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState(places[0]?.id || "");
  const [reportCategory, setReportCategory] = useState("Rampy i wejścia");
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDesc.trim()) return;

    onSubmitReport({
      placeId: selectedPlaceId,
      category: reportCategory,
      title: reportTitle.trim(),
      description: reportDesc.trim(),
    });

    setReportSuccess(true);
    setReportTitle("");
    setReportDesc("");
    setTimeout(() => {
      setReportSuccess(false);
      onSuccessDone();
    }, 1200);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Formularz zgłoszenia bariery lub udogodnienia
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Twoje zgłoszenie trafi bezpośrednio do Panelu Administratora miejskiego oraz właściciela lokalu.
        </p>
      </div>

      {reportSuccess ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 mb-2" />
          <h4 className="text-base font-bold text-slate-900">Zgłoszenie zostało pomyślnie wysłane!</h4>
          <p className="text-xs text-slate-500 mt-1">
            Przyznano +15 punktów za wkład w mapowanie dostępności.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Wybierz lokal
            </label>
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800"
            >
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.address})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Kategoria zgłoszenia
            </label>
            <select
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800"
            >
              <option value="Rampy i wejścia">Wejścia, progi i podjazdy</option>
              <option value="Winda i komunikacja pionowa">Windy i schody</option>
              <option value="Toaleta dostosowana">Toaleta dla osób z niepełnosprawnością</option>
              <option value="Pętla indukcyjna i dźwięk">Pętla indukcyjna i audiodeskrypcja</option>
              <option value="Tłumacz PJM">Tłumacz Polskiego Języka Migowego</option>
              <option value="Weryfikacja udogodnień">Weryfikacja istniejącego udogodnienia</option>
              <option value="Inne">Inne zgłoszenie architektoniczne lub cyfrowe</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Tytuł zgłoszenia
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="np. Zepsuty podnośnik schodowy lub Za wysoki próg"
              required
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Szczegółowy opis problemu / sugestii
            </label>
            <textarea
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              placeholder="Opisz dokładnie, w którym miejscu występuje bariera, jakiego sprzętu dotyczy oraz jaka zmiana umożliwiłaby swobodny dostęp..."
              rows={4}
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 outline-none focus:border-blue-700"
            />
          </div>

          <Button
            type="submit"
            className="h-11 bg-blue-700 font-bold text-white hover:bg-blue-800 px-6 rounded-xl"
          >
            Prześlij zgłoszenie (+15 pkt)
          </Button>
        </form>
      )}
    </div>
  );
}
