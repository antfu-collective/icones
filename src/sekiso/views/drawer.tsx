import { defineView } from '@sekiso/core/view'
import { drawer } from '../behavior/drawer'
import { Icon } from './icon'

export const drawerView = defineView(drawer, {
  tags: {
    root: 'aside',
    back: 'button',
    search: 'form',
    input: 'input',
    clear: 'button',
    link: 'a',
    favorite: 'button',
  },
  layout: {
    top: 'div',
    bar: 'div',
    list: 'nav',
    text: 'span',
    name: 'span',
    count: 'span',
  },
  roles: {
    back: 'icon-button',
    search: 'search',
    clear: 'icon-button',
    link: 'list-item',
    name: 'text',
    count: 'caption',
    favorite: 'toggle',
  },
}, ({ state, t }, s) => (
  <s.Root>
    <s.Top>
      <s.Bar>
        <s.Back label={t('nav.back')}>
          <Icon name="back" />
        </s.Back>
      </s.Bar>
      <s.Search>
        <Icon name="search" />
        <s.Input label={t('home.search')} />
        <s.Clear label={t('search.clear')}>
          <Icon name="clear" />
        </s.Clear>
      </s.Search>
    </s.Top>
    <s.List label={t('drawer.label')}>
      {state.items.map((item) => {
        const favorite = state.favorites.includes(item.id)
        return (
          <s.Link key={item.id} value={item.id} data={{ current: state.current === item.id, hidden: item.hidden }}>
            <s.Text>
              <s.Name>
                {item.special
                  ? t(`drawer.${item.id}`)
                  : item.name}
                {item.hidden && <Icon name="deprecated" />}
              </s.Name>
              <s.Count>
                {t(item.id === 'all'
                  ? 'drawer.sets'
                  : 'home.total', { count: item.count })}
              </s.Count>
            </s.Text>
            {!item.special && (
              <s.Favorite value={item.id} label={t(favorite ? 'home.unfavorite' : 'home.favorite')}>
                <Icon name={favorite ? 'starred' : 'star'} />
              </s.Favorite>
            )}
          </s.Link>
        )
      })}
    </s.List>
  </s.Root>
))
