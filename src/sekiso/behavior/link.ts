/** A port that opens a page of the app, without a page load. The renderer supplies it. */
export type Navigate = (to: string) => void

/**
 * Opens an in-app link with `navigate`, as a router link does. A click with a
 * modifier key, or one a handler already took, keeps the browser's own behavior,
 * so a link still opens in a new tab.
 */
export function followLink(event: Event, to: string, navigate: Navigate | undefined): void {
  const click = event as MouseEvent
  if (!navigate || click.defaultPrevented || click.button !== 0 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey)
    return
  event.preventDefault()
  navigate(to)
}

/** The attributes of a link to another site. */
export function external(href: string): Record<string, string> {
  return { href, target: '_blank', rel: 'noopener' }
}
