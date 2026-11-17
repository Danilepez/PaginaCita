// Confeti en forma de corazón. canvas-confetti no trae 'heart' de serie:
// se crea con shapeFromPath y se pasa en `shapes`.
export async function fireHearts() {
  const { default: confetti } = await import("canvas-confetti");
  const heart = confetti.shapeFromPath({
    path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
  });
  const base = {
    shapes: [heart],
    colors: ["#ff4b4b", "#ff7676"],
    scalar: 2.2,
    ticks: 220,
    gravity: 0.8,
    disableForReducedMotion: true,
  };
  confetti({ ...base, particleCount: 60, spread: 90, origin: { y: 0.65 } });
  const end = Date.now() + 1800;
  (function frame() {
    confetti({ ...base, particleCount: 2, angle: 60, spread: 55, origin: { x: 0, y: 0.8 } });
    confetti({ ...base, particleCount: 2, angle: 120, spread: 55, origin: { x: 1, y: 0.8 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
