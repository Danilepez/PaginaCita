"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Ask from "@/components/Ask";
import { Success } from "@/components/Steps";
import { PickStep, WhenStep } from "@/components/WizardSteps";
import { ACTIVITIES, FOODS, type Option, type Plan } from "@/lib/data";
import { sendPlan } from "./actions";

// Three.js solo en cliente: evita errores de hidratación / SSR.
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const variants = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, filter: "blur(8px)" },
};

export default function Page() {
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState(0); // paso ya montado: decide el layout sin saltos
  const [plan, setPlan] = useState<Plan>({ date: "", time: "", food: [], activity: [] });
  const [foods, setFoods] = useState<Option[]>(FOODS);
  const [acts, setActs] = useState<Option[]>(ACTIVITIES);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const toggle = (key: "food" | "activity", v: string) =>
    setPlan((p) => ({ ...p, [key]: p[key].includes(v) ? p[key].filter((i) => i !== v) : [...p[key], v] }));

  // Agrega una opción personalizada a la lista y la deja seleccionada.
  const addOption = (key: "food" | "activity", o: Option) => {
    const setList = key === "food" ? setFoods : setActs;
    setList((l) => (l.some((x) => x.label.toLowerCase() === o.label.toLowerCase()) ? l : [...l, o]));
    const v = `${o.emoji} ${o.label}`;
    setPlan((p) => (p[key].includes(v) ? p : { ...p, [key]: [...p[key], v] }));
  };

  const confirm = () =>
    start(async () => {
      setError("");
      const res = await sendPlan(plan);
      if (res.ok) setStep(4);
      else setError(res.error ?? "Algo salió mal. Inténtalo de nuevo.");
    });

  const back = () => setStep((s) => s - 1);
  const next = () => setStep((s) => s + 1);

  const hero = step === 0 || step === 4; // el corazón 3D protagoniza estas pantallas
  const heroLayout = shown === 0 || shown === 4;

  return (
    <main
      className={`relative flex min-h-dvh justify-center overflow-hidden px-4 ${
        heroLayout ? "items-end pb-[7vh]" : "items-center py-10"
      }`}
    >
      <div className="absolute inset-0">
        <Scene3D hero={hero} happy={step === 4} />
      </div>
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" />

      <div
        className={`relative w-full max-w-3xl ${
          heroLayout
            ? "p-2"
            : "rounded-[28px] border border-white/10 bg-black/30 p-6 shadow-[0_30px_120px_-30px_rgba(255,75,75,0.3)] backdrop-blur-2xl sm:p-10"
        }`}
      >
        <AnimatePresence mode="wait" onExitComplete={() => setShown(step)}>
          <motion.div
            key={step}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && <Ask onYes={next} />}
            {step === 1 && (
              <WhenStep plan={plan} onChange={(p) => setPlan((o) => ({ ...o, ...p }))} onBack={back} onNext={next} />
            )}
            {step === 2 && (
              <PickStep
                n={2}
                title="¿Qué comeremos?"
                hint="Elige las que quieras o agrega la tuya."
                options={foods}
                value={plan.food}
                onToggle={(v) => toggle("food", v)}
                onAdd={(o) => addOption("food", o)}
                onBack={back}
                onNext={next}
                cta="Siguiente"
              />
            )}
            {step === 3 && (
              <PickStep
                n={3}
                title="¿Qué haremos?"
                hint="Arma el plan a tu gusto, con tus propias ideas."
                options={acts}
                value={plan.activity}
                onToggle={(v) => toggle("activity", v)}
                onAdd={(o) => addOption("activity", o)}
                onBack={back}
                onNext={confirm}
                cta="Confirmar plan"
                loading={pending}
                error={error}
              />
            )}
            {step === 4 && <Success plan={plan} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
