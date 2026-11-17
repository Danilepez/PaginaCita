"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Heart } from "lucide-react";
import { PrimaryButton } from "./ui";
import type { Plan } from "@/lib/data";
import { fireHearts } from "@/lib/hearts";

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="py-6 text-center sm:py-10">
      <div className="mx-auto mb-8 grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/5">
        <Heart className="h-5 w-5 text-[#ff4b4b]" strokeWidth={1.5} />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Una invitación</p>
      <h1 className="mx-auto mt-4 max-w-md text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
        Nuestra próxima aventura <span className="text-[#ff4b4b]">empieza aquí.</span>
      </h1>
      <div className="mt-10">
        <PrimaryButton breathe onClick={onStart}>
          Empezar <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </div>
  );
}

export function Success({ plan }: { plan: Plan }) {
  useEffect(() => {
    fireHearts();
  }, []);

  const date = new Date(`${plan.date}T12:00:00`).toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const rows = [
    ["Fecha", date],
    ["Hora", plan.time],
    ["Comida", plan.food.join("  ·  ")],
    ["Plan", plan.activity.join("  ·  ")],
  ];

  return (
    <div className="py-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 12 }}
        className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-[#ff4b4b] shadow-[0_0_50px_-5px_rgba(255,75,75,0.8)]"
      >
        <Check className="h-6 w-6 text-white" strokeWidth={2.5} />
      </motion.div>
      <h2 className="mx-auto max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        ¡Todo listo! Te veo pronto para nuestra cita.
      </h2>
      <dl className="mx-auto mt-8 max-w-sm divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] text-left text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-6 px-4 py-3">
            <dt className="font-mono text-[11px] uppercase tracking-widest text-white/40">{k}</dt>
            <dd className="text-right text-white/90 first-letter:uppercase">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
