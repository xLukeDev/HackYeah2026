"use client";

import { useState } from "react";
import { DEMO_USERS } from "@/lib/initial-data";
import { UserProfile, UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCheck, Building2, Shield } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { translateAuthError } from "@/lib/auth-errors";

interface RegisterFormProps {
  onSuccess: (user: UserProfile) => void;
  onError: (msg: string) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
}

export default function RegisterForm({
  onSuccess,
  onError,
  loading,
  setLoading,
}: RegisterFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");

    if (password !== confirmPassword) {
      onError("Hasła nie są identyczne.");
      return;
    }
    if (password.length < 6) {
      onError("Hasło musi mieć minimum 6 znaków.");
      return;
    }
    if (!name.trim()) {
      onError("Wpisz imię i nazwisko.");
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const registeredUsersKey = "dostepne_miasto_registered_users";
      const storedUsers: Array<UserProfile & { password?: string }> =
        typeof window !== "undefined" && localStorage.getItem(registeredUsersKey)
          ? JSON.parse(localStorage.getItem(registeredUsersKey) || "[]")
          : [];

      const alreadyInDemo = DEMO_USERS.some(
        (u) => u.email.toLowerCase() === cleanEmail
      );
      const alreadyInLocal = storedUsers.some(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      if (alreadyInDemo || alreadyInLocal) {
        onError("Konto o tym adresie e-mail już istnieje w systemie. Zaloguj się.");
        return;
      }

      // Rejestracja w Better Auth
      try {
        const res = await signUp.email({
          email: cleanEmail,
          password,
          name: name.trim(),
        });
        if (res?.error) {
          onError(
            translateAuthError(res.error.message) ||
              "Nie udało się zarejestrować konta. Spróbuj ponownie."
          );
          return;
        }
      } catch {
        // Fallback do bazy lokalnej w razie braku połączenia z API
      }

      const initials = name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const newUser: UserProfile & { password?: string } = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password,
        role: selectedRole,
        roleLabel:
          selectedRole === "admin"
            ? "Administrator Miejski"
            : selectedRole === "owner"
            ? "Właściciel Obiektu"
            : "Mieszkaniec",
        initials: initials || "US",
        badge:
          selectedRole === "admin"
            ? "Admin"
            : selectedRole === "owner"
            ? "Zarządca"
            : "Mieszkaniec",
        points: selectedRole === "admin" ? 1000 : selectedRole === "owner" ? 150 : 50,
        ownedPlaceIds: selectedRole === "owner" ? ["owner-zgloszenie-1"] : undefined,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(
          registeredUsersKey,
          JSON.stringify([...storedUsers, newUser])
        );
      }

      onSuccess(newUser);
    } catch (err: unknown) {
      onError(
        translateAuthError(
          err instanceof Error ? err.message : "Wystąpił błąd podczas rejestracji."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="mb-1 block text-xs font-bold text-slate-700">
          Kim jesteś? (Rola w systemie)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "user" as UserRole, label: "Mieszkaniec", icon: UserCheck },
            { id: "owner" as UserRole, label: "Właściciel", icon: Building2 },
            { id: "admin" as UserRole, label: "Audytor / Admin", icon: Shield },
          ].map((roleItem) => {
            const Icon = roleItem.icon;
            const isSelected = selectedRole === roleItem.id;
            return (
              <button
                key={roleItem.id}
                type="button"
                onClick={() => setSelectedRole(roleItem.id)}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-800 font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span>{roleItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Imię i nazwisko / Nazwa podmiotu
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="np. Anna Nowak lub Kawiarnia Retro"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Adres e-mail
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="twoj-email@example.com"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Hasło
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Powtórz hasło
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-2 h-11 w-full rounded-xl bg-blue-700 font-bold text-white shadow-md hover:bg-blue-800 disabled:opacity-50"
      >
        {loading ? "Przetwarzanie..." : "Utwórz konto"}
      </Button>
    </form>
  );
}
