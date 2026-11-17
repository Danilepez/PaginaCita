"use server";

import type { Plan } from "@/lib/data";

const clean = (s: unknown) => String(s ?? "").slice(0, 200);
const CRIMSON = 0x8b0a1a;

export async function sendPlan(plan: Plan): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return { ok: false, error: "Falta DISCORD_WEBHOOK_URL en .env.local" };

  const raw = new Date(`${clean(plan.date)}T12:00:00Z`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const date = raw.charAt(0).toUpperCase() + raw.slice(1);
  const list = (a: string[]) => (a ?? []).slice(0, 10).map(clean).join("  ·  ") || "—";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        embeds: [
          {
            title: "Cita confirmada",
            description: "El plan quedó armado desde la web.",
            color: CRIMSON,
            fields: [
              { name: "Fecha", value: date, inline: true },
              { name: "Hora", value: clean(plan.time), inline: true },
              { name: "Comida", value: list(plan.food) },
              { name: "Actividad", value: list(plan.activity) },
            ],
            footer: { text: "planear cita" },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: `Discord respondió ${res.status}` };
  } catch {
    return { ok: false, error: "No se pudo conectar con Discord" };
  }
}
