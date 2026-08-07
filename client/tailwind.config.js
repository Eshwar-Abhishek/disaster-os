/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        arsenic: '#4D2308',
        chestnut: '#55443A',
        morning: '#8A9992',
        almond: '#CFD0CD',
        primary: {
          dark: '#4D2308',
          brown: '#55443A',
          DEFAULT: '#55443A',
        },
        secondary: {
          accent: '#8A9992',
          DEFAULT: '#8A9992',
        },
        surface: {
          light: '#CFD0CD',
          card: '#55443A',
          dark: '#4D2308',
          DEFAULT: '#CFD0CD',
        },
        navy: {
          DEFAULT: '#4D2308',
          50: '#F5F5F4',
          100: '#E5E6E4',
          200: '#CFD0CD',
          300: '#B0B4B1',
          400: '#8A9992',
          500: '#6C7A74',
          600: '#55443A',
          700: '#4D2308',
          800: '#3D1C06',
          900: '#4D2308',
          950: '#2A1304',
        },
        brand: {
          DEFAULT: '#55443A',
          light: '#8A9992',
          dark: '#4D2308',
          50: '#F2F3F1',
          100: '#CFD0CD',
          500: '#55443A',
          600: '#4D2308',
          700: '#3D1C06',
        },
        sage: {
          DEFAULT: '#8A9992',
          light: '#CFD0CD',
          dark: '#55443A',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#DC2626',
          info: '#8A9992',
        },
      },
      borderRadius: {
        'card': '20px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.15)',
        'glow-sage': '0 0 20px rgba(132, 169, 140, 0.15)',
        'elevated': '0 20px 60px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'strobe': 'strobe 0.2s infinite alternate',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        strobe: {
          '0%': { opacity: '0.1' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
