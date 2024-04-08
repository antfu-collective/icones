<template>
  <div class="p-6 w-120 help-page">
    <p class="mb-2 opacity-75">
      How to use the icon?
    </p>

    <h2 class="bold text-lg mb-1">
      Copy per Icon
    </h2>
    <p>
      You can copy the icon as SVG to paste in almost any editor (Figma, Sketch, Illustrator, etc.), or copy as component to use in your web apps.
    </p>

    <h2 class="bold text-lg mt-5 mb-1">
      Iconify Runtime
    </h2>
    <p>
      Iconify provides a runtime solution that fetches icons on the go.
      Refer its <a href="https://iconify.design/" target="_blank">documentation</a> for more details.
    </p>

    <h2 class="bold text-lg mt-5 mb-1">
      Atomic CSS
    </h2>
    <p>
      Created by the author of <b>Icônes</b>. With the power of <a href="https://github.com/antfu/unocss">UnoCSS</a>, you can use the icons with <b>Pure CSS</b> using <a href="https://github.com/antfu/unocss/tree/main/packages/preset-icons" target="_blank"><code>@unocss/preset-icons</code></a>.
    </p>
    <p class="mt-2">
      Check out <a href="https://antfu.me/posts/icons-in-pure-css" target="_blank">this blog post</a> for more.
    </p>

    <h2 class="bold text-lg mt-5 mb-1">
      Components
    </h2>
    <p>
      Created by the author of <b>Icônes</b>, <a href="https://github.com/antfu/unplugin-icons" target="_blank"><code>unplugin-icons</code></a> is a on-demand
      solution to generate icons as components on the fly.
    </p>
    <p class="mt-2">
      Check out <a href="https://antfu.me/posts/journey-with-icons-continues" target="_blank">this blog post</a> for the story behind.
    </p>
  </div>
</template>

<style lang="postcss">
.help-page p {
  @apply text-black/60 dark:text-white/60;
}
.help-page a {
  @apply text-primary opacity-75 hover:opacity-100;
}
</style>
