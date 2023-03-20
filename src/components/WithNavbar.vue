<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <Navbar />
    <div class="flex-auto overflow-overlay flex flex-col">
      <slot />
    </div>
  </div>
</template>
