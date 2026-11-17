import type { AcademyDashboard, Money } from '../../api/types'
import type { Lang } from '~/shell/lang'

/**
 * Display-only formatters for the academy screens.
 *
 * These are pure presentation helpers: they never fetch, never hold persistent
 * data, and never invent a value. All counts, dates and amounts arrive from the
 * adapter. Arabic renders Arabic-Indic digits and Arabic month names; English
 * renders Western digits and English month names. The underlying numbers stay
 * untouched for the API and for ARIA.
 */

const arabicDate = new Intl.DateTimeFormat('ar-EG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const englishDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const arabicNumber = new Intl.NumberFormat('ar-EG', {
  maximumFractionDigits: 0,
})

const westernNumber = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
})

function numberFor(lang: Lang) {
  return lang === 'en' ? westernNumber : arabicNumber
}

/** Clamp a backend percentage into the 0–100 range the progress bar can show. */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

/** Localised count, e.g. 3 → "٣" in Arabic, "3" in English. */
export function formatCount(value: number, lang: Lang = 'ar'): string {
  const formatter = numberFor(lang)
  if (!Number.isFinite(value)) return formatter.format(0)
  return formatter.format(Math.max(0, Math.round(value)))
}

/** Localised percentage, e.g. 64 → "٦٤٪" (ar) or "64%" (en). */
export function formatPercent(value: number, lang: Lang = 'ar'): string {
  const sign = lang === 'en' ? '%' : '٪'
  return `${formatCount(clampPercent(value), lang)}${sign}`
}

/** Localised Gregorian date; returns `fallback` for null or invalid input. */
export function formatDate(
  iso: string | null,
  fallback: string,
  lang: Lang = 'ar',
): string {
  if (!iso) return fallback
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return fallback
  return (lang === 'en' ? englishDate : arabicDate).format(date)
}

/** Localised time of day, used by the dashboard session list. */
export function formatTime(iso: string, lang: Lang = 'ar'): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date)
}

/**
 * A money field renders as a placeholder in Batch 1. `amount` is null until the
 * legal and finance review supplies an approved value; the UI never invents a
 * figure from a missing number.
 */
export function formatMoney(
  money: Money,
  placeholder: string,
  lang: Lang = 'ar',
): string {
  if (money.amount === null || money.isPlaceholder) return placeholder
  const amount = numberFor(lang).format(money.amount)
  return `${amount} ${money.currency}`
}

/**
 * True when the dashboard aggregate holds no cohorts, no scheduled sessions and
 * no alerts — the page-level empty state. Section-level empty states are handled
 * separately so one missing list never hides the others.
 */
export function isAcademyDashboardEmpty(
  dashboard: Pick<AcademyDashboard, 'cohorts' | 'upcomingSessions' | 'alerts'>,
): boolean {
  return (
    dashboard.cohorts.length === 0 &&
    dashboard.upcomingSessions.length === 0 &&
    dashboard.alerts.length === 0
  )
}
