/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skysoft: {
          50: "#f2f8fc",
          100: "#e4f1fa",
          200: "#c7e0f2",
          300: "#a3cceb",
          400: "#7eb7e3",
          500: "#5da3db",
          600: "#3e8ecf",
          700: "#2f6fa5",
        },
        cloud: {
          white: "rgba(255,255,255,0.7)",
          glass: "rgba(255,255,255,0.45)",
        },
      },
    },
  },
  plugins: [],
};
