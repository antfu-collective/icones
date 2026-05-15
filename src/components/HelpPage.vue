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
      Created by the author of <b>Icônes</b>. With the power of <a href="https://github.com/antfu/unocss">UnoCSS</a>, you can use the icons with <b>Pure CSS</b> using <a href="https://github.com/unocss/unocss/tree/main/packages-presets/preset-icons" target="_blank"><code>@unocss/preset-icons</code></a>.
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

    <h2 class="bold text-lg mt-5 mb-1">
      Search Syntax
    </h2>
    <p>
      The search is powered by <a href="https://github.com/junegunn/fzf#search-syntax" target="_blank">fzf</a>.
      By default, it uses fuzzy matching. You can use the following syntax for more precise results:
    </p>
    <table class="mt-2 w-full text-sm">
      <thead>
        <tr class="text-left">
          <th class="py-1 pr-3">
            Token
          </th>
          <th class="py-1 pr-3">
            Match type
          </th>
          <th class="py-1">
            Example
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="py-1 pr-3">
            <code>'word</code>
          </td>
          <td class="py-1 pr-3">
            Exact match
          </td>
          <td class="py-1">
            <code>'heart</code>
          </td>
        </tr>
        <tr>
          <td class="py-1 pr-3">
            <code>^word</code>
          </td>
          <td class="py-1 pr-3">
            Prefix match
          </td>
          <td class="py-1">
            <code>^arrow</code>
          </td>
        </tr>
        <tr>
          <td class="py-1 pr-3">
            <code>word$</code>
          </td>
          <td class="py-1 pr-3">
            Suffix match
          </td>
          <td class="py-1">
            <code>left$</code>
          </td>
        </tr>
        <tr>
          <td class="py-1 pr-3">
            <code>!word</code>
          </td>
          <td class="py-1 pr-3">
            Negation
          </td>
          <td class="py-1">
            <code>!outline</code>
          </td>
        </tr>
        <tr>
          <td class="py-1 pr-3">
            <code>a | b</code>
          </td>
          <td class="py-1 pr-3">
            OR
          </td>
          <td class="py-1">
            <code>'heart | 'star</code>
          </td>
        </tr>
        <tr>
          <td class="py-1 pr-3">
            <code>a b</code>
          </td>
          <td class="py-1 pr-3">
            AND (multiple terms)
          </td>
          <td class="py-1">
            <code>'arrow 'left</code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="postcss">
.help-page p {
  @apply text-black/60 dark:text-white/60;
}
.help-page a {
  @apply text-primary opacity-75 hover:opacity-100;
}
.help-page table {
  @apply text-black/60 dark:text-white/60;
}
.help-page code {
  @apply px-1.5 py-0.5 rounded bg-gray/10 text-black/80 dark:text-white/80 font-mono text-xs;
}
</style>
