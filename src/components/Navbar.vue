<script lang="ts">
import { getSearchResults, isDark } from '../store'

export default defineComponent(() => ({
  ...getSearchResults(),
  isDark,
}))
</script>

<template>
  <nav
    class="
      dragging p-2 relative bg-base z-10 flex border-b border-base flex-none
    "
    :class="$route.path !== '/' ? 'md:hidden' : ''"
  >
    <!-- In Collections -->
    <template v-if="$route.path !== '/'">
      <IconButton
        class="non-dragging text-xl mx-3 my-auto flex-none"
        icon="carbon:arrow-left"
        @click="$router.replace('/')"
      />
    </template>

    <!-- Homepage Only -->
    <template v-else>
      <RouterLink
        class="non-dragging text-xl mx-3 my-auto"
        to="/collection/all"
      >
        <IconButton icon="carbon:search" style="padding-bottom: 3px" />
      </RouterLink>
      <div flex-auto />
      <h1
        absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center
        text-xl font-light tracking-2px pointer-events-none
      >
        Icônes
      </h1>
      <a
        class="non-dragging text-xl mx-3 my-auto flex-none"
        href="https://github.com/antfu/icones"
        target="_blank"
      >
        <IconButton icon="codicon:github" style="padding-bottom: 3px" />
      </a>
      <div class="non-dragging text-xl mx-3 my-auto flex-none">
        <DarkSwitcher />
      </div>
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
