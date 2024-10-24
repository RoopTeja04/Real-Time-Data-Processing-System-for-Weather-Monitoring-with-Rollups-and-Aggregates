module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],  // Ensures only used classes are included in the production build
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
