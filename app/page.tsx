"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";

// Three.js solo en cliente: evita errores de hidratación / SSR.
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

export default function Page() {
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  // El botón "No" se teletransporta (ratón, táctil y clic).
  const dodge = useCallback(() => {
    const w = noRef.current?.offsetWidth ?? 120;
    const h = noRef.current?.offsetHeight ?? 56;
    const pad = 16;
    setNoPos({
      x: pad + Math.random() * Math.max(0, window.innerWidth - w - pad * 2),
      y: pad + Math.random() * Math.max(0, window.innerHeight - h - pad * 2),
    });
  }, []);

  const sayYes = useCallback(async () => {
    setAccepted(true);
    const { default: confetti } = await import("canvas-confetti");
    const colors = ["#ff2e88", "#ffb454", "#ffd9e6", "#8a5cff", "#ffffff"];
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors });
    const end = Date.now() + 2500;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <main className="relative h-dvh w-screen overflow-hidden">
      <div className="absolute inset-0">
        <Scene3D happy={accepted} />
      </div>

      {/* Capa solo con opacidad: un transform aquí rompería el position:fixed del botón "No". */}
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.section
            key="question"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-5 pb-[12vh] text-center sm:justify-center sm:pb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="mb-4 text-lg italic text-rose-200/80 sm:text-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
            >
              Tengo una pregunta muy importante para ti...
            </motion.p>

            <motion.h1
              className="pointer-events-auto max-w-2xl rounded-3xl border border-white/15 bg-white/[0.06] px-6 py-6 text-3xl font-semibold leading-tight text-white shadow-[0_0_60px_-10px_rgba(255,46,136,0.55)] backdrop-blur-md sm:px-10 sm:py-8 sm:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
            >
              ¿Quieres ir a una cita conmigo este fin de semana?
            </motion.h1>

            <motion.div
              className="pointer-events-auto mt-8 flex items-center justify-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.8 }}
            >
              <motion.button
                onClick={sayYes}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 px-10 py-4 text-xl font-semibold text-white shadow-[0_0_40px_8px_rgba(255,46,136,0.55)] outline-none focus-visible:ring-4 focus-visible:ring-white/70 sm:px-14 sm:py-5 sm:text-2xl"
                animate={{ scale: [1, 1.09, 1, 1.13, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="h-6 w-6 fill-white" /> Sí
              </motion.button>

              {noPos && <span aria-hidden className="inline-block h-14 w-24" />}
              <button
                ref={noRef}
                onMouseEnter={dodge}
                onPointerDown={dodge}
                onClick={dodge}
                style={noPos ? { position: "fixed", left: noPos.x, top: noPos.y } : undefined}
                className="z-50 rounded-full border border-white/25 bg-white/10 px-8 py-4 text-lg text-white/80 backdrop-blur transition-[left,top] duration-200 sm:text-xl"
              >
                No
              </button>
            </motion.div>
          </motion.section>
        ) : (
          <motion.section
            key="success"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h2
              className="text-4xl font-semibold italic text-white drop-shadow-[0_0_30px_rgba(255,180,84,0.8)] sm:text-6xl"
              initial={{ scale: 0.6, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.4 }}
            >
              ¡Sabía que dirías que sí! ❤️
            </motion.h2>
            <motion.p
              className="mt-6 max-w-md rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-4 text-xl text-amber-100 backdrop-blur-md sm:text-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.9 }}
            >
              Ve preparando tu mejor outfit. Yo paso por ti.
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
