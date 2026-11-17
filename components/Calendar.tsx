"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DOW = ["L", "M", "X", "J", "V", "S", "D"];
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// Calendario mensual propio: cualquier día futuro, sin fechas predefinidas.
export default function Calendar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());
  const [view, setView] = useState(() => {
    const d = value ? new Date(`${value}T12:00:00`) : today;
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const first = new Date(view.y, view.m, 1);
  const offset = (first.getDay() + 6) % 7; // semana empieza en lunes
  const total = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const label = first.toLocaleDateString("es", { month: "long", year: "numeric" });
  const canPrev = view.y * 12 + view.m > today.getFullYear() * 12 + today.getMonth();
  const shift = (n: number) =>
    setView((v) => {
      const d = new Date(v.y, v.m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium capitalize">{label}</span>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => shift(-1)}
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 disabled:opacity-20"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DOW.map((d) => (
          <span key={d} className="pb-1 font-mono text-[10px] text-white/35">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const v = iso(view.y, view.m, d);
          const past = v < todayIso;
          const on = v === value;
          return (
            <button
              key={i}
              type="button"
              disabled={past}
              onClick={() => onChange(v)}
              className={`aspect-square rounded-full text-sm transition-colors disabled:text-white/20 ${
                on
                  ? "bg-[#ff4b4b] font-semibold text-white shadow-[0_0_20px_-2px_rgba(255,75,75,0.8)]"
                  : `hover:bg-white/10 ${v === todayIso ? "ring-1 ring-white/30" : ""}`
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
