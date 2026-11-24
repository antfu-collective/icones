const ICON_ID_RE = /^[a-z0-9-]+:[a-z0-9-]+$/

/**
 * Read the icon ids from the hash of a shared bag link, like `#mdi:home,carbon:add`.
 * The hash is not sent to the server.
 */
export function parseBagHash(hash: string): string[] {
  let text = hash.replace(/^#/, '')
  try {
    text = decodeURIComponent(text)
  }
  catch {}
  const ids = text
    .split(',')
    .map(id => id.trim())
    .filter(id => ICON_ID_RE.test(id))
  return Array.from(new Set(ids))
}

export function getBagShareUrl(ids: string[], origin: string) {
  return `${origin}/bag#${ids.join(',')}`
}
