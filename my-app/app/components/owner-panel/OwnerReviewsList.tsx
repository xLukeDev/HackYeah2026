"use client";

import { useState } from "react";
import { Review, Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Star, Send } from "lucide-react";

interface OwnerReviewsListProps {
  currentPlace: Place;
  reviews: Review[];
  onSendReply: (reviewId: string, replyText: string) => void;
}

export default function OwnerReviewsList({
  currentPlace,
  reviews,
  onSendReply,
}: OwnerReviewsListProps) {
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const handleSend = (reviewId: string) => {
    const text = replyTexts[reviewId]?.trim();
    if (!text) return;
    onSendReply(reviewId, text);
    setReplyTexts((prev) => ({ ...prev, [reviewId]: "" }));
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            Opinie gości obiektu ({reviews.length})
          </h4>
          <p className="text-[11px] text-slate-500">
            Odpowiadaj oficjalnie na opinie gości
          </p>
        </div>
        <span className="flex items-center gap-1 font-bold text-amber-600 text-xs">
          <Star className="h-3.5 w-3.5 fill-current" />
          {currentPlace.rating || 5}.0
        </span>
      </div>

      {reviews.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center">
          Brak opinii dla tego lokalu. Zachęć klientów do wystawienia recenzji!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{rev.author}</span>
                <span className="text-[10px] text-slate-400">{rev.date}</span>
              </div>
              <div className="mt-1 flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-3 w-3 ${s <= rev.rating ? "fill-current" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-slate-700 leading-relaxed">{rev.text}</p>

              {/* Official Response */}
              {rev.ownerReply ? (
                <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/90 p-2.5">
                  <span className="font-bold text-blue-900 block text-[11px]">
                    Twoja odpowiedź ({rev.ownerReply.date}):
                  </span>
                  <p className="text-slate-700 mt-0.5">{rev.ownerReply.text}</p>
                </div>
              ) : (
                <div className="mt-3 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={replyTexts[rev.id] || ""}
                    onChange={(e) =>
                      setReplyTexts((prev) => ({
                        ...prev,
                        [rev.id]: e.target.value,
                      }))
                    }
                    placeholder="Napisz odpowiedź właściciela..."
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none focus:border-blue-700"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSend(rev.id)}
                    className="mt-2 h-7 bg-blue-700 text-[11px] font-bold text-white hover:bg-blue-800"
                  >
                    <Send className="mr-1 h-3 w-3" />
                    Odpowiedz oficjalnie
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
