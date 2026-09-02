/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070D14",
        "ink-deep": "#04080D",
        panel: "#0D1A2D",
        "panel-card": "#11223B",
        "panel-hover": "#172E4F",
        signal: "#00F5A0",
        "signal-dark": "#00C982",
        cyan: "#00D2FF",
        alert: "#FF4D4D",
        mist: "#8FA6C1",
        "mist-light": "#B5C8DC",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-signal": "0 0 20px -3px rgba(0, 245, 160, 0.35)",
        "glow-cyan": "0 0 20px -3px rgba(0, 210, 255, 0.35)",
        "glow-alert": "0 0 20px -3px rgba(255, 77, 77, 0.35)",
        "glow-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
