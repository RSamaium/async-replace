import { describe, it, expect } from 'vitest'
import asyncReplace from './async-replace'

describe('async-replace', () => {
  it('no match local', async () => {
    const newString = await asyncReplace('aaa', /(\d)/)
    expect(newString).toBe('aaa')
  })

  it('no match global', async () => {
    const newString = await asyncReplace('aaa', /(\d)/g)
    expect(newString).toBe('aaa')
  })

  it('simple local', async () => {
    const newString = await asyncReplace(' foo ', /(fo)(.)/, async (match, p1, p2, offset, input) => {
      expect(match).toBe('foo')
      expect(p1).toBe('fo')
      expect(p2).toBe('o')
      expect(offset).toBe(1)
      expect(input).toBe(' foo ')
      return p2 + '-' + p1
    })
    expect(newString).toBe(' o-fo ')
  })

  it('simple global', async () => {
    const newString = await asyncReplace(' foo ', /(fo)(.)/g, async (match, p1, p2, offset, input) => {
      expect(match).toBe('foo')
      expect(p1).toBe('fo')
      expect(p2).toBe('o')
      expect(offset).toBe(1)
      expect(input).toBe(' foo ')
      return p2 + '-' + p1
    })
    expect(newString).toBe(' o-fo ')
  })

  it('messy global', async () => {
    const matches = ['foo', 'foz']
    const offsets = [1, 5]
    const p2s = ['o', 'z']
    const newString = await asyncReplace('1foo2foz3', /(fo)(.)/g, async (match, p1, p2, offset, input) => {
      expect(match).toBe(matches.shift())
      expect(p1).toBe('fo')
      expect(p2).toBe(p2s.shift())
      expect(offset).toBe(offsets.shift())
      expect(input).toBe('1foo2foz3')
      return p2.toUpperCase() + p1
    })
    expect(newString).toBe('1Ofo2Zfo3')
  })

  it('global and ignoreCase', async () => {
    const newString = await asyncReplace(' Foo foo ', /(f)oo/gi, async (match, p1) => {
      return p1
    })
    expect(newString).toBe(' F f ')
  })

  it('local and ignoreCase', async () => {
    const newString = await asyncReplace(' Foo foo ', /(f)oo/i, async (match, p1) => {
      return p1
    })
    expect(newString).toBe(' F foo ')
  })
})
