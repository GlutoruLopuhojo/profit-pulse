"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatCurrency } from "@/lib/finance";
import type { FinancialMetrics } from "@/lib/types";

interface FinancialChartProps {
  metrics: FinancialMetrics;
}

type ChartMode = "bar" | "donut";

interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

export function FinancialChart({ metrics }: FinancialChartProps) {
  const { locale, t } = useLanguage();
  const [mode, setMode] = useState<ChartMode>("bar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isProfitable = metrics.netProfit >= 0;

  const barData: ChartDatum[] = [
    { name: t.chart.revenue, value: metrics.revenue, color: "#0ea5e9" },
    { name: t.chart.cogs, value: metrics.cogs, color: "#f59e0b" },
    { name: t.chart.marketing, value: metrics.marketing, color: "#6366f1" },
    { name: t.chart.feesAndTaxes, value: metrics.feesAndTaxes, color: "#8b5cf6" },
    {
      name: isProfitable ? t.chart.netProfit : t.chart.netLoss,
      value: Math.abs(metrics.netProfit),
      color: isProfitable ? "#10b981" : "#f43f5e",
    },
  ];

  const donutData: ChartDatum[] = [
    { name: t.chart.cogs, value: metrics.cogs, color: "#f59e0b" },
    { name: t.chart.marketing, value: metrics.marketing, color: "#6366f1" },
    { name: t.chart.feesAndTaxes, value: metrics.feesAndTaxes, color: "#8b5cf6" },
    ...(isProfitable
      ? [{ name: t.chart.netProfit, value: metrics.netProfit, color: "#10b981" }]
      : []),
  ].filter((item) => item.value > 0);

  const hasData = metrics.revenue > 0 || metrics.totalExpenses > 0;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t.chart.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.chart.subtitle}
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setMode("bar")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              mode === "bar"
                ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
            {t.chart.barMode}
          </button>
          <button
            type="button"
            onClick={() => setMode("donut")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              mode === "donut"
                ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <PieChartIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {t.chart.donutMode}
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {t.chart.emptyState}
        </div>
      ) : (
        <div className="h-72 w-full">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              {mode === "bar" ? (
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#94a3b8"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                    formatter={(value) => [
                      formatCurrency(Number(value ?? 0), locale),
                      "",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(148,163,184,0.25)",
                      backgroundColor: "rgba(15, 23, 42, 0.94)",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={104}
                    paddingAngle={3}
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => {
                      const num = Number(value ?? 0);
                      const pct =
                        metrics.revenue > 0
                          ? ` (${((num / metrics.revenue) * 100).toFixed(1)}% ${t.chart.shareOfRevenue})`
                          : "";
                      return [`${formatCurrency(num, locale)}${pct}`, ""];
                    }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(148,163,184,0.25)",
                      backgroundColor: "rgba(15, 23, 42, 0.94)",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 dark:border-slate-900">
        {(mode === "bar" ? barData : donutData).map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-slate-600 dark:text-slate-400">
              {item.name}:
            </span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrency(item.value, locale)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
