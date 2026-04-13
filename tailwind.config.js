/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fef7f7',
          100: '#fdeef0',
          200: '#fbd5dc',
          300: '#f8b4c0',
          400: '#f48da0',
          500: '#e8687e',
        },
        lavender: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9daff',
          300: '#8ec2ff',
          400: '#60a5fa',
          500: '#3b82f6',
        },
        mint: {
          50: '#f0fdf9',
          100: '#ddfbf0',
          200: '#bef5e0',
          300: '#8dead0',
          400: '#5ed8b8',
          500: '#3dbe9e',
        },
        peach: {
          50: '#fff8f3',
          100: '#ffedd9',
          200: '#ffdbb5',
          300: '#ffc48d',
          400: '#ffa960',
          500: '#f08c40',
        },
        cream: {
          50: '#fffdf7',
          100: '#fef9ee',
          200: '#fdf2d9',
        },
      },
      fontFamily: {
        hand: ['Gowun Batang', 'serif'],
        display: ['Nanum Pen Script', 'cursive'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
