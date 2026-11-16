import type {
  CohortId,
  CurriculumId,
  DimensionId,
  LanguageId,
  LessonId,
  MessageThreadId,
  RubricId,
  SessionId,
  UnitId,
} from './types'

/**
 * TanStack Query key factory for the single API layer.
 *
 * Screens must import keys from here instead of inventing string keys, so cache
 * invalidation stays consistent between the mock and the real adapter.
 */
export const queryKeys = {
  system: {
    info: () => ['system', 'info'] as const,
  },
  auth: {
    session: () => ['auth', 'session'] as const,
  },
  languages: {
    all: () => ['languages'] as const,
    list: () => ['languages', 'list'] as const,
    levels: (languageId: LanguageId) =>
      ['languages', languageId, 'levels'] as const,
  },
  academies: {
    all: () => ['academies'] as const,
    current: () => ['academies', 'current'] as const,
    onboarding: () => ['academies', 'current', 'onboarding'] as const,
    dashboard: () => ['academies', 'current', 'dashboard'] as const,
  },
  cohorts: {
    all: () => ['cohorts'] as const,
    list: () => ['cohorts', 'list'] as const,
    detail: (cohortId: CohortId) => ['cohorts', cohortId] as const,
    roster: (cohortId: CohortId) => ['cohorts', cohortId, 'roster'] as const,
    attendance: (cohortId: CohortId, sessionId: SessionId) =>
      ['cohorts', cohortId, 'sessions', sessionId, 'attendance'] as const,
  },
  curricula: {
    all: () => ['curricula'] as const,
    list: () => ['curricula', 'list'] as const,
    detail: (curriculumId: CurriculumId) =>
      ['curricula', curriculumId] as const,
    unit: (curriculumId: CurriculumId, unitId: UnitId) =>
      ['curricula', curriculumId, 'units', unitId] as const,
    lesson: (curriculumId: CurriculumId, lessonId: LessonId) =>
      ['curricula', curriculumId, 'lessons', lessonId] as const,
  },
  rubrics: {
    all: () => ['rubrics'] as const,
    list: () => ['rubrics', 'list'] as const,
    detail: (rubricId: RubricId) => ['rubrics', rubricId] as const,
    dimension: (rubricId: RubricId, dimensionId: DimensionId) =>
      ['rubrics', rubricId, 'dimensions', dimensionId] as const,
  },
  earnings: {
    all: () => ['earnings'] as const,
    ledger: () => ['earnings', 'ledger'] as const,
  },
  messages: {
    all: () => ['messages'] as const,
    threads: () => ['messages', 'threads'] as const,
    thread: (threadId: MessageThreadId) =>
      ['messages', 'threads', threadId] as const,
  },
}
