"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

type SalesPoint = {
  day: string;
  actual: number;
  forecast: number;
};

function formatEuro(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function DemoDashboard() {
  const [traffic, setTraffic] = useState(8);
  const [discount, setDiscount] = useState(5);
  const [weather, setWeather] = useState(1);

  const data: SalesPoint[] = useMemo(() => {
    const base = [
      1180, 1210, 1160, 1290, 1320, 1270, 1350, 1410, 1380, 1450, 1490, 1420,
      1510, 1540, 1480, 1600, 1580, 1620, 1690, 1650, 1710, 1760, 1720, 1800,
      1780, 1850, 1880, 1820, 1900, 1950,
    ];

    return base.map((v, i) => {
      const day = `J-${29 - i}`;
      const forecast =
        v *
        (1 + traffic / 100) *
        (1 - discount / 200) *
        (1 + (weather * 3) / 100);

      const actual = i < 22 ? v : Math.round(v * (0.98 + (i % 3) * 0.02));
      return {
        day,
        actual: Math.round(actual),
        forecast: Math.round(forecast),
      };
    });
  }, [traffic, discount, weather]);

  const kpis = useMemo(() => {
    const sumActual = data.reduce((s, p) => s + p.actual, 0);
    const sumForecast = data.reduce((s, p) => s + p.forecast, 0);
    const gapPct = ((sumActual - sumForecast) / sumForecast) * 100;

    return {
      ca30: sumForecast,
      realized: sumActual,
      gapPct,
    };
  }, [data]);

  const scenarioImpact = useMemo(() => {
    const baseMonthly = 380_000;
    const impact =
      baseMonthly *
      (traffic / 100 * 0.6 - discount / 100 * 0.5 + (weather * 3) / 100 * 0.25);
    return Math.round(impact);
  }, [traffic, discount, weather]);

  const tooltipFormatter = (value: ValueType) => formatEuro(Number(value));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard label="CA prévu (30j)" value={formatEuro(kpis.ca30)} hint="+ scénario" />
          <KpiCard label="CA réalisé (30j)" value={formatEuro(kpis.realized)} hint="données démo" />
          <KpiCard
            label="Écart"
            value={`${kpis.gapPct > 0 ? "+" : ""}${kpis.gapPct.toFixed(1)}%`}
            hint="réel vs prévision"
            subtle
          />
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Prévision vs réel</div>
            <div className="mt-1 text-xs text-slate-500">
              Ajustez le scénario : la courbe de prévision s&apos;adapte.
            </div>
          </div>
          <div className="text-xs text-slate-500">Derniers 30 jours</div>
        </div>

        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={tooltipFormatter}
                labelFormatter={(label) => `Période ${String(label)}`}
              />
              <Area type="monotone" dataKey="forecast" strokeWidth={2} fillOpacity={0.12} />
              <Area type="monotone" dataKey="actual" strokeWidth={2} fillOpacity={0.06} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-xs text-slate-500">Lignes : prévision (scénario) et réel (démo).</div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Données</div>
            <div className="text-xs text-slate-500">3 derniers jours</div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">Jour</th>
                  <th className="px-4 py-3">Réel</th>
                  <th className="px-4 py-3">Prévision</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(-3).reverse().map((row) => (
                  <tr key={row.day} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-700">{row.day}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{formatEuro(row.actual)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatEuro(row.forecast)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Scénarios</div>
            <div className="text-xs text-slate-500">Simulation</div>
          </div>

          <div className="mt-4 space-y-5">
            <Slider label="Trafic" value={traffic} setValue={setTraffic} min={-15} max={20} unit="%" />
            <Slider label="Remise" value={discount} setValue={setDiscount} min={0} max={20} unit="%" />

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-700">Météo</span>
                <span className="font-medium text-slate-900">
                  {weather === 1 ? "Favorable" : weather === 0 ? "Neutre" : "Défavorable"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[-1, 0, 1].map((value) => {
                  const label = value === -1 ? "Défavorable" : value === 0 ? "Neutre" : "Favorable";
                  const active = weather === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setWeather(value)}
                      className={`rounded-xl border px-3 py-2 text-xs ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Impact estimé</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">
                {scenarioImpact >= 0 ? "+" : ""}
                {formatEuro(scenarioImpact)} / mois
              </div>
              <div className="mt-1 text-xs text-slate-500">Estimation indicative (démo).</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  subtle,
}: {
  label: string;
  value: string;
  hint: string;
  subtle?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      <div className={`mt-2 text-xs ${subtle ? "text-slate-500" : "text-emerald-700"}`}>{hint}</div>
    </div>
  );
}

function Slider({
  label,
  value,
  setValue,
  min,
  max,
  unit,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-medium text-slate-900">
          {value >= 0 ? "+" : ""}
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => setValue(parseInt(event.target.value, 10))}
        className="w-full"
      />
      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
