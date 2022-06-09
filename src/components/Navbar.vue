<script lang="ts">
import { getSearchResults, isDark } from '../store'

export default defineComponent(() => ({
  ...getSearchResults(),
  isDark,
}))
</script>

<template>
  <nav
    class="dragging"
    flex="~ gap4 none"
    p4 relative bg-base z-10 border="b base" text-xl
    :class="$route.path !== '/' ? 'md:hidden' : ''"
  >
    <!-- In Collections -->
    <template v-if="$route.path !== '/'">
      <div
        class="non-dragging"
        icon-button flex-none
        i-carbon:arrow-left
        @click="$router.replace('/')"
      />
    </template>

    <!-- Homepage Only -->
    <template v-else>
      <RouterLink
        class="non-dragging"
        i-carbon:search icon-button flex-none
        to="/collection/all"
      />
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
      />
      <DarkSwitcher flex-none />
    </template>

    <!-- Searching -->
    <div v-if="collection" class="flex">
      <form action="/collection/all" role="search" method="get" @submit.prevent>
        <input
          v-model="search"
          aria-label="Search"
          class="color-base text-base outline-none py-2 px-4 flex-auto m-0 w-full bg-transparent"
          name="s"
          placeholder="Search..."
        >
      </form>
    </div>
  </nav>
</template>
