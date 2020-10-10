import { UserConfig } from 'vite'
import Voie from 'vite-plugin-voie'
import PurgeIcons from 'vite-plugin-purge-icons'
import ViteComponents from 'vite-plugin-components'
import dayjs from 'dayjs'

const config: UserConfig = {
  plugins: [
    Voie({
      importMode: 'sync',
    }),
    ViteComponents(),
    PurgeIcons(),
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(dayjs().format('YYYY/MM/DD HH:mm')),
  },
}

export default config
