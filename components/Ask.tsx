"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const GONE_AT = 6; // esquivadas hasta que el "No" desaparece

// Pantalla principal: el "Sí" crece, el "No" huye y se desvanece hasta perderse.
export default function Ask({ onYes }: { onYes: () => void }) {
  const [dodges, setDodges] = useState(0);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const noRef = useRef<HTMLButtonElement>(null);

  const dodge = useCallback(() => {
    const el = noRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 16;
    const minX = pad - r.left;
    const maxX = window.innerWidth - pad - r.right;
    const minY = pad - r.top;
    const maxY = window.innerHeight - pad - r.bottom;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < 8; i++) {
      dx = minX + Math.random() * (maxX - minX);
      dy = minY + Math.random() * (maxY - minY);
      if (Math.hypot(dx, dy) > 150) break; // que salte lo bastante lejos
    }
    setOff((o) => ({ x: o.x + dx, y: o.y + dy }));
    setDodges((d) => d + 1);
  }, []);

  const gone = dodges >= GONE_AT;
  const grow = 1 + Math.min(dodges, GONE_AT) * 0.05;

  return (
    <div className="text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
        Tengo una pregunta muy importante para ti...
      </p>
      <h1 className="mx-auto mt-4 max-w-xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
        ¿Quieres ir a una cita conmigo?
      </h1>

      <div className="mt-8 flex items-center justify-center gap-4">
        <motion.button
          type="button"
          onClick={onYes}
          animate={{ scale: [grow, grow * 1.05, grow] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: grow * 1.1 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#ff4b4b] px-10 py-4 text-base font-medium tracking-wide text-white shadow-[0_8px_50px_-6px_rgba(255,75,75,0.85)] sm:px-12"
        >
          <Heart className="h-4 w-4 fill-white" /> Sí
        </motion.button>

        <motion.button
          ref={noRef}
          type="button"
          tabIndex={gone ? -1 : 0}
          aria-hidden={gone}
          onPointerEnter={dodge}
          onPointerDown={dodge}
          onClick={dodge}
          animate={{
            x: off.x,
            y: off.y,
            opacity: Math.max(0, 1 - dodges * 0.18),
            scale: Math.max(0.25, 1 - dodges * 0.12),
          }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          style={{ pointerEvents: gone ? "none" : "auto" }}
          className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base text-white/80 backdrop-blur"
        >
          No
        </motion.button>
      </div>

      <motion.p
        initial={false}
        animate={{ opacity: gone ? 1 : 0 }}
        className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40"
      >
        Solo queda una respuesta posible
      </motion.p>
    </div>
  );
}
