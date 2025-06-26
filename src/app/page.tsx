import { CSSProperties } from "react";
import AnimatedSignature from "./components/AnimatedSignature";
import CrossBackground from "./components/CrossBackground";
import LegalDrawer from "./components/LegalDrawer";
import { HeroProvider, HeroSwitcher, HeroVisual } from "./Hero";
import "./page.css";
import ThemeSwitcher from "./ThemeSwitcher";
import { cn } from "./util";

function Header({ className }: { className?: string }) {
  return (
    <div className={cn("text-sm", className)}>
      <span className="text-muted-foreground">ブカ</span>
      <h1 className="text-brand font-semibold ">Buka Studio</h1>
      <p className="text-muted-foreground">Design and development</p>
    </div>
  );
}

function About({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 text-muted-foreground text-sm",
        className
      )}
    >
      <p className="text-foreground font-medium text-base">
        We help founders turn ideas into products and brands.
      </p>
      <p className="text-foreground font-medium text-base">
        We’re{" "}
        <a
          href="https://marijanapav.com"
          className="underline hover:text-brand decoration-1 focus-brand"
        >
          Marijana
        </a>{" "}
        and{" "}
        <a
          href="https://rpavlini.com"
          className="underline hover:text-brand decoration-1 focus-brand"
        >
          Robert
        </a>
        , a designer–developer duo behind Buka Studio. We work closely with
        teams we believe in.
      </p>
      <p>
        We like projects where design and code move together, so nothing gets{" "}
        <span className="italic">lost in translation.</span>
      </p>

      <p>
        We’re drawn to new ideas. We dive in fast, and explore broadly. Whether
        we’re shaping early ideas, refining products in production, or crafting
        bold visuals for one-off moments, we make sure everything feels cohesive
        and on-brand.
      </p>
    </div>
  );
}

function Contact({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "gap-5 flex flex-col text-muted-foreground text-sm",
        className
      )}
    >
      <p>
        If you share this vision, and are looking for a partner to push your
        product forward, say{" "}
        <a
          href="mailto:hello@buka.studio"
          className="underline font-medium hover:text-brand decoration-1 focus-brand"
        >
          hello@buka.studio
        </a>
      </p>

      <p>Based in Croatia, available remotely.</p>

      <div className="mt-5">
        <AnimatedSignature className="w-[clamp(200px,50vw,220px)] h-auto" />
      </div>
    </div>
  );
}

function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex justify-between  gap-5 text-muted-foreground2",
        className
      )}
    >
      <span className="flex items-center gap-2 text-sm">
        <HeroSwitcher className="h-[0.85rem] w-[0.85rem] opacity-60" />
        {new Date().getFullYear()}{" "}
        <span className="hidden md:inline">Buka Studio</span>
      </span>

      <span className="flex gap-4 items-center text-sm">
        <a
          href="mailto:hello@buka.studio"
          className="hover:text-brand focus-brand"
        >
          Contact
        </a>

        <LegalDrawer>Legal</LegalDrawer>
        <ThemeSwitcher className="text-muted-foreground2 opacity-60" />
      </span>
    </footer>
  );
}

export default function Home() {
  return (
    <div
      className="page px-3 overflow-x-clip selection:text-brand selection:bg-brand/10"
      style={
        {
          "--fluid-col":
            "clamp(20px, calc(20px + (80 * ((100vw - 450px) / (1024 - 450)))), 100px)",
        } as CSSProperties
      }
    >
      <div className="content grid grid-cols-[var(--fluid-col),1fr,var(--fluid-col)] max-w-3xl w-full min-h-screen mx-auto grid-rows-[repeat(6,auto),1fr,repeat(4,auto)] border-l border-r border-dashed">
        <HeroProvider>
          <div className="grid grid-rows-subgrid col-[2] row-[1/11] border-l border-r">
            <div className="h-10 col-[2] row-[1] outlined-bottom dashed" />
            <Header className="col-[2] row-[2] py-3 md:py-8 md:px-8 px-3" />
            <div className="h-4 col-[2] row-[3] outlined-top outlined-bottom" />
            <div className="w-full aspect-square min-w-0 relative col-[2] row-[5]">
              <CrossBackground className="text-neutral-700" />
              <HeroVisual className="aspect-square" />
            </div>
            <About className="col-[2] row-[6] outlined-top outlined-bottom py-8 md:px-8 px-3 " />
            <Contact className="col-[2] row-[7] py-8 md:px-8 px-3 pb-12" />
            <div className="h-4 col-[2] row-[8] outlined-top outlined-bottom" />
            <Footer className="col-[2] row-[9] py-3 md:px-8 px-3" />
            <div className="h-10 col-[2] row-[10] outlined-top dashed" />
          </div>
        </HeroProvider>
      </div>
    </div>
  );
}
