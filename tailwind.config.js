/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dodgy Ducks brand palette
        primary: '#0077C8', // duck blue
        secondary: '#0B1F3A', // deep-water navy
        accent: '#FFD100', // duck yellow (pair with text-ink)
        splash: '#1EB4F0', // light water blue
        ink: '#0A0A0A', // logo black
      },
      fontFamily: {
        display: ['"Permanent Marker"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
