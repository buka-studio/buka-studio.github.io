import Logo from "./Logo";
import MousePositionVarsSetter from "./MousePositionVarsSetter";

export default function Home() {
  return (
    <div className="page flex min-h-full flex-col items-center justify-between p-12">
      <MousePositionVarsSetter />
      <main className="text-center flex flex-col items-center my-auto relative z-10">
        <Logo />
        <h1 className="text-4xl md:text-5xl mt-10 ">Buka Studio</h1>
        <p className="uppercase text-xs md:text-sm mt-1 tracking-[0.04375rem]">
          Design and Development
        </p>
      </main>
      <footer className="text-center uppercase font-medium text-xs leading-5 tracking-[0.03125rem] max-w-4xl">
        Legal Info WIP
      </footer>
      <svg xmlns="http://www.w3.org/2000/svg" className="absolute">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
    </div>
  );
}
