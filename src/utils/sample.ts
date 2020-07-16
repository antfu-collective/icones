export function sample<T>(arr: T[], num: number) {
  const result = new Array<T>(num)

  for (let i = 0; i < num; i++)
    result[i] = arr[Math.floor(arr.length * Math.random())]

  return result
}
