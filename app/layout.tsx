import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Realtime Chat app using Nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} `}
      >
        <ThemeProvider
         attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ConvexClientProvider>
               <TooltipProvider>
                  {children}
               </TooltipProvider>
               <Toaster richColors/>
            </ConvexClientProvider>
        </ThemeProvider>
       
      </body>
    </html>
  );
}
