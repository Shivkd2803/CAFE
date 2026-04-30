export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coffee: { 50: '#FFF8E1', 100: '#F5EDE0', 200: '#E8DCC9', 300: '#D7CCC8', 400: '#A1887F', 500: '#6D4C41', 600: '#5D4037', 700: '#4E342E', 800: '#3E2723', 900: '#2A1A17' },
        cream: '#FFF8E1',
        beige: '#D7CCC8'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Playfair Display"', 'serif']
      },
      backdropBlur: { xs: '2px' }
    }
  },
  plugins: []
};