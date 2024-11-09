/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        pink: '#fc428fff',
        pink_1: '#f5ebedff',
        pink_2: '#ff8080',
        pink_3: '#f5a4a4',
        yellow: '#fff0f0'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif']
      },
      keyframes: {
        customAnimation: {
          '0%': { transform: 'scale(0.75) rotate(-6deg)' },
          '25%': { transform: 'scale(1.1) rotate(-6deg)' },
          '50%': { transform: 'scale(1.1) rotate(6deg)' },
          '75%': { transform: 'scale(1.1) rotate(-6deg)' },
          '100%': { transform: 'scale(1.1s) rotate(6deg)' }
        },
        Animationcat: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(60px))' },
          '50%': { transform: 'translateX(80px)' }
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        customAnimation: 'customAnimation 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        Animationcat: 'Animationcat 3s steps(3, end) infinite',
        marquee: 'marquee 10s linear infinite'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.8xl'),
          // marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    }),
    require('@tailwindcss/line-clamp')
  ]
}
