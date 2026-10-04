"use client";

import { Review } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface AdminReviewsModerationProps {
  reviews: Review[];
  onDeleteReview: (reviewId: string) => void;
}

export default function AdminReviewsModeration({
  reviews,
  onDeleteReview,
}: AdminReviewsModerationProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
      <div className="border-b border-slate-100 pb-4 mb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
          Moderacja Treści
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-0.5">
          Wszystkie opinie mieszkańców ({reviews.length})
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Dbaj o kulturę wypowiedzi i merytoryczność ocen dostępności.
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{rev.author}</span>
                <Badge variant="outline" className="text-[10px]">
                  {rev.role}
                </Badge>
                <span className="text-slate-400">• {rev.place} •</span>
                <span className="text-slate-400">{rev.date}</span>
              </div>
              <p className="mt-1.5 text-slate-700 leading-normal">“{rev.text}”</p>
            </div>

            <button
              onClick={() => onDeleteReview(rev.id)}
              className="shrink-0 text-slate-400 hover:text-red-600 transition-colors p-1"
              title="Usuń opinię jako moderator"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
