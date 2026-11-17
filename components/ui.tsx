"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
  breathe,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  breathe?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      animate={breathe ? { scale: [1, 1.035, 1] } : undefined}
      transition={breathe ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : undefined}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full bg-[#ff4b4b] px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-[0_8px_40px_-8px_rgba(255,75,75,0.75)] transition-opacity disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
}

export function StepHeader({ n, total, title, hint }: { n: number; total: number; title: string; hint: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
        Paso {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-2 text-sm text-white/50">{hint}</p>
      <div className="mt-5 h-px bg-white/10">
        <motion.div
          className="h-px bg-[#ff4b4b]"
          initial={{ width: 0 }}
          animate={{ width: `${(n / total) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function Footer({
  onBack,
  onNext,
  label,
  disabled,
  loading,
  error,
}: {
  onBack: () => void;
  onNext: () => void;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}) {
  return (
    <div className="mt-8">
      {error && <p className="mb-4 text-sm text-[#ff7676]">{error}</p>}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-white/45 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Atrás
        </button>
        <PrimaryButton onClick={onNext} disabled={disabled} loading={loading}>
          {label}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </PrimaryButton>
      </div>
    </div>
  );
}
