"use client";

import { motion } from "framer-motion";

// Posiciones fijas (no aleatorias) para evitar errores de hidratación.
const HEARTS = [
  { size: 360, x: ["4%", "18%", "4%"], y: ["6%", "26%", "6%"], r: [-12, 8, -12], d: 42, o: 0.16 },
  { size: 280, x: ["68%", "56%", "68%"], y: ["10%", "34%", "10%"], r: [14, -6, 14], d: 36, o: 0.13 },
  { size: 420, x: ["58%", "70%", "58%"], y: ["58%", "42%", "58%"], r: [-8, 12, -8], d: 50, o: 0.12 },
  { size: 240, x: ["8%", "22%", "8%"], y: ["62%", "78%", "62%"], r: [10, -14, 10], d: 40, o: 0.18 },
  { size: 180, x: ["40%", "48%", "40%"], y: ["72%", "56%", "72%"], r: [-16, 6, -16], d: 32, o: 0.1 },
];

export default function AmbientHearts() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEARTS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute blur-3xl"
          style={{ width: h.size, height: h.size, opacity: h.o }}
          animate={{ left: h.x, top: h.y, rotate: h.r }}
          transition={{ duration: h.d, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="#ff4b4b">
            <path d="M12 21s-7.5-4.6-9.6-9.4C.8 8 3 4.5 6.5 4.5c2 0 3.5 1.1 5.5 3.2 2-2.1 3.5-3.2 5.5-3.2 3.5 0 5.7 3.5 4.1 7.1C19.5 16.4 12 21 12 21z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
