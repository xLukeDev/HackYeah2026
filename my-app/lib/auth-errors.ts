/**
 * Tłumaczenie komunikatów błędów uwierzytelniania na język polski.
 */
export function translateAuthError(message?: string | null): string {
  if (!message) {
    return "Wystąpił błąd autoryzacji. Spróbuj ponownie.";
  }

  const normalized = message.toLowerCase().trim();

  if (
    normalized.includes("invalid email or password") ||
    normalized.includes("invalid credentials") ||
    normalized.includes("invalid password") ||
    normalized.includes("wrong password")
  ) {
    return "Nieprawidłowy adres e-mail lub hasło.";
  }

  if (
    normalized.includes("user already exists") ||
    normalized.includes("email already in use") ||
    normalized.includes("already registered") ||
    normalized.includes("email already exists")
  ) {
    return "Konto o tym adresie e-mail już istnieje w systemie. Zaloguj się.";
  }

  if (
    normalized.includes("password is too short") ||
    normalized.includes("password must be") ||
    normalized.includes("short password")
  ) {
    return "Hasło jest za krótkie. Wymagane minimum 6 znaków.";
  }

  if (
    normalized.includes("invalid email") ||
    normalized.includes("malformed email")
  ) {
    return "Wprowadź prawidłowy adres e-mail.";
  }

  if (
    normalized.includes("user not found") ||
    normalized.includes("no user found")
  ) {
    return "Nie znaleziono zarejestrowanego konta dla tego adresu e-mail.";
  }

  if (
    normalized.includes("too many requests") ||
    normalized.includes("rate limit")
  ) {
    return "Zbyt wiele prób logowania. Odczekaj chwilę przed kolejną próbą.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network error") ||
    normalized.includes("fetch failed")
  ) {
    return "Błąd połączenia z serwerem. Sprawdź połączenie sieciowe.";
  }

  return message;
}
