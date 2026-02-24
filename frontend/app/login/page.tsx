"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@rfe.ai");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToken(`${email}-token`);
    router.push("/demo");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-slate-900">Connexion RFE</h1>
        <p className="mt-2 text-sm text-slate-600">
          Connectez-vous pour accéder au dashboard.
        </p>

        <label className="mt-6 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none ring-slate-200 transition focus:ring"
          required
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Se connecter
        </button>
      </form>
    </main>
  );
}
