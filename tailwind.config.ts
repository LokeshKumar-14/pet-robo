import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        card: "hsl(var(--card))",
        primary: "hsl(var(--primary))",
        cyan: "#68e8ff",
        lime: "#a7ff68",
        danger: "#ff4d6d",
        ink: "#05070a"
      },
      boxShadow: {
        glow: "0 0 40px rgba(104, 232, 255, 0.18)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.34)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [animate]
};

export default config;
