import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand colors for Australian legal tech
        primary: '#1e40af', // Professional blue
        secondary: '#059669', // Australian green
        accent: '#dc2626', // Alert red
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        'legally-legit': {
          'primary': '#1e40af',
          'primary-content': '#ffffff',
          'secondary': '#059669',
          'secondary-content': '#ffffff',
          'accent': '#dc2626',
          'accent-content': '#ffffff',
          'neutral': '#374151',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#e5e7eb',
          'base-content': '#1f2937',
          'info': '#3b82f6',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
      },
      'light',
      'dark',
      'corporate',
    ],
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
}
export default config
