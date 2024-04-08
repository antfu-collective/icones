export function dataUrlToBlob(dataurl: string) {
  const parts = dataurl.split(',')
  const type = parts[0].split(':')[1].split(';')[0]
  const base64 = atob(parts[1])
  const arr = new Uint8Array(base64.length)
  for (let i = 0; i < base64.length; i++)
    arr[i] = base64.charCodeAt(i)
  return new Blob([arr], { type })
}
