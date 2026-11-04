import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // HTTPS y acceso por red local: sin HTTPS, el móvil no deja usar la cámara ni el micrófono.
  server: { host: true },
  plugins: [
    react(),
    basicSsl(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      // Los iconos ya entran por globPatterns: así no se precachean dos veces.
      includeManifestIcons: false,
      manifest: {
        name: 'Kanga',
        short_name: 'Kanga',
        description: 'Un laboratorio de ciencias en tu móvil, también sin internet.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#2563eb',
        background_color: '#f8fafc',
        icons: [
          { src: '/iconos/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/iconos/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/iconos/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // El esqueleto de la app se descarga por adelantado.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,json}'],
        // Los modelos se descargan cuando hacen falta, para que la app pese poco.
        globIgnores: ['modelos/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/modelos/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'modelos',
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
