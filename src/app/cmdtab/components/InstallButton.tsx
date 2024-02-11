import { ReactNode } from "react";
import { cn } from "~/app/util";

export default function InstallButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus-visible:ring-2 ring-[#ea154c]",
        className
      )}
      href="https://chromewebstore.google.com/detail/cmdtab/cnhamlcjfdekdinhkfmllfdjamcncbkl"
      target="_blank"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f27239_0%,#ea154c_50%,#f27239_100%)]" />
      <span
        className={
          "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#121212] px-8 py-1 text-sm font-medium text-neutral-200 backdrop-blur-3xl"
        }
      >
        {children}
      </span>
    </a>
  );
}
