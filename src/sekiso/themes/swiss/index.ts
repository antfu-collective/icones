// @unocss-include
import { defineTheme } from '@sekiso/core/theme'
import { compose } from '../compose'
import original from '../original'
import styles from './theme.module.css'
import './theme.css'

const grotesk = '"Helvetica Neue", Helvetica, "Nimbus Sans", Inter, Arial, sans-serif'

/**
 * The International Typographic Style: a catalog index rather than a wall of
 * cards. Each section has its title and a big count in a column of its own,
 * and each icon set is one row of a ruled table.
 */
export default defineTheme({
  name: 'swiss',
  extends: original,
  tokens: {
    'fg': '#111111',
    'muted': 'rgb(17 17 17 / 55%)',
    'line': '#111111',
    'surface': '#f4f4ef',
    'raised': 'transparent',
    'accent': '#e3120b',
    'icon': '#111111',
    'star': '#e3120b',
    'danger': '#e3120b',
    'font': grotesk,
    'font-display': grotesk,
    'font-mono': 'ui-monospace, SFMono-Regular, Menlo, monospace',
    'radius': '0',
    'paper': 'none',
    'scheme': 'light',
  },
  roles: compose(original.roles, styles),
  slots: compose(original.slots, styles),
  // Bold, geometric strokes
  icons: {
    'back': 'i-ph-arrow-left-bold',
    'github': 'i-ph-github-logo-bold',
    'settings': 'i-ph-gear-six-bold',
    'theme': 'i-ph-circle-half-tilt-bold',
    'light': 'i-ph-sun-bold',
    'dark': 'i-ph-moon-bold',
    'search': 'i-ph-magnifying-glass-bold',
    'clear': 'i-ph-x-bold',
    'help': 'i-ph-question-bold',
    'search-all': 'i-ph-arrow-bend-down-right-bold',
    'star': 'i-ph-plus-bold',
    'starred': 'i-ph-asterisk-bold',
    'remove': 'i-ph-minus-bold',
    'hidden': 'i-ph-eye-slash-bold',
    'visible': 'i-ph-eye-bold',
    'cached': 'i-ph-download-simple-bold',
    'deprecated': 'i-ph-prohibit-bold',
    'empty': 'i-ph-circle-dashed-bold',
  },
})
