/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cs-black': '#000000',
                'cs-dark': '#111111',
                'cs-border': '#222222',
                'cs-text-primary': '#FFFFFF',
                'cs-text-secondary': '#777777',
                'cs-accent': '#6ba9d5',
                'cs-vip': '#C5A059'
            }
        },
    },
    plugins: [],
}