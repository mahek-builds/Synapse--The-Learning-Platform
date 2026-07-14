import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        timeout: 180000, // 3 minutes - LangGraph agents take ~60-90s
      },
      '/chat': {
        target: 'http://localhost:8000',
        timeout: 180000,
      }
    }
  }
})
