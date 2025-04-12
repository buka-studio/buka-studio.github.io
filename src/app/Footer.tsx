"use client";

import { Drawer } from "vaul";
import { cn } from "./util";

export default function Footer({ className }: { className?: string }) {
  return (
    <Drawer.Root>
      <footer className={cn("text-brand", className)}>
        © 2025 Buka Studio. All rights reserved /{" "}
        <Drawer.Trigger className="">Legal</Drawer.Trigger>
      </footer>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-10" />
        <Drawer.Content className="bg-neutral-950 p-8 pt-5 md:p-10 md:pt-10 fixed bottom-0 left-0 right-0 text-xs text-neutral-500 rounded-t-xl z-20">
          <div className="justify-between max-w-5xl flex gap-8 md:gap-12 m-auto flex-col md:flex-row">
            <div className="md:hidden mx-auto w-16 h-1.5 flex-shrink-0 rounded-full bg-neutral-600" />
            <div className="text-xs">
              <div className="text-neutral-200 mb-4">Legal information</div>
              <div className="leading-5">
                Buka Studio d.o.o.
                <br />
                Design and development
                <br />
                Zagreb, Croatia
              </div>
            </div>
            <div className="text-xs flex flex-col justify-between flex-1 leading-5">
              <div className="[&]:[text-wrap:balance] mb-4">
                The company is registered at the Commercial Court in Zagreb
                under Registration number 081528558 / Identification number
                081528558 / OIB 57408517057
              </div>
              <div className="[&]:[text-wrap:balance]">
                Share capital of the company of 2.500,00 eur has been paid in
                full. Erste&Steiermärkische Bank d.d.,Jadranski trg 3A, 51000
                Rijeka, IBAN HR8724020061101179225. Board Member: Marijana
                Pavlinić
              </div>
            </div>
            <div className="text-xs">
              <div className="text-neutral-200 mb-4">Contact</div>
              <div className="leading-5">
                <a
                  href="mailto:hello@buka.studio"
                  className="hover:text-neutral-200 transition-colors duration-200"
                >
                  hello@buka.studio
                </a>
                <br />
                <a
                  href="https://marijanapav.com"
                  className="hover:text-neutral-200 transition-colors duration-200"
                >
                  marijanapav.com
                </a>
                <br />
                <a
                  href="https://rpavlini.com"
                  className="hover:text-neutral-200 transition-colors duration-200"
                >
                  rpavlini.com
                </a>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
