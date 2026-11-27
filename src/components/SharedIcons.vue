<script setup lang="ts">
// The icons of a shared bag, for the `shared-icons` outlet of `sharedBagView`
import { bags, toggleBag } from '../store'
import { parseBagHash } from '../utils/bag'

const route = useRoute()
const icons = computed(() => parseBagHash(route.hash))
</script>

<template>
  <Icons :icons="icons" :selected="bags" toggle class="text-2xl" @select="toggleBag" />
</template>
