import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Apple-style typography config
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  // Tighter tracking for that premium "San Francisco" feel
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "User Journey Builder - AI-Powered Journey Mapping",
  description: "Transform product ideas into visual user journey diagrams with AI",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased selection:bg-blue-500/30 selection:text-blue-600`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
