import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  // Zajišťuje správné relativní cesty ke všem JavaScript a CSS souborům na GitHub Pages
  base: '/ZS/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Finance pod kontrolou',
        short_name: 'Finance',
        description: 'Správa osobních financí',
        theme_color: '#0A0A0A',
        background_color: '#0A0A0A',
        display: 'standalone',
        // Oprava cest v manifestu pro funkční PWA na podsložce /ZS/
        scope: '/ZS/',
        start_url: '/ZS/',
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
  },
})
