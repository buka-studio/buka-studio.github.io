"use client";

import { useState } from "react";
import Logo from "./Logo";
import MousePositionVarsSetter from "./MousePositionVarsSetter";

const sections = ["legal", "contact"] as const;
type Section = (typeof sections)[number];

export default function Footer() {
  const [section, setSection] = useState<Section>();

  return (
    <footer className="absolute bottom-8 flex flex-col gap-4 text-center font-regular text-xs leading-5 tracking-[0.03125rem] max-w-4xl mt-5 opacity-60">
      <div className="flex gap-8 justify-center">
        <button
          className="flex items-left text-xs"
          onClick={() => setSection("legal")}
        >
          Legal
        </button>
        <button
          className="flex items-left text-xs"
          onClick={() => setSection("contact")}
        >
          Contact
        </button>
      </div>
      {section && (
        <div className="pt-8 border-t border-t-neutral-700">
          {section === "legal" && (
            <div>
              Legal information / Buka Studio d.o.o. Dubravica 6, 10090 Zagreb /
              Društvo je upisano u sudski registar trgovačkog suda u Zagrebu,
              pod brojem 081528558, Matični broj 081528558, OIB 57408517057.
              Temeljni kapital društva iznos 2.500,00 eur i uplaćen je u
              cijelosti. / Račun otvoren u Erste&Steiermärkische Bank d.d.,
              Jadranski trg 3A, 51000 Rijeka, IBAN HR8724020061101179225 / Član
              uprave: Marijana Šimag
            </div>
          )}
          {section === "contact" && <div>hello@buka.studio</div>}
        </div>
      )}
    </footer>
  );
}
