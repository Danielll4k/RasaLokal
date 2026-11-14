/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#51B5E5',
          ocean: '#3FA5D7',
          bg: '#FBFCFD',
          ice: '#EAF7FD',
          text: '#09090B',
          muted: '#9AABB4',
          star: '#EAA22E',
          verified: '#39A979',
          danger: '#B3261E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
