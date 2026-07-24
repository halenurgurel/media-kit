import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/Toaster";
import { inter, playfairDisplay, poppins, dmSans } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Media Kit Builder",
  description: "Create a stunning media kit to land brand deals as an Instagram creator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} ${poppins.variable} ${dmSans.variable}`}
    >
      <body className="bg-cream-50 text-charcoal-900 antialiased font-sans">
        <Providers>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
