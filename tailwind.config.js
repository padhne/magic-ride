/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4: content paths must cover all source files with className usage
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  // NativeWind v4 preset — adds the RN-compatible theme and plugins
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Brand colors ──────────────────────────────────────────────────────
      colors: {
        primary: {
          DEFAULT: '#1A1A2E',
          50:  '#E8E8F5',
          100: '#C5C5E8',
          200: '#9F9FD8',
          300: '#7878C9',
          400: '#5656BB',
          500: '#3A3AAE',
          600: '#2E2E9A',
          700: '#222285',
          800: '#1A1A6F',
          900: '#0D0D55',
        },
        accent: {
          DEFAULT: '#00D09C',
          50:  '#E0FBF5',
          100: '#B3F5E4',
          200: '#80EDD1',
          300: '#4DE5BE',
          400: '#26DEAE',
          500: '#00D09C',
          600: '#00B888',
          700: '#009C72',
          800: '#007F5C',
          900: '#005F44',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1C1C2E',
        },
        background: {
          DEFAULT: '#F4F4F8',
          dark: '#0F0F1A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#252538',
        },
        muted: {
          DEFAULT: '#8E8E9A',
          dark: '#6B6B80',
        },
        border: {
          DEFAULT: '#E4E4EF',
          dark: '#2E2E45',
        },
        success: '#22C55E',
        danger:  '#EF4444',
        warning: '#F59E0B',
        info:    '#3B82F6',
      },

      // ── Border radius ──────────────────────────────────────────────────────
      borderRadius: {
        card:  '20px',
        sheet: '28px',
        btn:   '14px',
        pill:  '999px',
      },

      // ── Spacing additions (on top of Tailwind's 4px grid) ────────────────
      spacing: {
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
        '22':  '88px',
        '26':  '104px',
        '30':  '120px',
      },

      // ── Font sizes ─────────────────────────────────────────────────────────
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
      },
    },
  },
  plugins: [],
};
