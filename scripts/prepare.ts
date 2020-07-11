import path from 'path'
import fs from 'fs-extra'

const dir = path.resolve(__dirname, '../node_modules/@iconify/json')
const outfile = path.resolve(__dirname, '../src/assets/collections.json')

async function prepare() {
  const raw = await fs.readJSON(path.join(dir, 'collections.json'))

  const collections = Object.entries(raw).map(([id, v]) => ({
    ...(v as any),
    id,
  }))

  for (const set of collections) {
    const setData = await fs.readJSON(path.join(dir, 'json', `${set.id}.json`))

    const prefix = setData.prefix
    const icons = Object.keys(setData.icons).map(i => `${prefix}:${i}`)

    set.icons = icons
  }

  await fs.ensureDir(path.dirname(outfile))
  await fs.writeJSON(outfile, collections)
}

prepare()
