import { promises as fs } from 'node:fs'

;

(async () => {
  const path = './index.html'
  const file = await fs.readFile(path, 'utf-8')
  await fs.writeFile(path, file.replace(/\/lib/g, '//lib'), 'utf-8')
})()
