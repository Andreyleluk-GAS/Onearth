/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#dce8f2',
          200: '#bcd4e6',
          300: '#8fb8d5',
          400: '#5c96c0',
          500: '#3878ab',
          600: '#235e91',
          700: '#174a75',
          800: '#0b3d66', // Primary client brand blue
          900: '#072b49',
          950: '#041c31',
        },
        navy: {
          DEFAULT: '#0b3d66',
          dark: '#072640',
          light: '#13538a',
        },
        accent: {
          DEFAULT: '#e6a417',
          hover: '#d2930f',
          light: '#fff7e6',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#e6a417',
          600: '#d97706',
          700: '#b45309',
        },
        surface: {
          bg: '#f6f8fa',
          card: '#ffffff',
          border: '#e3e8ee',
        },
        ink: {
          DEFAULT: '#1d2733',
          muted: '#526071',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
