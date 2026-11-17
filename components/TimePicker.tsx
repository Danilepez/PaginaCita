"use client";

import { useState } from "react";

type T = { h: number; m: number; ap: "AM" | "PM" };
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINS = Array.from({ length: 12 }, (_, i) => i * 5);
const pad = (n: number) => String(n).padStart(2, "0");

const parse = (s: string): T => {
  const r = /^(\d+):(\d+) (AM|PM)$/.exec(s);
  return r ? { h: +r[1], m: +r[2], ap: r[3] as "AM" | "PM" } : { h: 0, m: -1, ap: "PM" };
};

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-xl border text-sm transition-colors ${
        on ? "border-[#ff4b4b]/70 bg-[#ff4b4b]/15 text-white" : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25"
      }`}
    >
      {children}
    </button>
  );
}

// Hora libre: cualquier hora y minutos de 5 en 5.
export default function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [t, setT] = useState<T>(() => parse(value));
  const set = (p: Partial<T>) => {
    const n = { ...t, ...p };
    setT(n);
    if (n.h && n.m >= 0) onChange(`${n.h}:${pad(n.m)} ${n.ap}`);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="font-mono text-3xl tracking-tight">
          {t.h || "--"}:{t.m >= 0 ? pad(t.m) : "--"}
          <span className="ml-2 text-base text-white/50">{t.ap}</span>
        </span>
        <div className="flex gap-1">
          {(["AM", "PM"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => set({ ap: a })}
              className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                t.ap === a ? "bg-[#ff4b4b] text-white" : "text-white/50 hover:bg-white/10"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/35">Hora</p>
      <div className="grid grid-cols-6 gap-1.5">
        {HOURS.map((h) => (
          <Chip key={h} on={t.h === h} onClick={() => set({ h })}>
            {h}
          </Chip>
        ))}
      </div>
      <p className="mb-2 mt-4 font-mono text-[10px] uppercase tracking-widest text-white/35">Minutos</p>
      <div className="grid grid-cols-6 gap-1.5">
        {MINS.map((m) => (
          <Chip key={m} on={t.m === m} onClick={() => set({ m })}>
            {pad(m)}
          </Chip>
        ))}
      </div>
    </div>
  );
}
