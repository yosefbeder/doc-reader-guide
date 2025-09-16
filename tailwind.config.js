/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": {
            left: "-16px",
          },
          "75%": {
            left: "110%",
          },
          "100%": {
            left: "110%",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
