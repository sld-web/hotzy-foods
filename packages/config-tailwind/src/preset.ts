import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: '#b20028',
        'primary-container': '#d7263d',
        'on-primary': '#ffffff',
        secondary: '#745b00',
        'secondary-container': '#fecb00',
        tertiary: '#006539',
        'tertiary-container': '#008149',
        'chili-red': '#D7263D',
        'golden-glaze': '#FFCC00',
        'fresh-mint': '#3CB371',
        surface: '#f9f9f9',
        'surface-dim': '#dadada',
        'surface-container': '#eeeeee',
        'surface-gray': '#F8F8F8',
        'on-surface': '#1b1b1b',
        error: '#ba1a1a',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Work Sans', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display-mobile': [
          '36px',
          { lineHeight: '42px', fontWeight: '800', letterSpacing: '-0.02em' },
        ],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '0.02em' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '700' }],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      spacing: {
        'margin-desktop': '40px',
        'margin-mobile': '16px',
        gutter: '24px',
        'stack-sm': '4px',
        'stack-md': '16px',
        'stack-lg': '32px',
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-12px) translateX(6px)' },
          '50%': { transform: 'translateY(-6px) translateX(-4px)' },
          '75%': { transform: 'translateY(-18px) translateX(8px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-8px) translateX(-5px)' },
          '50%': { transform: 'translateY(-14px) translateX(3px)' },
          '75%': { transform: 'translateY(-22px) translateX(-6px)' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 20s ease-in-out forwards',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'fade-in-up-slow': 'fade-in-up 0.9s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
      },
    },
  },
};

export default preset;
