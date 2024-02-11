"use client";

import LogoIcon from "../../../public/cmdtab/logo-icon.svg";
import Footer from "../Footer";
import FeaturesCarousel from "./components/FeaturesCarousel";
import InstallButton from "./components/InstallButton";

import MousePositionVarsSetter from "../MousePositionVarsSetter";
import {
  OpenSourceCard,
  PerformanceCard,
  PrivacyCard,
  WorkflowCard,
} from "./components/bento";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="flex-col items-center justify-between p-8 md:p-12 flex-1">
        <main className="text-center flex flex-col items-center my-auto relative z-10">
          <div
            className="shadow-sm outline-none rounded-[1.875rem] hover:shadow-md transition-all duration-200 hover:scale-[102%] active:scale-100 active:shadow-sm focus-visible:outline-none focus-visible:shadow-md focus-visible:scale-[102%]  
       shadow-neutral-950 active:shadow-neutral-950 hover:shadow-neutral-950 focus-visible:shadow-neutral-950"
          >
            <LogoIcon />
          </div>
          <h1 className="text-4xl md:text-5xl mt-5 font-mono">CmdTab</h1>
          <p className="text-xs md:text-sm mt-1 tracking-[0.04375rem] text-[#A1A1A1] text-balance">
            Clean & simple tab management <br />
            browser extension.
          </p>
          <div className="mt-10 flex flex-col gap-2">
            <InstallButton className="">Add to Chrome</InstallButton>
            <div className="flex gap-5 text-neutral-500">
              {/* <a>Add to Chrome</a>
              <a>Add to Firefox</a> */}
            </div>
          </div>

          <div className="bento grid grid-cols-5 max-w-5xl gap-5 mx-auto mt-[100px]">
            <WorkflowCard className="col-span-5 md:col-span-3" />
            <PrivacyCard className="col-span-5 md:col-span-2" />
            <OpenSourceCard className="col-span-5 md:col-span-2" />
            <PerformanceCard className="col-span-5 md:col-span-3" />
          </div>

          <div className="features mt-[100px]">
            <FeaturesCarousel />
          </div>
        </main>
      </div>

      <div className="w-full flex justify-center items-center py-8">
        <Footer hideContact />
      </div>
      <MousePositionVarsSetter />

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
