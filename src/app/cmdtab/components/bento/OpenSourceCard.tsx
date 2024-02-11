import { ComponentProps } from "react";
import { cn } from "~/app/util";
import Active from "../../../../../public/cmdtab/bento/os-active.svg";
import Base from "../../../../../public/cmdtab/bento/os-base.svg";
import BoxIcon from "../../../../../public/cmdtab/box.svg";
import BentoCard from "./BentoCard";

export default function OpenSourceCard({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <BentoCard
      className={cn(className, "group ")}
      illustration={
        <div className="relative illustration -top-8 logo-illustration group-hover:[&_.logo]:scale-[1.03] [&_.logo]:[transform-origin:center] [&_.logo]:transition-transform [&_.logo]:duration-300">
          <Base className="absolute inset-0 left-[50%] translate-x-[-50%]" />
          <Active className="absolute inset-0 active left-[50%] translate-x-[-50%] transition-opacity duration-500 [&]:[mask-image:radial-gradient(40%_40%_at_var(--mouse-x,9999px)_var(--mouse-y,9999px),black_45%,transparent)]" />
        </div>
      }
    >
      <div>
        <h3 className="font-mono uppercase flex items-center gap-2 text-sm mb-2">
          <BoxIcon /> Open Source
        </h3>
        <p className="text-balance text-neutral-400 text-left">
          Fostering a collaborative environment where users can contribute to
          its development.
        </p>
      </div>
    </BentoCard>
  );
}
