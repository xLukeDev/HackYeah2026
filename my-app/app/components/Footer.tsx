"use client";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-xs text-slate-400 sm:flex-row lg:px-8">
        <p>© 2026 MapaBezBarier Kraków · Wersja demo · HackYeah 2026</p>
        <div className="flex gap-5">
          <button
            className="hover:text-blue-700"
            onClick={() => alert("Deklaracja dostępności cyfrowej zgodnie z WCAG 2.1 AA.")}
          >
            Deklaracja dostępności
          </button>
          <button
            className="hover:text-blue-700"
            onClick={() => alert("Infolinia miejska ds. dostępności: {numer telefonu}.")}
          >
            Infolinia ds. dostępności
          </button>
        </div>
      </div>
    </footer>
  );
}
