import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bag } from '../src/sekiso/behavior/bag'
import { collection } from '../src/sekiso/behavior/collection'
import { detail } from '../src/sekiso/behavior/detail'
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

describe('collection behavior (headless)', () => {
  it('routes a menu choice to a way to show, a mode, or a task', () => {
    const setList = vi.fn()
    const setMode = vi.fn()
    const run = vi.fn()
    const instance = collection({
      id: 'collection',
      setList,
      setMode,
      run,
    })
    instance.api.choose('list')
    instance.api.choose('copy')
    instance.api.choose('download_svgs')
    instance.api.choose('cache')
    expect(setList).toHaveBeenCalledWith('list')
    expect(setMode).toHaveBeenCalledWith('copy')
    expect(run.mock.calls).toEqual([
      ['svgs'],
      ['cache'],
    ])
  })

  it('turns a category off when it is picked again', () => {
    const setCategory = vi.fn()
    collection({ id: 'a', category: 'Arrows', setCategory }).api.toggleCategory('Arrows')
    collection({ id: 'b', category: 'Arrows', setCategory }).api.toggleCategory('Media')
    expect(setCategory.mock.calls).toEqual([
      [''],
      ['Media'],
    ])
  })
})

describe('detail behavior (headless)', () => {
  it('shows the code of a format, then hides it', () => {
    const instance = detail({ id: 'detail', icon: 'mdi:home' })
    instance.api.preview('svg')
    expect(instance.get().previewing).toBe('svg')
    instance.api.preview('')
    expect(instance.get().previewing).toBe('')
  })
})

describe('bag behavior (headless)', () => {
  it('packs a zip in the format picked', () => {
    const pack = vi.fn()
    bag({ id: 'bag', count: 2, pack }).api.pack('zip:vue')
    expect(pack).toHaveBeenCalledWith('zip:vue')
  })
})
