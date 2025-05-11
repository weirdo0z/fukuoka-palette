import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          bg: {
            normal: { value: '#fff6f0' },
            dent: { value: '#fff0ea' },
          },
        },
      },
      semanticTokens: {
        colors: {
          progress: {
            fulfilled: { value: '#0285EA' },
            not: { value: '#838383' },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
})
