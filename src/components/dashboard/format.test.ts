import { describe, expect, it } from 'vitest'
import type { AcademyDashboard, Money } from '../../api/types'
import {
  clampPercent,
  formatCount,
  formatDate,
  formatMoney,
  formatPercent,
  formatTime,
  isAcademyDashboardEmpty,
} from './format'

const placeholder: Money = {
  amount: null,
  currency: 'XXX',
  isPlaceholder: true,
}

const emptyLists = {
  cohorts: [] as AcademyDashboard['cohorts'],
  upcomingSessions: [] as AcademyDashboard['upcomingSessions'],
  alerts: [] as AcademyDashboard['alerts'],
}

describe('academy format helpers', () => {
  it('clamps percentages into the progress-bar range', () => {
    expect(clampPercent(-12)).toBe(0)
    expect(clampPercent(0)).toBe(0)
    expect(clampPercent(63.6)).toBe(64)
    expect(clampPercent(100)).toBe(100)
    expect(clampPercent(180)).toBe(100)
    expect(clampPercent(Number.NaN)).toBe(0)
  })

  it('renders counts and percentages with the right digits per language', () => {
    expect(formatCount(3)).toContain('٣')
    expect(formatCount(3, 'en')).toBe('3')
    expect(formatPercent(64)).toContain('٦٤')
    expect(formatPercent(64, 'en')).toBe('64%')
    expect(formatPercent(150, 'en')).toBe('100%')
  })

  it('formats ISO dates and falls back for null or invalid input', () => {
    const formatted = formatDate('2026-10-31T18:20:00.000Z', 'لا نشاط')
    expect(formatted).not.toBe('لا نشاط')
    expect(formatted).toMatch(/2026|٢٠٢٦/)
    expect(formatDate(null, 'لا نشاط')).toBe('لا نشاط')
    expect(formatDate('not-a-date', 'لا نشاط')).toBe('لا نشاط')
  })

  it('formats dates in English when asked', () => {
    const formatted = formatDate('2026-10-31T18:20:00.000Z', '-', 'en')
    expect(formatted).toContain('2026')
    expect(formatted).toContain('October')
  })

  it('formats a time of day and never throws on bad input', () => {
    expect(formatTime('2026-10-31T18:20:00.000Z', 'en')).toMatch(/18:20|6:20/)
    expect(formatTime('not-a-date', 'en')).toBe('')
  })

  it('uses Arabic month names and digits for an Arabic date', () => {
    const formatted = formatDate('2026-10-31T00:00:00.000Z', '-', 'ar')
    expect(formatted).toContain('أكتوبر')
    expect(formatted).toMatch(/[٠-٩]/)
  })

  it('formats a time of day in Arabic digits too', () => {
    const formatted = formatTime('2026-10-31T18:20:00.000Z', 'ar')
    expect(formatted).not.toBe('')
    expect(formatted).toMatch(/[٠-٩]/)
  })

  it('shows a placeholder instead of inventing a money figure', () => {
    expect(formatMoney(placeholder, '[price]', 'en')).toBe('[price]')
    expect(
      formatMoney(
        { amount: 1200, currency: 'EUR', isPlaceholder: false },
        '[price]',
        'en',
      ),
    ).toBe('1,200 EUR')
    // A non-placeholder flag with no amount still must not print NaN.
    expect(
      formatMoney(
        { amount: null, currency: 'EUR', isPlaceholder: false },
        '[price]',
        'en',
      ),
    ).toBe('[price]')
  })

  it('renders an approved amount in the language digits', () => {
    const approved: Money = {
      amount: 1200,
      currency: 'EUR',
      isPlaceholder: false,
    }
    const arabic = formatMoney(approved, '[price]', 'ar')
    expect(arabic).toContain('EUR')
    expect(arabic).toMatch(/[١٢]/)
  })

  it('detects the page-level empty dashboard only when all three lists are empty', () => {
    expect(isAcademyDashboardEmpty(emptyLists)).toBe(true)
    expect(
      isAcademyDashboardEmpty({
        ...emptyLists,
        cohorts: [{}] as AcademyDashboard['cohorts'],
      }),
    ).toBe(false)
    expect(
      isAcademyDashboardEmpty({
        ...emptyLists,
        upcomingSessions: [{}] as AcademyDashboard['upcomingSessions'],
      }),
    ).toBe(false)
    expect(
      isAcademyDashboardEmpty({
        ...emptyLists,
        alerts: [{}] as AcademyDashboard['alerts'],
      }),
    ).toBe(false)
  })
})
