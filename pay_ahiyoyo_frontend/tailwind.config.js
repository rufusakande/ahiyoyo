/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fdc354",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('preline/plugin'),
  ],
}