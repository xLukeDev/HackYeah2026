"use client";

import { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Star,
  CheckCircle2,
  Building,
  Trash2,
} from "lucide-react";

interface UserReviewsTabProps {
  reviews: Review[];
  deleteReview: (id: string) => void;
  onExplore: () => void;
}

export default function UserReviewsTab({
  reviews,
  deleteReview,
  onExplore,
}: UserReviewsTabProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <MessageCircle className="mx-auto h-10 w-10 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Nie dodałeś jeszcze żadnej opinii</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Przeglądaj lokale na mapie i oceń ich dostępność. Za każdą zatwierdzoną opinię otrzymasz 25 punktów!
        </p>
        <Button
          onClick={onExplore}
          className="mt-4 bg-blue-700 text-xs font-bold text-white hover:bg-blue-800"
        >
          Przejdź do wyszukiwarki miejsc
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((rev) => (
        <div
          key={rev.id}
          className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-blue-700">{rev.place}</span>
                <div className="mt-1 flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= rev.rating ? "fill-current" : "text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 text-xs font-bold text-slate-700">
                    {rev.rating}.0
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">{rev.date}</span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-700">“{rev.text}”</p>

            {rev.verifiedFeatures && rev.verifiedFeatures.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {rev.verifiedFeatures.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-800 border border-cyan-200"
                  >
                    <CheckCircle2 className="h-3 w-3 text-cyan-600" />
                    {feat}
                  </span>
                ))}
              </div>
            )}

            {rev.ownerReply && (
              <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Building className="h-3.5 w-3.5 text-blue-700" />
                  {rev.ownerReply.author}
                  <span className="ml-auto text-[10px] font-normal text-blue-600">
                    {rev.ownerReply.date}
                  </span>
                </div>
                <p className="mt-1 text-slate-700 leading-normal">
                  {rev.ownerReply.text}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[11px] text-slate-400">
              ID opinii: {rev.id.slice(0, 8)}
            </span>
            <button
              onClick={() => deleteReview(rev.id)}
              className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
              title="Usuń opinię"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
