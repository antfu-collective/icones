export function bufferToString(buffer: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint16Array(buffer) as any)
}
