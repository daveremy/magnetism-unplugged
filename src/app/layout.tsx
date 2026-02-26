import type { ReactElement, ReactNode } from "react";
import type { Metadata } from "next";
import { Source_Serif_4, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Navigation } from "@/components/ui/Navigation";
import { getAllModules } from "@/lib/modules";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Magnetism Unplugged",
  description:
    "An interactive course on magnetism for learners with no physics or math background.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const modules = getAllModules();

  return (
    <html lang="en">
      <body
        className={`${sourceSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <Navigation modules={modules} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
