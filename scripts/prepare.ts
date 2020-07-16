import path from 'path'
import fs from 'fs-extra'

const dir = path.resolve(__dirname, '../node_modules/@iconify/json')
const out = path.resolve(__dirname, '../public')
const collectionsDir = path.resolve(__dirname, '../public/collections')

async function prepare() {
  const raw = await fs.readJSON(path.join(dir, 'collections.json'))
  await fs.ensureDir(collectionsDir)

  const collections = Object.entries(raw).map(([id, v]) => ({
    ...(v as any),
    id,
  }))

  const collectionsMeta = []

  for (const info of collections) {
    const setData = await fs.readJSON(path.join(dir, 'json', `${info.id}.json`))

    const icons = Object.keys(setData.icons)
    const categories = setData.categories
    const meta = {...info, icons, categories }

    await fs.writeJSON(path.join(collectionsDir, `${info.id}-raw.json`), setData)
    await fs.writeJSON(path.join(collectionsDir, `${info.id}-meta.json`), meta)
    collectionsMeta.push(meta)

    info.sampleIcons = icons.slice(0, 7)
  }

  await fs.writeJSON(path.join(out, 'collections-meta.json'), collectionsMeta)
  await fs.writeJSON(path.join(out, 'collections-info.json'), collections)
}

prepare()
