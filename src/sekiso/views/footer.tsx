import { defineView } from '@sekiso/core/view'
import { footer } from '../behavior/footer'

export const footerView = defineView(footer, {
  tags: {
    root: 'footer',
    author: 'a',
    iconify: 'a',
  },
  layout: {
    credits: 'p',
    updated: 'p',
  },
  roles: {
    author: 'link',
    iconify: 'link',
    credits: 'caption',
    updated: 'caption',
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
