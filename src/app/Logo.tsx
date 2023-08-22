"use client";
import { useState } from "react";
import LogoIcon from "../../public/logo-icon.svg";

const colors = ["#b493ff", "#92fdf6", "#fff"];

export default function Logo() {
  const [color, setColor] = useState(0);
  const style = { "--accent": colors[color] } as React.CSSProperties;

  return (
    <button onClick={() => setColor((color + 1) % colors.length)} className="">
      <LogoIcon
        style={style}
        className="shadow-sm shadow-neutral-800 rounded-[2.25rem] hover:shadow-md transition-all duration-200 hover:scale-[102%] active:scale-100 active:shadow-sm active:shadow-neutral-800 hover:shadow-neutral-600 [&_path]:transition-all [&_path]:duration-200"
      />
    </button>
  );
}
