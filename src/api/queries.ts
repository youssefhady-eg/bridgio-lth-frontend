import { queryOptions } from '@tanstack/react-query'
import { api } from './index'
import { queryKeys } from './query-keys'
import type { CohortId, CurriculumId, MessageThreadId } from './types'

/**
 * Query options for the single API layer.
 *
 * Every academy screen reads through this file; no component calls the adapter
 * or `fetch` directly. All methods are PROPOSED — Mentingo to implement on
 * restore/rebuild.
 */

export const adapterInfoQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.system.info(),
    queryFn: () => api.system.getInfo(),
    staleTime: Number.POSITIVE_INFINITY,
  })

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.auth.session(),
    queryFn: () => api.auth.getSession(),
    staleTime: 30_000,
  })

export const languagesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.languages.list(),
    queryFn: () => api.languages.list(),
    staleTime: 60_000,
  })

/** Screen 11 — partner onboarding and calibration. */
export const academyOnboardingQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.academies.onboarding(),
    queryFn: () => api.academies.getOnboarding(),
    staleTime: 30_000,
  })

/** Screen 12 — the academy dashboard aggregate. */
export const academyDashboardQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.academies.dashboard(),
    queryFn: () => api.academies.getDashboard(),
    staleTime: 30_000,
  })

/** Screen 13 — cohort builder and seat publisher. */
export const cohortListQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.cohorts.list(),
    queryFn: () => api.cohorts.list(),
    staleTime: 30_000,
  })

export const cohortQueryOptions = (cohortId: CohortId) =>
  queryOptions({
    queryKey: queryKeys.cohorts.detail(cohortId),
    queryFn: () => api.cohorts.get({ cohortId }),
    staleTime: 30_000,
  })

/** Screen 14 — roster plus sessions and the proposed attendance model. */
export const cohortRosterQueryOptions = (cohortId: CohortId) =>
  queryOptions({
    queryKey: queryKeys.cohorts.roster(cohortId),
    queryFn: () => api.cohorts.getRoster({ cohortId }),
    staleTime: 0,
  })

export const attendanceSheetQueryOptions = (
  cohortId: CohortId,
  sessionId: string,
) =>
  queryOptions({
    queryKey: queryKeys.cohorts.attendance(cohortId, sessionId),
    queryFn: () => api.cohorts.getAttendanceSheet({ cohortId, sessionId }),
    staleTime: 0,
  })

/** Screen 15 — curriculum and lesson builder. */
export const curriculumListQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.curricula.list(),
    queryFn: () => api.curricula.list(),
    staleTime: 30_000,
  })

export const curriculumQueryOptions = (curriculumId: CurriculumId) =>
  queryOptions({
    queryKey: queryKeys.curricula.detail(curriculumId),
    queryFn: () => api.curricula.get({ curriculumId }),
    staleTime: 0,
  })

/** Screen 16 — grading rubric. */
export const rubricListQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.rubrics.list(),
    queryFn: () => api.rubrics.list(),
    staleTime: 30_000,
  })

export const rubricQueryOptions = (rubricId: string) =>
  queryOptions({
    queryKey: queryKeys.rubrics.detail(rubricId),
    queryFn: () => api.rubrics.get({ rubricId }),
    staleTime: 0,
  })

/** Screen 17 — earnings ledger, provisional figures only. */
export const earningsLedgerQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.earnings.ledger(),
    queryFn: () => api.earnings.getLedger(),
    staleTime: 30_000,
  })

/** Header chat popup — human threads, mock only. */
export const messageThreadsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.messages.threads(),
    queryFn: () => api.messages.listThreads(),
    staleTime: 0,
  })

export const threadMessagesQueryOptions = (threadId: MessageThreadId) =>
  queryOptions({
    queryKey: queryKeys.messages.thread(threadId),
    queryFn: () => api.messages.listMessages({ threadId }),
    staleTime: 0,
  })
