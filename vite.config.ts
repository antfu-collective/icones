import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import PurgeIcons from 'vite-plugin-purge-icons'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePWA } from 'vite-plugin-pwa'
import dayjs from 'dayjs'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

const { resolve } = require('path');
const { readdirSync } = require('fs');

function getFiles(dir) {
  const dirents = readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

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
        includeAssets: [...getFiles("public")],
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
    UnoCSS(),
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(dayjs().format('YYYY/MM/DD HH:mm')),
  },
})
