"use client";

import { motion, MotionProps } from "framer-motion";
import { ComponentProps } from "react";

const groupProps: Partial<MotionProps> = {
  variants: {
    initial: { pathLength: 0, opacity: 0 },
    animate: (custom: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 1.1 * custom,
      },
    }),
  },
  initial: "initial",
  whileInView: "animate",
  viewport: { once: true },
};

const pathProps: Partial<MotionProps> = {
  variants: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
  },
  transition: { duration: 0.3, opacity: { duration: 0 }, ease: "easeInOut" },
};

export default function AnimatedSignature({
  className,
}: {
  className?: string;
}) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="2986"
      height="427"
      viewBox="0 0 2986 427"
      fill="none"
      strokeWidth="20"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <Marijana {...groupProps} custom={0} pathProps={pathProps} />
      <Ampersand {...groupProps} custom={2.5} pathProps={pathProps} />
      <Robert {...groupProps} custom={3.5} pathProps={pathProps} />
      <Smiley {...groupProps} custom={5.5} pathProps={pathProps} />
    </motion.svg>
  );
}

type SignatureProps = ComponentProps<typeof motion.g> & {
  pathProps?: ComponentProps<typeof motion.path>;
};

const Ampersand = ({ pathProps, ...props }: SignatureProps) => {
  return (
    <motion.g {...props}>
      <motion.path
        d="M1634.12 268.373C1557.08 230.104 1436.96 156.187 1407.72 69.2505C1391.98 22.4374 1453.91 0.126242 1473.91 22.4381C1518.89 72.8383 1370.43 133.724 1375.29 228.732C1381.52 350.592 1543 273.122 1557.88 157.031C1560.92 133.281 1551.59 107.425 1551.59 107.425C1551.59 107.425 1595.85 114.79 1611.95 102.659"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
    </motion.g>
  );
};

const Marijana = ({ pathProps, ...props }: SignatureProps) => {
  console.log(props, pathProps);
  return (
    <motion.g {...props}>
      <motion.path
        d="M29.4927 147.882C29.4927 147.882 37.929 174.477 41.8282 187.838C49.2721 213.47 54.1638 243.02 54.2347 269.165"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M13.5 119.931C31.188 147.586 60.369 204.877 100.005 201.7C130.318 199.299 174.989 80.3547 178.699 82.198C182.453 84.0753 181.731 249.501 242.664 249.356"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M320.823 126.989C306.337 99.0489 232.517 147.937 256.981 210.219C289.23 278.062 351.65 203.621 346.136 137.157C346.136 116.503 344.62 111.987 344.62 111.987C325.416 150.546 369.706 233.426 410.786 239.202"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M401.177 99.916C428.467 126.993 433.107 180.275 438.718 234.581C439.53 242.431 440.306 254.727 440.306 254.727C430.704 223.763 426.189 165.951 446.299 138.205C469.041 106.723 523.188 134.306 540.732 111.633C542.825 108.889 545.352 102.318 545.352 102.318C545.352 102.318 541.165 113.51 540.732 119.359C537.219 161.998 550.796 283.829 608.649 215.946"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M574.359 79.188L571.182 69.873"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M670.593 86.7656C648.549 89.8788 630.657 104.496 638.143 153.197C643.415 187.49 698.304 379.715 655.937 404.402C596.967 438.763 562.876 365.845 585.979 319.416C619.984 250.892 651.455 225.211 713.183 178.638"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M800.547 132.036C765.879 106.239 702.921 209.982 759.712 240.488C793.717 257.384 818.48 192.398 823.029 167.487C823.462 165.176 825.411 144.577 823.029 144.577C809.257 144.577 821.365 267.788 905.26 212.183"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M919.049 111.165C899.792 110.186 927.071 167.049 931.985 184.563C936.1 199.233 938.786 229.991 934.721 223.874C907.108 182.323 931.915 105.689 983.968 121.503C1020.21 132.55 1026.49 228.152 1069.38 206.562C1092.84 194.72 1172.05 86.5337 1103.24 115.004C1054.88 139.281 1039.99 210.822 1089.59 228.152C1129.96 237.369 1143.13 143.874 1143.13 143.874C1143.13 140.897 1144.86 210.994 1193.41 221.725"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
    </motion.g>
  );
};

const Robert = ({ pathProps, ...props }: SignatureProps) => {
  return (
    <motion.g {...props}>
      <motion.path
        d="M1803.65 58.6306C1778.54 50.3558 1827.59 238.807 1826.8 240.324C1826.44 241.046 1814.69 202.517 1814.18 200.929C1807.54 181.289 1801 153.736 1800.93 133.301C1800.78 84.0563 1859.91 34.5228 1909.15 47.8089C1978.24 66.4382 1841.67 169.085 1827.01 150.101C1821.64 140.928 1886.99 158.645 1895.51 160.956C1957.02 177.564 2022.58 192.677 2053.92 129.569C2065.32 106.599 2017.38 105.741 2005.91 148.271C1991.26 222.032 2083.88 233.041 2114.49 202.209C2175.85 140.545 2039.25 65.324 2005.91 129.569"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />

      <motion.path
        d="M2166.55 42.0908C2160.52 43.2573 2158.61 47.2652 2157.94 48.638C2148.3 68.4138 2190.32 185.759 2192.45 212.836C2193.07 220.096 2193.75 237.845 2183.21 223.667C2158.09 190.452 2186.1 109.271 2249.35 122.166C2318.12 140.747 2313.87 195.76 2264.77 215.974C2229.6 230.457 2170.92 223.476 2159.71 203.976C2152.1 190.728 2166.73 176.611 2207.8 184.198C2288 199.013 2388.27 203.986 2411.67 117.194C2426.32 62.9664 2349.41 84.8856 2336.34 133.408C2320.87 190.843 2362.94 229.231 2403.58 221.722C2425.17 217.75 2450.06 200.065 2468.1 164.096"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M2498.86 113.151C2483.28 93.1164 2502.61 242.223 2518.77 232.119C2531.34 227.931 2467.8 48.209 2572.63 100.27"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M2589.46 19.6855C2589.46 19.6855 2593.28 54.7782 2594.29 72.3244C2595.26 89.2711 2613.16 292.347 2653.89 221.433"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M2557.25 131.317C2532.37 113.407 2653.35 121.786 2670.31 121.714"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
    </motion.g>
  );
};

const Smiley = ({ pathProps, ...props }: SignatureProps) => {
  return (
    <motion.g {...props}>
      <motion.path
        d="M2852.93 100.243C2858.94 97.4924 2874.69 100.243 2880.4 102.111"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M2969.28 111.679L2950.65 110.163"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
      <motion.path
        d="M2859.38 155.64C2854.91 164.719 2857.84 196.653 2870.98 211.311C2904.12 248.425 2972.67 223.382 2972.53 175.22"
        stroke="hsl(var(--color-brand))"
        {...pathProps}
      />
    </motion.g>
  );
};
