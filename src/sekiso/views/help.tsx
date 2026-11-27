import { defineView } from '@sekiso/core/view'
import { help, progress } from '../behavior/help'
import { Icon } from './icon'

export const helpView = defineView(help, {
  parts: {
    root: 'div',
    backdrop: 'div',
    panel: 'div.dialog',
    link: 'a',
    intro: 'p.caption',
    title: 'h2.subheading',
    text: 'p.text',
    code: 'code.code',
  },
}, ({ state, t }, s) => (
  <s.Root data={{ open: state.open }}>
    <s.Backdrop />
    <s.Panel>
      <s.Intro>{t('help.intro')}</s.Intro>
      <s.Title>{t('help.copy.title')}</s.Title>
      <s.Text>{t('help.copy.text')}</s.Text>
      <s.Title>{t('help.runtime.title')}</s.Title>
      <s.Text>
        {t('help.runtime.text')}
        {' '}
        <s.Link value="iconify">{t('help.runtime.link')}</s.Link>
        {t('help.runtime.after')}
      </s.Text>
      <s.Title>{t('help.css.title')}</s.Title>
      <s.Text>
        {t('help.css.text')}
        {' '}
        <s.Link value="unocss">{t('help.css.unocss')}</s.Link>
        {t('help.css.middle')}
        {' '}
        <s.Link value="preset-icons"><s.Code>{t('help.css.preset')}</s.Code></s.Link>
        {t('help.css.after')}
      </s.Text>
      <s.Text>
        {t('help.css.more')}
        {' '}
        <s.Link value="css-post">{t('help.post')}</s.Link>
        {t('help.more.after')}
      </s.Text>
      <s.Title>{t('help.components.title')}</s.Title>
      <s.Text>
        {t('help.components.text')}
        {' '}
        <s.Link value="unplugin-icons"><s.Code>{t('help.components.unplugin')}</s.Code></s.Link>
        {t('help.components.after')}
      </s.Text>
      <s.Text>
        {t('help.components.more')}
        {' '}
        <s.Link value="components-post">{t('help.post')}</s.Link>
        {t('help.components.story')}
      </s.Text>
    </s.Panel>
  </s.Root>
))

export const progressView = defineView(progress, {
  parts: { root: 'div.toast', message: 'span' },
}, ({ state }, s) => (
  <s.Root data={{ shown: state.active }}>
    <Icon name="busy" />
    <s.Message>{state.message}</s.Message>
  </s.Root>
))
