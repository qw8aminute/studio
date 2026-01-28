import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Opus Prime - Crayon',
        short_name: 'Crayon',
        description: 'Creative drawing app with animation and speech bubbles',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#6366f1',
        lang: 'en',
        scope: '/',
        orientation: 'any',
        categories: ['creativity', 'education', 'kids'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ['gif.js']
  }
})
