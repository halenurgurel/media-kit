import { Inter, Playfair_Display, Poppins, DM_Sans } from "next/font/google";

// "latin-ext" is required alongside "latin": bios and other user text are
// often in Turkish, and without it characters like ş, ğ, ı, İ, ö, ü, ç fail
// to render (or collapse/disappear) in these fonts.
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});
