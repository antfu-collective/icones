# AGENTS.md

Icônes is an icon explorer for the Iconify icon sets. It is a static Vue 3 + Vite single-page app, deployed to Netlify. It also runs inside a VS Code webview (`isVSCode` in `src/env.ts`).

## Commands

Use pnpm. Node 24.

- `pnpm install`: installs the dependencies. The `postinstall` script runs `scripts/prepare.ts`.
- `pnpm dev`: starts the dev server on port 3333.
- `pnpm build`: generates the data, then builds to `dist`.
- `pnpm test --run`: runs the Vitest tests once.
- `pnpm lint`: runs ESLint (`@antfu/eslint-config`). Add `--fix` to fix the style.
- `pnpm typecheck`: runs `vue-tsc`.

Before you finish a change, run `pnpm lint`, `pnpm typecheck` and `pnpm test --run`.

## Generated data

`scripts/prepare.ts` reads `@iconify/json` and writes these files. They are in `.gitignore`. Do not edit them by hand.

- `public/collections/{prefix}.json`: the full icon set.
- `public/collections/{prefix}-meta.json`: the icon names and categories of one set.
- `public/collections-meta.json`: the names of all icons in all sets (large, about 7.5 MB).
- `public/collections.json` and `public/llms.txt`: the index and guide for AI agents.
- `src/data/collections-info.json`: the set list that the app bundles, with sample icons.

If these files are missing, run `pnpm tsx scripts/prepare.ts`.

## Layout

- `src/pages`: routes, from `vite-plugin-pages`. `/collection/:id` shows one set. The ids `all` and `recent` are special.
- `src/components`: Vue components. `Icons.vue` is the icon grid, `IconDetail.vue` is the icon dialog.
- `src/data`: loads the collections and icon data.
- `src/store`: global state. User settings and the bag are in `localStorage` (`src/store/localstorage.ts`).
- `src/hooks/search.ts`: icon search. It uses `fzf` and the predicted words of `gpu-icons-search` (`src/utils/predict.ts`).
- `src/utils/svg`: SVG transformers (SVG to Vue, React, Svelte and more). `test/transformers.test.ts` has snapshot tests for them.
- `src/utils/agent-tools.ts`: WebMCP tools for AI agents in the browser.

Vue APIs, `vue-router` and `@vueuse/core` are auto-imported (`unplugin-auto-import`). Components in `src/components` are auto-registered. Styles use UnoCSS, often in attributify mode (`flex="~ gap-2"`).

## URLs

The app state is in the URL, so links work for people and for agents:

- `/collection/all?s=home`: search all sets.
- `/collection/mdi?s=arrow&category=Navigation`: search one set, in one category.
- `/collection/mdi?icon=mdi:home`: open the dialog of one icon.
- `/bag#mdi:home,carbon:add`: show a shared bag. The icons are in the hash, so they are not sent to the server.

Keep this. New views and filters must also go in the URL.

## Agent support

Keep Icônes easy to use for AI agents:

- If you change what users can do, update the WebMCP tools in `src/utils/agent-tools.ts` and the guide in `writeAgentFiles()` in `scripts/prepare.ts`.
- Each icon-only button needs an accessible name: the `label` prop of `IconButton` and `FAB`, or `aria-label`. Use `<button>` for actions, not a `<div>` with `@click`.
- Toggle buttons use `aria-pressed`.

## Conventions

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore(deps):`).
- Do not commit the generated data, `dist` or `dev-dist`.
