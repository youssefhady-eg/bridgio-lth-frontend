/**
 * BRIDGIO Learn-to-Hire API contract — shared primitives.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * Mentingo's local source was deleted by the owner (2026-11-01). Nothing in this
 * file describes a confirmed Mentingo endpoint, table or field. All IDs are
 * opaque strings owned by the backend; the frontend must never parse them.
 */

/** Opaque identifier owned by the backend. Never parse or construct one. */
export type UserId = string
export type AcademyId = string
export type LanguageId = string
export type LevelId = string
export type CohortId = string
export type LearnerId = string
export type SessionId = string
export type CurriculumId = string
export type LessonId = string
export type UnitId = string
export type MaterialId = string
export type RubricId = string
export type DimensionId = string
export type LedgerEntryId = string
export type MessageThreadId = string
export type MessageId = string

/** ISO-8601 timestamp supplied by the backend. */
export type IsoDateTime = string

/** ISO-8601 calendar date (`YYYY-MM-DD`) supplied by the backend. */
export type IsoDate = string

/** Writing direction carried by a language record. */
export type ContentDirection = 'ltr' | 'rtl'

/**
 * Mentingo roles used by this projection.
 *
 * `academy_owner` and `instructor` are the two academy surfaces this batch
 * builds. `learner` exists in the contract because Mentingo owns learner
 * accounts, but no learner screen is built in Batch 1. There is no separate
 * BRIDGIO role system and no assistant or parent role in LTH.
 */
export type UserRole = 'academy_owner' | 'instructor' | 'learner'

/** Which implementation of the single API layer is active. */
export type ApiMode = 'mock' | 'http'

/** Marks every shape in this contract. Do not remove or present it as confirmed. */
export const CONTRACT_STATUS = 'PROPOSED' as const
export type ContractStatus = typeof CONTRACT_STATUS

/**
 * A money field is always a placeholder in Batch 1. `amount` is null until the
 * legal and finance review supplies an approved value; the UI renders the
 * `[price]` placeholder and never invents a figure.
 */
export interface Money {
  amount: number | null
  /** ISO 4217 code, or `'XXX'` when no currency has been approved. */
  currency: string
  isPlaceholder: boolean
}

/** Marks a display value that is a target or an illustration, not data. */
export type TargetKind = 'target' | 'illustrative' | 'placeholder'
