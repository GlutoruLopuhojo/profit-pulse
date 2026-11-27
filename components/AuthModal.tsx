"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useLanguage } from "./providers/LanguageProvider";
import { useAuthStore } from "@/lib/auth-store";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useLanguage();
  const { setUser, refreshProfile } = useAuthStore();

  if (typeof document === "undefined" || !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase keys are missing in Netlify Environment Variables");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          setUser(data.session.user);
          await refreshProfile();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: data.user.email || email,
            is_pro: false,
          });
        }
        if (data.session) {
          setUser(data.session.user);
          await refreshProfile();
        }
      }
      onClose();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-6 text-xl font-bold text-white">
          {isLogin ? (t.auth?.login || "Login") : (t.auth?.signUp || "Sign Up")}
        </h2>
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder={t.auth?.emailPlaceholder || "Email"}
            className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t.auth?.passwordPlaceholder || "Password"}
            className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? "..." : (isLogin ? (t.auth?.login || "Login") : (t.auth?.signUp || "Sign Up"))}
          </button>
        </form>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage(null);
          }}
          className="mt-6 w-full text-center text-sm text-slate-400 hover:text-white"
        >
          {isLogin
            ? (t.auth?.needAccount || "Need an account? Sign Up")
            : (t.auth?.haveAccount || "Have an account? Login")}
        </button>
      </div>
    </div>,
    document.body
  );
}
