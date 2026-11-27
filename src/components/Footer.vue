<script setup lang="ts">
// The footer's state comes from the scope in `App.vue`
import { View } from '@sekiso/vue'
import { footerView } from '../sekiso/views/footer'
</script>

<template>
  <View :of="footerView" />
</template>
