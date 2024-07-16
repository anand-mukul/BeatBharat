import type { Metadata } from "next";
import { DM_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BeatBharat",
  description: "Discover the Pulse of Indian Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "relative h-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProviderWrapper>
            <main className="relative flex flex-col min-h-screen">
              {children}
            </main>
            <Toaster richColors />
          </AuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
