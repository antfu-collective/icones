import antfu from '@antfu/eslint-config'
import sekiso from 'eslint-plugin-sekiso'

export default antfu(
  {
    ignores: [
      '**/src/assets/collections.json',
      '**/public/collections',
      '**/public/lib',
      '**/release',
      '**/collections-info.json',
      '**/collections-meta.json',
      '**/public/collections.json',
      '**/public/llms.txt',
    ],
    formatters: true,
  },
  // Keeps each layer of `src/sekiso` to its own job: no markup or text in views, no styles in behavior
  ...sekiso.configs.recommended,
)
