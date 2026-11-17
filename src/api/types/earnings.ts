import type {
  CohortId,
  IsoDate,
  IsoDateTime,
  LedgerEntryId,
  Money,
} from './common'

/**
 * Earnings, escrow and payout ledger.
 *
 * PROPOSED — Mentingo/BFF to implement on restore/rebuild.
 * Money is provisional until the legal and finance review. Every amount in the
 * mock is a placeholder (`amount: null`, `isPlaceholder: true`); the screen says
 * so on screen and never presents a figure as a real payout.
 */

export type LedgerEntryType =
  | 'tuition'
  | 'escrow_hold'
  | 'instructor_share'
  | 'platform_fee'
  | 'payout'
  | 'adjustment'

export type LedgerEntryStatus =
  | 'pending'
  | 'held'
  | 'available'
  | 'paid'
  | 'reversed'

export interface LedgerEntry {
  id: LedgerEntryId
  date: IsoDate
  type: LedgerEntryType
  status: LedgerEntryStatus
  description: string
  amount: Money
  cohortId: CohortId | null
  cohortLabel: string | null
  reference: string | null
}

export type PayoutAccountStatus = 'not_connected' | 'pending' | 'verified'

export interface EarningsSummary {
  available: Money
  pending: Money
  held: Money
  paidToDate: Money
  nextPayoutDate: IsoDate | null
  payoutAccountStatus: PayoutAccountStatus
  provisional: true
  updatedAt: IsoDateTime
}

export type PayoutScheduleStatus = 'scheduled' | 'processing' | 'paid' | 'on_hold'

export interface PayoutScheduleItem {
  id: string
  label: string
  date: IsoDate
  amount: Money
  status: PayoutScheduleStatus
}

export interface EarningsLedger {
  summary: EarningsSummary
  entries: LedgerEntry[]
  payoutSchedule: PayoutScheduleItem[]
}
