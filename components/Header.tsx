"use client";

import { useState } from "react";
import { Activity, Globe, User, LogOut, Printer } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/types";
import { useAuthStore } from "@/lib/auth-store";
import { AuthModal } from "./AuthModal";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export function Header() {
  const { locale, setLocale, t } = useLanguage();
  const { user, profile, signOut } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Printer className="h-3.5 w-3.5" /> {locale === "ru" ? "Скачать PDF-отчет" : "Download PDF"}
          </button>
          {user ? (
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-2">
                {user.email}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${profile?.is_pro ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                  {profile?.is_pro ? 'PRO' : 'FREE'}
                </span>
              </span>
              <button onClick={() => signOut()} className="flex items-center gap-1 text-red-600">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs text-white">
              <User className="h-3.5 w-3.5" /> Login
            </button>
          )}

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
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}

