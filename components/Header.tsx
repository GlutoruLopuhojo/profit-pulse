"use client";

import { Activity, Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export function Header() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl">
                {t.app.name}
              </h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                {t.app.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.app.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:inline-flex">
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            {t.header.languageLabel}
          </span>
          <div
            role="group"
            aria-label={t.header.languageLabel}
            className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900"
          >
            {LOCALES.map((item) => {
              const active = locale === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLocale(item.code)}
                  aria-pressed={active}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
