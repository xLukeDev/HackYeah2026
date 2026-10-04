"use client";

import { ACCESSIBILITY_CATALOG } from "@/lib/initial-data";
import { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { AccessibilityIcon } from "@/components/AccessibilityIcon";

interface OwnerAccessibilityAuditProps {
  currentPlace: Place;
  selectedFeatures: string[];
  savedSuccess: boolean;
  onToggleFeature: (featureLabel: string) => void;
  onSaveFeatures: () => void;
}

export default function OwnerAccessibilityAudit({
  currentPlace,
  selectedFeatures,
  savedSuccess,
  onToggleFeature,
  onSaveFeatures,
}: OwnerAccessibilityAuditProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Audyt i deklaracja udogodnień
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Dostępność: {currentPlace.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Zaznacz wszystkie cechy, które są obecnie w 100% sprawne i dostępne dla gości.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
          {selectedFeatures.length} aktywnych cech
        </span>
      </div>

      {savedSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Cechy dostępności zostały pomyślnie zaktualizowane w bazie miejskiej!
        </div>
      )}

      <div className="grid gap-2.5 sm:grid-cols-2">
        {ACCESSIBILITY_CATALOG.map((item) => {
          const isChecked = selectedFeatures.includes(item.label);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleFeature(item.label)}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                isChecked
                  ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <AccessibilityIcon
                id={item.id}
                name={item.label}
                className="h-5 w-5 shrink-0 text-blue-700 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  {isChecked && <CheckCircle2 className="h-4 w-4 text-blue-700" />}
                </div>
                <p className="text-xs font-bold mt-0.5 leading-snug">{item.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">
          Zmiany pojawią się natychmiast na interaktywnej mapie.
        </span>
        <Button
          onClick={onSaveFeatures}
          className="bg-blue-700 font-bold text-white hover:bg-blue-800 rounded-xl px-5"
        >
          Zapisz cechy obiektu
        </Button>
      </div>
    </div>
  );
}
