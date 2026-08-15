import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/readflow/',
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon.svg'],
    manifest: {
      name: 'Reading Journal', short_name: 'Journal', description: 'Your private reading rhythm',
      theme_color: '#eeece9', background_color: '#eeece9', display: 'standalone', start_url: '/readflow/',
      icons: [{ src: '/readflow/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
    },
    workbox: { globPatterns: ['**/*.{js,css,html,svg}'] }
  })]
})
