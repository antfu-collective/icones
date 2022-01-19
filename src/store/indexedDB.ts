import type { Table } from 'dexie'
import Dexie from 'dexie'

const db = new Dexie('icones')

db.version(1).stores({
  collections: 'id, data',
})

const collections: Table = (db as any).collections

export async function loadCollection(id: string) {
  return await collections.where({ id }).first()
}

export async function saveCollection(id: string, data: any) {
  return await collections.put({ id, data }, 'id')
}

export default db
