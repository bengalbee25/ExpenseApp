/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effdf5', 100:'#d9fbe7', 200:'#b3f4d0', 300:'#83e8b2',
          400:'#4fd491', 500:'#22c07d', 600:'#16a36a', 700:'#147f55',
          800:'#135f43', 900:'#0f4d37'
        }
      },
      boxShadow: { soft: '0 10px 25px rgba(0,0,0,0.07)' }
    },
  },
  plugins: [],
}
