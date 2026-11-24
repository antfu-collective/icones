const DASH = 45 // '-'

/**
 * A list of query words, with a weight from 0 to 1.
 * The typed query has the weight 1, the predicted queries have less.
 */
export interface RankTerm {
  parts: string[]
  weight: number
}

/**
 * Score how close an icon name is to the query words, from 0 to 1.
 * The name can have a `prefix:`, it is ignored. The query words must be lower case, without `-`.
 *
 * - A word equal to a query word is the best match, then a word that starts with it,
 *   then a word that contains it. A name that matches only fuzzily has a low score.
 * - Each name word that no query word matches lowers the score,
 *   so `search` comes before `text-search`, which comes before `clipboard-text-search-outline`.
 * - A match on the first word is a bit better, so `search-web` comes before `web-search`.
 */
export function scoreName(name: string, parts: string[]): number {
  const start = name.indexOf(':') + 1
  let words = 1
  for (let i = start; i < name.length; i++) {
    if (name.charCodeAt(i) === DASH)
      words++
  }

  let total = 0
  let first = false
  // The bits of the name words that a query word matches
  let matched = 0
  let count = 0
  for (const part of parts) {
    let best = 0
    let bestPosition = -1
    let position = name.indexOf(part, start)
    while (position >= 0) {
      const end = position + part.length
      const atStart = position === start || name.charCodeAt(position - 1) === DASH
      const atEnd = end === name.length || name.charCodeAt(end) === DASH
      const quality = atStart
        ? atEnd ? 1 : 0.7
        : 0.3
      if (quality > best) {
        best = quality
        bestPosition = position
        if (best === 1)
          break
      }
      position = name.indexOf(part, position + 1)
    }
    if (bestPosition < 0) {
      // The match is fuzzy
      total += 0.1
      continue
    }
    total += best
    if (bestPosition === start)
      first = true
    let word = 0
    for (let i = start; i < bestPosition; i++) {
      if (name.charCodeAt(i) === DASH)
        word++
    }
    const bit = 1 << (word % 31)
    if (!(matched & bit)) {
      matched |= bit
      count++
    }
  }

  const extra = words - count
  return total / parts.length / (1 + extra * 0.5) * (first ? 1 : 0.95)
}

/**
 * Sort the icons by their best score over the terms, highest first.
 * `matches` holds, for each term, the icons that the term found.
 * The first term is the typed text, it can find many icons, the others should find fewer.
 * An icon that has the same score as another keeps its order.
 */
export function rankIcons(matches: [RankTerm, string[]][]): string[] {
  const [[term, icons], ...others] = matches.map(([term, icons]): [RankTerm, string[]] => [
    {
      ...term,
      parts: term.parts.flatMap(part => part.split('-')).filter(Boolean),
    },
    icons,
  ])
  // Score the icons of the other terms first, to look them up quickly in a small map
  const otherScores = new Map<string, number>()
  for (const [other, found] of others) {
    for (const icon of found) {
      const score = other.weight * scoreName(icon, other.parts)
      if (score > (otherScores.get(icon) ?? -1))
        otherScores.set(icon, score)
    }
  }

  // The scores have few distinct values, group the icons by score instead of sorting them all
  const groups = new Map<number, string[]>()
  function add(icon: string, score: number) {
    const group = groups.get(score)
    if (group)
      group.push(icon)
    else
      groups.set(score, [icon])
  }
  for (const icon of icons) {
    let score = term.weight * scoreName(icon, term.parts)
    const other = otherScores.get(icon)
    if (other !== undefined) {
      score = Math.max(score, other)
      otherScores.delete(icon)
    }
    add(icon, score)
  }
  for (const [icon, score] of otherScores)
    add(icon, score)

  return [
    ...groups.keys(),
  ]
    .sort((a, b) => b - a)
    .flatMap(score => groups.get(score)!)
}
