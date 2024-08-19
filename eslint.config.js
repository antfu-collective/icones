// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '**/src/assets/collections.json',
      '**/public/collections',
      '**/public/lib',
      '**/release',
      '**/collections-info.json',
      '**/collections-meta.json',
      '**/dist-electron',
    ],
    formatters: true,
  },
)
