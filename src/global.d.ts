interface Window {
  Iconify: {
    getSVG: (icon: string) => string | false
    getSVGObject: (icon: string) => any
  }
}
