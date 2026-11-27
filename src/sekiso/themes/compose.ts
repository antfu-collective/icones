/**
 * The classes of a base theme with a theme's own added, key by key, for a
 * theme that keeps the base's look and adds to it. `extends` alone replaces.
 */
export function compose(base: Readonly<Record<string, string>>, own: Readonly<Record<string, string>>): Record<string, string> {
  const merged: Record<string, string> = { ...base }
  for (const [key, value] of Object.entries(own)) {
    merged[key] = merged[key]
      ? `${merged[key]} ${value}`
      : value
  }
  return merged
}
