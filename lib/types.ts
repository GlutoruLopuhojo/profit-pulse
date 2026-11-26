export type Locale = "en" | "ru";

export type InputMode = "manual" | "upload";

export interface FinancialInputs {
  revenue: number;
  cogs: number;
  marketing: number;
  feesAndTaxes: number;
}

export type FinancialFieldKey = keyof FinancialInputs;

export interface FinancialMetrics {
  revenue: number;
  cogs: number;
  marketing: number;
  feesAndTaxes: number;
  totalExpenses: number;
  grossProfit: number;
  grossMarginPercent: number;
  netProfit: number;
  netMarginPercent: number;
  roiPercent: number;
  contributionMarginRatio: number;
  breakEvenPoint: number | null;
  breakEvenDelta: number | null;
  isAboveBreakEven: boolean;
}

export type ColumnMapping = Record<FinancialFieldKey, string | null>;

export interface ParsedSpreadsheet {
  fileName: string;
  headers: string[];
  rows: Record<string, unknown>[];
  mapping: ColumnMapping;
}

export type AdvisorStatus = "healthy" | "warning" | "critical";

export interface AdvisorInsight {
  title: string;
  detail: string;
  tone: "positive" | "warning" | "negative";
}

export interface AnalyzeRequest {
  revenue: number;
  cogs: number;
  marketing: number;
  feesAndTaxes: number;
  locale?: Locale;
}

export interface AnalyzeResponse {
  score: number;
  status: AdvisorStatus;
  headline: string;
  summary: string;
  insights: AdvisorInsight[];
  recommendations: string[];
  metrics: FinancialMetrics;
  generatedAt: string;
}
