import { describe, expect, it } from 'vitest'
import { defaultLang, dirFor, hrefWithLang, langs, parseLang } from './lang'

describe('shell lang', () => {
  it('defaults to Arabic and knows both languages', () => {
    expect(defaultLang).toBe('ar')
    expect(langs).toEqual(['ar', 'en'])
  })

  it('parses the ?lang param strictly', () => {
    expect(parseLang('ar')).toBe('ar')
    expect(parseLang('en')).toBe('en')
    expect(parseLang('fr')).toBeUndefined()
    expect(parseLang(undefined)).toBeUndefined()
    expect(parseLang('')).toBeUndefined()
  })

  it('maps language to direction', () => {
    expect(dirFor('ar')).toBe('rtl')
    expect(dirFor('en')).toBe('ltr')
  })

  it('hrefWithLang keeps path and other params, sets lang', () => {
    expect(hrefWithLang('/academy/cohorts', '', 'en')).toBe(
      '/academy/cohorts?lang=en',
    )
    expect(hrefWithLang('/academy/earnings', '?as=instructor', 'en')).toBe(
      '/academy/earnings?as=instructor&lang=en',
    )
    expect(hrefWithLang('/academy', '?as=academy&lang=en', 'ar')).toBe(
      '/academy?as=academy&lang=ar',
    )
    expect(hrefWithLang('/', '?lang=en', 'ar')).toBe('/?lang=ar')
  })
})
