export function HtmlToJSX(html: string) {
  const jsx = html.replace(/([\w-]+)=/g, (i) => {
    const words = i.split('-')
    if (words.length === 1)
      return i
    return words
      .map((i, idx) =>
        idx === 0
          ? i.toLowerCase()
          : i[0].toUpperCase() + i.slice(1).toLowerCase())
      .join('')
  })
  return jsx
}
