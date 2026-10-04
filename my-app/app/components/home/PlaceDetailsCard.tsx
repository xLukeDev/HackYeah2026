"use client";

import { Place } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  AlertTriangle,
  MessageCircle,
  SlidersHorizontal,
  Tag,
  Info,
} from "lucide-react";
import { AccessibilityIcon } from "@/components/AccessibilityIcon";

interface PlaceDetailsCardProps {
  place: Place | null;
  onOpenReview: () => void;
  onOpenVerify: () => void;
}

export default function PlaceDetailsCard({
  place,
  onOpenReview,
  onOpenVerify,
}: PlaceDetailsCardProps) {
  if (!place) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
        Wybierz punkt na mapie, aby zobaczyć szczegóły dostępności.
      </div>
    );
  }

  const isCertified = place.verified || place.verificationStatus === "zatwierdzony";
  const isPending = place.verificationStatus === "oczekuje";
  const isNeedsFix = place.verificationStatus === "do_poprawy";

  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="border-0 bg-blue-50 text-blue-700 font-bold text-xs">
                {place.categoryLabel}
              </Badge>
              {isCertified && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[10px]">
                  <ShieldCheck className="h-3 w-3 mr-1 inline" /> Certyfikat Miejski
                </Badge>
              )}
              {isPending && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-bold text-[10px]">
                  <Clock className="h-3 w-3 mr-1 inline" /> Weryfikacja w toku
                </Badge>
              )}
              {isNeedsFix && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-300 font-bold text-[10px]">
                  <AlertTriangle className="h-3 w-3 mr-1 inline" /> Do poprawy
                </Badge>
              )}
            </div>
            <span className="text-xs text-slate-400">
              ID: #{place.id}
            </span>
          </div>

          <CardTitle className="pt-2 text-xl font-bold text-slate-900">
            {place.name}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            <MapPin className="mr-1 inline h-3.5 w-3.5 text-blue-700" />
            {place.address}
          </CardDescription>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {place.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                >
                  <Tag className="h-2.5 w-2.5 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Status banner for unverified places */}
          {isPending && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold">Obiekt oczekuje na weryfikację miejską.</span>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Dane z importu lub zgłoszenia społecznościowego. Przed przyznaniem Certyfikatu Miejskiego wymagany jest audyt miejski.
                </p>
              </div>
            </div>
          )}

          {/* Rating & reviews */}
          <div className="flex items-center gap-1.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(place.rating || 5)
                    ? "fill-current"
                    : "text-slate-200"
                }`}
              />
            ))}
            <span className="ml-1 text-xs font-bold text-slate-800">
              {place.rating || 4.8} · {place.reviewsCount || 12} opinii
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-600">
            {place.description}
          </p>

          <div className="flex items-center gap-2 border-y border-slate-100 py-3 text-xs text-slate-600">
            <Clock className="h-3.5 w-3.5 text-blue-700 shrink-0" />
            <span>Godziny otwarcia: {place.hours}</span>
          </div>

          {/* Accessibility Profile List */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Zweryfikowane cechy ({place.features.length})
              </span>
              <button
                onClick={onOpenVerify}
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                + Zaznacz / Zgłoś opcje
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {place.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800"
                >
                  <AccessibilityIcon name={feature} className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Accessibility Details / Sources / Measurements */}
          {place.accessibility && place.accessibility.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-blue-700" />
                  Pomiary i źródła audytu
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Metryka dostępności
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {place.accessibility.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
                      <span>{item.label}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          item.reliability === "Potwierdzone"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.reliability === "Zgłoszone"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.reliability}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600 leading-snug">
                      {item.value}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400">
                      Źródło: {item.source} · {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Card Action Buttons: Add Review + Verify Features */}
      <div className="p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={onOpenReview}
            className="h-10 flex-1 bg-blue-700 text-xs font-bold text-white hover:bg-blue-800 rounded-xl"
          >
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Dodaj opinię i oceń
          </Button>
          <Button
            onClick={onOpenVerify}
            variant="outline"
            className="h-10 border-blue-300 text-blue-800 hover:bg-blue-50 text-xs font-bold rounded-xl"
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            Zaznacz opcje
          </Button>
        </div>
      </div>
    </Card>
  );
}
