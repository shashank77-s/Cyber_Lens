/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F5FAF7",
        "ink-deep": "#EAF6EF",
        panel: "#F0F9F4",
        "panel-card": "#FFFFFF",
        "panel-hover": "#ECFDF5",
        signal: "#8EE7A8",
        "signal-dark": "#5BCB7A",
        cyan: "#7AD8C7",
        alert: "#F28B7D",
        mist: "#4F6475",
        "mist-light": "#3A4F5F",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-signal": "0 12px 30px -10px rgba(92, 203, 122, 0.38)",
        "glow-cyan": "0 12px 30px -10px rgba(122, 216, 199, 0.35)",
        "glow-alert": "0 12px 30px -10px rgba(242, 139, 125, 0.35)",
        "glow-card": "0 20px 50px -20px rgba(24, 39, 32, 0.18)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float": "floatOrb 8s ease-in-out infinite alternate",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px) scale(0.97)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        floatOrb: {
          from: { transform: "translate(0, 0) scale(1)" },
          to:   { transform: "translate(30px, -20px) scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};
