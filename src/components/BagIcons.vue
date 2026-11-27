<script setup lang="ts">
// The icons in the bag, for the `bag-icons` outlet of `bagView`
import { BagSelectKey } from '../hooks'
import { bags } from '../store'

const select = inject(BagSelectKey)!
</script>

<template>
  <Icons :icons="bags" @select="select" />
</template>
