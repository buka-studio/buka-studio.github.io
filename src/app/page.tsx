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
      <footer className="text-center uppercase font-medium text-xs leading-5 tracking-[0.03125rem] max-w-4xl mt-5 opacity-60">
        Legal information / Buka Studio d.o.o. Dubravica 6, 10090 Zagreb /
        Društvo je upisano u sudski registar trgovačkog suda u Zagrebu, pod
        brojem 081528558, Matični broj 081528558, OIB 57408517057. Temeljni
        kapital društva iznos 2.500,00 eur i uplaćen je u cijelosti. / Račun
        otvoren u Erste&Steiermärkische Bank d.d., Jadranski trg 3A, 51000
        Rijeka, IBAN HR8724020061101179225 / Član uprave: Marijana Šimag
      </footer>
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
