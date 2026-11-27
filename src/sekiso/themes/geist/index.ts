// @unocss-include
import { defineTheme } from '@sekiso/core/theme'
import { compose } from '../compose'
import original from '../original'
import styles from './theme.module.css'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './theme.css'

/** Hairlines of a grid behind the page, every 64px. */
const grid = [
  'linear-gradient(to right, light-dark(rgb(0 0 0 / 4%), rgb(255 255 255 / 4%)) 1px, transparent 1px)',
  'linear-gradient(to bottom, light-dark(rgb(0 0 0 / 4%), rgb(255 255 255 / 4%)) 1px, transparent 1px)',
].join(', ')

/**
 * Black and white, Geist Sans and Mono, hairline
 * borders on a page grid. The icon sets are project cards in a centered
 * container, with their samples in a strip at the bottom. Light or dark.
 */
export default defineTheme({
  name: 'geist',
  extends: original,
  tokens: {
    'fg': 'light-dark(#171717, #ededed)',
    'muted': 'light-dark(#666666, #a1a1a1)',
    'line': 'light-dark(#ebebeb, #2e2e2e)',
    'surface': 'light-dark(#fafafa, #000000)',
    'raised': 'light-dark(#ffffff, #0a0a0a)',
    'accent': 'light-dark(#006bff, #52a8ff)',
    'icon': 'light-dark(#171717, #ededed)',
    'star': '#f5a524',
    'danger': 'light-dark(#d93036, #ff6166)',
    'font': '"Geist Variable", "Geist", Inter, ui-sans-serif, system-ui, sans-serif',
    'font-display': '"Geist Variable", "Geist", Inter, ui-sans-serif, system-ui, sans-serif',
    'font-mono': '"Geist Mono Variable", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    'radius': '6px',
    'paper': grid,
    'scheme': 'light dark',
  },
  roles: compose(original.roles, styles),
  slots: compose(original.slots, styles),
  icons: {
    'back': 'i-lucide-arrow-left',
    'github': 'i-lucide-github',
    'settings': 'i-lucide-settings',
    'light': 'i-lucide-sun',
    'dark': 'i-lucide-moon',
    'search': 'i-lucide-search',
    'clear': 'i-lucide-x',
    'help': 'i-lucide-circle-help',
    'search-all': 'i-lucide-corner-down-right',
    'star': 'i-lucide-star',
    'starred': 'i-ph-star-fill',
    'remove': 'i-lucide-trash-2',
    'hidden': 'i-lucide-eye-off',
    'visible': 'i-lucide-eye',
    'cached': 'i-lucide-hard-drive-download',
    'deprecated': 'i-lucide-ban',
    'empty': 'i-lucide-search-x',
    'drawer': 'i-lucide-panel-left',
    'website': 'i-lucide-external-link',
    'npm': 'i-lucide-package',
    'size': 'i-lucide-zoom-in',
    'menu': 'i-lucide-ellipsis',
    'bag': 'i-lucide-shopping-bag',
    'check': 'i-lucide-check',
    'color': 'i-lucide-palette',
    'copy': 'i-lucide-copy',
    'case': 'i-lucide-chevron-up',
    'add': 'i-lucide-plus',
    'select': 'i-lucide-list-checks',
    'checked': 'i-lucide-square-check',
    'unchecked': 'i-lucide-square',
    'link': 'i-lucide-link',
    'download': 'i-lucide-download',
    'font': 'i-lucide-type',
    'sprite': 'i-lucide-layout-grid',
    'busy': 'i-lucide-loader-circle',
    'manager-pnpm': 'i-logos-pnpm',
    'manager-npm': 'i-logos-npm-icon',
    'manager-yarn': 'i-logos-yarn',
    'manager-bun': 'i-logos-bun',
  },
})
