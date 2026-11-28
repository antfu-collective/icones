// @unocss-include
import { defineTheme } from '@sekiso/core/theme'
import original from '../original'
import styles from './theme.module.css'
import './theme.css'

/** The grain of handmade paper: fine noise, and long fibers. */
const paper = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .18 0 0 0 .07 0"/></filter><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".008 .2" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .55 0 0 0 0 .45 0 0 0 0 .3 0 0 0 .18 -.06"/></filter><rect width="100%" height="100%" filter="url(#n)"/><rect width="100%" height="100%" filter="url(#f)"/></svg>`)}")`

const serif = '"Shippori Mincho", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "Noto Serif CJK JP", "Iowan Old Style", "Palatino Linotype", Georgia, serif'

/**
 * Sumi ink on washi, Japanese paper: warm paper with its grain, serif type,
 * thin ruled lines, and one vermilion accent, the color of a seal.
 */
export default defineTheme({
  name: 'washi',
  extends: original,
  tokens: {
    'fg': '#2b2420',
    'muted': 'rgb(43 36 32 / 58%)',
    'line': 'rgb(110 84 56 / 24%)',
    'surface': '#f2ead9',
    'raised': 'rgb(250 245 234 / 72%)',
    'accent': '#b7282e',
    'icon': '#3b322b',
    'star': '#b8862b',
    'danger': '#a33b2a',
    'font': serif,
    'font-display': serif,
    'font-mono': '"Osaka-Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    'radius': '2px',
    'paper': paper,
    'scheme': 'light',
  },
  styles,
  // Thin strokes, like a brush
  icons: {
    'back': 'i-ph-arrow-left-light',
    'github': 'i-ph-github-logo-light',
    'settings': 'i-ph-gear-six-light',
    'light': 'i-ph-sun-light',
    'dark': 'i-ph-moon-light',
    'search': 'i-ph-magnifying-glass-light',
    'clear': 'i-ph-x-light',
    'help': 'i-ph-question-light',
    'search-all': 'i-ph-arrow-bend-down-right-light',
    'star': 'i-ph-flower-lotus-light',
    'starred': 'i-ph-flower-lotus-fill',
    'remove': 'i-ph-trash-light',
    'hidden': 'i-ph-eye-slash-light',
    'visible': 'i-ph-eye-light',
    'cached': 'i-ph-archive-light',
    'deprecated': 'i-ph-prohibit-light',
    'empty': 'i-ph-wind-light',
    'drawer': 'i-ph-caret-left-light',
    'website': 'i-ph-arrow-square-out-light',
    'npm': 'i-ph-package-light',
    'size': 'i-ph-magnifying-glass-plus-light',
    'menu': 'i-ph-list-light',
    'bag': 'i-ph-handbag-light',
    'check': 'i-ph-check-light',
    'color': 'i-ph-palette-light',
    'copy': 'i-ph-copy-light',
    'case': 'i-ph-caret-up-light',
    'add': 'i-ph-plus-light',
    'select': 'i-ph-list-checks-light',
    'checked': 'i-ph-check-square-light',
    'unchecked': 'i-ph-square-light',
    'link': 'i-ph-link-light',
    'download': 'i-ph-download-simple-light',
    'font': 'i-ph-text-aa-light',
    'sprite': 'i-ph-squares-four-light',
    'busy': 'i-ph-circle-notch-light',
    'manager-pnpm': 'i-logos-pnpm',
    'manager-npm': 'i-logos-npm-icon',
    'manager-yarn': 'i-logos-yarn',
    'manager-bun': 'i-logos-bun',
  },
})
