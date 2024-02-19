import { Metadata } from "next";
import { Cormorant, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "./util";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Buka Studio",
  description: "Design and Development Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className={cn(inter.variable, cormorant.variable, "font-sans")}>
        {children}
      </body>
    </html>
  );
}
