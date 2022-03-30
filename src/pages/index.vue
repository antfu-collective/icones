<script setup lang='ts'>
import { sortedCollectionsInfo as collections } from '../data'
</script>

<template>
  <WithNavbar>
    <NavPlaceholder class="sm:border-b border-gray-200 text-center m-auto flex font-light dark:border-dark-200" style="height:37px">
      <div class="m-auto">
        Icônes
      </div>
    </NavPlaceholder>
    <CollectionEntries :collections="collections" />
    <Footer />
  </WithNavbar>
</template>
