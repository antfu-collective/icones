import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(__dirname, '../public')

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

  const raw = await fs.readJSON(path.join(dir, 'collections.json'))
  await fs.ensureDir(collectionsDir)

  const collections = Object
    .entries(raw)
    .map(([id, v]) => ({ ...(v as any), id }))
    .filter(v => v.hidden !== true)

  const collectionsMeta = []

  for (const info of collections) {
    const setData = await fs.readJSON(path.join(dir, 'json', `${info.id}.json`))

    const icons = Object.keys(setData.icons)
    const categories = setData.categories
    const meta = { ...info, icons, categories }
    const rawFilePath = path.join(collectionsDir, `${info.id}.json`)
    const metaFilePath = path.join(collectionsDir, `${info.id}-meta.json`)

    await fs.writeJSON(rawFilePath, setData)
    await fs.writeJSON(metaFilePath, meta)
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
    if (['flag', 'flagpack', 'cif', 'fa', 'fontisto', 'et', 'ps'].includes(info.id))
      info.sampleIcons = info.sampleIcons.slice(0, 6)

    info.prepacked = {
      prefix: setData.prefix,
      width: setData.width,
      height: setData.height,
      icons: ObjectPick(setData.icons, info.sampleIcons),
    }
    info.size = humanFileSize(fs.statSync(rawFilePath).size)
  }

  await fs.writeJSON(path.join(out, 'collections-meta.json'), collectionsMeta)
  const infoOut = path.resolve(__dirname, '../src/data')
  await fs.writeJSON(path.join(infoOut, 'collections-info.json'), collections)
}

async function copyLibs() {
  const modules = path.resolve(__dirname, '../node_modules')

  await fs.copy(
    path.join(modules, 'svg-packer/dist/index.browser.js'),
    path.join(out, 'lib/svg-packer.js'),
  )

  await fs.copy(
    path.join(modules, 'jszip/dist/jszip.min.js'),
    path.join(out, 'lib/jszip.min.js'),
  )
}

async function prepare() {
  await copyLibs()
  await prepareJSON()
}

prepare()
