import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Deal Hunter · UK BMV BRRR",
  description:
    "Personal UK below-market-value deal hunter for Liverpool & Manchester — bedroom conversion + BRRR refinance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={cn("font-sans", geistSans.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <TooltipProvider>
          <Header />
          <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-[1600px]">{children}</main>
          <Toaster richColors position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
