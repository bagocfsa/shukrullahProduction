/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefdf8',
          100: '#fef9e7',
          200: '#fef0c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#f59e0b', // Golden amber - main brand color
          600: '#d97706', // Deeper amber
          700: '#b45309', // Rich golden brown
          800: '#92400e', // Dark amber
          900: '#78350f', // Deep brown
        },
        secondary: {
          50: '#fdf8f3',
          100: '#faf0e4',
          200: '#f4dfc4',
          300: '#ecc89b',
          400: '#e2a96f',
          500: '#d4924a', // Groundnut shell color
          600: '#c17d3e',
          700: '#a16535',
          800: '#825230',
          900: '#6b4429',
        },
        groundnut: {
          50: '#fdf8f3',
          100: '#faf0e4',
          200: '#f4dfc4',
          300: '#ecc89b',
          400: '#e2a96f',
          500: '#d4924a', // Groundnut shell color
          600: '#c17d3e',
          700: '#a16535',
          800: '#825230',
          900: '#6b4429',
        },
        oil: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Golden oil color
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        earth: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#e8ddd0',
          300: '#d6c4a9',
          400: '#c2a67f',
          500: '#b08d5b', // Earth brown
          600: '#9a7548',
          700: '#7f5f3c',
          800: '#684f34',
          900: '#56422d',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}
