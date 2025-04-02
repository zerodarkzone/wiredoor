import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueJsx(), tailwindcss(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          // ws: false,
          // rewriteWsOrigin: false,
          // rewrite: path => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log(
                `Proxying ${req.method} request to: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
              )
            })
            proxy.on('proxyRes', (proxyRes) => {
              console.log(`Response from target: ${proxyRes.statusCode}`)
            })
            proxy.on('error', (err) => {
              console.error('Proxy error:', err)
            })
          },
        },
      },
    },
  }
})
