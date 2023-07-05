export function sample<T>(arr: T[], num: number) {
  return Array.from({ length: num }, () => arr[Math.floor(arr.length * Math.random())])
}
