// @unocss-include
import { defineTheme } from '@sekiso/core/theme'
import styles from './theme.module.css'
import './theme.css'

/**
 * The classic look of Icônes. Light or dark by the dark switch, with the
 * user's color as the accent. Every color is a token, so a theme that
 * extends this one and gives other tokens is a new look.
 */
export default defineTheme({
  name: 'original',
  tokens: {
    'fg': 'light-dark(#111827, #f3f4f6)',
    'muted': 'light-dark(rgb(17 24 39 / 50%), rgb(243 244 246 / 50%))',
    'line': 'rgb(136 136 136 / 25%)',
    'surface': 'light-dark(#ffffff, #181818)',
    'raised': 'light-dark(#ffffff, #1e1e1e)',
    'accent': 'var(--theme-color, #329672)',
    'icon': 'light-dark(#777777, #aaaaaa)',
    'star': '#facc15',
    'danger': '#fb7185',
    'font': 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'font-display': 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'font-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    'radius': '8px',
    'paper': 'none',
    'scheme': 'light dark',
  },
  // A part wears the class of its role, then its own where it has one
  roles: styles,
  slots: {
    ...styles,
    // Parts that need no look of their own
    'home-search-all-text': '',
    'settings-intro': '',
  },
  icons: {
    'back': 'i-carbon-arrow-left',
    'github': 'i-carbon-logo-github',
    'settings': 'i-carbon-settings',
    'theme': 'i-carbon-color-palette',
    'light': 'i-carbon-sun',
    'dark': 'i-carbon-moon',
    'search': 'i-carbon-search',
    'clear': 'i-carbon-close',
    'help': 'i-carbon-help',
    'search-all': 'i-carbon-direction-right-01',
    'star': 'i-carbon-star',
    'starred': 'i-carbon-star-filled',
    'remove': 'i-carbon-delete',
    'hidden': 'i-carbon-view-off',
    'visible': 'i-carbon-view',
    'cached': 'i-carbon-cloud-auditing',
    'deprecated': 'i-carbon-information-disabled',
    'empty': 'i-ph-x-circle-bold',
  },
})
