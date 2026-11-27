import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { home, searchAllHref } from '../src/sekiso/behavior/home'
import { followLink } from '../src/sekiso/behavior/link'

describe('home behavior (headless)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('sends the search once the typing stops', () => {
    const setSearch = vi.fn()
    const instance = home({ id: 'home', setSearch })
    instance.api.type('ho')
    instance.api.type('home')
    expect(instance.get().draft).toBe('home')
    expect(setSearch).not.toHaveBeenCalled()
    vi.advanceTimersByTime(250)
    expect(setSearch).toHaveBeenCalledTimes(1)
    expect(setSearch).toHaveBeenCalledWith('home')
  })

  it('searches all icons for what is typed, and clears it', () => {
    const navigate = vi.fn()
    const setSearch = vi.fn()
    const instance = home({ id: 'home', navigate, setSearch })
    instance.api.type('arrow up')
    instance.api.searchAll()
    expect(navigate).toHaveBeenCalledWith('/collection/all?s=arrow%20up')
    expect(setSearch).toHaveBeenCalledWith('')
    expect(instance.get().draft).toBe('')
  })

  it('encodes the search in the link', () => {
    expect(searchAllHref('home !outline')).toBe('/collection/all?s=home%20!outline')
  })
})

describe('followLink', () => {
  it('opens a plain click in the app, and keeps a click with a modifier for the browser', () => {
    const navigate = vi.fn()
    const plain = {
      button: 0,
      preventDefault: vi.fn(),
    } as unknown as Event
    const newTab = {
      button: 0,
      metaKey: true,
      preventDefault: vi.fn(),
    } as unknown as Event
    followLink(plain, '/settings', navigate)
    followLink(newTab, '/settings', navigate)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect((newTab as unknown as { preventDefault: () => void }).preventDefault).not.toHaveBeenCalled()
  })
})
