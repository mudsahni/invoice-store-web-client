import type {Config} from "tailwindcss";

export default {
    darkMode: ['selector'],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                dots: {
                    '0%, 20%': {content: '""'},
                    '40%': {content: '"."'},
                    '60%': {content: '".."'},
                    '80%': {content: '"..."'},
                    '100%': {content: '"...."'},
                },
                'bounce-x': {
                    '0%, 100%': {transform: 'translateX(0)'},
                    '50%': {transform: 'translateX(25%)'}
                },
                wave: {
                    '0%': {transform: 'translateY(0)'},
                    '50%': {transform: 'translateY(-6px)'},
                    '100%': {transform: 'translateY(0)'}
                },
            },
            animation: {
                'wave-1': 'wave 1s ease-in-out',
                'wave-2': 'wave 1s ease-in-out 0.2s',
                'wave-3': 'wave 1s ease-in-out 0.4s',
                'bounce-x': 'bounce-x 1s infinite',
                dots: 'dots 2s steps(4, end) infinite',
            },
            colors: {
                'cream': '#F4F2ED',
                'graphite-a': '#242424',
                'graphite-b': '#252525',
                'graphite-c': '#262626',
                'graphite-d': '#272727',
                'graphite-e': '#282828',
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
