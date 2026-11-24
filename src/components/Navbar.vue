<script lang="ts">
import { getSearchResults, isDark } from '../store'

export default defineComponent({
  setup() {
    const route = useRoute()

    return {
      ...getSearchResults(),
      isDark,
      showNav: computed(() => !route.path.startsWith('/collection')),
      isHomepage: computed(() => route.path === '/'),
    }
  },
})
</script>

<template>
  <nav
    class="dragging"
    flex="~ gap4 none"
    px4 py3 md:p4 items-center relative bg-base z-10 border="b base" text-xl
    :class="showNav ? '' : 'md:hidden'"
  >
    <!-- In Collections -->
    <template v-if="!isHomepage">
      <RouterLink
        class="non-dragging"
        icon-button flex-none
        i-carbon:arrow-left
        to="/"
        title="Back to collections"
        aria-label="Back to collections"
      />
    </template>

    <!-- Homepage Only -->
    <template v-if="showNav">
      <!-- <RouterLink
        class="non-dragging"
        i-carbon:search icon-button flex-none
        to="/collection/all"
      /> -->
      <div flex-auto />
      <h1
        absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center
        text-xl font-light tracking-2px pointer-events-none
      >
        Icônes
      </h1>
      <a
        class="non-dragging"
        i-carbon-logo-github icon-button flex-none
        href="https://github.com/antfu/icones"
        target="_blank"
        title="GitHub"
        aria-label="GitHub"
      />
      <RouterLink
        class="non-dragging"
        i-carbon-settings icon-button flex-none
        to="/settings"
        title="Settings"
        aria-label="Settings"
      />
      <DarkSwitcher flex-none />
    </template>

    <!-- Searching -->
    <SearchBar
      v-if="collection"
      v-model:search="search"
      class="flex items-center w-full rounded-lg bg-gray-400/10 text-base"
      :style="false"
      :icon="false"
    />
  </nav>
</template>
