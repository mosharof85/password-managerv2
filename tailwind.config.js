/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "#7c5cfc",
        "primary-glow": "rgba(124, 92, 252, 0.35)",
        secondary: "#a78bfa",
        rose: "#f472b6",
        "rose-glow": "rgba(244, 114, 182, 0.35)",
        green: "#34d399",
        "green-glow": "rgba(52, 211, 153, 0.25)",
        red: "#ef4444",
        "red-glow": "rgba(239, 68, 68, 0.3)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
      },
    },
  },
  plugins: [],
}
