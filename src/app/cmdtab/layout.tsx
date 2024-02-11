import { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "CmdTab Browser Extension",
  description:
    "CmdTab is a tab management Chrome extension with a simple & clean UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${jetbrains.variable}`}>{children}</div>;
}
