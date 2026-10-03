"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { ACCESSIBILITY_CATALOG } from "@/lib/initial-data";
import { Place } from "@/lib/types";
import { X, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessibilityIcon } from "@/components/AccessibilityIcon";

interface QuickVerifyModalProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickVerifyModal({
  place,
  isOpen,
  onClose,
}: QuickVerifyModalProps) {
  const { updatePlaceFeatures, currentUser, addReport } = useApp();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(place.features);
  const [reportNote, setReportNote] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const toggleFeature = (label: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const handleSave = () => {
    updatePlaceFeatures(place.id, selectedFeatures);

    // If there was a note, add it as a report
    if (reportNote.trim()) {
      addReport({
        placeId: place.id,
        category: "Weryfikacja cech dostępności",
        title: `Aktualizacja parametrów: ${place.name}`,
        description: reportNote.trim(),
      });
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Zamknij"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {saved ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Dziękujemy za weryfikację!
            </h3>
            <p className="max-w-md text-xs text-slate-500 leading-relaxed">
              Zaktualizowane cechy dostępności dla lokalu <strong>{place.name}</strong> zostały zapisane i są widoczne dla wszystkich mieszkańców.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" /> +15 punktów weryfikatora dodano do Twojego profilu!
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                Weryfikacja w terenie
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Zaznacz opcje dostępności: {place.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Jesteś na miejscu? Zaznacz lub odznacz udogodnienia na podstawie tego, co widzisz w rzeczywistości.
              </p>
            </div>

            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-2 p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
                {ACCESSIBILITY_CATALOG.map((item) => {
                  const isChecked = selectedFeatures.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleFeature(item.label)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        isChecked
                          ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <AccessibilityIcon id={item.id} name={item.label} className="h-4 w-4 shrink-0 text-blue-700" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">
                            {item.category}
                          </span>
                          <span className="text-xs font-medium">{item.label}</span>
                        </div>
                      </div>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border text-white ${
                          isChecked ? "bg-blue-700 border-blue-700" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Opcjonalna uwaga lub opis błędu (np. winda chwilowo nieczynna)
                </label>
                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Wpisz dodatkowe szczegóły dla innych gości lub zarządcy obiektu..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="text-xs"
                >
                  Anuluj
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-700 font-bold text-white hover:bg-blue-800 text-xs px-5 rounded-xl"
                >
                  Zapisz i zaktualizuj profil lokalu
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
