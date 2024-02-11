import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: Parameters<typeof clsx>) {
  return twMerge(clsx(classes));
}
