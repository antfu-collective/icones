import type { Component } from 'vue'
import type { Router } from 'vue-router'
import { Sekiso } from '@sekiso/vue'
import { h, watchEffect } from 'vue'
import BagIcons from '../components/BagIcons.vue'
import CollectionSamples from '../components/CollectionSamples.vue'
import DetailPreview from '../components/DetailPreview.vue'
import IconGrid from '../components/IconGrid.vue'
import NavbarSearch from '../components/NavbarSearch.vue'
import SharedIcons from '../components/SharedIcons.vue'
import SnippetCode from '../components/SnippetCode.vue'
import { DEFAULT_THEME, themeColor, themeName, themeScheme } from '../store'
import { createIconesApp, resolveTheme, themes } from './app'

/** The framework-native components the views place by name, with `<Outlet>`. */
const outlets = {
  'samples': CollectionSamples,
  'search': NavbarSearch,
  'icons': IconGrid,
  'preview': DetailPreview,
  'snippet-code': SnippetCode,
  'bag-icons': BagIcons,
  'shared-icons': SharedIcons,
}

/** Takes the theme a link names, as `?theme=washi`, and keeps it. */
function takeThemeParam(search: string) {
  const asked = new URLSearchParams(search).get('theme')
  if (asked && asked in themes)
    themeName.value = asked
}

/**
 * Starts the Sekiso app on the page: the active theme on `<html>`, as
 * `data-theme` and the token variables, and the root that gives the views
 * the theme, the messages and the outlets.
 */
export function useSekiso(router: Router) {
  takeThemeParam(location.search)
  if (!(themeName.value in themes))
    themeName.value = DEFAULT_THEME
  router.afterEach(to => takeThemeParam(new URLSearchParams(to.query as Record<string, string>).toString()))

  const app = createIconesApp(themeName.value)
  app.attach(document.documentElement)

  watchEffect(() => {
    const theme = resolveTheme(themeName.value)
    app.setTheme(theme)
    themeScheme.value = theme.tokens.scheme ?? 'light dark'
  })
  // The accent of the original theme is the color picked in the icon set's menu
  watchEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeColor.value)
  })

  return {
    app,
    /** Wraps the app's root component in the Sekiso root. */
    wrap: (root: Component) => () => h(Sekiso, { app, outlets }, () => h(root)),
  }
}
