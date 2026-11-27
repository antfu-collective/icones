import { defineView, Outlet } from '@sekiso/core/view'
import { detail } from '../behavior/detail'
import { Icon } from './icon'

export const detailView = defineView(detail, {
  tags: {
    'root': 'div',
    'backdrop': 'div',
    'panel': 'div',
    'close': 'button',
    'preview': 'label',
    'color': 'input',
    'help': 'button',
    'copy-name': 'button',
    'case-toggle': 'button',
    'cases': 'div',
    'case': 'button',
    'license': 'a',
    'collection': 'a',
    'category': 'a',
    'bag': 'button',
    'selecting': 'button',
    'copy-color': 'button',
    'snippet': 'button',
    'snippet-preview': 'div',
    'download': 'button',
    'link': 'a',
    'install-docs': 'a',
    'manager': 'button',
    'copy-install': 'button',
    'toast': 'div',
  },
  layout: {
    'handle': 'span',
    'aside': 'div',
    'artwork': 'span',
    'preview-text': 'span',
    'body': 'div',
    'id': 'div',
    'id-text': 'span',
    'meta': 'p',
    'categories': 'p',
    'chips': 'div',
    'swatch': 'span',
    'color-text': 'code',
    'groups': 'div',
    'group': 'div',
    'group-name': 'h3',
    'group-items': 'div',
    'tag': 'sup',
    'preview-title': 'div',
    'preview-hint': 'span',
    'install': 'div',
    'managers': 'div',
    'manager-name': 'span',
    'command': 'div',
    'code': 'code',
    'code-manager': 'span',
    'code-verb': 'span',
    'code-package': 'span',
  },
  roles: {
    'panel': 'sheet',
    'close': 'icon-button',
    'help': 'link',
    'preview-text': 'caption',
    'id-text': 'code',
    'copy-name': 'icon-button',
    'case-toggle': 'icon-button',
    'cases': 'popover',
    'case': 'option',
    'license': 'link',
    'meta': 'caption',
    'collection': 'link',
    'categories': 'caption',
    'category': 'link',
    'bag': 'chip',
    'selecting': 'chip',
    'copy-color': 'chip',
    'swatch': 'swatch',
    'group-name': 'caption',
    'snippet': 'button',
    'snippet-preview': 'popover',
    'preview-hint': 'caption',
    'download': 'button',
    'link': 'button',
    'install-docs': 'link',
    'manager': 'tab',
    'code': 'code',
    'copy-install': 'icon-button',
    'toast': 'toast',
  },
}, ({ state, t }, s) => (
  <s.Root data={{ open: state.open }}>
    <s.Backdrop />
    <s.Panel>
      {state.icon !== '' && (
        <>
          <s.Handle />
          <s.Close label={t('detail.close')}>
            <Icon name="clear" />
          </s.Close>
          <s.Aside>
            <s.Preview data={{ contrast: state.lowContrast }} vars={{ color: state.color }}>
              <s.Artwork>
                <Outlet name="preview" icon={state.icon} />
              </s.Artwork>
              <s.PreviewText>
                <Icon name="color" />
                {t('detail.changeColor')}
              </s.PreviewText>
              <s.Color label={t('detail.changeColorLabel')} />
            </s.Preview>
          </s.Aside>
          <s.Body>
            <s.Help>{t('detail.help')}</s.Help>
            <s.Id>
              <s.IdText>{state.name}</s.IdText>
              <s.CopyName label={t('detail.copyName')}>
                <Icon name="copy" />
              </s.CopyName>
              <s.CaseToggle label={t('detail.case')}>
                <Icon name="case" />
              </s.CaseToggle>
              <s.Cases>
                {state.cases.map(item => (
                  <s.Case key={item.key} value={item.key}>
                    <Icon name="check" />
                    {item.label}
                  </s.Case>
                ))}
              </s.Cases>
            </s.Id>
            <s.License>{state.license?.title}</s.License>
            {state.collection && (
              <s.Meta>
                {t('detail.collection')}
                {' '}
                <s.Collection>{state.collection.name}</s.Collection>
              </s.Meta>
            )}
            {state.categories.length > 0 && (
              <s.Categories>
                {t('detail.categories', { count: state.categories.length })}
                {' '}
                {state.categories.map(category => (
                  <s.Category key={category} value={category}>{category}</s.Category>
                ))}
              </s.Categories>
            )}
            <s.Chips>
              <s.Bag>
                <Icon name={state.inBag ? 'bag' : 'add'} />
                {t(state.inBag ? 'detail.inBag' : 'detail.addToBag')}
              </s.Bag>
              <s.Selecting>
                <Icon name="select" />
                {t('detail.selecting')}
              </s.Selecting>
              <s.CopyColor>
                <Icon name={state.copyColor ? 'checked' : 'unchecked'} />
                {t('detail.copyColor')}
                <s.Swatch vars={{ swatch: state.color }} />
                <s.ColorText>{state.color}</s.ColorText>
              </s.CopyColor>
            </s.Chips>
            <s.Groups>
              {state.groups.map(group => (
                <s.Group key={group.name}>
                  <s.GroupName>{t(`detail.group.${group.name}`)}</s.GroupName>
                  <s.GroupItems>
                    {group.formats.map(format => (
                      <s.Snippet key={format.type} value={format.type}>
                        {format.name}
                        {format.tag && <s.Tag>{format.tag}</s.Tag>}
                      </s.Snippet>
                    ))}
                  </s.GroupItems>
                </s.Group>
              ))}
              <s.Group>
                <s.GroupName>{t('detail.group.Download')}</s.GroupName>
                <s.GroupItems>
                  {state.downloads.map(format => (
                    <s.Download key={format.type} value={format.type}>
                      {format.name}
                      {format.tag && <s.Tag>{format.tag}</s.Tag>}
                    </s.Download>
                  ))}
                </s.GroupItems>
              </s.Group>
              <s.Group>
                <s.GroupName>{t('detail.group.View')}</s.GroupName>
                <s.GroupItems>
                  {state.links.map(link => (
                    <s.Link key={link.name} value={link.name}>{link.name}</s.Link>
                  ))}
                </s.GroupItems>
              </s.Group>
            </s.Groups>
            <s.SnippetPreview vars={{ x: `${state.previewX}px`, y: `${state.previewY}px` }}>
              <s.PreviewTitle>
                {t('detail.preview')}
                {' '}
                <s.PreviewHint>{t('detail.previewHint')}</s.PreviewHint>
              </s.PreviewTitle>
              <Outlet name="snippet-code" icon={state.icon} type={state.previewing} color={state.copyColor ? state.color : 'currentColor'} />
            </s.SnippetPreview>
            {state.packageName !== '' && (
              <s.Install>
                <s.InstallDocs>{t('detail.install')}</s.InstallDocs>
                <s.Managers>
                  {state.managers.map(manager => (
                    <s.Manager key={manager} value={manager}>
                      <Icon name={`manager-${manager}` as 'manager-pnpm'} />
                      <s.ManagerName>{manager}</s.ManagerName>
                    </s.Manager>
                  ))}
                </s.Managers>
                <s.Command>
                  <s.Code>
                    <s.CodeManager>{state.manager}</s.CodeManager>
                    <s.CodeVerb>
                      {state.manager === 'npm'
                        ? ' i -D '
                        : ' add -D '}
                    </s.CodeVerb>
                    <s.CodePackage>{state.packageName}</s.CodePackage>
                  </s.Code>
                  <s.CopyInstall label={t('detail.copyInstall')}>
                    <Icon name="copy" />
                  </s.CopyInstall>
                </s.Command>
              </s.Install>
            )}
          </s.Body>
        </>
      )}
    </s.Panel>
    <s.Toast data={{ shown: state.copied }}>
      <Icon name="check" />
      {t('collection.copied')}
    </s.Toast>
  </s.Root>
))
