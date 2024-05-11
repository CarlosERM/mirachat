import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        c1: "#2879FF",
        c2: "#7CACFB",
        c3: "#9B9B9B",
        c4: "#FFFFFF",
        c5: "#5696FF",
        c6: "#0362FF",
        c7: "#E1ECFF",
        c8: "#BBD4FF",
        c9: "#f1f1f1",
        c10: "#CBDFFF",
        c11: "#1D72FF",
        c12: "#51E869",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
