"use client";

import { OwnerNotification } from "@/lib/types";
import { AlertCircle, Trash2, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OwnerNotificationsBannerProps {
  notifications: OwnerNotification[];
  onDismiss: (id: string) => void;
}

export default function OwnerNotificationsBanner({
  notifications,
  onDismiss,
}: OwnerNotificationsBannerProps) {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-label="Powiadomienia urzędowe dla właściciela">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Bell className="h-4 w-4 text-blue-700" />
        <span>Powiadomienia i komunikaty urzędowe ({notifications.length})</span>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const isDeleted = notif.type === "place_deleted";

          return (
            <div
              key={notif.id}
              className={`relative rounded-2xl border p-5 shadow-sm transition-all ${
                isDeleted
                  ? "border-red-200 bg-red-50/70 text-red-950"
                  : "border-blue-200 bg-blue-50/70 text-blue-950"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isDeleted ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isDeleted ? (
                      <Trash2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                        {isDeleted ? "Lokal wykreślony z rejestru" : "Powiadomienie"}
                      </span>
                      <span className="text-xs text-slate-500">• {notif.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{notif.title}</h4>
                    <p className="text-sm text-slate-700">{notif.message}</p>

                    {notif.reason && (
                      <div className="mt-2.5 rounded-xl border border-red-200/80 bg-white/90 p-3 text-sm">
                        <span className="font-semibold text-slate-900">
                          Powód podany przez administratora miejskiego:
                        </span>
                        <p className="mt-1 text-slate-700">{notif.reason}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(notif.id)}
                  className="h-8 shrink-0 text-slate-600 hover:bg-white/60 hover:text-slate-900"
                  title="Oznacz jako przeczytane"
                >
                  <X className="mr-1 h-4 w-4" />
                  <span className="text-xs font-medium">Ukryj</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
