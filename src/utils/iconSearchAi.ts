import { GoogleGenerativeAI } from '@google/generative-ai'

export async function searchIconAi(
  query: string,
  prefix: string,
  libName: string,
) {
  const key = useStorage('gemini_api_key', '').value
  if (!key)
    throw new Error('API key not found. Please set it in the settings.')

  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  // Fetch icon list from Iconify API
  const res = await fetch(`https://api.iconify.design/collection?prefix=${encodeURIComponent(prefix)}`)
  if (!res.ok) {
    throw new Error(`Icon set "${prefix}" not found (status ${res.status})`)
  }

  const data = await res.json() as {
    uncategorized?: string[]
    categories?: Record<string, string[]>
    aliases?: Record<string, string>
    hidden?: string[]
  }

  // Build complete icon list
  const icons = new Set<string>()
  data.uncategorized?.forEach(i => icons.add(i))
  Object.values(data.categories || {}).forEach(arr => arr.forEach(i => icons.add(i)))
  Object.keys(data.aliases || {}).forEach(i => icons.add(i))
  data.hidden?.forEach(i => icons.add(i))

  const iconList = Array.from(icons)

  // Sanitize
  const safeLibName = libName.replace(/[\n\r]/g, ' ')
  const safeQuery = query.replace(/[\n\r]/g, ' ')

  const prompt = `
You are an AI that returns the most relevant icon names from a given icon library based on a user's query.

### Icon Library Name
"${safeLibName}"

### Available Icon Names
${iconList.join(', ')}

### User Query
"${safeQuery}"

### Rules
1. ONLY choose icon names from the "Available Icon Names" list.
2. Output icon names in lowercase.
3. Output format: comma-separated list, no spaces except after commas.
4. Do not output explanations, markdown, bullet points, or any extra text before or after.
5. If no matching icon names are found, output exactly: ""

### Output for:
Query: "${safeQuery}"
`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  // Validate AI output against real list
  const chosenIcons = text
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(k => iconList.includes(k))

  return chosenIcons
}
