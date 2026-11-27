import type { Translate } from '@sekiso/core/view'
import type { HomeSection } from '../behavior/home'
import { defineView, Embed, Outlet } from '@sekiso/core/view'
import { home } from '../behavior/home'
import { Icon } from '../schema'
import { footerView } from './footer'

function sectionName(section: HomeSection, t: Translate): string {
  return section.type === 'normal'
    ? section.name
    : t(`home.section.${section.type}`)
}

/** Both views of the home page share one instance, so the parts are the same. */
const HOME_PARTS = {
  parts: {
    'root': 'main.page',
    'search': 'form.search',
    'input': 'input',
    'clear': 'button.icon-button',
    'search-all': 'a.card',
    'card': 'a.card',
    'favorite': 'button.toggle',
    'forget': 'button.icon-button',
    'header': 'div',
    'search-all-text': 'span',
    'shortcut': 'span',
    'key': 'kbd.keycap',
    'sections': 'div',
    'section': 'section',
    'section-header': 'div',
    'section-name': 'h2.subheading',
    'section-count': 'span.caption',
    'cards': 'div',
    'card-body': 'div',
    'card-name': 'span.text',
    'badges': 'span',
    'card-meta': 'span.caption',
    'author': 'span',
    'license': 'span',
    'total': 'span',
    'samples': 'span',
    'card-actions': 'span',
    'empty': 'div.empty',
    'empty-text': 'p',
  },
} as const

/** The search of icon sets, in the header that sticks to the top. */
export const homeSearchView = defineView(home, HOME_PARTS, ({ state, t }, s) => (
  <s.Header>
    <s.Search data={{ open: state.draft !== '' }}>
      <Icon name="search" />
      <s.Input label={t('home.search')} />
      <s.Clear label={t('search.clear')}>
        <Icon name="clear" />
      </s.Clear>
    </s.Search>
    <s.SearchAll>
      <Icon name="search-all" />
      <s.SearchAllText>{t('home.searchAll')}</s.SearchAllText>
      <s.Shortcut>
        <s.Key>{t(state.mac ? 'key.command' : 'key.control')}</s.Key>
        {' + '}
        <s.Key>{t('key.enter')}</s.Key>
      </s.Shortcut>
    </s.SearchAll>
  </s.Header>
))

/** The icon sets by category, or the matches of the search. */
export const homeView = defineView(home, HOME_PARTS, ({ state, t }, s) => {
  const sections = state.sections.filter(section => section.collections.length > 0)
  return (
    <s.Root>
      <s.Sections>
        {sections.map(section => (
          <s.Section key={section.name} data={{ type: section.type }}>
            <s.SectionHeader>
              <s.SectionName>{sectionName(section, t)}</s.SectionName>
              <s.SectionCount>{section.collections.length}</s.SectionCount>
            </s.SectionHeader>
            <s.Cards>
              {section.collections.map((collection) => {
                const favorite = state.favorites.includes(collection.id)
                return (
                  <s.Card key={collection.id} value={collection.id} data={{ hidden: collection.hidden }}>
                    <s.CardBody>
                      <s.CardName>
                        {collection.name}
                        <s.Badges>
                          {favorite && <Icon name="starred" />}
                          {collection.hidden && <Icon name="deprecated" />}
                        </s.Badges>
                      </s.CardName>
                      <s.CardMeta>
                        <s.Author>{collection.author?.name}</s.Author>
                        <s.License>{collection.license?.title}</s.License>
                        <s.Total>{t('home.total', { count: collection.total ?? 0 })}</s.Total>
                      </s.CardMeta>
                    </s.CardBody>
                    <s.Samples>
                      <Outlet name="samples" icons={collection.sampleIcons ?? []} namespace={`${collection.id}:`} />
                    </s.Samples>
                    <s.CardActions>
                      <s.Favorite value={collection.id} label={t(favorite ? 'home.unfavorite' : 'home.favorite')}>
                        <Icon name={favorite ? 'starred' : 'star'} />
                      </s.Favorite>
                      {section.type === 'recent' && (
                        <s.Forget value={collection.id} label={t('home.forget')}>
                          <Icon name="remove" />
                        </s.Forget>
                      )}
                    </s.CardActions>
                  </s.Card>
                )
              })}
            </s.Cards>
          </s.Section>
        ))}
        {sections.length === 0 && (
          <s.Empty>
            <Icon name="empty" />
            <s.EmptyText>{t('home.empty')}</s.EmptyText>
          </s.Empty>
        )}
        <Embed view={footerView} />
      </s.Sections>
    </s.Root>
  )
})
