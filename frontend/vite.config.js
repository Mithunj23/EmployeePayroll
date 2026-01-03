import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Use port 3000 or 5173
    open: true,
    proxy: {
      '/api': 'http://localhost:5000', // Proxy /api requests to backend port 5000
    },
  },
})
