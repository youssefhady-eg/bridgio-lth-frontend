import type { BridgioApi } from '../contract'
import type {
  Academy,
  AcademyDashboard,
  AcademyOnboarding,
  AddLessonInput,
  AddUnitInput,
  AttendanceSheet,
  Cohort,
  CohortList,
  CreateCohortInput,
  CreateCurriculumInput,
  Curriculum,
  CurriculumList,
  DraftCurriculumOutlineInput,
  EarningsLedger,
  Language,
  Level,
  MarkAttendanceInput,
  Message,
  MessageThread,
  MohsenCurriculumDraft,
  PublishCohortInput,
  PublishCurriculumInput,
  PublishRubricInput,
  Roster,
  Rubric,
  RubricList,
  SendMessageInput,
  SendMessageResult,
  Session,
  SignInInput,
  UpdateAcademyProfileInput,
  UpdateRubricDimensionInput,
} from '../types'
import { CONTRACT_VERSION } from '../version'
import { endpoints } from './endpoints'
import { HttpClient } from './http-client'

export interface HttpApiOptions {
  baseUrl: string
  requestTimeoutMs: number
  getAccessToken?: () => string | null
  fetchImpl?: typeof fetch
}

/**
 * HTTP ADAPTER — PROPOSED endpoints only.
 *
 * Implements the exact same `BridgioApi` interface as the mock adapter. No live
 * Mentingo backend is connected in Batch 1. Every path in `endpoints.ts` is a
 * proposal for Mentingo to implement on restore/rebuild, not a confirmed route.
 */
export function createHttpApi(options: HttpApiOptions): BridgioApi {
  const client = new HttpClient({
    baseUrl: options.baseUrl,
    timeoutMs: options.requestTimeoutMs,
    getAccessToken: options.getAccessToken,
    fetchImpl: options.fetchImpl,
  })

  return {
    contractVersion: CONTRACT_VERSION,
    mode: 'http',

    auth: {
      getSession: async () => {
        // A signed-out backend may answer 204 or a `null`/empty body, which the
        // HTTP client returns as `undefined`. The contract says `Session | null`,
        // and TanStack Query treats `undefined` query data as an error, so this
        // method (and only this one) normalises `undefined` to `null`.
        const session = await client.request<Session | null | undefined>({
          method: 'GET',
          path: endpoints.auth.session,
        })
        return session ?? null
      },
      signIn: (input: SignInInput) =>
        client.request<Session>({
          method: 'POST',
          path: endpoints.auth.signIn,
          body: input,
        }),
      signOut: () =>
        client.request<void>({
          method: 'POST',
          path: endpoints.auth.signOut,
        }),
    },

    languages: {
      list: () =>
        client.request<Language[]>({
          method: 'GET',
          path: endpoints.languages.list,
        }),
      listLevels: (input) =>
        client.request<Level[]>({
          method: 'GET',
          path: endpoints.languages.levels(input.languageId),
        }),
    },

    academies: {
      get: () =>
        client.request<Academy>({
          method: 'GET',
          path: endpoints.academies.current,
        }),
      getOnboarding: () =>
        client.request<AcademyOnboarding>({
          method: 'GET',
          path: endpoints.academies.onboarding,
        }),
      getDashboard: () =>
        client.request<AcademyDashboard>({
          method: 'GET',
          path: endpoints.academies.dashboard,
        }),
      updateProfile: (input: UpdateAcademyProfileInput) =>
        client.request<Academy>({
          method: 'PATCH',
          path: endpoints.academies.profile,
          body: { name: input.name, contactEmail: input.contactEmail },
        }),
      completeOnboardingStep: (input) =>
        client.request<AcademyOnboarding>({
          method: 'POST',
          path: endpoints.academies.completeStep(input.stepId),
        }),
    },

    cohorts: {
      list: () =>
        client.request<CohortList>({
          method: 'GET',
          path: endpoints.cohorts.list,
        }),
      get: (input) =>
        client.request<Cohort>({
          method: 'GET',
          path: endpoints.cohorts.detail(input.cohortId),
        }),
      create: (input: CreateCohortInput) =>
        client.request<Cohort>({
          method: 'POST',
          path: endpoints.cohorts.list,
          body: input,
        }),
      publish: (input: PublishCohortInput) =>
        client.request<Cohort>({
          method: 'POST',
          path: endpoints.cohorts.publish(input.cohortId),
        }),
      getRoster: (input) =>
        client.request<Roster>({
          method: 'GET',
          path: endpoints.cohorts.roster(input.cohortId),
        }),
      getAttendanceSheet: (input) =>
        client.request<AttendanceSheet>({
          method: 'GET',
          path: endpoints.cohorts.attendanceSheet(
            input.cohortId,
            input.sessionId,
          ),
        }),
      markAttendance: (input: MarkAttendanceInput) =>
        client.request<AttendanceSheet>({
          method: 'PUT',
          path: endpoints.cohorts.attendanceSheet(
            input.cohortId,
            input.sessionId,
          ),
          body: { records: input.records },
        }),
    },

    curricula: {
      list: () =>
        client.request<CurriculumList>({
          method: 'GET',
          path: endpoints.curricula.list,
        }),
      get: (input) =>
        client.request<Curriculum>({
          method: 'GET',
          path: endpoints.curricula.detail(input.curriculumId),
        }),
      create: (input: CreateCurriculumInput) =>
        client.request<Curriculum>({
          method: 'POST',
          path: endpoints.curricula.list,
          body: input,
        }),
      addUnit: (input: AddUnitInput) =>
        client.request<Curriculum>({
          method: 'POST',
          path: endpoints.curricula.units(input.curriculumId),
          body: { title: input.title, objective: input.objective },
        }),
      addLesson: (input: AddLessonInput) =>
        client.request<Curriculum>({
          method: 'POST',
          path: endpoints.curricula.lessons(input.curriculumId, input.unitId),
          body: {
            title: input.title,
            objective: input.objective,
            durationMinutes: input.durationMinutes,
            contentLanguageId: input.contentLanguageId,
            kind: input.kind,
          },
        }),
      publish: (input: PublishCurriculumInput) =>
        client.request<Curriculum>({
          method: 'POST',
          path: endpoints.curricula.publish(input.curriculumId),
        }),
      draftOutline: (input: DraftCurriculumOutlineInput) =>
        client.request<MohsenCurriculumDraft>({
          method: 'POST',
          path: endpoints.curricula.draftOutline(input.curriculumId),
          body: {
            unitTitle: input.unitTitle,
            lessonCount: input.lessonCount,
          },
        }),
    },

    rubrics: {
      list: () =>
        client.request<RubricList>({
          method: 'GET',
          path: endpoints.rubrics.list,
        }),
      get: (input) =>
        client.request<Rubric>({
          method: 'GET',
          path: endpoints.rubrics.detail(input.rubricId),
        }),
      updateDimension: (input: UpdateRubricDimensionInput) =>
        client.request<Rubric>({
          method: 'PATCH',
          path: endpoints.rubrics.dimension(
            input.rubricId,
            input.dimensionId,
          ),
          body: {
            weightPercent: input.weightPercent,
            descriptors: input.descriptors,
          },
        }),
      publish: (input: PublishRubricInput) =>
        client.request<Rubric>({
          method: 'POST',
          path: endpoints.rubrics.publish(input.rubricId),
        }),
    },

    earnings: {
      getLedger: () =>
        client.request<EarningsLedger>({
          method: 'GET',
          path: endpoints.earnings.ledger,
        }),
    },

    messages: {
      listThreads: () =>
        client.request<MessageThread[]>({
          method: 'GET',
          path: endpoints.messages.threads,
        }),
      listMessages: (input) =>
        client.request<Message[]>({
          method: 'GET',
          path: endpoints.messages.messages(input.threadId),
        }),
      sendMessage: (input: SendMessageInput) =>
        client.request<SendMessageResult>({
          method: 'POST',
          path: endpoints.messages.messages(input.threadId),
          body: { body: input.body },
        }),
    },

    system: {
      // Adapter-local, never a Mentingo call.
      getInfo: async () => ({
        contractVersion: CONTRACT_VERSION,
        mode: 'http',
        mockScenario: null,
        endpointStatus: 'PROPOSED',
      }),
    },
  }
}
