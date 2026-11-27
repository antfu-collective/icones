<script setup lang="ts">
// The icons of the icon set's page, for the `icons` outlet of `collectionView`
import { IconSetKey } from '../hooks'
import { activeMode, bags, iconSize, listType } from '../store'

const { icons, max, namespace, search, select, loadMore } = inject(IconSetKey)!

const sentinel = ref<HTMLElement>()
// On mobile the document scrolls, not the icon list (see App.vue)
const isMobile = useMediaQuery('(max-width: 767.9px)')
const scroller = computed(() => sentinel.value?.closest<HTMLElement>('[data-slot="collection-scroller"]') ?? undefined)
const scrollRoot = computed(() => isMobile.value ? undefined : scroller.value)

watch(namespace, () => {
  (scrollRoot.value ?? window).scrollTo({ top: 0 })
})

// Load more icons when the end of the list comes near
const LOAD_MARGIN = 600
const nearEnd = ref(false)
useIntersectionObserver(sentinel, ([entry]) => {
  nearEnd.value = entry?.isIntersecting ?? false
}, { root: scrollRoot, rootMargin: `0px 0px ${LOAD_MARGIN}px 0px` })

function isSentinelNear() {
  if (!sentinel.value)
    return false
  const bottom = scrollRoot.value?.getBoundingClientRect().bottom ?? window.innerHeight
  return sentinel.value.getBoundingClientRect().top < bottom + LOAD_MARGIN
}

// The sentinel can stay near after a load, when the icons are small.
// The observer does not fire again in that case, so measure after the render.
watch([
  nearEnd,
  max,
  () => icons.value.length,
], async () => {
  if (!nearEnd.value)
    return
  await nextTick()
  if (icons.value.length > max.value && isSentinelNear())
    loadMore()
})
</script>

<template>
  <Icons
    :key="namespace"
    :icons="icons.slice(0, max)"
    :selected="bags"
    :style="{ fontSize: `${iconSize}px` }"
    :display="listType"
    :search="search"
    :namespace="namespace"
    :toggle="activeMode === 'select'"
    @select="select"
  />
  <div ref="sentinel" />
</template>
