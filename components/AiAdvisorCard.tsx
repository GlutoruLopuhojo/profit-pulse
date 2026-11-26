"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type {
  AdvisorStatus,
  AnalyzeResponse,
  FinancialInputs,
} from "@/lib/types";

interface AiAdvisorCardProps {
  inputs: FinancialInputs;
}

const STATUS_BADGE: Record<AdvisorStatus, string> = {
  healthy:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  critical:
    "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300",
};

const TONE_ICON = {
  positive: <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />,
  warning: <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />,
  negative: <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />,
};

export function AiAdvisorCard({ inputs }: AiAdvisorCardProps) {
  const { locale, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalyzeResponse | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, locale }),
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const data = (await response.json()) as AnalyzeResponse;
      setReport(data);
    } catch {
      setError(t.advisor.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.advisor.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.advisor.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => void handleAnalyze()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t.advisor.analyzing}
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                {report ? t.advisor.reanalyzeButton : t.advisor.analyzeButton}
              </>
            )}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
          >
            {error}
          </div>
        )}

        {!report && !error && (
          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            {t.advisor.emptyPrompt}
          </div>
        )}

        {report && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/70">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t.advisor.scoreLabel}
                </p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
                    {report.score}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  STATUS_BADGE[report.status]
                }`}
              >
                {t.advisor.statusLabels[report.status]}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {report.headline}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {report.summary}
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.advisor.insightsTitle}
              </h4>
              <ul className="space-y-2">
                {report.insights.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-900/40"
                  >
                    {TONE_ICON[item.tone]}
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.advisor.recommendationsTitle}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
