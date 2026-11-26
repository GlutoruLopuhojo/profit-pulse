"use client"; import  { useMemo, useState, useEffect } from "react";
import { Save, History, Trash2, FileSpreadsheet, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/auth-store";
import type { FinancialMetrics, FinancialInputs, InputMode } from "@/lib/types";
import { AiAdvisorCard } from "@/components/AiAdvisorCard";
import { FileUploadPanel } from "@/components/FileUploadPanel";
import { FinancialChart } from "@/components/FinancialChart";
import { Header } from "@/components/Header";
import { KpiCards } from "@/components/KpiCards";
import { ManualInputPanel } from "@/components/ManualInputPanel";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { calculateFinancialMetrics, DEFAULT_FINANCIAL_INPUTS } from "@/lib/finance";

interface SavedCalculation {
  id: string;
  title: string;
  inputs: FinancialInputs;
  metrics: FinancialMetrics;
  created_at: string;
}

export function Dashboard() {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [history, setHistory] = useState<SavedCalculation[]>([]);
  const [mode, setMode] = useState<InputMode>("manual");
  const [inputs, setInputs] = useState<FinancialInputs>(DEFAULT_FINANCIAL_INPUTS);

  const metrics = useMemo(() => calculateFinancialMetrics(inputs), [inputs]);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('calculations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setHistory(data as SavedCalculation[]);
  };

  const saveCalculation = async () => {
    if (!user || !title) return;
    await supabase.from('calculations').insert({
      user_id: user.id,
      title,
      inputs,
      metrics,
    });
    setTitle("");
    fetchHistory();
  };

  const deleteCalculation = async (id: string) => {
    await supabase.from('calculations').delete().eq('id', id);
    fetchHistory();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <KpiCards metrics={metrics} />
        
        {user && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="mb-4 text-lg font-bold flex items-center gap-2"><Save className="h-5 w-5"/> Save Report</h2>
            <div className="flex gap-2">
              <input placeholder="Report Title" className="border rounded px-3 py-2 flex-grow" value={title} onChange={(e) => setTitle(e.target.value)} />
              <button onClick={saveCalculation} className="bg-emerald-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </section>
        )}

        {user && history.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-bold flex items-center gap-2"><History className="h-5 w-5"/> History</h2>
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between border-b p-2">
                  <div className="cursor-pointer" onClick={() => setInputs(h.inputs)}>
                    <p className="font-semibold">{h.title}</p>
                    <p className="text-xs text-slate-500">{new Date(h.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => deleteCalculation(h.id)} className="text-red-500"><Trash2 className="h-4 w-4"/></button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{t.inputPanel.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.inputPanel.subtitle}</p>
            </div>
            <div role="tablist" className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
              <button onClick={() => setMode("manual")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${mode === "manual" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"}`}>
                <SlidersHorizontal className="h-3.5 w-3.5" /> {t.inputPanel.manualTab}
              </button>
              <button onClick={() => setMode("upload")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${mode === "upload" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"}`}>
                <FileSpreadsheet className="h-3.5 w-3.5" /> {t.inputPanel.uploadTab}
              </button>
            </div>
          </div>
          {mode === "manual" ? <ManualInputPanel inputs={inputs} onChange={setInputs} /> : <FileUploadPanel onApplyInputs={setInputs} onSwitchToManual={() => setMode("manual")} />}
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7"><FinancialChart metrics={metrics} /></div>
          <div className="lg:col-span-5"><AiAdvisorCard inputs={inputs} /></div>
        </div>
      </main>
    </div>
  );
}
