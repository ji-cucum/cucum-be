/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./view/*.{ejs}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ['group-hover']
    },
  },
  plugins: [],
}
