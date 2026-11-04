import { readFileSync } from 'node:fs'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// La portada de index.html se pinta antes que el CSS: sus colores se copian de tokens.css al compilar.
const coloresPortada = {
  name: 'colores-portada',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => {
      const tokens = readFileSync('src/core/estilos/tokens.css', 'utf8')
      const leer = (nombre) => tokens.match(new RegExp(`${nombre}:\\s*([^;]+);`))[1]
      const variables = ['--color-fondo', '--color-texto']
        .map((nombre) => `${nombre}: ${leer(nombre)};`)
        .join(' ')
      return html.replace('/* colores-desde-tokens */', `:root { ${variables} }`)
    },
  },
}

// El CSS general no bloquea el primer pintado: en 3G lenta, la portada de index.html sale antes.
const cssSinBloqueo = {
  name: 'css-sin-bloqueo',
  transformIndexHtml: {
    order: 'post',
    handler: (html) =>
      html.replace(
        /<link rel="stylesheet"( crossorigin)? href="([^"]+)">/g,
        (_, crossorigin = '', href) =>
          `<link rel="preload" as="style"${crossorigin} href="${href}" onload="this.rel='stylesheet'">` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`,
      ),
  },
}

export default defineConfig({
  // HTTPS y acceso por red local: sin HTTPS, el móvil no deja usar la cámara ni el micrófono.
  server: { host: true },
  plugins: [
    react(),
    coloresPortada,
    cssSinBloqueo,
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
        theme_color: '#f6f0e2',
        background_color: '#f6f0e2',
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
