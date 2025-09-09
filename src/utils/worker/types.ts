import type { PackType } from '../svg'

export type PackOperation = 'pack-zip' | 'pack-json-zip' | 'pack-svg-zip' | 'pack-font-zip'

export interface PackZipPayload {
  icons: string[]
  name: string
  type: PackType
}
export interface PackJsonZipPayload {
  icons: string[]
  name: string
}
export interface PackSvgZipPayload {
  icons: string[]
}

export interface PackFontZipPayload {
  icons: string[]
  options: any
}

export interface WorkerPackMessage<O extends PackOperation> {
  payload: O extends 'pack-zip' ? PackZipPayload
    : O extends 'pack-json-zip' ? PackJsonZipPayload
      : O extends 'pack-svg-zip' ? PackSvgZipPayload
        : O extends 'pack-font-zip' ? PackFontZipPayload
          : never
  operation: O
  collections: ArrayBuffer
}

export interface WorkerPackResponse {
  blob: ArrayBuffer
  name?: string
}
