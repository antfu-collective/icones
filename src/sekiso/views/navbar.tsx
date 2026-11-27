import { defineView, Outlet } from '@sekiso/core/view'
import { navbar } from '../behavior/navbar'
import { Icon } from './icon'

export const navbarView = defineView(navbar, {
  tags: {
    root: 'nav',
    back: 'a',
    github: 'a',
    settings: 'a',
    theme: 'button',
    dark: 'button',
  },
  layout: {
    brand: 'h1',
  },
  roles: {
    root: 'bar',
    brand: 'brand',
    back: 'icon-button',
    github: 'icon-button',
    settings: 'icon-button',
    theme: 'icon-button',
    dark: 'toggle',
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
    <s.Theme label={t('nav.theme', {
      theme: t(`theme.${state.theme}`),
    })}
    >
      <Icon name="theme" />
    </s.Theme>
    <s.Dark label={t('nav.dark')}>
      <Icon name={state.dark ? 'dark' : 'light'} />
    </s.Dark>
  </s.Root>
))
