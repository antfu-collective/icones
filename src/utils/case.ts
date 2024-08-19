export const idCases = {
  bare(id: string) {
    return id.replace(/^.*:/, '')
  },
  barePascal(id: string) {
    return id.replace(/^.*:/, '').replace(/(?:^|[-_:]+)(\w)/g, (_, c) => c.toUpperCase())
  },
  iconify(id: string) {
    return id
  },
  dash(id: string) {
    return id.replace(/:/g, '-')
  },
  slash(id: string) {
    return id.replace(/:/g, '/')
  },
  doubleHyphen(id: string) {
    return id.replace(/:/g, '--')
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
  componentKebab(id: string) {
    return `<${id.replace(/:/g, '-')}/>`
  },
  unocssColon(id: string) {
    return `i-${id}`
  },
  unocss(id: string) {
    return `i-${id.replace(/:/g, '-')}`
  },
  iconifyTailwind(id: string) {
    return `icon-[${id.replace(/:/g, '--')}]`
  },
}

export type IdCase = keyof typeof idCases
