"use client";

import { useTheme } from "next-themes";
import { useDidMount } from "../hooks/useDidMount";
import { cn } from "../util";

export function ThemeToggle(props: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const didMount = useDidMount();

  return (
    <div {...props} className={cn("flex items-center gap-2", props.className)}>
      <button
        className={cn("opacity-60", {
          "opacity-100": theme === "light" && didMount,
        })}
        onClick={() => setTheme(theme === "light" ? "system" : "light")}
      >
        Light
      </button>
      <span>/</span>
      <button
        className={cn("opacity-60", {
          "opacity-100": theme === "dark" && didMount,
        })}
        onClick={() => setTheme(theme === "dark" ? "system" : "dark")}
      >
        Dark
      </button>
    </div>
  );
}
