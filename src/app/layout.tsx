import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";
import { cn } from "./util";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en" className="" suppressHydrationWarning>
      <body className={cn(inter.variable, "font-sans")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
