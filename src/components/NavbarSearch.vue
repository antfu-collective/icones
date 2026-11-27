<script setup lang="ts">
// The search of an icon set in the navigation bar on small screens, for the `search` outlet of `navbarView`.
// It uses the scope of the icon set's page, in `IconSet.vue`.
import { View } from '@sekiso/vue'
import { collectionSearchView } from '../sekiso/views/collection'
</script>

<template>
  <View :of="collectionSearchView" :input="{ place: 'bar' }" />
</template>
