import type JSZip from 'jszip'

declare global {
  declare interface Window {
    JSZip: JSZip
    SvgPacker: (options: any) => Promise<any>

    // for vscode
    baseURI?: string
    staticURI?: string
    vscode?: any
  }
}
