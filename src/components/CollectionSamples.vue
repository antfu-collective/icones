<script setup lang="ts">
// The sample icons of a card on the home page, for the `samples` outlet of `homeView`
defineProps<{
  icons: string[]
  namespace: string
}>()
</script>

<template>
  <Icons
    :icons="icons"
    :namespace="namespace"
    color-class=""
    size="xl"
    :tooltip="false"
    :interactive="false"
    spacing="m-1"
    class="justify-center"
  />
</template>
