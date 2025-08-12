import { GoogleGenerativeAI } from '@google/generative-ai'

export async function searchIconAi(query: string, lib: string) {
  const apiKey = useStorage('gemini_api_key', '')
  if (!apiKey.value) {
    throw new Error('API key not found. Please set it in the settings.')
  }
  const genAI = new GoogleGenerativeAI(apiKey.value)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  try {
    const prompt = `
  You are an assistant that finds the most relevant icon names from a given library based on a user's query.

  Icon Library: ${lib}
  User Query: ${query}

  Rules:
  - You will be given an icon library and a user's query.
  - Your task is to return a comma-separated list of the most relevant icon names from the library.
  - The icon names must be in lowercase.
  - Return only the comma-separated list. Do not include any other text, explanations, or formatting.
  - If no suitable icons are found, return an empty string.

  Example 1:
  Icon Library: mdi
  User Query: delivery box
  Output: mdi-truck, mdi-package-variant, mdi-package

  Example 2:
  Icon Library: material symbols
  User Query: "settings"
  Output: material-symbols-settings, material-symbols-tune, material-symbols-gear

  Output for "${query}":
`
    const result = await model.generateContent(prompt)

    // This is the actual text output from Gemini
    const text = result.response.text().trim()
    console.log('[Service] Gemini Output:', text)

    // Convert the comma-separated list to an array of keywords
    return text
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k)
  }
  catch (error) {
    console.error('Unexpected Error', error)
    throw error
  }
}
