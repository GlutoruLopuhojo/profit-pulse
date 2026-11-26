"use client";

import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { DEFAULT_FINANCIAL_INPUTS, formatCurrency } from "@/lib/finance";
import type { FinancialFieldKey, FinancialInputs } from "@/lib/types";

interface ManualInputPanelProps {
  inputs: FinancialInputs;
  onChange: (next: FinancialInputs) => void;
}

const BASE_MAX: Record<FinancialFieldKey, number> = {
  revenue: 500000,
  cogs: 300000,
  marketing: 200000,
  feesAndTaxes: 150000,
};

const FIELDS: FinancialFieldKey[] = [
  "revenue",
  "cogs",
  "marketing",
  "feesAndTaxes",
];

const ACCENTS: Record<FinancialFieldKey, string> = {
  revenue: "accent-emerald-600 dark:accent-emerald-400",
  cogs: "accent-amber-600 dark:accent-amber-400",
  marketing: "accent-sky-600 dark:accent-sky-400",
  feesAndTaxes: "accent-violet-600 dark:accent-violet-400",
};

const DOTS: Record<FinancialFieldKey, string> = {
  revenue: "bg-emerald-500",
  cogs: "bg-amber-500",
  marketing: "bg-sky-500",
  feesAndTaxes: "bg-violet-500",
};

export function ManualInputPanel({ inputs, onChange }: ManualInputPanelProps) {
  const { locale, t } = useLanguage();

  const presets: { label: string; values: FinancialInputs }[] = [
    {
      label: t.inputPanel.presetEcommerce,
      values: { revenue: 120000, cogs: 48000, marketing: 22000, feesAndTaxes: 14000 },
    },
    {
      label: t.inputPanel.presetSaas,
      values: { revenue: 185000, cogs: 26000, marketing: 48000, feesAndTaxes: 21000 },
    },
    {
      label: t.inputPanel.presetLoss,
      values: { revenue: 75000, cogs: 46000, marketing: 23000, feesAndTaxes: 12500 },
    },
  ];

  const handleFieldChange = (field: FinancialFieldKey, rawValue: string) => {
    const parsed = Number(rawValue);
    onChange({
      ...inputs,
      [field]: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
    });
  };

  const totalExpenses = inputs.cogs + inputs.marketing + inputs.feesAndTaxes;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.inputPanel.presetsLabel}
          </span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.values)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onChange(DEFAULT_FINANCIAL_INPUTS)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          {t.inputPanel.reset}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const value = inputs[field];
          const max = Math.max(
            BASE_MAX[field],
            Math.ceil((value * 1.25) / 1000) * 1000
          );
          const step = max >= 100000 ? 500 : 100;

          return (
            <div
              key={field}
              className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <label
                    htmlFor={`input-${field}`}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${DOTS[field]}`}
                      aria-hidden="true"
                    />
                    {t.inputPanel.fields[field]}
                  </label>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {t.inputPanel.fieldHints[field]}
                  </p>
                </div>

                <div className="relative w-32 shrink-0">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    $
                  </span>
                  <input
                    id={`input-${field}`}
                    type="number"
                    min={0}
                    step={100}
                    value={value}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-6 pr-2.5 text-right text-sm font-semibold tabular-nums text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              <input
                aria-label={t.inputPanel.fields[field]}
                type="range"
                min={0}
                max={max}
                step={step}
                value={value}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className={`mt-2 h-2 w-full cursor-pointer rounded-lg bg-slate-200 dark:bg-slate-800 ${ACCENTS[field]}`}
              />

              <div className="mt-1 flex justify-between text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
                <span>$0</span>
                <span>{formatCurrency(max, locale)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-100/70 px-4 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/80">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          {t.inputPanel.totalExpensesLabel}
        </span>
        <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">
          {formatCurrency(totalExpenses, locale)}
        </span>
      </div>
    </div>
  );
}
