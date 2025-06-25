import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fdc354", 
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkMode: 'class',

      },
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
} satisfies Config;
