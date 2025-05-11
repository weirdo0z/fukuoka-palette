import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import tsconfigpaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tsconfigpaths()],
})
