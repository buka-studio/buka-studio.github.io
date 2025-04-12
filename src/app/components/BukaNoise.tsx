"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "../util";
import CrossBackground from "./CrossBackground";
import CanvasNoise from "./Noise";

export default function BukaNoise({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const getThemeColor = () => {
    return resolvedTheme === "dark" ? "rgb(50, 50, 50)" : "rgb(0, 0, 0)";
  };

  const [color, setColor] = useState<string | undefined>();

  useEffect(() => {
    setColor(getThemeColor());
  }, [resolvedTheme]);

  return (
    <div className={cn("p-2 w-full aspect-square min-w-0 relative", className)}>
      <CrossBackground className="text-neutral-700" />
      <div
        className="noise-container relative w-full h-full overflow-hidden [mask-size:cover]"
        style={{
          maskImage: 'url("logomark.svg")',
        }}
        onMouseLeave={() => setColor(getThemeColor())}
        onMouseEnter={() => setColor("rgb(236, 75, 34)")}
      >
        {color && (
          <CanvasNoise
            active={Boolean(color)}
            className="absolute inset-0 w-full "
            height={620}
            width={620}
            color={color}
          />
        )}
      </div>
    </div>
  );
}
