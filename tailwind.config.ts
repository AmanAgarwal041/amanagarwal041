import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        "ink-2": "#141b31",
        paper: "#f3efe6",
        accent: "#4ea8ff",
        "accent-ink": "#0a5bd6",
        sun: "#ffcd03",
        sky: "#2f8ff0",
        deep: "#0b3a8c",
        brick: { red: "#e3000b", blue: "#0a5bd6", green: "#00a650", orange: "#ff8a00", azure: "#3fb4f0" },
        mist: "#d9e9ff",
        tide: "#1f74d6",
        "tide-2": "#2b84e8",
        pastel: "#ffd9c4",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
