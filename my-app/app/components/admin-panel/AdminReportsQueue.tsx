"use client";

import { useState } from "react";
import { Report } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
} from "lucide-react";

interface AdminReportsQueueProps {
  reports: Report[];
  onUpdateReportStatus: (
    reportId: string,
    status: Report["status"],
    notes?: string
  ) => void;
}

export default function AdminReportsQueue({
  reports,
  onUpdateReportStatus,
}: AdminReportsQueueProps) {
  const [filter, setFilter] = useState<"pending" | "resolved" | "all">("pending");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const pendingReports = reports.filter((r) => r.status === "Oczekujące");
  const displayedReports = reports.filter((r) => {
    if (filter === "pending") return r.status === "Oczekujące";
    if (filter === "resolved") return r.status === "Potwierdzone" || r.status === "Odrzucone";
    return true;
  });

  const handleResolve = (reportId: string, status: Report["status"]) => {
    const note = adminNotes[reportId] || "Rozpatrzono przez Administratora Miejskiego.";
    onUpdateReportStatus(reportId, status, note);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Kolejka moderacyjna
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Zgłoszenia barier i weryfikacje cech ({displayedReports.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Przeanalizuj zgłoszenie mieszkańca i zaktualizuj stan infrastruktury w bazie.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === "pending"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Oczekujące ({pendingReports.length})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === "resolved"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rozpatrzone
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Wszystkie
          </button>
        </div>
      </div>

      {displayedReports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
          Brak zgłoszeń w tej kategorii. Wszystkie sprawy zostały rozpatrzone na bieżąco!
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReports.map((rep) => (
            <div
              key={rep.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-shadow hover:bg-white hover:shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-[10px]">
                      {rep.category}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Zgłosił: <strong>{rep.userName}</strong> ({rep.createdAt})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {rep.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-700 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" /> Dotyczy obiektu: {rep.placeName}
                  </p>
                </div>

                <Badge
                  className={`text-xs font-bold ${
                    rep.status === "Potwierdzone"
                      ? "bg-emerald-100 text-emerald-800"
                      : rep.status === "Oczekujące"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {rep.status}
                </Badge>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-700">
                {rep.description}
              </p>

              {rep.notes && (
                <div className="mt-3 rounded-xl bg-purple-50 border border-purple-200 p-2.5 text-xs text-purple-900">
                  <strong>Notatka urzędowa:</strong> {rep.notes}
                </div>
              )}

              {/* Actions for pending reports */}
              {rep.status === "Oczekujące" && (
                <div className="mt-4 border-t border-slate-200 pt-3">
                  <div className="mb-2">
                    <input
                      type="text"
                      value={adminNotes[rep.id] || ""}
                      onChange={(e) =>
                        setAdminNotes((prev) => ({
                          ...prev,
                          [rep.id]: e.target.value,
                        }))
                      }
                      placeholder="Dodaj notatkę inspekcyjną (np. Sprawdzono w terenie, przekazano do zarządcy)..."
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none focus:border-purple-600"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleResolve(rep.id, "Potwierdzone")}
                      className="bg-emerald-600 font-bold text-white hover:bg-emerald-700 h-8 text-xs"
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Zatwierdź jako Potwierdzone
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResolve(rep.id, "W realizacji")}
                      className="bg-blue-600 font-bold text-white hover:bg-blue-700 h-8 text-xs"
                    >
                      <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                      Skieruj do zarządcy obiektu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(rep.id, "Odrzucone")}
                      className="text-slate-600 hover:text-red-700 h-8 text-xs"
                    >
                      <XCircle className="mr-1 h-3.5 w-3.5" />
                      Odrzuć
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
