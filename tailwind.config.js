/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tahoe: {
          blue: '#007AFF',
          purple: '#AF52DE',
          pink: '#FF2D55',
          glass: 'rgba(255, 255, 255, 0.15)',
          'glass-dark': 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(255, 255, 255, 0.25)',
          accent: '#0A84FF'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Inter"', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', 'monospace']
      },
      backdropBlur: {
        xs: '4px',
        glass: '24px',
        heavy: '40px'
      },
      boxShadow: {
        'liquid': '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.15)',
        'dock': '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
        'window': '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.2)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}
