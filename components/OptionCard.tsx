"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Check } from "lucide-react";

type Props = { emoji: string; label: string; image?: string; selected: boolean; onClick: () => void };

// Tarjeta con efecto magnético (se inclina hacia el cursor) y glow que sigue al puntero.
export default function OptionCard({ emoji, label, image, selected, onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const x = useSpring(rx, { stiffness: 220, damping: 16 });
  const y = useSpring(ry, { stiffness: 220, damping: 16 });
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const glow = useMotionTemplate`radial-gradient(150px circle at ${mx}px ${my}px, rgba(255,75,75,0.24), transparent 70%)`;

  const move = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    mx.set(px);
    my.set(py);
    rx.set((px / r.width - 0.5) * 10);
    ry.set((py / r.height - 0.5) * 10);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(-200);
    my.set(-200);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      aria-pressed={selected}
      className={`relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left backdrop-blur-md transition-colors sm:h-36 ${
        selected
          ? "border-[#ff4b4b]/70 bg-[#ff4b4b]/10"
          : "border-white/10 bg-white/[0.04] hover:border-white/25"
      }`}
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      )}
      <motion.span className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <span className="relative text-3xl leading-none">{emoji}</span>
      <span className="relative text-sm font-medium tracking-tight text-white/90">{label}</span>
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-[#ff4b4b]"
        >
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </motion.span>
      )}
    </motion.button>
  );
}
