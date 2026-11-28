import type { BehaviorContext } from '@sekiso/core/behavior'

/** How long a search waits for the typing to stop. */
export const DEBOUNCE = 250

type DraftContext = BehaviorContext<{ draft: string }, { search?: string, setSearch?: (search: string) => void }>
  & { onDestroy: (listener: () => void) => void }

/**
 * A search field whose text runs ahead of the search: what is typed shows at
 * once, and goes to `setSearch` once the typing stops. A `search` set from
 * elsewhere, like the address, replaces what is typed.
 */
export function createDraft(context: DraftContext) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let sent: string | undefined

  function flush(search: string): void {
    clearTimeout(timer)
    sent = search
    context.options().setSearch?.(search)
  }

  context.onOptions((options) => {
    const search = options.search ?? ''
    if (sent === undefined || search !== sent) {
      sent = search
      context.store.set({ draft: search })
    }
  })
  context.onDestroy(() => clearTimeout(timer))

  return {
    type(draft: string): void {
      context.store.set({ draft })
      clearTimeout(timer)
      timer = setTimeout(flush, DEBOUNCE, draft)
    },
    clear(): void {
      context.store.set({ draft: '' })
      flush('')
    },
  }
}

/** The fzf search syntax, as examples and the message key that explains each. */
export const SEARCH_SYNTAX = [
  ['home outline', 'search.syntax.both'],
  ['home | house', 'search.syntax.either'],
  ['\'home', 'search.syntax.exact'],
  ['^home', 'search.syntax.start'],
  ['home$', 'search.syntax.end'],
  ['!outline', 'search.syntax.not'],
] as const
