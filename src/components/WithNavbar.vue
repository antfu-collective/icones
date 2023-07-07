<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <Navbar />
    <div class="flex-auto flex flex-col of-hidden">
      <slot />
    </div>
  </div>
</template>
