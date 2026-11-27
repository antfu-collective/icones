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
- `pnpm check:themes`: checks each theme in `src/sekiso/themes` against the contract in `src/sekiso/schema.ts`.

Before you finish a change, run `pnpm lint`, `pnpm typecheck` and `pnpm test --run`. If you change `src/sekiso`, also run `pnpm check:themes`.

## Generated data

`scripts/prepare.ts` reads `@iconify/json` and writes these files. They are in `.gitignore`. Do not edit them by hand.

- `public/collections/{prefix}.json`: the full icon set.
- `public/collections/{prefix}-meta.json`: the icon names and categories of one set.
- `public/collections-meta.json`: the names of all icons in all sets (large, about 7.5 MB).
- `public/collections.json` and `public/llms.txt`: the index and guide for AI agents.
- `src/data/collections-info.json`: the set list that the app bundles, with sample icons.

If these files are missing, run `pnpm tsx scripts/prepare.ts`.

## Themes (Sekiso)

The UI uses [Sekiso](https://github.com/vercel-labs/sekiso): neutral views that a theme dresses. A theme changes the look _and_ the layout, so the same view can be a grid of cards, a ruled table or a column of tall cards. The layers are in `src/sekiso`, and `eslint-plugin-sekiso` keeps each to its job:

- `behavior/`: primitives (`definePrimitive` from `@ui-sdk/core`). State, actions, and the attributes of each part. No markup, text or styles. The renderer passes data and ports (like `navigate`) as options.
- `views/`: neutral JSX (`defineView`). Only named parts, no classes, no styles, and all text from `t()` in `locales/en.json`. Native Vue components go in an `<Outlet>`, registered in `src/sekiso/renderer.ts`.
- `themes/<name>/`: `defineTheme`, with a CSS module that has a class per role and per part (`data-slot`), the tokens, and the icons. `washi` and `geist` extend `original` and add to it with `compose()`.
- `schema.ts`: the icons, roles and tokens that every theme gives.

The theme is in `localStorage` (`src/store/theme.ts`). The settings page picks it, and the `?theme=` query param of any page sets it. Every screen is a Sekiso view. The Vue files in `src/pages` and `src/components` only connect the stores to the views, as options and ports. A few native components stay, in outlets: the icon grid (`Icons.vue`, for speed), the icon preview and the highlighted code. New UI goes in `src/sekiso`.

## Layout

- `src/pages`: routes, from `vite-plugin-pages`. `/collection/:id` shows one set. The ids `all` and `recent` are special.
- `src/sekiso`: the Sekiso app, see above.
- `src/components`: Vue components. `Icons.vue` is the icon grid. `IconSet.vue` and `IconDetail.vue` connect the icon set page and the icon sheet to their views.
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
- `/?theme=washi`: open a page in a theme (`original`, `washi` or `geist`).

Keep this. New views and filters must also go in the URL.

## Agent support

Keep Icônes easy to use for AI agents:

- If you change what users can do, update the WebMCP tools in `src/utils/agent-tools.ts` and the guide in `writeAgentFiles()` in `scripts/prepare.ts`.
- Each icon-only button needs an accessible name: the `label` prop of `IconButton` and `FAB`, or `aria-label`. Use `<button>` for actions, not a `<div>` with `@click`.
- Toggle buttons use `aria-pressed`.

## Conventions

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore(deps):`).
- Do not commit the generated data, `dist` or `dev-dist`.
