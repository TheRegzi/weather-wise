/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'opensans': ['Open Sans', 'Helvetica', 'sans-serif'],
        'roboto': ['Roboto', 'Arial', 'sans-serif'],
        'inter': ['Inter', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
}
}
