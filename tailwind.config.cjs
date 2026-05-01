module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E2A78',
        danger: '#E11C2A',
        secondary: '#5A2D82',
        neutral: '#2E2E2E',
        white: '#FFFFFF',
        logoRed: '#FF2D2D', // Bright red from DOJ logo
        // Override orange palette so existing orange-* classes map to the new brand palette
        orange: {
          50: '#FFF5F5',
          100: '#FFE8E8',
          200: '#FFD1D1',
          300: '#FFA3A3',
          400: '#FF5555',
          500: '#FF2D2D', // Updated to logo red
          600: '#E41C1C',
          700: '#CC1919',
          800: '#991212',
          900: '#660D0D',
        }
      }
    },
  },
  plugins: [],
}
