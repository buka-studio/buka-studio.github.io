"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "../util";
import CanvasNoise from "./Noise";

const getThemeColor = (theme?: string) => {
  return theme === "dark" ? "rgb(50, 50, 50)" : "rgb(0, 0, 0)";
};

export default function BukaNoise({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();

  const [color, setColor] = useState<string | undefined>();

  useEffect(() => {
    setColor(getThemeColor(resolvedTheme));
  }, [resolvedTheme]);

  return (
    <div
      className={cn(
        "noise-container relative w-full h-full overflow-hidden [mask-size:cover]",
        className
      )}
      style={{
        maskImage: 'url("logomark.svg")',
      }}
      onMouseLeave={() => setColor(getThemeColor(resolvedTheme))}
      onMouseEnter={() => setColor("rgb(236, 75, 34)")}
    >
      {color && (
        <CanvasNoise
          active={Boolean(color)}
          className="absolute inset-0 w-full  [image-rendering:pixelated]"
          height={620}
          width={620}
          color={color}
        />
      )}
    </div>
  );
}
