/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B4CCA',
          light: '#5C6EEE',
          dark: '#2A3AA9',
        },
        secondary: {
          DEFAULT: '#7E57C2',
          light: '#9E77E2',
          dark: '#5E35A2',
        },
        accent: {
          DEFAULT: '#FFD700',
          light: '#FFE54C',
          dark: '#CCA900',
        },
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        '3d': '0 15px 35px rgba(0, 0, 0, 0.2)',
        'inner-3d': 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};