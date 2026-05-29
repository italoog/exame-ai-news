import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF1F1',
          100: '#FFD6D6',
          200: '#FFB0B0',
          300: '#FF8585',
          400: '#FF5C5C',
          500: '#E10600',
          600: '#B80000',
          700: '#8A0000',
          800: '#5C0000',
          900: '#300000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 12px rgba(0,0,0,0.06)',
        lg: '0 10px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config


const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // EXAME Brand
        brand: {
          DEFAULT: '#E10600',
          50: '#FFF1F1',
          100: '#FFD6D6',
          200: '#FFB0B0',
          300: '#FF8585',
          400: '#FF5C5C',
          500: '#E10600',
          600: '#B80000',
          700: '#8A0000',
          800: '#5C0000',
          900: '#300000',
        },
        // Semantic mapping (shadcn/ui compatible)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      fontSize: {
        hero: ['4rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        h1: ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        h2: ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h3: ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h4: ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h5: ['1.25rem', { lineHeight: '1.3' }],
        h6: ['1.125rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        body: ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        caption: ['0.75rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'exame-sm': '0 1px 2px rgba(0,0,0,0.04)',
        'exame-md': '0 4px 12px rgba(0,0,0,0.06)',
        'exame-lg': '0 10px 30px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [animate],
};

export default config;
