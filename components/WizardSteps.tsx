"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import OptionCard from "./OptionCard";
import { Footer, StepHeader } from "./ui";
import type { Option, Plan } from "@/lib/data";

export function WhenStep({
  plan,
  onChange,
  onBack,
  onNext,
}: {
  plan: Plan;
  onChange: (p: Partial<Plan>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepHeader n={1} total={3} title="¿Cuándo?" hint="Elige el día en el calendario y la hora exacta." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Calendar value={plan.date} onChange={(date) => onChange({ date })} />
        <TimePicker value={plan.time} onChange={(time) => onChange({ time })} />
      </div>
      <Footer onBack={onBack} onNext={onNext} label="Siguiente" disabled={!plan.date || !plan.time} />
    </div>
  );
}

export function PickStep({
  n,
  title,
  hint,
  options,
  value,
  onToggle,
  onAdd,
  onBack,
  onNext,
  cta,
  loading,
  error,
}: {
  n: number;
  title: string;
  hint: string;
  options: Option[];
  value: string[];
  onToggle: (v: string) => void;
  onAdd: (o: Option) => void;
  onBack: () => void;
  onNext: () => void;
  cta: string;
  loading?: boolean;
  error?: string;
}) {
  const [adding, setAdding] = useState(false);
  const [emoji, setEmoji] = useState("✨");
  const [label, setLabel] = useState("");

  const submit = () => {
    const l = label.trim().slice(0, 40);
    if (!l) return;
    onAdd({ emoji: emoji.trim() || "✨", label: l });
    setLabel("");
    setEmoji("✨");
    setAdding(false);
  };

  return (
    <div>
      <StepHeader n={n} total={3} title={title} hint={hint} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((o) => {
          const v = `${o.emoji} ${o.label}`;
          return (
            <OptionCard
              key={v}
              emoji={o.emoji}
              label={o.label}
              image={o.image}
              selected={value.includes(v)}
              onClick={() => onToggle(v)}
            />
          );
        })}
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 text-sm text-white/50 transition hover:border-[#ff4b4b]/60 hover:text-white sm:h-36"
        >
          <Plus className="h-5 w-5" /> Agregar otra
        </button>
      </div>

      {adding && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={8}
            aria-label="Emoji"
            className="h-11 w-14 rounded-xl bg-white/5 text-center text-xl outline-none focus:ring-1 focus:ring-[#ff4b4b]/60"
          />
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Nombre de la opción"
            className="h-11 min-w-0 flex-1 rounded-xl bg-white/5 px-3 text-sm outline-none placeholder:text-white/30 focus:ring-1 focus:ring-[#ff4b4b]/60"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!label.trim()}
            className="h-11 rounded-xl bg-[#ff4b4b] px-4 text-sm font-medium disabled:opacity-30"
          >
            Añadir
          </button>
          <button type="button" onClick={() => setAdding(false)} className="h-11 px-2 text-sm text-white/45 hover:text-white">
            ✕
          </button>
        </div>
      )}

      <Footer onBack={onBack} onNext={onNext} label={cta} disabled={value.length === 0} loading={loading} error={error} />
    </div>
  );
}
