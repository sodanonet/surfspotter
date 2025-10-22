/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [], // Will be overridden in each app
  theme: {
    extend: {
      colors: {
        // Ocean/Water colors
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Wave/Cyan accent
        wave: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        // Sand/Beach
        sand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
        },
        // Sunset/Warning
        sunset: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
      // Mobile-first breakpoints (default Tailwind)
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Surf-specific spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Border radius for surf aesthetic
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        surfspotter: {
          'primary': '#0ea5e9',           // Ocean blue
          'primary-content': '#ffffff',
          'secondary': '#06b6d4',         // Wave cyan
          'secondary-content': '#ffffff',
          'accent': '#f97316',            // Sunset orange
          'accent-content': '#ffffff',
          'neutral': '#1e293b',           // Dark slate
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',          // White background
          'base-200': '#f8fafc',          // Light gray
          'base-300': '#e2e8f0',          // Medium gray
          'base-content': '#1e293b',      // Dark text
          'info': '#0ea5e9',              // Ocean blue
          'info-content': '#ffffff',
          'success': '#10b981',           // Green
          'success-content': '#ffffff',
          'warning': '#fbbf24',           // Sand yellow
          'warning-content': '#1e293b',
          'error': '#ef4444',             // Red
          'error-content': '#ffffff',
        },
      },
      'light',
      'dark',
    ],
  },
}
