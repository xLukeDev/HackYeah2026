"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { UserProfile } from "@/lib/types";
import { X, LogIn } from "lucide-react";
import DemoProfileSelector from "./DemoProfileSelector";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const { loginUser } = useApp();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleAuthSuccess = (user: UserProfile) => {
    loginUser(user);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white shadow-md">
              <LogIn className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {mode === "login" ? "Zaloguj się do platformy" : "Utwórz nowe konto"}
              </h2>
              <p className="text-xs text-slate-500">
                Wspólnie współtworzymy w pełni dostępne miasto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Zamknij"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Demo Profiles (Hackathon Friendly) */}
        <DemoProfileSelector onSelectDemo={handleAuthSuccess} />

        {/* Tab switch */}
        <div className="mb-5 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => {
              setMode("login");
              setError("");
              setSuccessMsg("");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              mode === "login"
                ? "bg-white text-blue-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Zaloguj się
          </button>
          <button
            onClick={() => {
              setMode("register");
              setError("");
              setSuccessMsg("");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              mode === "register"
                ? "bg-white text-blue-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Zarejestruj się
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <p className="mb-3.5 rounded-xl bg-red-50 p-2.5 text-xs font-medium text-red-600 border border-red-200">
            {error}
          </p>
        )}

        {successMsg && (
          <p className="mb-3.5 rounded-xl bg-emerald-50 p-2.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            {successMsg}
          </p>
        )}

        {/* Forms */}
        {mode === "login" ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
}
