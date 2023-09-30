import Footer from "./Footer";
import Logo from "./Logo";
import MousePositionVarsSetter from "./MousePositionVarsSetter";

export default function Home() {
  return (
    <div className="page flex min-h-screen flex-col items-center justify-between p-8 md:p-12">
      <MousePositionVarsSetter />
      <main className="text-center flex flex-col items-center my-auto relative z-10">
        <Logo />
        <h1 className="text-4xl md:text-5xl mt-10 ">Buka Studio</h1>
        <p className="uppercase text-xs md:text-sm mt-1 tracking-[0.04375rem]">
          Design and Development
        </p>
      </main>
      <Footer />
      <svg xmlns="http://www.w3.org/2000/svg" className="absolute">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.25"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
    </div>
  );
}
