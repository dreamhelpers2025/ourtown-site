/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff6ec',
          100: '#ffe7c9',
          200: '#ffcd92',
          300: '#ffaa55',
          400: '#fb8c2e',
          500: '#ec6f10',
          600: '#cf5708',
          700: '#a8420a',
          800: '#85360f',
          900: '#6b2d10',
        },
        accent: {
          50:  '#f1f7f4',
          100: '#dcebe3',
          200: '#bcd9c9',
          300: '#8fbfa6',
          400: '#5fa382',
          500: '#3f8866',
          600: '#2f6c51',
          700: '#275743',
          800: '#214637',
          900: '#1c3a2e',
        },
        ink: {
          DEFAULT: '#1a1410',
          soft: '#574a40',
        },
        cream: '#fbf6ee',
        sand: '#f3ebdc',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [],
};
