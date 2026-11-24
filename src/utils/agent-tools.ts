import type { Router } from 'vue-router'
import type { CollectionInfo } from '../data'
import { collections, getCollectionMeta, getFullMeta } from '../data'
import { addToBag, bags, removeFromBag } from '../store/localstorage'
import { getIconSnippet, SnippetMap } from './icons'
import { predictWords } from './predict'

/**
 * Tools for AI agents in the browser, with the WebMCP API.
 * https://webmachinelearning.github.io/webmcp/
 */

interface AgentTool {
  name: string
  title: string
  description: string
  inputSchema: object
  annotations?: {
    readOnlyHint?: boolean
  }
  execute: (input: any) => Promise<unknown>
}

interface ModelContext {
  registerTool: (tool: AgentTool, options?: { signal?: AbortSignal }) => unknown
}

export const ICON_FORMATS = Array.from(new Set([
  'id',
  'url',
  'css',
  ...Object.values(SnippetMap).flatMap(group => Object.keys(group)),
]))

const MAX_LIMIT = 500

function clampLimit(limit: unknown, fallback = 50) {
  const value = Number(limit)
  if (!Number.isFinite(value) || value <= 0)
    return fallback
  return Math.min(Math.floor(value), MAX_LIMIT)
}

export function summarizeCollection(c: CollectionInfo) {
  return {
    id: c.id,
    name: c.name,
    total: c.total,
    category: c.category,
    author: c.author?.name,
    license: c.license?.title,
    palette: c.palette,
    deprecated: c.hidden || undefined,
  }
}

function findCollection(id: string) {
  const collection = collections.find(c => c.id === id)
  if (!collection)
    throw new Error(`Unknown collection "${id}". Use list_collections to find the ids.`)
  return collection
}

function parseIconId(id: string) {
  const match = /^([a-z0-9-]+):([a-z0-9-]+)$/.exec(String(id || '').trim())
  if (!match)
    throw new Error(`Invalid icon id "${id}". Use the "prefix:name" form, for example "mdi:home".`)
  findCollection(match[1])
  return `${match[1]}:${match[2]}`
}

export function listCollections({ query = '', category = '', limit }: { query?: string, category?: string, limit?: number } = {}) {
  const words = String(query).toLowerCase().split(/\s+/).filter(Boolean)
  const matched = collections.filter((c) => {
    if (category && c.category?.toLowerCase() !== String(category).toLowerCase())
      return false
    const text = `${c.id} ${c.name} ${c.category} ${c.author?.name}`.toLowerCase()
    return words.every(w => text.includes(w))
  })
  return {
    total: matched.length,
    categories: Array.from(new Set(collections.map(c => c.category).filter(Boolean))),
    collections: matched.slice(0, clampLimit(limit, 300)).map(summarizeCollection),
  }
}

export async function getCollection({ id }: { id: string }) {
  const info = findCollection(id)
  const meta = await getCollectionMeta(info.id)
  const count = (groups?: Record<string, string[]>) => groups
    ? Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length]))
    : undefined
  return {
    ...summarizeCollection(info),
    url: info.url,
    licenseUrl: info.license?.url,
    page: `${location.origin}/collection/${info.id}`,
    categories: count(meta?.categories),
    variants: count(meta?.variants),
    sampleIcons: info.sampleIcons?.map(i => `${info.id}:${i}`),
  }
}

let allIconIds: Promise<string[]> | undefined

async function getIconIds(collection?: string) {
  if (collection) {
    const info = findCollection(collection)
    const meta = await getCollectionMeta(info.id)
    return (meta?.icons || []).map(i => `${info.id}:${i}`)
  }
  allIconIds ??= getFullMeta().then(meta => meta
    .filter(c => !c.hidden)
    .flatMap(c => c.icons.map(i => `${c.id}:${i}`)))
  return allIconIds
}

function matchWords(ids: string[], words: string[]) {
  return ids.filter((id) => {
    const name = id.slice(id.indexOf(':') + 1)
    return words.every(w => name.includes(w))
  })
}

function rank(ids: string[], words: string[]) {
  const typed = words.join('-')
  const score = (id: string) => {
    const name = id.slice(id.indexOf(':') + 1)
    if (name === typed)
      return 0
    if (name.startsWith(typed))
      return 1
    if (name.split('-').some(part => words.includes(part)))
      return 2
    return 3
  }
  return ids
    .map(id => [
      id,
      score(id),
    ] as const)
    .sort((a, b) => a[1] - b[1] || a[0].length - b[0].length)
    .map(([id]) => id)
}

export async function searchIcons({ query, collection, limit }: { query: string, collection?: string, limit?: number }) {
  const words = String(query || '').trim().toLowerCase().split(/[\s:]+/).filter(Boolean)
  if (!words.length)
    throw new Error('The query is empty.')
  const ids = await getIconIds(collection || undefined)
  const results = rank(matchWords(ids, words), words)

  // Add the matches of related words from the search model, after the direct matches
  const seen = new Set(results)
  const related: string[] = []
  try {
    const predictions = await predictWords(words.join(' '), new AbortController().signal)
    for (const p of predictions) {
      const replaced = words.map(w => w === p.from
        ? p.word
        : w)
      for (const id of rank(matchWords(ids, words.includes(p.from)
        ? replaced
        : [p.word]), replaced)) {
        if (!seen.has(id)) {
          seen.add(id)
          related.push(id)
        }
      }
    }
  }
  catch {
    // Predictions are optional
  }

  const max = clampLimit(limit)
  const icons = [
    ...results,
    ...related,
  ]
  return {
    total: icons.length,
    icons: icons.slice(0, max),
  }
}

export async function getIcon({ id, format = 'svg', color }: { id: string, format?: string, color?: string }) {
  const icon = parseIconId(id)
  if (!ICON_FORMATS.includes(format))
    throw new Error(`Unknown format "${format}". Use one of: ${ICON_FORMATS.join(', ')}.`)
  const collection = findCollection(icon.split(':')[0])
  // `loadIcon()` of Iconify rejects with the icon name, when the icon does not exist or the network fails
  const code = await getIconSnippet(collections, icon, format, true, color || 'currentColor')
    .catch(() => undefined)
  if (code === undefined)
    throw new Error(`Can not load icon "${icon}". Check the name with search_icons.`)
  return {
    id: icon,
    format,
    code,
    collection: collection.name,
    license: collection.license?.title,
    licenseUrl: collection.license?.url,
    author: collection.author?.name,
  }
}

function toIdList(ids: unknown) {
  const list = Array.isArray(ids)
    ? ids
    : [ids]
  return list.map(i => parseIconId(String(i)))
}

export function createAgentTools(router: Router): AgentTool[] {
  return [
    {
      name: 'list_collections',
      title: 'List icon collections',
      description: 'List the icon collections (icon sets) of Icônes, like Material Design Icons (mdi) or Carbon (carbon). Filter by words in the id, name, category or author.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Words to match, for example "material" or "brand"' },
          category: { type: 'string', description: 'Exact category name, for example "Material" or "Brands / Social"' },
          limit: { type: 'number', description: 'Maximum number of collections, 300 by default' },
        },
      },
      annotations: { readOnlyHint: true },
      execute: async input => listCollections(input),
    },
    {
      name: 'get_collection',
      title: 'Get collection details',
      description: 'Get the details of one icon collection: license, author, icon count, and the icon count of each category and variant.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Collection id (the icon prefix), for example "mdi"' },
        },
        required: ['id'],
      },
      annotations: { readOnlyHint: true },
      execute: async input => getCollection(input),
    },
    {
      name: 'search_icons',
      title: 'Search icons',
      description: 'Search icons by name across all collections, or in one collection. Returns icon ids in the "prefix:name" form, best matches first. Matches of related words (synonyms) come after the direct matches.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Words of the icon name, for example "arrow left" or "home"' },
          collection: { type: 'string', description: 'Collection id to search in, for example "mdi". Omit to search all collections.' },
          limit: { type: 'number', description: `Maximum number of icons, 50 by default, ${MAX_LIMIT} at most` },
        },
        required: ['query'],
      },
      annotations: { readOnlyHint: true },
      execute: async input => searchIcons(input),
    },
    {
      name: 'get_icon',
      title: 'Get icon code',
      description: 'Get the code of an icon: SVG markup, a component for a framework, a CSS rule or a URL. Includes the license of the icon.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Icon id in the "prefix:name" form, for example "mdi:home"' },
          format: { type: 'string', enum: ICON_FORMATS, description: 'Output format, "svg" by default' },
          color: { type: 'string', description: 'CSS color to replace "currentColor", for example "#ff0000"' },
        },
        required: ['id'],
      },
      annotations: { readOnlyHint: true },
      execute: async input => getIcon(input),
    },
    {
      name: 'open_icon',
      title: 'Show icon',
      description: 'Open the page of an icon in Icônes, so the user can see it.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Icon id in the "prefix:name" form, for example "mdi:home"' },
        },
        required: ['id'],
      },
      execute: async ({ id }) => {
        const icon = parseIconId(id)
        await router.push({
          path: `/collection/${icon.split(':')[0]}`,
          query: { icon },
        })
        return { opened: icon, url: location.href }
      },
    },
    {
      name: 'get_bag',
      title: 'Get bag',
      description: 'List the icons in the bag. The user collects icons in the bag to download them together as an icon font, an SVG sprite or a zip of components.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => ({
        icons: [...bags.value],
      }),
    },
    {
      name: 'add_to_bag',
      title: 'Add icons to bag',
      description: 'Add icons to the bag.',
      inputSchema: {
        type: 'object',
        properties: {
          ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Icon ids in the "prefix:name" form',
          },
        },
        required: ['ids'],
      },
      execute: async ({ ids }) => {
        toIdList(ids).forEach(addToBag)
        return {
          icons: [...bags.value],
        }
      },
    },
    {
      name: 'remove_from_bag',
      title: 'Remove icons from bag',
      description: 'Remove icons from the bag.',
      inputSchema: {
        type: 'object',
        properties: {
          ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Icon ids in the "prefix:name" form',
          },
        },
        required: ['ids'],
      },
      execute: async ({ ids }) => {
        toIdList(ids).forEach(removeFromBag)
        return {
          icons: [...bags.value],
        }
      },
    },
  ]
}

/**
 * Register the agent tools, when the browser supports WebMCP.
 */
export function registerAgentTools(router: Router) {
  const context: ModelContext | undefined = (document as any).modelContext ?? (navigator as any).modelContext
  if (!context?.registerTool)
    return
  for (const tool of createAgentTools(router)) {
    Promise.resolve()
      .then(() => context.registerTool({
        ...tool,
        // WebMCP turns a rejection into an `OperationError` without the message,
        // so return the error as a result, for the agent to fix the input
        execute: input => tool.execute(input ?? {})
          .catch((error: unknown) => ({
            error: error instanceof Error
              ? error.message
              : String(error),
          })),
      }))
      .catch(error => console.warn(`[icones] Can not register the WebMCP tool "${tool.name}"`, error))
  }
}
