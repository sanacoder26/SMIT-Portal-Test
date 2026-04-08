export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#4B9CD3', /* SMIT cap light blue */
          500: '#2563eb',
          600: '#1e3a8a', /* SMIT text dark blue */
          700: '#172554',
        },
        accent: {
          500: '#8DC63F', /* SMIT green accent */
          600: '#7ab332',
        }
      }
    },
  },
  plugins: [],
}
