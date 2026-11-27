import { defineView, Outlet } from '@sekiso/core/view'
import { bag, sharedBag } from '../behavior/bag'
import { Icon } from './icon'

export const bagView = defineView(bag, {
  tags: {
    'root': 'div',
    'backdrop': 'div',
    'panel': 'div',
    'share': 'button',
    'clear': 'button',
    'close': 'button',
    'zip-options': 'div',
    'zip-close': 'button',
    'zip': 'button',
    'zip-toggle': 'button',
    'iconfont': 'button',
    'sprite': 'button',
  },
  layout: {
    header: 'div',
    intro: 'div',
    title: 'h2',
    count: 'p',
    icons: 'div',
    tag: 'sup',
    footer: 'div',
    empty: 'p',
  },
  roles: {
    'panel': 'sheet',
    'count': 'caption',
    'share': 'icon-button',
    'clear': 'icon-button',
    'close': 'icon-button',
    'zip-close': 'icon-button',
    'zip': 'button',
    'zip-toggle': 'action',
    'iconfont': 'action',
    'sprite': 'action',
    'empty': 'empty',
  },
}, ({ state, t }, s) => (
  <s.Root data={{ open: state.open }}>
    <s.Backdrop />
    <s.Panel>
      <s.Header>
        <s.Intro>
          <s.Title>{t('bag.title')}</s.Title>
          <s.Count>{t('bag.count', { count: state.count })}</s.Count>
        </s.Intro>
        <s.Share label={t(state.shared ? 'bag.shared' : 'bag.share')}>
          <Icon name={state.shared ? 'check' : 'link'} />
        </s.Share>
        <s.Clear label={t('bag.clear')}>
          <Icon name="remove" />
        </s.Clear>
        <s.Close label={t('bag.close')}>
          <Icon name="clear" />
        </s.Close>
      </s.Header>
      {state.count > 0 && (
        <>
          <s.Icons>
            <Outlet name="bag-icons" />
          </s.Icons>
          <s.ZipOptions>
            <s.ZipClose label={t('detail.close')}>
              <Icon name="clear" />
            </s.ZipClose>
            {state.formats.map(format => (
              <s.Zip key={format.type} value={format.type}>
                {format.name}
                {format.tag && <s.Tag>{format.tag}</s.Tag>}
              </s.Zip>
            ))}
          </s.ZipOptions>
          <s.Footer>
            <s.ZipToggle>
              <Icon name="download" />
              {t('bag.zip')}
            </s.ZipToggle>
            <s.Iconfont>
              <Icon name="font" />
              {t('bag.iconfont')}
            </s.Iconfont>
            <s.Sprite>
              <Icon name="sprite" />
              {t('bag.sprite')}
            </s.Sprite>
          </s.Footer>
        </>
      )}
      {state.count === 0 && <s.Empty>{t('bag.empty')}</s.Empty>}
    </s.Panel>
  </s.Root>
))

export const sharedBagView = defineView(sharedBag, {
  tags: {
    root: 'main',
    add: 'button',
    browse: 'a',
  },
  layout: {
    title: 'h1',
    hint: 'p',
    icons: 'div',
    footer: 'p',
    empty: 'p',
  },
  roles: {
    root: 'page',
    hint: 'caption',
    footer: 'caption',
    browse: 'link',
    empty: 'caption',
  },
}, ({ state, t }, s) => (
  <s.Root>
    <s.Title>{t('shared.title')}</s.Title>
    {state.count > 0 && (
      <>
        <s.Hint>{t('shared.hint', { count: state.count })}</s.Hint>
        <s.Add>
          {state.missing > 0
            ? t('shared.add', { count: state.missing })
            : t('shared.all')}
        </s.Add>
        <s.Icons>
          <Outlet name="shared-icons" />
        </s.Icons>
        <s.Footer>
          {t('shared.yours', { count: state.bag })}
          {' '}
          <s.Browse>{t('shared.browse')}</s.Browse>
        </s.Footer>
      </>
    )}
    {state.count === 0 && <s.Empty>{t('shared.empty')}</s.Empty>}
  </s.Root>
))
