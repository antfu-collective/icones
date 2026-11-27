import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(__dirname, '../public')

async function readJSON(file: string) {
  return JSON.parse(await fsp.readFile(file, 'utf-8'))
}

async function writeJSON(file: string, data: any) {
  await fsp.writeFile(file, JSON.stringify(data))
}

function ObjectPick(source: Record<string, any>, keys: string[]) {
  const obj: Record<string, any> = {}
  for (const key of keys)
    obj[key] = source[key]
  return obj
}

function humanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  const v = (size / 1024 ** i)
  return `${v.toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`
}

async function prepareJSON() {
  const dir = path.resolve(__dirname, '../node_modules/@iconify/json')
  const collectionsDir = path.resolve(__dirname, '../public/collections')

  const raw = await readJSON(path.join(dir, 'collections.json'))
  await fsp.mkdir(collectionsDir, { recursive: true })

  const collections = Object
    .entries(raw)
    .map(([id, v]) => ({
      ...(v as any),
      id,
      category: (v as any).hidden ? 'Deprecated / Unavailable' : (v as any).category,
    }))

  const collectionsMeta = []

  for (const info of collections) {
    const setData = await readJSON(path.join(dir, 'json', `${info.id}.json`))

    const icons = Object.keys(setData.icons)
    const categories = setData.categories
    const meta = { ...info, icons, categories }
    const rawFilePath = path.join(collectionsDir, `${info.id}.json`)
    const metaFilePath = path.join(collectionsDir, `${info.id}-meta.json`)

    await writeJSON(rawFilePath, setData)
    await writeJSON(metaFilePath, meta)
    collectionsMeta.push(meta)

    info.sampleIcons = icons.slice(0, 9)
    if (info.id === 'logos') {
      info.sampleIcons = [
        'vue',
        'vitejs',
        'vitest',
        'rollupjs',
        'github-icon',
        'eslint',
        'esbuild',
        'typescript-icon',
        'netlify-icon',
      ]
    }
    // non-square icons
    if ([
      'flag',
      'flagpack',
      'cif',
      'fa',
      'fontisto',
      'et',
      'ps',
    ].includes(info.id)) {
      info.sampleIcons = info.sampleIcons.slice(0, 6)
    }

    info.prepacked = {
      prefix: setData.prefix,
      width: setData.width,
      height: setData.height,
      icons: ObjectPick(setData.icons, info.sampleIcons),
    }
    info.size = humanFileSize(fs.statSync(rawFilePath).size)
  }

  await writeAgentFiles(collections)

  await writeJSON(path.join(out, 'collections-meta.json'), collectionsMeta)
  const infoOut = path.resolve(__dirname, '../src/data')
  await writeJSON(path.join(infoOut, 'collections-info.json'), collections)
}

const SITE = 'https://icones.js.org'

/**
 * Files for AI agents and other programs: `/llms.txt` and a small `/collections.json` index
 */
async function writeAgentFiles(collections: any[]) {
  const index = collections.map(c => ({
    id: c.id,
    name: c.name,
    total: c.total,
    category: c.category,
    author: c.author?.name,
    license: c.license?.title,
    licenseUrl: c.license?.url,
    palette: c.palette,
    deprecated: c.hidden || undefined,
  }))
  await writeJSON(path.join(out, 'collections.json'), index)

  const list = collections
    .filter(c => !c.hidden)
    .map(c => `- [${c.name}](${SITE}/collections/${c.id}-meta.json): \`${c.id}\`, ${c.total} icons, ${c.license?.title || 'unknown license'}`)
    .join('\n')

  const llms = `# Icônes

> Icônes is an icon explorer for ${index.length} open source icon sets (${index.reduce((sum, c) => sum + (c.total || 0), 0).toLocaleString('en-US')} icons), powered by Iconify. Every icon has an id in the form \`prefix:name\`, for example \`mdi:home\`. The prefix is the id of the icon set.

## Use the website

- \`${SITE}/collection/all?s=home\`: search all icon sets for "home".
- \`${SITE}/collection/mdi?s=arrow\`: search one icon set.
- \`${SITE}/collection/mdi?category=Navigation\`: show the icons of one category of an icon set.
- \`${SITE}/collection/mdi?icon=mdi:home\`: show one icon, with copy and download options.
- \`${SITE}/bag#mdi:home,carbon:add\`: show a shared bag (a list of icons, separated by commas). The user can add the icons to their own bag.
- \`${SITE}/?theme=washi\`: open any page in a theme, which the app then keeps: \`original\` (the default), \`washi\` (ink on Japanese paper) or \`geist\` (black and white, light or dark).

The search (\`s\`) uses the [fzf syntax](https://github.com/junegunn/fzf#search-syntax): \`home outline\` matches both words, \`home | house\` either word, \`'home\` the exact text, \`^home\` the start of the name, \`home$\` the end, and \`!outline\` excludes a word. In \`/collection/all\`, the names start with the set id, so \`^mdi: home\` searches only in \`mdi\`. Encode the query in the URL, for example \`?s=home%20!outline\`.

In a browser with WebMCP (\`document.modelContext\`), the page registers these tools: \`list_collections\`, \`get_collection\`, \`search_icons\`, \`get_icon\` (SVG, Vue, React, Svelte, CSS and more, with the license and categories), \`open_icon\`, \`get_bag\` (with a share link of the bag), \`add_to_bag\` and \`remove_from_bag\`.

## Static data

These JSON files do not need JavaScript:

- [${SITE}/collections.json](${SITE}/collections.json): index of all icon sets, with id, name, icon count, category and license.
- \`${SITE}/collections/{prefix}-meta.json\`: names of all icons in one set, with categories.
- \`${SITE}/collections/{prefix}.json\`: the full icon set in the [Iconify JSON format](https://iconify.design/docs/types/iconify-json.html), with the SVG bodies.

## Get the SVG of one icon

Icônes gets SVGs from the Iconify API:

- \`https://api.iconify.design/{prefix}/{name}.svg\`, for example https://api.iconify.design/mdi/home.svg
- Add \`?color=%23ff0000\` to set the color, or \`?height=24\` to set the size.

Check the license of the icon set before you use an icon. Some licenses require attribution.

## Icon sets

${list}
`
  await fsp.writeFile(path.join(out, 'llms.txt'), llms)
}

prepareJSON()
