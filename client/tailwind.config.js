/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4F46E5', // Indigo-600
                    light: '#6366F1',   // Indigo-500
                    dark: '#4338CA',    // Indigo-700
                },
                secondary: {
                    DEFAULT: '#06B6D4', // Cyan-500
                    light: '#22D3EE',   // Cyan-400
                    dark: '#0891B2',    // Cyan-600
                },
                accent: {
                    DEFAULT: '#7C3AED', // Violet-600
                    light: '#8B5CF6',   // Violet-500
                    dark: '#6D28D9',    // Violet-700
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
