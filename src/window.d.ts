declare global {
  export interface Window {
    JSZip: import('jszip')
    SvgPacker: (options: any) => Promise<any>

    // for vscode
    baseURI?: string
    staticURI?: string
    vscode?: any

    __BUILD_TIME__: string
  }
}
