export function HtmlToJSX(html: string) {
  const jsx = html.replace(/([\w-]+)=/g, (i) => {
    return i
      .split('-')
      .map((i, idx) =>
        idx === 0
          ? i.toLowerCase()
          : i[0].toUpperCase() + i.slice(1).toLowerCase())
      .join('')
  })
  return jsx
}
