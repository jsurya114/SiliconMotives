/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#151515', light: '#1f1f1f', mid: '#292929' },
        coral: { DEFAULT: '#727272', hover: '#656565' },
        warm: { white: '#fafafa', gray50: '#f5f5f5', gray100: '#e8e8e8' },
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        heading: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
