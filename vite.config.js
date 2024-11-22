import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  build: {
    outDir: 'client_build/'
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  },
  base: process.env.VITE_BASE
})
