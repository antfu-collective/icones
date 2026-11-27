import { defineView } from '@sekiso/core/view'
import { settings } from '../behavior/settings'
import { Icon } from './icon'

export const settingsView = defineView(settings, {
  tags: {
    'root': 'main',
    'theme': 'button',
    'category-toggle': 'button',
    'collection': 'a',
    'favorite': 'button',
    'visible': 'button',
  },
  layout: {
    'intro': 'div',
    'title': 'h1',
    'hint': 'p',
    'themes': 'div',
    'swatches': 'span',
    'swatch': 'span',
    'theme-name': 'span',
    'theme-about': 'span',
    'categories': 'div',
    'category': 'section',
    'category-header': 'div',
    'category-name': 'h2',
    'collections': 'ul',
    'row': 'li',
    'cached': 'span',
  },
  roles: {
    'root': 'page',
    'title': 'heading',
    'hint': 'caption',
    'theme': 'card',
    'swatch': 'swatch',
    'theme-name': 'text',
    'theme-about': 'caption',
    'category-name': 'subheading',
    'category-toggle': 'toggle',
    'collection': 'link',
    'favorite': 'toggle',
    'visible': 'toggle',
    'cached': 'icon-button',
  },
}, ({ state, t }, s) => (
  <s.Root>
    <s.Intro>
      <s.Title>{t('settings.theme.title')}</s.Title>
      <s.Hint>{t('settings.theme.hint')}</s.Hint>
    </s.Intro>
    <s.Themes>
      {state.themes.map(theme => (
        <s.Theme key={theme.name} value={theme.name} data={{ theme: theme.name }}>
          <s.Swatches>
            {theme.swatches.map(color => (
              <s.Swatch key={color} vars={{ swatch: color }} />
            ))}
          </s.Swatches>
          <s.ThemeName>{t(`theme.${theme.name}`)}</s.ThemeName>
          <s.ThemeAbout>{t(`theme.${theme.name}.about`)}</s.ThemeAbout>
        </s.Theme>
      ))}
    </s.Themes>
    <s.Intro>
      <s.Title>{t('settings.collections.title')}</s.Title>
      <s.Hint>{t('settings.collections.hint')}</s.Hint>
    </s.Intro>
    <s.Categories>
      {state.categories.map(category => (
        <s.Category key={category.name} data={{ hidden: category.hidden }}>
          <s.CategoryHeader>
            <s.CategoryName>{category.name}</s.CategoryName>
            <s.CategoryToggle value={category.name} label={t('settings.showCategory', { name: category.name })}>
              <Icon name={category.hidden ? 'hidden' : 'visible'} />
            </s.CategoryToggle>
          </s.CategoryHeader>
          <s.Collections>
            {category.collections.map(collection => (
              <s.Row key={collection.id} data={{ excluded: collection.excluded }}>
                <s.Collection value={collection.id}>{collection.name}</s.Collection>
                {collection.cached && (
                  <s.Cached label={t('settings.cached')}>
                    <Icon name="cached" />
                  </s.Cached>
                )}
                {!collection.excluded && (
                  <s.Favorite value={collection.id} pressed={collection.favorite} label={t('settings.favorite', { name: collection.name })}>
                    <Icon name={collection.favorite ? 'starred' : 'star'} />
                  </s.Favorite>
                )}
                {!category.hidden && (
                  <s.Visible value={collection.id} pressed={!collection.excluded} label={t('settings.show', { name: collection.name })}>
                    <Icon name={collection.excluded ? 'hidden' : 'visible'} />
                  </s.Visible>
                )}
              </s.Row>
            ))}
          </s.Collections>
        </s.Category>
      ))}
    </s.Categories>
  </s.Root>
))
