/**
 * PROPOSED endpoint map — Mentingo to implement on restore/rebuild.
 *
 * These paths are a proposal, not a description of existing Mentingo routes.
 * They live in one file so a backend change is a single-place edit, never a
 * screen rewrite. Base URL comes from `VITE_API_URL`.
 */

const encode = (value: string): string => encodeURIComponent(value)

export const endpoints = {
  auth: {
    session: '/auth/session',
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
  },
  languages: {
    // PROPOSED — language and level records are data, never a UI constant.
    list: '/languages',
    levels: (languageId: string) =>
      `/languages/${encode(languageId)}/levels`,
  },
  academies: {
    // PROPOSED — tenant provisioning is NOT VERIFIED.
    current: '/academies/current',
    onboarding: '/academies/current/onboarding',
    dashboard: '/academies/current/dashboard',
    profile: '/academies/current/profile',
    completeStep: (stepId: string) =>
      `/academies/current/onboarding/steps/${encode(stepId)}/complete`,
  },
  cohorts: {
    // PROPOSED — the cohort model itself is a proposal.
    list: '/cohorts',
    detail: (cohortId: string) => `/cohorts/${encode(cohortId)}`,
    publish: (cohortId: string) => `/cohorts/${encode(cohortId)}/publish`,
    roster: (cohortId: string) => `/cohorts/${encode(cohortId)}/roster`,
    attendanceSheet: (cohortId: string, sessionId: string) =>
      `/cohorts/${encode(cohortId)}/sessions/${encode(sessionId)}/attendance`,
  },
  curricula: {
    // PROPOSED — Mentingo has no verified curriculum model.
    list: '/curricula',
    detail: (curriculumId: string) => `/curricula/${encode(curriculumId)}`,
    units: (curriculumId: string) =>
      `/curricula/${encode(curriculumId)}/units`,
    lessons: (curriculumId: string, unitId: string) =>
      `/curricula/${encode(curriculumId)}/units/${encode(unitId)}/lessons`,
    publish: (curriculumId: string) =>
      `/curricula/${encode(curriculumId)}/publish`,
    draftOutline: (curriculumId: string) =>
      `/curricula/${encode(curriculumId)}/draft-outline`,
  },
  rubrics: {
    // PROPOSED — five-dimension coverage is NOT VERIFIED.
    list: '/rubrics',
    detail: (rubricId: string) => `/rubrics/${encode(rubricId)}`,
    dimension: (rubricId: string, dimensionId: string) =>
      `/rubrics/${encode(rubricId)}/dimensions/${encode(dimensionId)}`,
    publish: (rubricId: string) => `/rubrics/${encode(rubricId)}/publish`,
  },
  earnings: {
    // PROPOSED — every amount is a placeholder until the finance review.
    ledger: '/earnings/ledger',
  },
  messages: {
    // PROPOSED — in-app chat, mock only; no real-time transport claimed.
    threads: '/messages/threads',
    messages: (threadId: string) =>
      `/messages/threads/${encode(threadId)}/messages`,
  },
} as const
