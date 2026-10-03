"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { ACCESSIBILITY_CATALOG } from "@/lib/initial-data";
import { Place } from "@/lib/types";
import { Star, CheckCircle2, X, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessibilityIcon } from "@/components/AccessibilityIcon";

interface ReviewFormProps {
  place: Place;
  onClose: () => void;
  authorName?: string;
}

export default function ReviewForm({ place, onClose, authorName }: ReviewFormProps) {
  const { addReview, currentUser } = useApp();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(() => {
    // Pre-check the features the place already advertises
    const initial: Record<string, boolean> = {};
    place.features.forEach((f) => {
      initial[f] = true;
    });
    return initial;
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleOption = (label: string) => {
    setCheckedOptions((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const selectedLabels = Object.keys(checkedOptions).filter((k) => checkedOptions[k]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Wybierz ocenę gwiazdkową (1–5).");
      return;
    }
    if (comment.trim().length < 8) {
      setError("Napisz co najmniej kilka słów o swoim doświadczeniu (min. 8 znaków).");
      return;
    }

    setError("");
    setLoading(true);

    // Save to AppContext
    addReview({
      placeId: place.id,
      text: comment.trim(),
      rating,
      verifiedFeatures: selectedLabels,
    });

    setLoading(false);
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Zamknij"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Dziękujemy za opinię i weryfikację!
            </h3>
            <p className="max-w-md text-xs text-slate-500 leading-relaxed">
              Twoja recenzja lokalu <strong>{place.name}</strong> oraz zweryfikowane udogodnienia ({selectedLabels.length}) zostały opublikowane i dodane do profilu lokalu.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" /> +25 punktów dodano do Twojego konta!
            </div>
            <Button
              onClick={onClose}
              className="mt-4 bg-blue-700 font-bold text-white hover:bg-blue-800 px-6 rounded-xl"
            >
              Zamknij okno
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Głos Społeczności
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Oceń i zweryfikuj dostępność: {place.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {authorName || currentUser?.name
                  ? `Wystawiasz opinię jako: ${authorName || currentUser?.name}`
                  : "Każda perspektywa pomaga innym osobom zaplanować bezpieczny dzień."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Ogólna ocena dostępności tego miejsca:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      aria-label={`Ocena ${star}`}
                      className="p-1 transition-transform hover:scale-115"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-xs font-bold text-slate-700">
                    {["", "1.0 - Niedostępne", "2.0 - Duże bariery", "3.0 - Częściowo dostępne", "4.0 - Dobre udogodnienia", "5.0 - Wzorcowa dostępność"][rating]}
                  </span>
                </div>
              </div>

              {/* Interactive Features Checklist */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Zaznacz opcje dostępności, które widziałeś w lokalu:
                  </label>
                  <span className="text-[11px] font-semibold text-blue-700">
                    {selectedLabels.length} zaznaczonych
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
                  {ACCESSIBILITY_CATALOG.map((item) => {
                    const isChecked = !!checkedOptions[item.label];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleOption(item.label)}
                        className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-all ${
                          isChecked
                            ? "border-blue-500 bg-blue-50/80 text-blue-900 font-semibold"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <AccessibilityIcon id={item.id} name={item.label} className="h-4 w-4 shrink-0 text-blue-700 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">
                            {item.category}
                          </span>
                          <span className="truncate block leading-tight">{item.label}</span>
                        </div>
                        {isChecked && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Twój komentarz / szczegółowy opis <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Opisz np. wysokość progów, działanie windy, uprzejmość obsługi, czy pętla indukcyjna działa bez zarzutu..."
                  rows={3}
                  required
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-900 outline-none focus:border-blue-700"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 p-2.5 text-xs font-medium text-red-600 border border-red-200">
                  {error}
                </p>
              )}

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
                  type="submit"
                  disabled={loading}
                  className="bg-blue-700 font-bold text-white hover:bg-blue-800 text-xs px-5 rounded-xl"
                >
                  {loading ? "Publikowanie..." : "Opublikuj opinię (+25 pkt)"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
