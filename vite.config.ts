import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
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
        scope: '/',
        start_url: '/',
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