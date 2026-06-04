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
        'display-mobile': ['36px', { lineHeight: '42px', fontWeight: '800', letterSpacing: '-0.02em' }],
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
    },
  },
};

export default preset;
