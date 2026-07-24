import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: {
          50: "#FAF7F4",
          100: "#F0EBE5",
          200: "#E3D9D0",
        },
        charcoal: {
          900: "#2C2420",
          600: "#8C7A70",
          400: "#B5A89E",
        },
        mauve: {
          50: "#F2EBF0",
          200: "#D4B8CE",
          400: "#B08BA8",
          600: "#9A7394",
          800: "#7D5E7A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair-display)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
