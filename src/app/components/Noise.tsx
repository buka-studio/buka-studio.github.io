"use client";

import { formatHex, interpolate, parse } from "culori";
import { useAnimationFrame } from "framer-motion";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { randFloat } from "three/src/math/MathUtils";
import { cn } from "../util";

const noise3d = createNoise3D();

function Canvas({
  active,
  className,
  width = 900,
  height = 900,
  color,
}: {
  active: boolean;
  className?: string;
  width?: number;
  height?: number;
  color: string;
}) {
  const seed = useRef(randFloat(0.5, 1.5));
  const canvas = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = 1600;
  const [initialized, setInitialized] = useState(false);

  const isLightTheme = useTheme().resolvedTheme === "light";

  const scaleX = width / canvasSize;
  const scaleY = height / canvasSize;

  const targetColor = useRef(parse(color));
  const prevColor = useRef(color);
  const currentColor = useRef(parse(color));

  const interpolator = useRef(
    interpolate([currentColor.current!, targetColor.current!])
  );
  const t = useRef(0);

  if (prevColor.current !== color) {
    prevColor.current = color;
    targetColor.current = parse(color);
    interpolator.current = interpolate([
      currentColor.current!,
      targetColor.current!,
    ]);
    t.current = 0;
  }

  useAnimationFrame((time) => {
    if (!active) {
      return;
    }
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // ctx.fillStyle = color;

    t.current += 0.05;
    const c = interpolator.current(t.current);
    currentColor.current = c;

    ctx.fillStyle = formatHex(c);

    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const noiseFactor = noise3d(
          i * 0.03,
          j * 0.03,
          time / (8000 * seed.current)
        );

        // const noiseFactor2 = noise3d(
        //   mouse.current.x * 0.0005 * i,
        //   mouse.current.y * 0.0005 * j,
        //   time / (8000 * seed.current)
        // );

        const mouseDistance = Math.sqrt(
          (mouse.current.x - i * 20 + 5) ** 2 +
            (mouse.current.y - j * 20 + 5) ** 2
        );

        const mouseSize = 500;

        var s = (noiseFactor < 0 ? 0.4 : noiseFactor < 0.5 ? 0.95 : 1.5) * 0.25;

        const mouseFactor = 1; //clamp(1, 2, (100 / mouseDistance) * 5);

        const baseSize = isLightTheme ? 25 : 20;
        const size = baseSize * s * mouseFactor;

        const halfSize = size / 2;

        ctx.fillRect(i * 20 + 5 - halfSize, j * 20 + 5 - halfSize, size, size);
      }
    }

    // ctx.fillRect(mouse.current.x - 50, mouse.current.y - 50, 100, 100);

    if (!initialized) {
      setInitialized(true);
    }
  });

  return (
    <canvas
      ref={canvas}
      width={canvasSize}
      height={canvasSize}
      onMouseMove={(e) => {
        mouse.current = {
          x: e.nativeEvent.offsetX / scaleX,
          y: e.nativeEvent.offsetY / scaleY,
        };
      }}
      style={{
        height: height,
        width: width,
      }}
      className={cn(
        "canvas relative overflow-hidden opacity-0 transition-all duration-1000",
        { "opacity-100": initialized },
        className
      )}
    />
  );
}

export default function Noise({
  active = true,
  className,
  width = 900,
  height = 900,
  color,
}: {
  active: boolean;
  className?: string;
  width?: number;
  height?: number;
  color: string;
}) {
  return (
    <Canvas
      active={active}
      className={className}
      width={width}
      height={height}
      color={color}
    />
  );
}
