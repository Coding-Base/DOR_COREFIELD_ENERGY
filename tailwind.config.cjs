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
        // Override orange palette so existing orange-* classes map to the new brand palette
        orange: {
          50: '#FFFFFF',
          100: '#F7F7FA',
          200: '#EDECF6',
          300: '#D4D2F0',
          400: '#9C8FE6',
          500: '#1E2A78',
          600: '#5A2D82',
          700: '#E11C2A',
          800: '#1B234F',
          900: '#16183A',
        }
      }
    },
  },
  plugins: [],
}
