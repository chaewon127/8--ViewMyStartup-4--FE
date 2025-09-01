import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
  port: 3000,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      rewrite: p => p.replace(/^\/api/, '') // 백엔드가 /api prefix 없을 때
    }
  }
},
  resolve: { alias: { '@': '/src' } },
})


