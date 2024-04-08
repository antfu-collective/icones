interface Window {
  JSZip: import('jszip')
  SvgPacker: (options: any) => Promise<any>

  // for vscode
  baseURI?: string
  staticURI?: string
}

declare const vscode: any
declare const __BUILD_TIME__: string
declare const PWA: boolean

declare module '*.vue' {
  import type { defineComponent } from './vue'

  const Component: ReturnType<typeof defineComponent>
  export default Component
}
