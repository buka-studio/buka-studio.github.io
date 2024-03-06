"use client";

import { useTheme } from "next-themes";
import { cn } from "./util";

export function ThemeToggle(props: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div {...props} className={cn("flex gap-2", props.className)}>
      <button
        className={cn("opacity-60", { "opacity-100": theme === "light" })}
        onClick={() => setTheme(theme === "light" ? "system" : "light")}
      >
        Light
      </button>
      <span>/</span>
      <button
        className={cn("opacity-60", { "opacity-100": theme === "dark" })}
        onClick={() => setTheme(theme === "dark" ? "system" : "dark")}
      >
        Dark
      </button>
    </div>
  );
}
