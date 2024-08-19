export function cleanupQuery(query: Record<string, string | undefined | null>) {
  for (const key of Object.keys(query)) {
    if (!query[key])
      delete query[key]
  }
  return query
}
