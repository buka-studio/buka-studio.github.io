"use client";

import { cn } from "../util";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("text-brand", className)}>
      © 2024 Buka Studio. All rights reserved / <span>Legal</span>
    </footer>
  );
}
