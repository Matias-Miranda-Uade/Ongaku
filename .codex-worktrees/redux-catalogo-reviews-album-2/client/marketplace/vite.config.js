import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const backendUrl = loadEnv(mode, process.cwd(), '').VITE_BACKEND_URL || 'http://localhost:8080'
  const backendRoutes = [
    '/api',
    '/media',
    '/vinyls',
    '/reviews',
    '/audio-previews',
    '/average-scores',
    '/carts',
    '/favorites',
    '/orders',
    '/payments',
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
        {
          target: backendUrl,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (_error, _request, response) => {
              if (!response || !('writeHead' in response) || response.headersSent || response.writableEnded) return
              response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' })
              response.end(JSON.stringify({
                success: false,
                message: 'No se pudo conectar con el backend. Iniciá el servidor y volvé a intentar.',
                errors: [],
              }))
            })
          },
        },
      ])),
    },
  }
})
