"use client";

import { parseHex, Rgb } from "culori";
import { useAnimationFrame } from "framer-motion";
import { useTheme } from "next-themes";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useMatchMedia from "~/app/hooks/useMatchMedia";
import { cn } from "~/app/util";
import { CellType, Simulation } from "./Simulation";

type Vec3 = [number, number, number];

interface PointerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isOver: boolean;
}

interface Colors {
  accent: string;
  background: string;
  cellOutline: string;
  cellFluid: string;
}

interface Config {
  scale: number;
  cellSize: number;
  cellOutlineWidth: number;
  fluidPercentage: number;
  particlesPerCell: number;
}

interface Props {
  height: number;
  width: number;
  className?: string;
  config: Config;
  colors: Colors;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVec3(v1: Vec3, v2: Vec3, t: number): Vec3 {
  const r = lerp(v1[0], v2[0], t);
  const g = lerp(v1[1], v2[1], t);
  const b = lerp(v1[2], v2[2], t);

  return [r, g, b];
}

function vec3ToRgb([r, g, b]: Vec3): string {
  return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
}

function hexToVec3(hex: string): Vec3 {
  const { r, g, b } = parseHex(hex) as Rgb;
  return [r, g, b];
}

function SimulationCanvas({
  height = 800,
  width = 600,
  config,
  colors,
  className,
}: Props) {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(window.devicePixelRatio || 1);
  }, []);

  const hoverFactor = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<Simulation | null>(null);
  const mouseRef = useRef<PointerState>({
    x: -1,
    y: -1,
    vx: 0,
    vy: 0,
    radius: 80,
    isOver: false,
  });

  const scrollVelocityRef = useRef(0);

  const setupScene = useCallback(() => {
    const cellSize = config.cellSize;
    const scale = config.scale;

    const simWidth = width / scale;
    const simHeight = height / scale;

    const gridCellSize = cellSize / scale;

    const numX = Math.floor(width / cellSize);
    const numY = Math.floor(height / cellSize);

    const particlesPerCell = config.particlesPerCell;
    const particleRadius = (gridCellSize / particlesPerCell) * 0.25;

    const maxParticles = numX * numY * particlesPerCell;

    const sim = new Simulation({
      density: 1000.0,
      width: simWidth,
      height: simHeight,
      fluidPercentage: config.fluidPercentage,
      grid: {
        cellSize: gridCellSize,
      },
      particles: {
        maxNum: maxParticles,
        radius: particleRadius,
        numPerCell: particlesPerCell,
      },
    });

    simulationRef.current = sim;
  }, [config, width, height]);

  const draw = useCallback(() => {
    const sim = simulationRef.current;
    const canvas = canvasRef.current;
    if (!sim || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = config.scale;

    ctx.save();
    ctx.scale(dpr, dpr);

    const cellPixelSize = sim.grid.cellSize * scale;

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    const { grid } = sim;

    for (let i = 0; i < grid.numX; i++) {
      for (let j = 0; j < grid.numY; j++) {
        const cellIndex = i * grid.numY + j;
        const cellType = grid.cellType[cellIndex];

        if (cellType === CellType.Fluid) {
          const density = grid.gridCellDensity[cellIndex];
          if (density > 0.01) {
            const targetColor = lerpVec3(
              hexToVec3(colors.cellFluid),
              hexToVec3(colors.accent),
              hoverFactor.current
            );
            const finalColor = lerpVec3(
              hexToVec3(colors.background),
              targetColor,
              density
            );

            ctx.fillStyle = vec3ToRgb(finalColor);
            const x = i * cellPixelSize;
            const y = height - (j + 1) * cellPixelSize;
            ctx.fillRect(x, y, cellPixelSize, cellPixelSize);

            if (config.cellOutlineWidth > 0) {
              ctx.strokeStyle = colors.cellOutline;
              ctx.lineWidth = config.cellOutlineWidth;
              ctx.strokeRect(x, y, cellPixelSize, cellPixelSize);
            }
          }
        }
      }
    }

    ctx.restore();
  }, [colors, config, dpr, width, height]);

  const animate = useCallback(() => {
    const sim = simulationRef.current;
    if (sim) {
      const targetHover = mouseRef.current.isOver ? 1 : 0;
      hoverFactor.current += (targetHover - hoverFactor.current) * 0.1;

      mouseRef.current.vx *= 0.9;
      mouseRef.current.vy *= 0.9;

      if (Math.abs(mouseRef.current.vx) < 0.001) {
        mouseRef.current.vx = 0;
      }
      if (Math.abs(mouseRef.current.vy) < 0.001) {
        mouseRef.current.vy = 0;
      }

      const physicsParams = {
        gravity: -9.81,
        scrollVelocity: scrollVelocityRef.current,
        pointer: {
          ...mouseRef.current,
          radius: mouseRef.current.radius / config.scale,
        },
        fluidDensity: sim.fluidDensity,
      };

      sim.simulate(1 / 60.0, physicsParams);

      scrollVelocityRef.current = 0.0;
    }

    draw();
  }, [config, draw]);

  useAnimationFrame(() => {
    animate();
  });

  useEffect(() => {
    setupScene();
  }, [width, height, setupScene]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = currentScrollY - lastScrollY;
      scrollVelocityRef.current += -velocity * 0.05;
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updatePointerPosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Convert screen coordinates to CSS pixel coordinates relative to the canvas
    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;

    // Scale CSS pixel coordinates to simulation space
    const simX = cssX / config.scale;
    const simY = (height - cssY) / config.scale; // Use prop 'height' for inversion

    if (mouseRef.current.isOver) {
      mouseRef.current.vx = simX - mouseRef.current.x;
      mouseRef.current.vy = simY - mouseRef.current.y;
    }

    mouseRef.current.x = simX;
    mouseRef.current.y = simY;
  };

  const onMouseEnter = () => {
    mouseRef.current.isOver = true;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.isOver = true;
    updatePointerPosition(e.clientX, e.clientY);
  };

  const onMouseLeave = () => {
    mouseRef.current.isOver = false;
    mouseRef.current.vx = 0;
    mouseRef.current.vy = 0;
  };

  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    mouseRef.current.isOver = true;
    if (e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchEnd = () => {
    mouseRef.current.isOver = false;
    mouseRef.current.vx = 0;
    mouseRef.current.vy = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      width={width * dpr}
      height={height * dpr}
      className={cn(
        "bg-transparent w-full h-auto cursor-crosshair [image-rendering:pixelated]",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

const getThemeColors = (theme?: string) => {
  if (theme === "dark") {
    return {
      accent: "#ec4a22",
      background: "#0b0a09",
      cellOutline: "#0b0a09",
      cellFluid: "#323232",
    };
  }
  return {
    accent: "#ec4a22",
    background: "#e7e5e4",
    cellOutline: "#e7e5e4",
    cellFluid: "#323232",
  };
};

const baseConfig: Config = {
  scale: 100,
  cellSize: 8,
  cellOutlineWidth: 8 * 0.8,
  fluidPercentage: 40,
  particlesPerCell: 4,
};

function getConfig(
  baseConfig: Config,
  {
    isMobile,
    theme,
  }: {
    isMobile: boolean;
    theme?: string;
  }
) {
  const config = {
    ...baseConfig,
  };

  if (isMobile) {
    config.fluidPercentage = 50;
    config.cellSize = 10;
  }

  if (theme === "light") {
    config.cellOutlineWidth = config.cellSize * 0.6;
  }

  return config;
}

export default function FluidVisual({ className }: { className?: string }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });

    observer.observe(containerRef.current);

    setInitialized(true);

    return () => observer.disconnect();
  }, []);

  const theme = useTheme();
  const isMobile = useMatchMedia("(max-width: 568px)");

  const [config, setConfig] = useState(
    getConfig(baseConfig, {
      isMobile,
      theme: theme.resolvedTheme,
    })
  );
  const [colors, setColors] = useState(getThemeColors(theme.resolvedTheme));

  useLayoutEffect(() => {
    setConfig(
      getConfig(baseConfig, {
        isMobile,
        theme: theme.resolvedTheme,
      })
    );
  }, [theme.resolvedTheme, isMobile]);

  useLayoutEffect(() => {
    setColors(getThemeColors(theme.resolvedTheme));
  }, [theme.resolvedTheme]);

  return (
    <div
      className={cn("relative w-full h-full [mask-size:cover]", className)}
      style={{
        maskImage: 'url("logomark.svg")',
      }}
      ref={containerRef}
    >
      <SimulationCanvas
        config={config}
        colors={colors}
        width={width}
        height={height}
        className={cn("transition-opacity duration-500 absolute inset-0", {
          "opacity-0": !initialized,
          "opacity-100": initialized,
        })}
      />
    </div>
  );
}
