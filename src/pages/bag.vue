<script setup lang='ts'>
import { View } from '@sekiso/vue'
import { sharedBagView } from '../sekiso/views/bag'
import { addToBag, bags } from '../store'
import { parseBagHash } from '../utils/bag'

const route = useRoute()
const router = useRouter()
const icons = computed(() => parseBagHash(route.hash))
const missing = computed(() => icons.value.filter(id => !bags.value.includes(id)))

const options = computed(() => ({
  count: icons.value.length,
  missing: missing.value.length,
  bag: bags.value.length,
  navigate: (to: string) => router.push(to),
  addAll: () => missing.value.forEach(addToBag),
}))
</script>

<template>
  <WithNavbar>
    <View :of="sharedBagView" :options="options" />
  </WithNavbar>
</template>
