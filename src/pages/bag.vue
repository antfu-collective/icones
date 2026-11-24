<script setup lang='ts'>
import { addToBag, bags, toggleBag } from '../store'
import { parseBagHash } from '../utils/bag'

const route = useRoute()
const icons = computed(() => parseBagHash(route.hash))
const missing = computed(() => icons.value.filter(id => !bags.value.includes(id)))

function addAll() {
  missing.value.forEach(addToBag)
}
</script>

<template>
  <WithNavbar>
    <div class="flex-auto of-y-auto px-4 md:px-8 py-6">
      <h1 class="text-xl">
        Shared bag
      </h1>
      <template v-if="icons.length">
        <p class="op50 text-sm mb-4">
          {{ icons.length }} icons. Click an icon to add it to your bag or remove it.
        </p>
        <button class="btn mb-4" :disabled="!missing.length" @click="addAll">
          {{ missing.length ? `Add ${missing.length} icons to my bag` : 'All icons are in your bag' }}
        </button>
        <Icons :icons="icons" :selected="bags" toggle class="text-2xl" @select="toggleBag" />
        <p class="op50 text-sm mt-4">
          Your bag has {{ bags.length }} icons. <RouterLink to="/collection/all" class="underline">
            Browse icons
          </RouterLink>
        </p>
      </template>
      <p v-else class="op50 text-sm">
        This link has no icons.
      </p>
    </div>
  </WithNavbar>
</template>
