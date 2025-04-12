"use client";

import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/Command";
import { toast } from "../ui/Toast";

export const getPageBackgroundColor = () =>
  getComputedStyle(document.documentElement).backgroundColor;

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleTakeScreenshot() {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      toast.error("Oops, no canvas found.");
    }

    try {
      const screenshotCanvas = document.createElement("canvas");
      const ctx = screenshotCanvas.getContext("2d");
      screenshotCanvas.width = canvas!.width;
      screenshotCanvas.height = canvas!.height;

      ctx!.fillStyle = getPageBackgroundColor();
      ctx?.fillRect(0, 0, screenshotCanvas.width, screenshotCanvas.height);
      ctx!.drawImage(canvas!, 0, 0);

      const a = document.createElement("a");
      a.href = screenshotCanvas!.toDataURL("image/png");
      a.download = `buka_studio_screenshot_${new Date().getTime()}.png`;
      a.click();
    } catch (e) {
      toast.error("Oops, something went wrong.");
    }

    toast.success("Screenshot saved!");
  }

  function handleToggleDebugMode() {
    if (window.location.hash.includes("debug")) {
      window.location.hash = "";
    } else {
      window.location.hash = "debug";
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem onSelect={handleToggleDebugMode}>
          Toggle Debug Mode
        </CommandItem>
        <CommandItem onSelect={handleTakeScreenshot}>
          Take a screenshot
        </CommandItem>
      </CommandList>
    </CommandDialog>
  );
}
