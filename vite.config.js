import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/energi-alternatif-terbarukan-/',
  plugins: [react()],
  server: { host: true }
})
