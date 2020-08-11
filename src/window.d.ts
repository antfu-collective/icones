import type JSZip from 'jszip'

declare interface Window {
  JSZip: JSZip
  SvgPacker: (options: any) => Promise<any>
}
