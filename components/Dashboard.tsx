"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, SlidersHorizontal } from "lucide-react";
import { AiAdvisorCard } from "@/components/AiAdvisorCard";
import { FileUploadPanel } from "@/components/FileUploadPanel";
import { FinancialChart } from "@/components/FinancialChart";
import { Header } from "@/components/Header";
import { KpiCards } from "@/components/KpiCards";
import { ManualInputPanel } from "@/components/ManualInputPanel";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  calculateFinancialMetrics,
  DEFAULT_FINANCIAL_INPUTS,
} from "@/lib/finance";
import type { FinancialInputs, InputMode } from "@/lib/types";

export function Dashboard() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<InputMode>("manual");
  const [inputs, setInputs] = useState<FinancialInputs>(
    DEFAULT_FINANCIAL_INPUTS
  );

  const metrics = useMemo(() => calculateFinancialMetrics(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <KpiCards metrics={metrics} />

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.inputPanel.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.inputPanel.subtitle}
              </p>
            </div>

            <div
              role="tablist"
              aria-label={t.inputPanel.title}
              className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "manual"}
                onClick={() => setMode("manual")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  mode === "manual"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                {t.inputPanel.manualTab}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "upload"}
                onClick={() => setMode("upload")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  mode === "upload"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
                {t.inputPanel.uploadTab}
              </button>
            </div>
          </div>

          {mode === "manual" ? (
            <ManualInputPanel inputs={inputs} onChange={setInputs} />
          ) : (
            <FileUploadPanel
              onApplyInputs={setInputs}
              onSwitchToManual={() => setMode("manual")}
            />
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FinancialChart metrics={metrics} />
          </div>
          <div className="lg:col-span-5">
            <AiAdvisorCard inputs={inputs} />
          </div>
        </div>

        <footer className="pb-4 text-center text-xs text-slate-400 dark:text-slate-500">
          {t.app.currencyNote}
        </footer>
      </main>
    </div>
  );
}
