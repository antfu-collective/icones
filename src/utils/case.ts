export const idCases = {
  barePascal(id: string) {
    return id.replace(/^.*:/, '').replace(/(?:^|[-_:]+)(\w)/g, (_, c) => c.toUpperCase())
  },
  bare(id: string) {
    return id.replace(/^.*:/, '')
  },
  iconify(id: string) {
    return id
  },
  dash(id: string) {
    return id.replace(/:/g, '-')
  },
  camel(id: string) {
    return id.replace(/[-_:]+(\w)/g, (_, c) => c.toUpperCase())
  },
  pascal(id: string) {
    return id.replace(/(?:^|[-_:]+)(\w)/g, (_, c) => c.toUpperCase())
  },
  component(id: string) {
    return `<${id.replace(/(?:^|[-_:]+)(\w)/g, (_, c) => c.toUpperCase())}/>`
  },
  unocss(id: string) {
    return `i-${id.replace(/:/g, '-')}`
  },
}

export type IdCase = keyof typeof idCases
