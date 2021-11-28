import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import PurgeIcons from 'vite-plugin-purge-icons'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePWA } from 'vite-plugin-pwa'
import dayjs from 'dayjs'
import Vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [
    Vue(),
    Pages({
      importMode: 'sync',
    }),
    Components({
      dts: true,
    }),
    AutoImport({
      dts: true,
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
    }),
    PurgeIcons(),
    VitePWA({
      manifest: {
        name: 'Icônes',
        short_name: 'Icônes',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    WindiCSS({
      safelist: 'text-2xl text-3xl text-4xl',
      preflight: {
        enableAll: true,
      },
    }),
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(dayjs().format('YYYY/MM/DD HH:mm')),
  },
})
