import type {
  AcademyId,
  IsoDateTime,
  LanguageId,
  Money,
  SessionId,
  CohortId,
} from './common'
import type { Language, Level } from './languages'
import type { CohortSummary } from './cohorts'

/**
 * Academy profile, calibration and dashboard aggregate.
 *
 * PROPOSED — Mentingo/BFF to implement on restore/rebuild.
 * Tenant provisioning is NOT VERIFIED, so this is a proposed BFF shape, not a
 * claim that an academy can be provisioned through an existing API.
 */

export type AcademyStatus = 'calibration' | 'active' | 'paused'

export interface Academy {
  id: AcademyId
  /** Demo value only; no per-academy branding, domain or invented brand name. */
  name: string
  status: AcademyStatus
  languageIds: LanguageId[]
  contactEmail: string
  createdAt: IsoDateTime
}

export type OnboardingStepId =
  | 'profile'
  | 'languages'
  | 'sample_lesson'
  | 'rubric_calibration'
  | 'payout_profile'

export type OnboardingStepStatus = 'complete' | 'in_progress' | 'pending' | 'blocked'

export interface OnboardingStep {
  id: OnboardingStepId
  status: OnboardingStepStatus
  completedAt: IsoDateTime | null
  /** Optional backend note shown as data, never used as UI copy. */
  detail: string | null
}

export type CalibrationStatus =
  | 'not_started'
  | 'in_review'
  | 'calibrated'
  | 'changes_requested'

export interface CalibrationSummary {
  status: CalibrationStatus
  reviewerRole: string | null
  rubricVersion: string | null
  appealOwnerReady: boolean
  sampleLessonsReviewed: number
  sampleLessonsRequired: number
}

export interface AcademyOnboarding {
  academy: Academy
  steps: OnboardingStep[]
  completionPercent: number
  calibration: CalibrationSummary
  languages: Language[]
  levels: Level[]
}

export interface AcademyTotals {
  activeCohorts: number
  activeLearners: number
  sessionsThisWeek: number
}

export type AcademyAlertKind =
  | 'attendance_due'
  | 'roster_incomplete'
  | 'curriculum_draft'
  | 'rubric_draft'
  | 'payout_profile'

export interface AcademyAlert {
  id: string
  kind: AcademyAlertKind
  count: number
  cohortId: CohortId | null
}

export interface AcademySessionSummary {
  id: SessionId
  cohortId: CohortId
  cohortLabel: string
  startsAt: IsoDateTime
  durationMinutes: number
  languageLabel: string
}

export interface AcademyDashboard {
  academy: Academy
  totals: AcademyTotals
  calibration: CalibrationSummary
  cohorts: CohortSummary[]
  upcomingSessions: AcademySessionSummary[]
  alerts: AcademyAlert[]
  /** Provisional only; rendered as a placeholder, never as a real figure. */
  earnings: Money
  updatedAt: IsoDateTime
}

export interface UpdateAcademyProfileInput {
  academyId: AcademyId
  name: string
  contactEmail: string
}

export interface CompleteOnboardingStepInput {
  academyId: AcademyId
  stepId: OnboardingStepId
}
