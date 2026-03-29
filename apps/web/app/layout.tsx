import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { FirebaseProvider } from "@/components/FirebaseProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "BASH | Premium Editorial E-Commerce",
  description: "Curated minimalism for the modern collector.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased font-sans bg-white text-black">
        <FirebaseProvider>
          {children}
          <Toaster position="bottom-right" />
        </FirebaseProvider>
      </body>
    </html>
  );
}
