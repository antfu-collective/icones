import type { CollectionInfo } from '../../data'
import { getSvg } from './loader'

export * from './transformers'

export async function LoadIconSvgs(
  collections: CollectionInfo[],
  icons: string[],
) {
  return await Promise.all(
    icons
      .filter(Boolean)
      .sort()
      .map(async (name) => {
        return {
          name,
          svg: await getSvg(collections, name),
        }
      }),
  )
}
