import { ComponentProps, ReactNode, forwardRef } from "react";
import { cn } from "~/app/util";

const BentoCard = forwardRef<
  HTMLDivElement,
  ComponentProps<"div"> & { illustration?: ReactNode }
>(function BentoCard({ className, illustration, children, ...props }, ref) {
  return (
    <div
      className={cn("relative rounded-[22px] p-[1px] shadow-card", className)}
    >
      <div
        className={cn(
          "border border-[#2F2E2E] p-6 flex flex-col gap-10 bg-[#171717] rounded-2xl h-[414px] relative-mouse relative z-[1] [&_>*]:opacity-1 overflow-hidden"
        )}
        ref={ref}
        {...props}
      >
        <div className="illustration flex-1">{illustration}</div>
        <div className="description mt-auto">{children}</div>
      </div>
      <div
        className={cn(
          "absolute inset-0 rounded-[17px] bg-white opacity-30 relative-mouse mouse-border transition-opacity duration-500 [&]:[mask-image:radial-gradient(40%_40%_at_var(--mouse-x,9999px)_var(--mouse-y,9999px),black_45%,transparent)]"
        )}
      />
    </div>
  );
});

export default BentoCard;
