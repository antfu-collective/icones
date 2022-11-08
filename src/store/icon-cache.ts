import LRU from 'lru-cache'

const cache = new LRU<string, HTMLElement>({
  max: 10_000,
})

export function getIcon(name: string) {
  if (cache.has(name))
    return cache.get(name)!
  const icon = document.createElement('iconify-icon')
  icon.setAttribute('mode', 'style')
  icon.setAttribute('icon', name)
  cache.set(name, icon)
  return icon
}
