import LRU from 'lru-cache'

const cache = new LRU<string, HTMLElement>({
  max: 1_000,
})

const mounted = new WeakSet<HTMLElement>()

export function getIcon(name: string) {
  if (cache.has(name) && !mounted.has(cache.get(name)!))
    return cache.get(name)!
  const icon = document.createElement('iconify-icon')
  icon.setAttribute('mode', 'style')
  icon.setAttribute('icon', name)
  cache.set(name, icon)
  mounted.add(icon)
  return icon
}

export function unmountIcon(name: string, icon: HTMLElement) {
  mounted.delete(icon)
  cache.set(name, icon)
}
