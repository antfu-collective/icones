import { UserConfig } from 'vite'
import Voie from 'vite-plugin-voie'
import PurgeIcons from 'vite-plugin-purge-icons'
import ViteComponents from 'vite-plugin-components'
import { VitePWA } from 'vite-plugin-pwa'
import dayjs from 'dayjs'

const config: UserConfig = {
  plugins: [
    Voie({
      importMode: 'sync',
    }),
    ViteComponents(),
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
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(dayjs().format('YYYY/MM/DD HH:mm')),
  },
}

export default config
