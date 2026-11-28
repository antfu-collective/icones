import { defineView, Outlet } from '@sekiso/core/view'
import { navbar } from '../behavior/navbar'
import { Icon } from '../schema'

export const navbarView = defineView(navbar, {
  parts: {
    root: 'nav.bar',
    back: 'a.icon-button',
    github: 'a.icon-button',
    settings: 'a.icon-button',
    dark: 'button.toggle',
    brand: 'h1.brand',
  },
}, ({ state, t }, s) => (
  <s.Root data={{ collection: state.collection, home: state.home }}>
    <s.Back label={t('nav.back')}>
      <Icon name="back" />
    </s.Back>
    {state.collection
      ? <Outlet name="search" />
      : <s.Brand>{t('app.name')}</s.Brand>}
    <s.Github label={t('nav.github')}>
      <Icon name="github" />
    </s.Github>
    <s.Settings label={t('nav.settings')}>
      <Icon name="settings" />
    </s.Settings>
    <s.Dark label={t('nav.dark')}>
      <Icon name={state.dark ? 'dark' : 'light'} />
    </s.Dark>
  </s.Root>
))
