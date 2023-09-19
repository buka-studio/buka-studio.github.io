"use client";
import { useState } from "react";
import LogoIcon from "../../public/logo-icon.svg";

const colors = ["#b493ff", "#92fdf6", "#fff"];

export default function Logo() {
  const [color, setColor] = useState(0);
  const style = { "--accent": colors[color] } as React.CSSProperties;

  return (
    <button
      style={style}
      onClick={() => setColor((color + 1) % colors.length)}
      className="shadow-sm outline-none shadow-neutral-950 rounded-[2.25rem] hover:shadow-md transition-all duration-200 hover:scale-[102%] active:scale-100 active:shadow-sm active:shadow-neutral-950 hover:shadow-neutral-950 focus-visible:outline-none focus-visible:shadow-md focus-visible:scale-[102%] focus-visible:shadow-neutral-950"
    >
      <LogoIcon className=" [&_path]:transition-all [&_path]:duration-200" />
    </button>
  );
}
