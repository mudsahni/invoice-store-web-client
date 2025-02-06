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
                'bounce-x': 'bounce-x 1s infinite'
            },
            colors: {
                // Light background
                'theme-bg': '#FAFAFA',

                // Dark text
                'theme-text': '#2E2E2E',

                // Primary Blue
                'primary': {
                    DEFAULT: '#2C7BE5',
                    '50': '#EBF2FD',
                    '100': '#D7E6FB',
                    '200': '#B0CDF8',
                    '300': '#88B5F5',
                    '400': '#619CF3',
                    '500': '#2C7BE5', // main
                    '600': '#2564BC',
                    '700': '#1D4E92',
                    '800': '#143768',
                    '900': '#0C203F',
                },

                // Vibrant Green
                'secondary': {
                    DEFAULT: '#48BB78',
                    '50': '#F0FBF5',
                    '100': '#DCF7EA',
                    '200': '#B9EFD5',
                    '300': '#96E7C0',
                    '400': '#72DFAA',
                    '500': '#48BB78', // main
                    '600': '#38925E',
                    '700': '#286944',
                    '800': '#18402A',
                    '900': '#081710',
                },

                // Alert Red
                'tertiary': {
                    DEFAULT: '#E53E3E',
                    '50': '#FCEBEA',
                    '100': '#F8D8D7',
                    '200': '#F0B2AF',
                    '300': '#E98D87',
                    '400': '#E1675F',
                    '500': '#E53E3E', // main
                    '600': '#BC3232',
                    '700': '#932625',
                    '800': '#6A1A19',
                    '900': '#410E0D',
                },

                // Subtle Purple
                'eccentric': {
                    DEFAULT: '#805AD5',
                    '50': '#F3EDFD',
                    '100': '#E7DCFB',
                    '200': '#D0BBF7',
                    '300': '#B89AF3',
                    '400': '#A179EE',
                    '500': '#805AD5', // main
                    '600': '#6648AA',
                    '700': '#4C3680',
                    '800': '#322455',
                    '900': '#18122B',
                },
                black: {
                    800: '#000'
                },
                dirtywhite: {
                    100: '#E7E7E7'
                }
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
