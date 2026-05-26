/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Town Gold — primary brand
        gold: {
          50:  '#fdf9ec',
          100: '#faf0c8',
          200: '#f5e293',
          300: '#efd061',
          400: '#e8b63e',
          500: '#d99e23',
          600: '#bb7e1a',
          700: '#965e18',
          800: '#7a4a1b',
          900: '#673e1c',
        },
        // Community Navy
        navy: {
          50:  '#eef4fb',
          100: '#d4e3f3',
          200: '#a9c5e6',
          300: '#7ba6d5',
          400: '#5187c1',
          500: '#3b6fa9',
          600: '#295f98',
          700: '#234c7b',
          800: '#1f3e63',
          900: '#1a3450',
        },
        // Heritage Red
        red: {
          50:  '#fbf0ec',
          100: '#f6d8cf',
          200: '#ecb29f',
          300: '#dd8c72',
          400: '#cf6e54',
          500: '#c65a46',
          600: '#a64332',
          700: '#85342a',
          800: '#6a2c25',
          900: '#5a2820',
        },
        // Forest Green
        forest: {
          50:  '#eff3ef',
          100: '#dae3dd',
          200: '#b6c8bd',
          300: '#8ba898',
          400: '#688b78',
          500: '#4f6b58',
          600: '#3f5648',
          700: '#34463b',
          800: '#2b3a31',
          900: '#243029',
        },
        cream: {
          DEFAULT: '#f7f2e8',
          50:  '#fdfaf3',
          100: '#f7f2e8',
          200: '#efe5cf',
          300: '#e3d4ad',
        },
        ink: {
          DEFAULT: '#2f2f2f',
          soft: '#5a5651',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', '"Nunito Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -8px rgba(47, 47, 47, 0.12)',
        soft: '0 2px 12px -4px rgba(47, 47, 47, 0.08)',
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [],
};
