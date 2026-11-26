"use client";

import { useRef, useState, type DragEvent } from "react";
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  aggregateMappedRows,
  createSampleCsvBlob,
  parseSpreadsheetFile,
} from "@/lib/file-parser";
import { formatCurrency } from "@/lib/finance";
import type {
  FinancialFieldKey,
  FinancialInputs,
  ParsedSpreadsheet,
} from "@/lib/types";

interface FileUploadPanelProps {
  onApplyInputs: (next: FinancialInputs) => void;
  onSwitchToManual: () => void;
}

const FIELDS: FinancialFieldKey[] = [
  "revenue",
  "cogs",
  "marketing",
  "feesAndTaxes",
];

export function FileUploadPanel({
  onApplyInputs,
  onSwitchToManual,
}: FileUploadPanelProps) {
  const { locale, t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsed, setParsed] = useState<ParsedSpreadsheet | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const result = await parseSpreadsheetFile(file);
      setParsed(result);
      onApplyInputs(aggregateMappedRows(result.rows, result.mapping));
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "EMPTY_FILE") {
        setError(t.uploadPanel.errors.empty);
      } else if (code === "UNSUPPORTED_FORMAT") {
        setError(t.uploadPanel.errors.unsupported);
      } else {
        setError(t.uploadPanel.errors.generic);
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const handleMappingChange = (field: FinancialFieldKey, header: string) => {
    if (!parsed) return;
    const nextMapping = {
      ...parsed.mapping,
      [field]: header || null,
    };
    const nextParsed = { ...parsed, mapping: nextMapping };
    setParsed(nextParsed);
    onApplyInputs(aggregateMappedRows(nextParsed.rows, nextMapping));
  };

  const handleDownloadSample = () => {
    const blob = createSampleCsvBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profitpulse-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const aggregated = parsed
    ? aggregateMappedRows(parsed.rows, parsed.mapping)
    : null;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30"
            : "border-slate-300 bg-slate-50/70 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <UploadCloud className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t.uploadPanel.dropTitle}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t.uploadPanel.dropSubtitle}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {t.uploadPanel.browseButton}
          </button>
          <button
            type="button"
            onClick={handleDownloadSample}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t.uploadPanel.downloadSample}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      {parsed && aggregated && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {t.uploadPanel.loadedFile}: {parsed.fileName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {parsed.rows.length} {t.uploadPanel.rowsDetected}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSwitchToManual}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {t.uploadPanel.applyToManual}
              </button>
              <button
                type="button"
                onClick={() => setParsed(null)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.uploadPanel.clearFile}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200/80 pt-3 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {t.uploadPanel.mappingTitle}
            </p>
            <p className="mb-3 text-[11px] text-slate-500 dark:text-slate-400">
              {t.uploadPanel.mappingSubtitle}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {FIELDS.map((field) => {
                const selected = parsed.mapping[field] ?? "";
                return (
                  <div
                    key={field}
                    className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <label
                        htmlFor={`map-${field}`}
                        className="text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        {t.inputPanel.fields[field]}
                      </label>
                      {selected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          {formatCurrency(aggregated[field], locale)}
                        </span>
                      )}
                    </div>
                    <select
                      id={`map-${field}`}
                      value={selected}
                      onChange={(e) => handleMappingChange(field, e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="">{t.uploadPanel.unmappedOption}</option>
                      {parsed.headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
