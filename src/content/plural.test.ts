import { describe, expect, it } from 'vitest'
import { countPhrase, englishCount, type NounForms } from './plural'
import { ar, en } from './strings'

const cohorts: NounForms = {
  one: 'فوج واحد',
  two: 'فوجان',
  few: 'أفواج',
  many: 'فوجًا',
}

describe('countPhrase — Arabic number–noun agreement', () => {
  it('uses the singular phrase for one and the dual for two', () => {
    expect(countPhrase(1, cohorts)).toBe('فوج واحد')
    expect(countPhrase(2, cohorts)).toBe('فوجان')
  })

  it('uses digit + plural for 0 and 3–10', () => {
    expect(countPhrase(0, cohorts)).toBe('٠ أفواج')
    expect(countPhrase(3, cohorts)).toBe('٣ أفواج')
    expect(countPhrase(10, cohorts)).toBe('١٠ أفواج')
  })

  it('uses digit + singular for 11 and above', () => {
    expect(countPhrase(11, cohorts)).toBe('١١ فوجًا')
    expect(countPhrase(25, cohorts)).toBe('٢٥ فوجًا')
  })

  it('never throws or prints NaN for a bad count', () => {
    expect(countPhrase(Number.NaN, cohorts)).toBe('٠ أفواج')
    expect(countPhrase(-4, cohorts)).toBe('٠ أفواج')
    expect(countPhrase(2.4, cohorts)).toBe('فوجان')
  })
})

describe('englishCount', () => {
  it('singularises only for exactly one', () => {
    expect(englishCount(1, 'question', 'questions')).toBe('1 question')
    expect(englishCount(0, 'question', 'questions')).toBe('0 questions')
    expect(englishCount(2, 'question', 'questions')).toBe('2 questions')
    expect(englishCount(Number.NaN, 'question', 'questions')).toBe('0 questions')
  })
})

describe('UI copy that counts things', () => {
  it('Arabic academy copy uses formal agreement', () => {
    expect(ar.dashboard.cohortsCount(1)).toBe('فوج واحد')
    expect(ar.dashboard.cohortsCount(2)).toBe('فوجان')
    expect(ar.dashboard.cohortsCount(3)).toBe('٣ أفواج')
    expect(ar.dashboard.learnersCount(11)).toBe('١١ متدرّبًا')
    expect(ar.cohorts.seatsAvailable(4)).toBe('٤ مقاعد')
    expect(ar.curriculum.unitsCount(2)).toBe('وحدتان')
    expect(ar.curriculum.unitsCount(7)).toBe('٧ وحدات')
    expect(ar.curriculum.lessonsCount(1)).toBe('درس واحد')
    expect(ar.curriculum.lessonsCount(12)).toBe('١٢ درسًا')
    expect(ar.roster.recordedSessions(3)).toBe('٣ جلسات')
  })

  it('English copy agrees in number', () => {
    expect(en.dashboard.cohortsCount(1)).toBe('1 cohort')
    expect(en.dashboard.cohortsCount(3)).toBe('3 cohorts')
    expect(en.cohorts.seatsAvailable(1)).toBe('1 seat')
    expect(en.curriculum.unitsCount(2)).toBe('2 units')
    expect(en.curriculum.lessonsCount(1)).toBe('1 lesson')
    expect(en.roster.recordedSessions(2)).toBe('2 recorded sessions')
  })

  it('Arabic counted copy never keeps a fixed plural after 1, 2 or 11+', () => {
    for (const text of [
      ar.dashboard.cohortsCount(1),
      ar.dashboard.cohortsCount(2),
      ar.dashboard.learnersCount(1),
      ar.dashboard.learnersCount(2),
      ar.cohorts.seatsAvailable(1),
      ar.cohorts.seatsAvailable(2),
      ar.curriculum.unitsCount(1),
      ar.curriculum.unitsCount(2),
      ar.curriculum.lessonsCount(1),
      ar.curriculum.lessonsCount(2),
      ar.curriculum.lessonsCount(11),
    ]) {
      expect(text).not.toMatch(/[١٢] أفواج/)
      expect(text).not.toMatch(/[١٢] متدرّبين/)
      expect(text).not.toMatch(/[١٢] مقاعد/)
      expect(text).not.toMatch(/[١٢] دروس/)
    }
  })
})
