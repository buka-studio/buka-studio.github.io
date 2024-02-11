import { AnimationPlaybackControls, stagger, useAnimate } from "framer-motion";
import { ComponentProps, useRef } from "react";
import PointerIcon from "../../../../../public/cmdtab/pointer.svg";
import SelectIcon from "../../../../../public/cmdtab/select.svg";
import { mockTabs } from "../../constants";
import BentoCard from "./BentoCard";
import TabItem from "./TabItem";

export default function WorkflowCard({
  className,
  ...props
}: ComponentProps<"div">) {
  const [scope, animate] = useAnimate();
  const animation = useRef<AnimationPlaybackControls | null>(null);
  const hovering = useRef(false);

  const onMouseEnter = async () => {
    if (hovering.current || animation.current) {
      return;
    }
    hovering.current = true;

    async function animateWorkflow() {
      if (!hovering.current) {
        return;
      }

      const mainAnimation = animate([
        [".select", { width: "20px", height: "20px" }, { duration: 0.25 }],
        [
          ".select",
          { width: "150px", height: "150px" },
          { duration: 0.75, type: "spring" },
        ],

        [".select-overlay", { opacity: 1 }, { at: "<" }],
        [
          ".tab",
          { background: "#232120", border: "1px solid #46403F" },
          { delay: stagger(0.15), at: "-0.5" },
        ],
        [".tag", { opacity: 1 }, { delay: stagger(0.1), at: "+0.3" }],
        [".select", { opacity: 0 }],
        [
          ".tab",
          { y: "-100%", opacity: 0 },
          { delay: stagger(0.07), at: "<", duration: 0.3 },
        ],
      ]);
      animation.current = mainAnimation;

      mainAnimation.then(() =>
        animate([
          [".tab", { opacity: 0, y: "100%" }, { duration: 0 }],
          [
            ".tab",
            {
              y: 0,
              background: "#1A1A1A",
              border: "1px solid #2A2726",
              opacity: 1,
            },
            {
              delay: stagger(0.1),
            },
          ],
          [".tag", { opacity: 0 }, { duration: 0 }],
          [".select", { height: "0px", width: "0px" }, { duration: 0 }],
          [".select", { opacity: 1 }],
        ]).then(() => {
          animation.current = null;

          setTimeout(() => animateWorkflow(), 1000);
        })
      );
    }

    animateWorkflow();
  };

  const onMouseLeave = () => {
    hovering.current = false;
  };

  return (
    <BentoCard
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
      illustration={
        <div className="relative overflow-hidden h-full">
          <div className="tabs flex flex-col gap-2 relative right-[-100px] top-[30px]">
            {mockTabs.slice(0, 3).map((tab) => (
              <TabItem key={tab.link} tab={tab} />
            ))}
          </div>
          <div className="overlay absolute h-full right-0 w-12 top-0 bg-[linear-gradient(90deg,transparent,#171717)]" />
          <div className="select absolute top-5 left-5">
            <div className="select-overlay border-[#FF7A2B] bg-[#ea5a0c1a] w-full h-full border opacity-0" />
            <PointerIcon className="absolute bottom-[-20px] right-[-20px]" />
          </div>
        </div>
      }
      ref={scope}
    >
      <div>
        <h3 className="font-mono uppercase flex items-center gap-2 text-sm mb-2">
          <SelectIcon /> Efficient Workflow
        </h3>
        <p className="text-balance text-neutral-400 text-left">
          Organize and manage your workflow with multi-select and tagging
          capabilities.
        </p>
      </div>
    </BentoCard>
  );
}
