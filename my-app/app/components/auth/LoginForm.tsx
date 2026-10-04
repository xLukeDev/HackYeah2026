"use client";

import { useState } from "react";
import { DEMO_USERS } from "@/lib/initial-data";
import { UserProfile, UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { translateAuthError } from "@/lib/auth-errors";

interface LoginFormProps {
  onSuccess: (user: UserProfile) => void;
  onError: (msg: string) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
}

export default function LoginForm({
  onSuccess,
  onError,
  loading,
  setLoading,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const registeredUsersKey = "dostepne_miasto_registered_users";
      const storedUsers: Array<UserProfile & { password?: string }> =
        typeof window !== "undefined" && localStorage.getItem(registeredUsersKey)
          ? JSON.parse(localStorage.getItem(registeredUsersKey) || "[]")
          : [];

      // 1. Sprawdzenie kont demonstracyjnych
      const demoMatch = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );
      if (demoMatch) {
        onSuccess(demoMatch);
        return;
      }

      // 2. Próba logowania przez Better Auth (baza SQLite)
      let betterAuthError: string | null = null;
      try {
        const res = await signIn.email({ email: cleanEmail, password });
        if (res?.data?.user) {
          const resUser = res.data.user;
          const initials = (resUser.name || cleanEmail)
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          const selectedRole: UserRole = "user";
          const user: UserProfile = {
            id: resUser.id,
            name: resUser.name || cleanEmail.split("@")[0],
            email: resUser.email,
            role: selectedRole,
            roleLabel: "Mieszkaniec",
            initials: initials || "US",
            badge: "Mieszkaniec",
            points: 50,
          };
          onSuccess(user);
          return;
        } else if (res?.error) {
          betterAuthError = res.error.message || null;
        }
      } catch (err: unknown) {
        betterAuthError = err instanceof Error ? err.message : null;
      }

      // 3. Sprawdzenie zarejestrowanych użytkowników w pamięci lokalnej
      const localMatch = storedUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      if (localMatch) {
        if (localMatch.password && localMatch.password !== password) {
          onError("Nieprawidłowe hasło dla tego konta.");
          return;
        }
        onSuccess(localMatch);
        return;
      }

      // 4. Jeśli konto nie istnieje ani w Better Auth, ani w bazie zarejestrowanych, ani w demo -> ODRZUĆ!
      onError(
        betterAuthError
          ? translateAuthError(betterAuthError)
          : "Nie znaleziono zarejestrowanego konta dla tego adresu e-mail. Zarejestruj się w zakładce „Zarejestruj się” lub skorzystaj z profilu demonstracyjnego."
      );
    } catch (err: unknown) {
      onError(
        translateAuthError(
          err instanceof Error ? err.message : "Wystąpił błąd podczas logowania."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
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

      <Button
        type="submit"
        disabled={loading}
        className="mt-2 h-11 w-full rounded-xl bg-blue-700 font-bold text-white shadow-md hover:bg-blue-800 disabled:opacity-50"
      >
        {loading ? "Przetwarzanie..." : "Zaloguj się"}
      </Button>
    </form>
  );
}
