import path from 'path'
import fs from 'fs-extra'

const out = path.resolve(__dirname, '../public')

async function prepareJSON() {
  const dir = path.resolve(__dirname, '../node_modules/@iconify/json')
  const collectionsDir = path.resolve(__dirname, '../public/collections')

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
    const meta = { ...info, icons, categories }

    await fs.writeJSON(
      path.join(collectionsDir, `${info.id}-raw.json`),
      setData
    )
    await fs.writeJSON(path.join(collectionsDir, `${info.id}-meta.json`), meta)
    collectionsMeta.push(meta)

    info.sampleIcons = icons.slice(0, 7)
  }

  await fs.writeJSON(path.join(out, 'collections-meta.json'), collectionsMeta)
  await fs.writeJSON(path.join(out, 'collections-info.json'), collections)
}

async function copyLibs() {
  const modules = path.resolve(__dirname, '../node_modules')

  await fs.copy(
    path.join(modules, '@iconify/iconify/dist/'),
    path.join(out, 'lib'),
    {
      filter: (src) => {
        if (fs.lstatSync(src).isDirectory()) return true
        const basename = path.basename(src)
        return basename.startsWith('iconify') && basename.endsWith('.min.js')
      }
    }
  )
  await fs.copy(
    path.join(modules, 'svg-packer/dist/index.browser.js'), 
    path.join(out, 'lib/svg-packer.js')
  )

  await fs.copy(
    path.join(modules, 'jszip/dist/jszip.min.js'), 
    path.join(out, 'lib/jszip.min.js')
  )
}

async function prepare() {
  await copyLibs()
  await prepareJSON()
}

prepare()
