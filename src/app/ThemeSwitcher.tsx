"use client";

import {
  CircleHalf as CircleHalfIcon,
  Circle as CircleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

import { useDidMount } from "./hooks/useDidMount";
import { cn } from "./util";

const controls = [
  {
    icon: <CircleIcon className="z-1 h-4 w-4" weight="fill" />,
    value: "dark",
  },
  {
    icon: <CircleIcon className="z-1 h-4 w-4" />,
    value: "light",
  },
  {
    icon: <CircleHalfIcon className="z-1 h-4 w-4" weight="fill" />,
    value: "system",
  },
];

export default function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const didMount = useDidMount();

  const activeIndex = Math.max(
    controls.findIndex(({ value }) => value === theme),
    0
  );

  const nextIndex = (activeIndex + 1) % controls.length;

  return (
    <div
      className={cn(
        "relative flex min-h-[2rem] min-w-[1.25rem] items-center gap-2",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {didMount && (
          <motion.button
            aria-label="Toggle theme"
            data-umami-event="Toggle theme"
            data-umami-event-theme={controls[nextIndex].value}
            className="rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            key={activeIndex}
            onClick={() => setTheme(controls[nextIndex].value)}
          >
            {controls[nextIndex].icon}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
