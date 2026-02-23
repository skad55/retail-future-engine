"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-28 pb-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Forecasting · Pilotage · Décision
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
                Prévoir.
                <br />
                Arbitrer.
                <br />
                Décider.
              </h1>

              <p className="mt-6 max-w-xl text-lg text-slate-600">
                Retail Future Engine structure vos données de vente,
                projette votre chiffre d’affaires et simule des scénarios
                clairs pour piloter vos magasins avec rigueur.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition"
                >
                  Voir la démo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 transition">
                  Demander une présentation
                </button>
              </div>
            </div>

            <HeroCard />
          </div>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-10 md:grid-cols-3">
            <ValueCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Prévisions fiables"
              text="Projection à 30 jours avec lecture exécutive claire."
            />
            <ValueCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Lecture multi-sites"
              text="Vision consolidée ou magasin par magasin."
            />
            <ValueCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Décisions argumentées"
              text="Scénarios comparables et explicables en CODIR."
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900" />
          <div>
            <div className="text-sm font-semibold">
              Retail Future Engine
            </div>
            <div className="text-xs text-slate-500">
              Forecast & Pilotage
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-600">
          <a className="hover:text-slate-900" href="#">
            Usage
          </a>
          <a className="hover:text-slate-900" href="#">
            Tarification
          </a>
          <a className="hover:text-slate-900" href="#">
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}

function HeroCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.3)]">
      <div className="text-sm font-semibold text-slate-900">
        Synthèse exécutive (démo)
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Metric label="CA prévu (30j)" value="€ 412k" />
        <Metric label="CA réalisé" value="€ 398k" />
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <div className="text-xs text-slate-500">Écart</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">
          -3.4%
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Ajustement recommandé sur trafic & remise.
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-slate-500">
        © {new Date().getFullYear()} Retail Future Engine — Tous droits réservés.
      </div>
    </footer>
  );
}