import type { Config } from "tailwindcss";

export default {
    darkMode: ['selector'],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
    theme: {
        extend: {
            colors: {
                black: {
                    800: '#0E1117'
                },
                dirtywhite: {
                    100: '#E7E7E7'
                }
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
