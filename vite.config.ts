import { rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import Vue from '@vitejs/plugin-vue'
import dayjs from 'dayjs'
import fg from 'fast-glob'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

import esmodule from 'vite-plugin-esmodule'
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'

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
      isElectron && renderer(),
      isElectron && esmodule(['prettier']),
      Vue({
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
          'vue-router',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
      }),
      !isElectron && VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
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
        injectManifest: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        integration: {
          configureOptions(viteConfig, options) {
            if (viteConfig.command === 'build')
              options.includeAssets = fg.sync('**/*.*', { cwd: join(process.cwd(), 'public'), onlyFiles: true })
          },
        },
        devOptions: {
          enabled: process.env.SW_DEV === 'true',
          /* when using generateSW the PWA plugin will switch to classic */
          type: 'module',
          navigateFallback: 'index.html',
        },
      }),
      UnoCSS(),
    ],
    define: {
      __BUILD_TIME__: JSON.stringify(dayjs().format('YYYY/MM/DD HH:mm')),
      PWA: !isElectron && (process.env.NODE_ENV === 'production' || process.env.SW_DEV === 'true'),
    },
    resolve: {
      alias: {
        'iconify-icon': resolve(__dirname, 'node_modules/iconify-icon/dist/iconify-icon.mjs'),
      },
    },
  }
})
