/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lpu-red':  '#C8102E',
        'gold':     '#F5A800',
        'brand':    '#7C3AED',
        'brand2':   '#9D5CFF',
        'emerald':  '#0D9E6E',
        'sky':      '#0EA5E9',
        'bg':       'var(--color-bg)',
        'surface':  'var(--color-surface)',
        'surface2': 'var(--color-surface2)',
        'surface3': 'var(--color-surface3)',
        'text':     'var(--color-text)',
        'text2':    'var(--color-text2)',
        'text3':    'var(--color-text3)',
        'border':   'var(--color-border)',
        'border2':  'var(--color-border2)',
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        brand: ['Syne', 'sans-serif'],
        mono:  ['DM Mono', 'monospace'],
      },
      borderRadius: {
        xl:    '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
