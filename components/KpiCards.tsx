"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Percent,
  Scale,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatCurrency, formatPercent } from "@/lib/finance";
import type { FinancialMetrics } from "@/lib/types";

interface KpiCardsProps {
  metrics: FinancialMetrics;
}

interface CardStyle {
  border: string;
  badgeBg: string;
  badgeText: string;
  valueText: string;
  iconBg: string;
}

function getToneStyle(isPositive: boolean): CardStyle {
  if (isPositive) {
    return {
      border:
        "border-emerald-200/90 bg-white dark:border-emerald-900/60 dark:bg-slate-950",
      badgeBg: "bg-emerald-500/10",
      badgeText: "text-emerald-700 dark:text-emerald-400",
      valueText: "text-emerald-600 dark:text-emerald-400",
      iconBg:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400",
    };
  }
  return {
    border:
      "border-rose-200/90 bg-white dark:border-rose-900/60 dark:bg-slate-950",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-700 dark:text-rose-400",
    valueText: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400",
  };
}

export function KpiCards({ metrics }: KpiCardsProps) {
  const { locale, t } = useLanguage();

  const profitPositive = metrics.netProfit >= 0;
  const marginPositive = metrics.netMarginPercent >= 0;
  const roiPositive = metrics.roiPercent >= 0;
  const bepPositive = metrics.isAboveBreakEven;

  const cards = [
    {
      key: "netProfit",
      label: t.kpis.netProfit.label,
      value: formatCurrency(metrics.netProfit, locale),
      sub: profitPositive
        ? t.kpis.netProfit.positiveSub
        : t.kpis.netProfit.negativeSub,
      positive: profitPositive,
      Icon: Wallet,
    },
    {
      key: "margin",
      label: t.kpis.margin.label,
      value: formatPercent(metrics.netMarginPercent, locale),
      sub: `${t.kpis.margin.grossPrefix} ${formatPercent(
        metrics.grossMarginPercent,
        locale
      )}`,
      positive: marginPositive && metrics.revenue > 0,
      Icon: Percent,
    },
    {
      key: "roi",
      label: t.kpis.roi.label,
      value: formatPercent(metrics.roiPercent, locale),
      sub:
        metrics.totalExpenses === 0
          ? t.kpis.roi.zeroSub
          : roiPositive
            ? t.kpis.roi.positiveSub
            : t.kpis.roi.negativeSub,
      positive: metrics.totalExpenses > 0 ? roiPositive : true,
      Icon: TrendingUp,
    },
    {
      key: "breakEven",
      label: t.kpis.breakEven.label,
      value:
        metrics.breakEvenPoint !== null
          ? formatCurrency(metrics.breakEvenPoint, locale)
          : t.kpis.breakEven.unreachable,
      sub:
        metrics.breakEvenPoint === null || metrics.breakEvenDelta === null
          ? t.kpis.breakEven.unreachableSub
          : metrics.breakEvenDelta >= 0
            ? `${t.kpis.breakEven.abovePrefix} ${formatCurrency(
                metrics.breakEvenDelta,
                locale
              )}`
            : `${t.kpis.breakEven.belowPrefix} ${formatCurrency(
                Math.abs(metrics.breakEvenDelta),
                locale
              )}`,
      positive: bepPositive,
      Icon: Scale,
    },
  ];

  return (
    <section
      aria-label="Key Performance Indicators"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => {
        const style = getToneStyle(card.positive);
        const StatusIcon = card.positive ? ArrowUpRight : ArrowDownRight;

        return (
          <div
            key={card.key}
            className={`rounded-2xl border p-5 shadow-xs transition-all ${style.border}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.iconBg}`}
              >
                <card.Icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>

            <div
              className={`mt-3 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl ${style.valueText}`}
            >
              {card.value}
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${style.badgeBg} ${style.badgeText}`}
              >
                <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {card.sub}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
