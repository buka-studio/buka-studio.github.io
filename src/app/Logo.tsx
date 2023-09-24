"use client";
import { useState } from "react";
import LogoIcon from "../../public/logo-icon.svg";

const colors = ["#fff", "#F44E22"];

export default function Logo() {
  const [color, setColor] = useState(0);
  const style = { "--accent": colors[color] } as React.CSSProperties;

  return (
    <button
      style={style}
      onClick={() => setColor((color + 1) % colors.length)}
      className="shadow-sm outline-none shadow-neutral-500 rounded-[1.875rem] hover:shadow-md transition-all duration-200 hover:scale-[102%] active:scale-100 active:shadow-sm active:shadow-neutral-500 hover:shadow-neutral-600 focus-visible:outline-none focus-visible:shadow-md focus-visible:scale-[102%] focus-visible:shadow-neutral-500 
       dark:shadow-neutral-950 dark:active:shadow-neutral-950 dark:hover:shadow-neutral-950 dark:focus-visible:shadow-neutral-950"
    >
      <LogoIcon className=" [&_path]:transition-all [&_path]:duration-200" />
    </button>
  );
}
