interface Window {
  Iconify: {
    getSVG: (icon: string) => string | false
    getSVGObject: (icon: string) => any
    addCollection: (data: any) => void
  }
  SvgPacker: (options: any) => Promise<any>
}
