import type { FinancialInputs, FinancialMetrics, Locale } from "./types";

export const DEFAULT_FINANCIAL_INPUTS: FinancialInputs = {
  revenue: 120000,
  cogs: 48000,
  marketing: 22000,
  feesAndTaxes: 14000,
};

export function sanitizeAmount(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value * 100) / 100;
}

export function calculateFinancialMetrics(
  rawInputs: FinancialInputs
): FinancialMetrics {
  const revenue = sanitizeAmount(rawInputs.revenue);
  const cogs = sanitizeAmount(rawInputs.cogs);
  const marketing = sanitizeAmount(rawInputs.marketing);
  const feesAndTaxes = sanitizeAmount(rawInputs.feesAndTaxes);

  const totalExpenses = cogs + marketing + feesAndTaxes;
  const grossProfit = revenue - cogs;
  const grossMarginPercent = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  const netProfit = revenue - totalExpenses;
  const netMarginPercent = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const roiPercent = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

  const variableCosts = cogs + feesAndTaxes;
  const contributionMarginRatio =
    revenue > 0 ? (revenue - variableCosts) / revenue : 0;

  let breakEvenPoint: number | null = null;
  if (revenue > 0 && contributionMarginRatio > 0) {
    breakEvenPoint = marketing / contributionMarginRatio;
  }

  const breakEvenDelta =
    breakEvenPoint !== null ? revenue - breakEvenPoint : null;

  const isAboveBreakEven =
    breakEvenPoint !== null ? revenue >= breakEvenPoint && netProfit >= 0 : false;

  return {
    revenue,
    cogs,
    marketing,
    feesAndTaxes,
    totalExpenses,
    grossProfit,
    grossMarginPercent,
    netProfit,
    netMarginPercent,
    roiPercent,
    contributionMarginRatio,
    breakEvenPoint,
    breakEvenDelta,
    isAboveBreakEven,
  };
}

export function formatCurrency(value: number, locale: Locale): string {
  const intlLocale = locale === "ru" ? "ru-RU" : "en-US";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, locale: Locale): string {
  const intlLocale = locale === "ru" ? "ru-RU" : "en-US";
  return `${new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;
}
