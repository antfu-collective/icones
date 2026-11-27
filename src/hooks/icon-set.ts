import type { ComputedRef, InjectionKey, Ref } from 'vue'

/** What the outlets of the icon set's page read from the page. */
export interface IconSetContext {
  icons: Readonly<Ref<string[]>>
  max: Ref<number>
  namespace: ComputedRef<string>
  search: Ref<string>
  select: (icon: string) => void
  loadMore: () => void
}

export const IconSetKey: InjectionKey<IconSetContext> = Symbol('icon-set')

/** What the outlet of the bag's icons reads from the bag. */
export const BagSelectKey: InjectionKey<(icon: string) => void> = Symbol('bag-select')
