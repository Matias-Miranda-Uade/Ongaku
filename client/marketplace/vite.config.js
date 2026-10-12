import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const backendUrl = loadEnv(mode, process.cwd(), '').VITE_BACKEND_URL || 'http://localhost:8080'
  const backendRoutes = [
    '/api',
    '/vinyls',
    '/reviews',
    '/audio-previews',
    '/average-scores',
    '/carts',
    '/orders',
    '/users',
    '/admin',
    '/dashboard',
    '/artists',
    '/genres',
    '/categories',
    '/order-statuses',
  ]

  return {
    plugins: [react()],
    server: {
      proxy: Object.fromEntries(backendRoutes.map((route) => [
        route,
        { target: backendUrl, changeOrigin: true },
      ])),
    },
  }
})
