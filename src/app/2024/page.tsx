import BukaLogo from "../../../public/logomark.svg";
import CommandPalette from "./CommandPalette";
import Footer from "./Footer";
import ParticlesLogo from "./ParticlesLogo";
import { ThemeToggle } from "./ThemeToggle";
import "./globals.css";

export default function Home() {
  return (
    <div className="">
      <div className="fixed inset-0 z-0">
        <ParticlesLogo />
      </div>
      <div className="fixed inset-5 md:inset-0 z-10 pointer-events-none [&>*]:pointer-events-auto">
        <main className="grid grid-rows-[1fr_auto] grid-cols-[1fr_auto] text-brand gap-5 md:mx-auto bottom-10 left-10 right-10 mr-auto text-sm md:text-base md:absolute">
          <div className="flex flex-col gap-2 md:gap-5 relative z-10">
            <div className="flex top-10 left-10 mb-5 md:fixed right-10 justify-between">
              <h1 className="text-base flex items-center gap-2 ">
                <BukaLogo className="h-5 w-5" />
                Buka Studio
              </h1>
              <ThemeToggle />
            </div>
            <p className="text-balance">
              Design and Development
              <br />
              studio based in Zagreb
            </p>
            <div>/</div>
          </div>
          <Footer className="row-start-2 md:static absolute bottom-0 text-sm md:text-base" />
          <div className="md:col-start-2 row-start-2 flex items-center gap-1">
            <a href="mailto:hello@buka.studio" rel="noopener noreferrer">
              hello@buka.studio
            </a>
            /
            <a
              href="https://github.com/buka-studio"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
