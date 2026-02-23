import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retail Future Engine",
  description: "Prévision de chiffre d’affaires et pilotage intelligent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}