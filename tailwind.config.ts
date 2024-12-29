import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        foreground: 'rgb(var(--color-foreground), <alpha-value>)',
        background: 'rgb(var(--color-background), <alpha-value>)',
        highlight: 'rgb(var(--color-highlight), <alpha-value>)',
        shadow: 'rgb(var(--color-shadow), <alpha-value>)',
        breakfast: 'color(display-p3 var(--color-breakfast) / <alpha-value>)',
        lunch: 'color(display-p3 var(--color-lunch) / <alpha-value>)',
        dinner: 'color(display-p3 var(--color-dinner) / <alpha-value>)',
        proteins: 'color(display-p3 var(--color-proteins) / <alpha-value>)',
        carbs: 'color(display-p3 var(--color-carbs) / <alpha-value>)',
        fats: 'color(display-p3 var(--color-fats) / <alpha-value>)',
        snacks: 'color(display-p3 var(--color-snacks) / <alpha-value>)',
        accent: 'color(display-p3 1 0.6 0.5 / <alpha-value>)',
      },
      boxShadow: {
        glow: '0 0 4px 0 rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        modalContentShow: {
          from: { opacity: '0', marginTop: '2rem' },
          to: { opacity: '1', marginTop: '0' },
        },
        border: {
          to: { '--border-angle': '360deg' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        modalContentShow:
          'modalContentShow 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        border: 'border 8s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
