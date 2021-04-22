module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: {
      primary: '#f3f3f3'
    },
    extend: {
      width: {
        paper: '8.5in'
      },
      height: {
        paper: '11in'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
