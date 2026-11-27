import { defineView, Embed, input, Outlet } from '@sekiso/core/view'
import { collection } from '../behavior/collection'
import { SEARCH_SYNTAX } from '../behavior/draft'
import { drawerView } from './drawer'
import { footerView } from './footer'
import { Icon } from './icon'

/** Both views of the page share one instance, so the parts are the same. */
const COLLECTION_PARTS = {
  tags: {
    'root': 'div',
    'drawer-toggle': 'button',
    'website': 'a',
    'npm': 'a',
    'license': 'a',
    'size-toggle': 'button',
    'size-menu': 'div',
    'size': 'input',
    'dark': 'button',
    'settings': 'a',
    'favorite': 'button',
    'menu': 'select',
    'menu-group': 'optgroup',
    'menu-option': 'option',
    'category': 'button',
    'variant': 'button',
    'search': 'form',
    'input': 'input',
    'clear': 'button',
    'help-toggle': 'button',
    'help': 'div',
    'load-more': 'button',
    'load-all': 'button',
    'bag': 'button',
    'mode': 'button',
    'toast': 'div',
  },
  layout: {
    'loading': 'p',
    'main': 'main',
    'header': 'div',
    'intro': 'div',
    'title': 'h1',
    'name': 'span',
    'links': 'span',
    'deprecated': 'span',
    'credits': 'div',
    'author': 'span',
    'actions': 'div',
    'cached': 'span',
    'cached-text': 'span',
    'size-box': 'div',
    'size-value': 'span',
    'menu-box': 'span',
    'categories': 'div',
    'variants': 'div',
    'variants-label': 'span',
    'help-box': 'span',
    'syntax': 'span',
    'syntax-row': 'span',
    'syntax-example': 'code',
    'syntax-meaning': 'span',
    'syntax-note': 'span',
    'scroller': 'div',
    'grid': 'div',
    'more': 'div',
    'count': 'p',
    'bag-count': 'span',
  },
  roles: {
    'root': 'page',
    'drawer-toggle': 'icon-button',
    'title': 'heading',
    'name': 'text',
    'website': 'icon-button',
    'npm': 'icon-button',
    'deprecated': 'badge',
    'credits': 'caption',
    'license': 'link',
    'actions': 'toolbar',
    'cached': 'caption',
    'size-toggle': 'icon-button',
    'size-menu': 'popover',
    'size': 'slider',
    'dark': 'icon-button',
    'settings': 'icon-button',
    'favorite': 'toggle',
    'menu-box': 'icon-button',
    'menu': 'menu',
    'category': 'chip',
    'variant': 'chip',
    'variants-label': 'caption',
    'search': 'search',
    'clear': 'icon-button',
    'help-toggle': 'icon-button',
    'help': 'popover',
    'syntax-example': 'code',
    'syntax-meaning': 'caption',
    'syntax-note': 'caption',
    'load-more': 'button',
    'load-all': 'button',
    'count': 'caption',
    'loading': 'empty',
    'bag': 'fab',
    'bag-count': 'counter',
    'mode': 'banner',
    'toast': 'toast',
  },
} as const

/** The search of the icons: in the page on large screens, in the navigation bar on small ones. */
export const collectionSearchView = defineView(collection, {
  ...COLLECTION_PARTS,
  input: input<{ place: 'page' | 'bar' }>(),
}, ({ input: { place }, t }, s) => (
  <s.Search value={place} data={{ place }}>
    <Icon name="search" />
    <s.Input value={place} label={t('collection.search')} />
    <s.Clear value={place} label={t('search.clear')}>
      <Icon name="clear" />
    </s.Clear>
    <s.HelpBox>
      <s.HelpToggle value={place} label={t('search.syntax.title')}>
        <Icon name="help" />
      </s.HelpToggle>
      <s.Help value={place}>
        <s.Syntax>
          {SEARCH_SYNTAX.map(([example, meaning]) => (
            <s.SyntaxRow key={example}>
              <s.SyntaxExample>{example}</s.SyntaxExample>
              <s.SyntaxMeaning>{t(meaning)}</s.SyntaxMeaning>
            </s.SyntaxRow>
          ))}
        </s.Syntax>
        <s.SyntaxNote>{t('search.syntax.note')}</s.SyntaxNote>
      </s.Help>
    </s.HelpBox>
  </s.Search>
))

/** The page of an icon set: the sidebar, the details and filters, and the icons. */
export const collectionView = defineView(collection, COLLECTION_PARTS, ({ state, t }, s) => {
  const set = state.collection
  return (
    <s.Root data={{ collapsed: state.drawerCollapsed, mode: state.mode }}>
      <Embed view={drawerView} />
      <s.DrawerToggle label={t('collection.toggleDrawer')}>
        <Icon name="drawer" />
      </s.DrawerToggle>
      {state.loading && <s.Loading>{t('collection.loading')}</s.Loading>}
      {!state.loading && set && (
        <s.Main>
          <s.Header>
            <s.Intro>
              <s.Title>
                <s.Name>{set.name}</s.Name>
                <s.Links>
                  {set.hidden && (
                    <s.Deprecated label={t('collection.deprecated')}>
                      <Icon name="deprecated" />
                    </s.Deprecated>
                  )}
                  <s.Website label={t('collection.website')}>
                    <Icon name="website" />
                  </s.Website>
                  <s.Npm label={t('collection.npm')}>
                    <Icon name="npm" />
                  </s.Npm>
                </s.Links>
              </s.Title>
              <s.Credits>
                <s.Author>{set.author}</s.Author>
                <s.License>{set.license?.title}</s.License>
              </s.Credits>
            </s.Intro>
            <s.Actions>
              {state.cached && (
                <s.Cached label={t('settings.cached')}>
                  <Icon name="cached" />
                  <s.CachedText>{t('collection.cached')}</s.CachedText>
                </s.Cached>
              )}
              <s.SizeBox>
                <s.SizeToggle label={t('collection.size')}>
                  <Icon name="size" />
                </s.SizeToggle>
                <s.SizeMenu>
                  <s.Size label={t('collection.size')} text={t('collection.sizeValue', { size: state.size })} />
                  <s.SizeValue>{t('collection.sizeValue', { size: state.size })}</s.SizeValue>
                </s.SizeMenu>
              </s.SizeBox>
              <s.Dark label={t('nav.dark')}>
                <Icon name={state.dark ? 'dark' : 'light'} />
              </s.Dark>
              <s.Settings label={t('nav.settings')}>
                <Icon name="settings" />
              </s.Settings>
              <s.Favorite label={t(state.favorite ? 'home.unfavorite' : 'home.favorite')}>
                <Icon name={state.favorite ? 'starred' : 'star'} />
              </s.Favorite>
              <s.MenuBox>
                <Icon name="menu" />
                <s.Menu label={t('menu.title')}>
                  <s.MenuGroup value="view" label={t('menu.view')}>
                    <s.MenuOption value="grid">{t('menu.grid')}</s.MenuOption>
                    <s.MenuOption value="list">{t('menu.list')}</s.MenuOption>
                  </s.MenuGroup>
                  <s.MenuGroup value="modes" label={t('menu.modes')}>
                    <s.MenuOption value="select">{t('collection.mode.select')}</s.MenuOption>
                    <s.MenuOption value="copy">{t('collection.mode.copy')}</s.MenuOption>
                  </s.MenuGroup>
                  <s.MenuGroup value="downloads" label={t('menu.downloads')}>
                    <s.MenuOption value="cache">{t('menu.cache')}</s.MenuOption>
                    <s.MenuOption value="download_iconfont">{t('menu.iconfont')}</s.MenuOption>
                    <s.MenuOption value="download_svgs">{t('menu.svgs')}</s.MenuOption>
                    <s.MenuOption value="download_json">{t('menu.json')}</s.MenuOption>
                  </s.MenuGroup>
                </s.Menu>
              </s.MenuBox>
            </s.Actions>
          </s.Header>
          {set.categories.length > 0 && (
            <s.Categories label={t('collection.categories')}>
              {set.categories.map(category => (
                <s.Category key={category} value={category}>{category}</s.Category>
              ))}
            </s.Categories>
          )}
          <Embed view={collectionSearchView} input={{ place: 'page' }} />
          {set.variants.length > 0 && (
            <s.Variants label={t('collection.variants')}>
              <s.VariantsLabel>{t('collection.variants')}</s.VariantsLabel>
              {set.variants.map(variant => (
                <s.Variant key={variant} value={variant}>{variant}</s.Variant>
              ))}
            </s.Variants>
          )}
          <s.Scroller>
            <s.Grid>
              <Outlet name="icons" />
            </s.Grid>
            <s.More>
              <s.LoadMore>{t('collection.loadMore')}</s.LoadMore>
              <s.LoadAll>{t('collection.loadAll', { count: state.total - state.shown })}</s.LoadAll>
            </s.More>
            <s.Count>{t('home.total', { count: state.total })}</s.Count>
            <Embed view={footerView} />
          </s.Scroller>
        </s.Main>
      )}
      <s.Bag label={t('collection.openBag', { count: state.bag })}>
        <Icon name="bag" />
        <s.BagCount>{state.bag}</s.BagCount>
      </s.Bag>
      <s.Mode>
        {t(state.mode === 'copy'
          ? 'collection.mode.copy'
          : 'collection.mode.select')}
        <Icon name="clear" />
      </s.Mode>
      <s.Toast data={{ shown: state.copied }}>
        <Icon name="check" />
        {t('collection.copied')}
      </s.Toast>
    </s.Root>
  )
})
