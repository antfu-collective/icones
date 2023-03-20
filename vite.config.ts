import { join, resolve } from 'node:path'
import { rmSync } from 'node:fs'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePWA } from 'vite-plugin-pwa'
import dayjs from 'dayjs'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import fg from 'fast-glob'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import esmodule from 'vite-plugin-esmodule'

export default defineConfig(({ mode }) => {
  const isElectron = mode === 'electron'
  const isBuild = process.argv.slice(2).includes('build')

  if (isElectron)
    rmSync('dist-electron', { recursive: true, force: true })

  return {
    plugins: [
      isElectron && electron([
        {
          entry: 'src/main/index.ts',
          vite: {
            build: {
              minify: isBuild,
              outDir: 'dist-electron/main',
            },
          },
        },
      ]),
      isElectron && renderer({
        nodeIntegration: true,
      }),
      isElectron && esmodule(['prettier']),
      Vue({
        reactivityTransform: true,
        customElement: [
          'iconify-icon',
        ],
        template: {
          compilerOptions: {
            isCustomElement: tag => tag === 'iconify-icon',
          },
        },
      }),
      Pages({
        importMode: 'sync',
      }),
      Components({
        dts: 'src/components.d.ts',
      }),
      AutoImport({
        imports: [
          'vue',
          'vue/macros',
          'vue-router',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
      }),
      !isElectron && VitePWA({
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
        includeAssets: fg.sync('**/*.*', { cwd: join(process.cwd(), 'public'), onlyFiles: true }),
      }),
      UnoCSS(),
    ],
    define: {
      __BUILD_TIME__: JSON.stringify(dayjs().format('YYYY/MM/DD HH:mm')),
    },
    resolve: {
      alias: {
        'iconify-icon': resolve(__dirname, 'node_modules/iconify-icon/dist/iconify-icon.mjs'),
      },
    },
  }
})
