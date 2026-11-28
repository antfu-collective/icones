import { defineView } from '@sekiso/core/view'
import { footer } from '../behavior/footer'

export const footerView = defineView(footer, {
  parts: {
    root: 'footer',
    author: 'a.link',
    iconify: 'a.link',
    credits: 'p.caption',
    updated: 'p.caption',
  },
}, ({ state, t }, s) => (
  <s.Root>
    <s.Credits>
      {t('footer.builtBy')}
      {' '}
      <s.Author>{t('footer.author')}</s.Author>
      {', '}
      {t('footer.poweredBy')}
      {' '}
      <s.Iconify>{t('footer.iconify')}</s.Iconify>
    </s.Credits>
    <s.Updated>{t('footer.updated', { time: state.time, ago: state.ago })}</s.Updated>
  </s.Root>
))
