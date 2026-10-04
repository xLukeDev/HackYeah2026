"use client";

import { Report } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flag,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface UserReportsTabProps {
  reports: Report[];
  onNewReport: () => void;
}

export default function UserReportsTab({
  reports,
  onNewReport,
}: UserReportsTabProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <Flag className="mx-auto h-10 w-10 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Brak zgłoszeń barier</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Zauważyłeś brak podjazdu, awarię windy lub złą nawierzchnię? Zgłoś to, a urzędnicy i zarządca obiektu zajmą się sprawą.
        </p>
        <Button
          onClick={onNewReport}
          className="mt-4 bg-blue-700 text-xs font-bold text-white hover:bg-blue-800"
        >
          Dodaj pierwsze zgłoszenie
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reports.map((rep) => {
        const statusStyles = {
          Oczekujące: "bg-amber-50 text-amber-800 border-amber-200",
          Potwierdzone: "bg-emerald-50 text-emerald-800 border-emerald-200",
          "W realizacji": "bg-blue-50 text-blue-800 border-blue-200",
          Odrzucone: "bg-slate-100 text-slate-600 border-slate-200",
        }[rep.status];

        return (
          <div
            key={rep.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {rep.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    {rep.title}
                  </h4>
                  <p className="text-xs font-semibold text-blue-700 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" /> {rep.placeName}
                  </p>
                </div>
                <Badge variant="outline" className={`font-bold text-xs ${statusStyles}`}>
                  {rep.status === "Oczekujące" && <Clock className="mr-1 h-3 w-3" />}
                  {rep.status === "Potwierdzone" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                  {rep.status === "W realizacji" && <AlertTriangle className="mr-1 h-3 w-3" />}
                  {rep.status}
                </Badge>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {rep.description}
              </p>

              {rep.notes && (
                <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Notatka weryfikatora:</span>{" "}
                  {rep.notes}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              <span>Zgłoszono: {rep.createdAt}</span>
              <span>Aktualizacja: {rep.updatedAt}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
