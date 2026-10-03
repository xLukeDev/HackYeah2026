import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DostępneMiasto Kraków - Społecznościowa Platforma Dostępności",
  description: "Wyszukiwarka bezbarierowych miejsc, audyty dostępności, opinie mieszkańców i panel zarządców obiektów",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans antialiased bg-slate-100 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
