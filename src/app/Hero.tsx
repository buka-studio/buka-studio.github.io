"use client";

import Logomark from "../../public/logomark.svg";

import { createContext, useContext, useState } from "react";
import FluidVisual from "./components/FluidVisual";
import NoiseVisual from "./components/NoiseVisual";

const visuals = {
  noise: NoiseVisual,
  fluid: FluidVisual,
};

const HeroContext = createContext<{
  visual: keyof typeof visuals;
  setVisual: (visual: keyof typeof visuals) => void;
}>({
  visual: "noise",
  setVisual: () => {},
});

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [visual, setVisual] = useState<keyof typeof visuals>("noise");
  return (
    <HeroContext.Provider value={{ visual, setVisual }}>
      {children}
    </HeroContext.Provider>
  );
}

const useHero = () => {
  return useContext(HeroContext);
};

export function HeroSwitcher({ className }: { className?: string }) {
  const { visual, setVisual } = useHero();

  const visualKeys = Object.keys(visuals);
  const activeIndex = visualKeys.indexOf(visual);

  const nextIndex = (activeIndex + 1) % visualKeys.length;

  const toggleVisual = () => {
    setVisual(visualKeys[nextIndex] as keyof typeof visuals);
  };

  return (
    <button
      aria-label="Toggle hero visual"
      onClick={toggleVisual}
      data-umami-event="Toggle hero visual"
      data-umami-event-visual={visualKeys[nextIndex]}
    >
      <Logomark className={className} />{" "}
    </button>
  );
}

export function HeroVisual({ className }: { className?: string }) {
  const { visual } = useHero();
  const Component = visuals[visual];

  return <Component className={className} />;
}
