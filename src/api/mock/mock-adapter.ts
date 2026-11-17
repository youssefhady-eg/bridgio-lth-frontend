import type { BridgioApi } from '../contract'
import { ApiError } from '../errors'
import type {
  Academy,
  AcademyDashboard,
  AcademyOnboarding,
  AttendanceRecord,
  AttendanceSheet,
  Cohort,
  CohortList,
  CohortSummary,
  Curriculum,
  CurriculumList,
  CurriculumSummary,
  EarningsLedger,
  Language,
  Level,
  MarkAttendanceInput,
  Message,
  MessageThread,
  MohsenCurriculumDraft,
  OnboardingStep,
  Rubric,
  RubricList,
  RubricSummary,
  Roster,
  RosterMember,
  Session,
  SignInInput,
  User,
} from '../types'
import { CONTRACT_VERSION } from '../version'
import { createSeed, seedIds, seedInstructorUser, type SeedData } from './seed'

export interface MockApiOptions {
  scenario?: 'seeded' | 'empty'
  session?: 'academy' | 'instructor' | 'none'
  latencyMs?: number
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function nowIso(): string {
  return new Date().toISOString()
}

function sleep(ms: number): Promise<void> {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve()
}

function notFound(what: string): ApiError {
  return new ApiError('NOT_FOUND', `${what} was not found.`)
}

function validation(message: string): ApiError {
  return new ApiError('VALIDATION', message)
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

function completionFor(steps: OnboardingStep[]): number {
  if (steps.length === 0) return 0
  const points = steps.reduce((total, step) => {
    if (step.status === 'complete') return total + 1
    if (step.status === 'in_progress') return total + 0.5
    return total
  }, 0)
  return Math.round((points / steps.length) * 100)
}

function cohortSummary(cohort: Cohort): CohortSummary {
  return {
    id: cohort.id,
    label: cohort.label,
    language: cohort.language,
    level: cohort.level,
    schedule: cohort.schedule,
    status: cohort.status,
    capacity: cohort.capacity,
    seatsFilled: cohort.seatsFilled,
    seatsAvailable: cohort.seatsAvailable,
    instructor: cohort.instructor,
    startDate: cohort.startDate,
  }
}

function curriculumSummary(curriculum: Curriculum): CurriculumSummary {
  return {
    id: curriculum.id,
    title: curriculum.title,
    status: curriculum.status,
    language: curriculum.language,
    level: curriculum.level,
    unitCount: curriculum.units.length,
    lessonCount: curriculum.units.reduce(
      (total, unit) => total + unit.lessons.length,
      0,
    ),
    updatedAt: curriculum.updatedAt,
  }
}

function rubricSummary(rubric: Rubric): RubricSummary {
  return {
    id: rubric.id,
    title: rubric.title,
    status: rubric.status,
    version: rubric.version,
    language: rubric.language,
    level: rubric.level,
    updatedAt: rubric.updatedAt,
  }
}

function attendanceRateForMembers(members: RosterMember[]): number | null {
  const present = sum(members.map((member) => member.attendance.present))
  const late = sum(members.map((member) => member.attendance.late))
  const absent = sum(members.map((member) => member.attendance.absent))
  const counted = present + late + absent
  if (counted === 0) return null
  return Math.round(((present + late) / counted) * 100)
}

/**
 * MOCK ADAPTER — implements the same proposed contract as the HTTP adapter.
 *
 * In-memory only: no persistent store, no network, no auth. All data is demo
 * data and every method remains PROPOSED. The deterministic reply in
 * `messages.sendMessage` is demo behaviour, not a real-time transport.
 */
export function createMockApi(options: MockApiOptions = {}): BridgioApi {
  const scenario = options.scenario ?? 'seeded'
  const latencyMs = options.latencyMs ?? 0
  const state: SeedData = createSeed()
  let signedOut = options.session === 'none'
  let sessionRole: 'academy' | 'instructor' =
    options.session === 'instructor' ? 'instructor' : 'academy'
  let stepCounter = 0

  const onboardingSteps: OnboardingStep[] =
    scenario === 'empty'
      ? [
          { id: 'profile', status: 'pending', completedAt: null, detail: null },
          { id: 'languages', status: 'pending', completedAt: null, detail: null },
          { id: 'sample_lesson', status: 'pending', completedAt: null, detail: null },
          {
            id: 'rubric_calibration',
            status: 'pending',
            completedAt: null,
            detail: null,
          },
          { id: 'payout_profile', status: 'pending', completedAt: null, detail: null },
        ]
      : [
          { id: 'profile', status: 'complete', completedAt: nowIso(), detail: null },
          { id: 'languages', status: 'complete', completedAt: nowIso(), detail: null },
          {
            id: 'sample_lesson',
            status: 'in_progress',
            completedAt: null,
            detail: 'Two of three sample lessons reviewed.',
          },
          {
            id: 'rubric_calibration',
            status: 'pending',
            completedAt: null,
            detail: null,
          },
          {
            id: 'payout_profile',
            status: 'blocked',
            completedAt: null,
            detail: 'Awaiting the finance review.',
          },
        ]

  if (scenario === 'empty') {
    state.cohorts = []
    state.rosters = {}
    state.sessions = {}
    state.attendance = {}
    state.curricula = []
    state.rubrics = []
    state.earnings.entries = []
    state.earnings.payoutSchedule = []
    state.threads = []
    state.messages = []
  }

  function sessionUser(): User | null {
    if (signedOut) return null
    if (sessionRole === 'instructor') return { ...seedInstructorUser }
    return { ...state.owner }
  }

  function currentSession(): Session | null {
    const user = sessionUser()
    if (!user) return null
    return { user, expiresAt: null }
  }

  function findCohort(cohortId: string): Cohort {
    const cohort = state.cohorts.find((item) => item.id === cohortId)
    if (!cohort) throw notFound('Cohort')
    return cohort
  }

  function findCurriculum(curriculumId: string): Curriculum {
    const curriculum = state.curricula.find((item) => item.id === curriculumId)
    if (!curriculum) throw notFound('Curriculum')
    return curriculum
  }

  function findRubric(rubricId: string): Rubric {
    const rubric = state.rubrics.find((item) => item.id === rubricId)
    if (!rubric) throw notFound('Rubric')
    return rubric
  }

  function findLanguage(languageId: string): Language {
    const language = state.languages.find((item) => item.id === languageId)
    if (!language) throw notFound('Language')
    return language
  }

  function findLevel(levelId: string): Level {
    const level = state.levels.find((item) => item.id === levelId)
    if (!level) throw notFound('Level')
    return level
  }

  function recomputeAttendance(cohortId: string): void {
    const members = state.rosters[cohortId] ?? []
    const sessions = state.sessions[cohortId] ?? []
    for (const member of members) {
      member.attendance = {
        present: 0,
        late: 0,
        absent: 0,
        excused: 0,
        recordedSessions: 0,
        attendanceRate: null,
      }
      for (const session of sessions) {
        const record = state.attendance[session.id]?.find(
          (item) => item.learnerId === member.learnerId,
        )
        if (!record) continue
        member.attendance.recordedSessions += 1
        if (record.status !== 'not_recorded') {
          member.attendance[record.status] += 1
        }
      }
      const present = member.attendance.present
      const late = member.attendance.late
      const absent = member.attendance.absent
      const counted = present + late + absent
      member.attendance.attendanceRate =
        counted === 0 ? null : Math.round(((present + late) / counted) * 100)
    }
  }

  function attendanceSheet(cohortId: string, sessionId: string): AttendanceSheet {
    const cohort = findCohort(cohortId)
    const session = (state.sessions[cohortId] ?? []).find(
      (item) => item.id === sessionId,
    )
    if (!session) throw notFound('Session')
    const members = state.rosters[cohortId] ?? []
    const records = state.attendance[session.id]
    const sheetRecords: AttendanceRecord[] =
      records && records.length > 0
        ? clone(records)
        : members.map((member) => ({
            learnerId: member.learnerId,
            status: 'not_recorded' as const,
            note: null,
          }))
    return {
      cohort: clone(cohort),
      session: clone(session),
      records: sheetRecords,
      recordedAt: session.attendanceRecorded ? session.startsAt : null,
    }
  }

  async function pause(): Promise<void> {
    await sleep(latencyMs)
  }

  return {
    contractVersion: CONTRACT_VERSION,
    mode: 'mock',

    auth: {
      getSession: async () => {
        await pause()
        return currentSession()
      },
      signIn: async (input: SignInInput) => {
        await pause()
        if (!input.email.trim() || !input.password.trim()) {
          throw validation('Email and password are required.')
        }
        sessionRole = input.email.toLowerCase().includes('instructor')
          ? 'instructor'
          : 'academy'
        signedOut = false
        const session = currentSession()
        if (!session) throw new ApiError('INTERNAL', 'Session could not be created.')
        return session
      },
      signOut: async () => {
        await pause()
        signedOut = true
      },
    },

    languages: {
      list: async () => {
        await pause()
        return clone(state.languages)
      },
      listLevels: async (input) => {
        await pause()
        if (!state.languages.some((language) => language.id === input.languageId)) {
          throw notFound('Language')
        }
        return clone(state.levels)
      },
    },

    academies: {
      get: async () => {
        await pause()
        return clone(state.academy)
      },
      getOnboarding: async (): Promise<AcademyOnboarding> => {
        await pause()
        return {
          academy: clone(state.academy),
          steps: clone(onboardingSteps),
          completionPercent: completionFor(onboardingSteps),
          calibration: {
            status: scenario === 'empty' ? 'not_started' : 'in_review',
            reviewerRole: scenario === 'empty' ? null : 'Academy calibration',
            rubricVersion: scenario === 'empty' ? null : 'v3',
            appealOwnerReady: scenario !== 'empty',
            sampleLessonsReviewed: scenario === 'empty' ? 0 : 2,
            sampleLessonsRequired: 3,
          },
          languages: clone(state.languages),
          levels: clone(state.levels),
        }
      },
      getDashboard: async (): Promise<AcademyDashboard> => {
        await pause()
        const activeCohorts = state.cohorts.filter(
          (cohort) => cohort.status === 'active' || cohort.status === 'published',
        )
        const sessions = Object.values(state.sessions)
          .flat()
          .filter((session) => session.status === 'scheduled')
          .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
        const nextWeek = Date.now() + 7 * 24 * 60 * 60 * 1000
        const alerts = []
        if (state.cohorts.some((cohort) => cohort.status === 'draft')) {
          alerts.push({
            id: 'alert_roster',
            kind: 'roster_incomplete' as const,
            count: state.cohorts.filter((cohort) => cohort.status === 'draft').length,
            cohortId: null,
          })
        }
        if (state.curricula.some((curriculum) => curriculum.status === 'draft')) {
          alerts.push({
            id: 'alert_curriculum',
            kind: 'curriculum_draft' as const,
            count: state.curricula.filter(
              (curriculum) => curriculum.status === 'draft',
            ).length,
            cohortId: null,
          })
        }
        if (state.rubrics.some((rubric) => rubric.status === 'draft')) {
          alerts.push({
            id: 'alert_rubric',
            kind: 'rubric_draft' as const,
            count: state.rubrics.filter((rubric) => rubric.status === 'draft').length,
            cohortId: null,
          })
        }
        if (state.earnings.summary.payoutAccountStatus !== 'verified') {
          alerts.push({
            id: 'alert_payout',
            kind: 'payout_profile' as const,
            count: 1,
            cohortId: null,
          })
        }
        return {
          academy: clone(state.academy),
          totals: {
            activeCohorts: activeCohorts.length,
            activeLearners: sum(
              activeCohorts.map((cohort) => cohort.seatsFilled),
            ),
            sessionsThisWeek: sessions.filter(
              (session) => new Date(session.startsAt).getTime() <= nextWeek,
            ).length,
          },
          calibration: {
            status: scenario === 'empty' ? 'not_started' : 'in_review',
            reviewerRole: scenario === 'empty' ? null : 'Academy calibration',
            rubricVersion: scenario === 'empty' ? null : 'v3',
            appealOwnerReady: scenario !== 'empty',
            sampleLessonsReviewed: scenario === 'empty' ? 0 : 2,
            sampleLessonsRequired: 3,
          },
          cohorts: activeCohorts.map((cohort) => clone(cohortSummary(cohort))),
          upcomingSessions: sessions.slice(0, 5).map((session) => {
            const cohort = state.cohorts.find((item) => item.id === session.cohortId)
            return {
              id: session.id,
              cohortId: session.cohortId,
              cohortLabel: cohort?.label ?? '',
              startsAt: session.startsAt,
              durationMinutes: session.durationMinutes,
              languageLabel: cohort?.language.label ?? '',
            }
          }),
          alerts,
          earnings: clone(state.earnings.summary.available),
          updatedAt: nowIso(),
        }
      },
      updateProfile: async (input): Promise<Academy> => {
        await pause()
        if (!input.name.trim() || !input.contactEmail.trim()) {
          throw validation('Academy name and contact email are required.')
        }
        state.academy = {
          ...state.academy,
          name: input.name.trim(),
          contactEmail: input.contactEmail.trim(),
        }
        return clone(state.academy)
      },
      completeOnboardingStep: async (input): Promise<AcademyOnboarding> => {
        await pause()
        const step = onboardingSteps.find((item) => item.id === input.stepId)
        if (!step) throw notFound('Onboarding step')
        if (step.status === 'blocked') {
          throw new ApiError(
            'CONFLICT',
            'This step is blocked until the finance review completes.',
          )
        }
        step.status = 'complete'
        step.completedAt = nowIso()
        return {
          academy: clone(state.academy),
          steps: clone(onboardingSteps),
          completionPercent: completionFor(onboardingSteps),
          calibration: {
            status: scenario === 'empty' ? 'not_started' : 'in_review',
            reviewerRole: scenario === 'empty' ? null : 'Academy calibration',
            rubricVersion: scenario === 'empty' ? null : 'v3',
            appealOwnerReady: scenario !== 'empty',
            sampleLessonsReviewed: scenario === 'empty' ? 0 : 2,
            sampleLessonsRequired: 3,
          },
          languages: clone(state.languages),
          levels: clone(state.levels),
        }
      },
    },

    cohorts: {
      list: async (): Promise<CohortList> => {
        await pause()
        return {
          cohorts: state.cohorts.map((cohort) => clone(cohortSummary(cohort))),
          languages: clone(state.languages),
          levels: clone(state.levels),
          instructors: clone(state.instructors),
        }
      },
      get: async (input) => {
        await pause()
        return clone(findCohort(input.cohortId))
      },
      create: async (input): Promise<Cohort> => {
        await pause()
        if (!input.label.trim()) throw validation('Cohort label is required.')
        if (!Number.isFinite(input.capacity) || input.capacity < 1) {
          throw validation('Capacity must be at least 1.')
        }
        if (input.capacity > 200) throw validation('Capacity must be 200 or less.')
        const language = findLanguage(input.languageId)
        const level = findLevel(input.levelId)
        const instructor = state.instructors.find(
          (item) => item.id === input.instructorId,
        )
        if (!instructor) throw notFound('Instructor')
        const cohort: Cohort = {
          id: `coh_${Date.now()}_${state.cohorts.length + 1}`,
          academyId: state.academy.id,
          label: input.label.trim(),
          language: clone(language),
          level: clone(level),
          schedule: input.schedule.trim(),
          capacity: Math.round(input.capacity),
          seatsFilled: 0,
          seatsAvailable: Math.round(input.capacity),
          status: 'draft',
          instructor: clone(instructor),
          startDate: input.startDate,
          endDate: input.endDate,
          price: { amount: null, currency: 'XXX', isPlaceholder: true },
          attendanceModel: 'proposed',
        }
        state.cohorts.push(cohort)
        state.rosters[cohort.id] = []
        state.sessions[cohort.id] = []
        return clone(cohort)
      },
      publish: async (input) => {
        await pause()
        const cohort = findCohort(input.cohortId)
        if (cohort.seatsAvailable < 1) {
          throw new ApiError(
            'CONFLICT',
            'Every seat is already filled; open a new cohort instead.',
          )
        }
        if (!cohort.schedule.trim()) {
          throw validation('A schedule is required before publishing seats.')
        }
        cohort.status = 'published'
        return clone(cohort)
      },
      getRoster: async (input): Promise<Roster> => {
        await pause()
        const cohort = findCohort(input.cohortId)
        const members = clone(state.rosters[cohort.id] ?? [])
        return {
          cohort: clone(cohort),
          members,
          sessions: clone(state.sessions[cohort.id] ?? []),
          attendanceRate: attendanceRateForMembers(members),
        }
      },
      getAttendanceSheet: async (input) => {
        await pause()
        return attendanceSheet(input.cohortId, input.sessionId)
      },
      markAttendance: async (input: MarkAttendanceInput) => {
        await pause()
        const cohort = findCohort(input.cohortId)
        const session = (state.sessions[cohort.id] ?? []).find(
          (item) => item.id === input.sessionId,
        )
        if (!session) throw notFound('Session')
        const members = state.rosters[cohort.id] ?? []
        if (members.length === 0) {
          throw validation('This cohort has no roster to record.')
        }
        const seen = new Set<string>()
        const records = input.records.map((record) => {
          if (!members.some((member) => member.learnerId === record.learnerId)) {
            throw validation('Attendance includes a learner outside the roster.')
          }
          if (seen.has(record.learnerId)) {
            throw validation('Attendance includes the same learner twice.')
          }
          seen.add(record.learnerId)
          return {
            learnerId: record.learnerId,
            status: record.status,
            note: null,
          }
        })
        if (seen.size !== members.length) {
          throw validation('Every roster member needs an attendance mark.')
        }
        state.attendance[session.id] = records
        session.attendanceRecorded = true
        recomputeAttendance(cohort.id)
        return attendanceSheet(cohort.id, session.id)
      },
    },

    curricula: {
      list: async (): Promise<CurriculumList> => {
        await pause()
        return {
          curricula: state.curricula.map((curriculum) =>
            clone(curriculumSummary(curriculum)),
          ),
          languages: clone(state.languages),
          levels: clone(state.levels),
        }
      },
      get: async (input) => {
        await pause()
        return clone(findCurriculum(input.curriculumId))
      },
      create: async (input): Promise<Curriculum> => {
        await pause()
        if (!input.title.trim()) throw validation('Curriculum title is required.')
        if (!input.description.trim()) {
          throw validation('Curriculum description is required.')
        }
        const language = findLanguage(input.languageId)
        const level = findLevel(input.levelId)
        const curriculum: Curriculum = {
          id: `cur_${Date.now()}_${state.curricula.length + 1}`,
          academyId: state.academy.id,
          title: input.title.trim(),
          description: input.description.trim(),
          status: 'draft',
          language: clone(language),
          level: clone(level),
          units: [],
          updatedAt: nowIso(),
        }
        state.curricula.push(curriculum)
        return clone(curriculum)
      },
      addUnit: async (input) => {
        await pause()
        if (!input.title.trim()) throw validation('Unit title is required.')
        if (!input.objective.trim()) throw validation('Unit objective is required.')
        const curriculum = findCurriculum(input.curriculumId)
        stepCounter += 1
        curriculum.units.push({
          id: `unit_${Date.now()}_${stepCounter}`,
          title: input.title.trim(),
          objective: input.objective.trim(),
          order: curriculum.units.length + 1,
          lessons: [],
        })
        curriculum.updatedAt = nowIso()
        return clone(curriculum)
      },
      addLesson: async (input) => {
        await pause()
        if (!input.title.trim()) throw validation('Lesson title is required.')
        if (!input.objective.trim()) throw validation('Lesson objective is required.')
        if (!Number.isFinite(input.durationMinutes) || input.durationMinutes < 5) {
          throw validation('Lesson duration must be at least 5 minutes.')
        }
        const curriculum = findCurriculum(input.curriculumId)
        const unit = curriculum.units.find((item) => item.id === input.unitId)
        if (!unit) throw notFound('Unit')
        const language = findLanguage(input.contentLanguageId)
        stepCounter += 1
        unit.lessons.push({
          id: `les_${Date.now()}_${stepCounter}`,
          title: input.title.trim(),
          objective: input.objective.trim(),
          order: unit.lessons.length + 1,
          durationMinutes: Math.round(input.durationMinutes),
          kind: input.kind,
          contentLanguage: clone(language),
          materials: [],
        })
        curriculum.updatedAt = nowIso()
        return clone(curriculum)
      },
      publish: async (input) => {
        await pause()
        const curriculum = findCurriculum(input.curriculumId)
        const lessonCount = curriculum.units.reduce(
          (total, unit) => total + unit.lessons.length,
          0,
        )
        if (lessonCount === 0) {
          throw new ApiError(
            'CONFLICT',
            'Add at least one lesson before publishing.',
          )
        }
        curriculum.status = 'published'
        curriculum.updatedAt = nowIso()
        return clone(curriculum)
      },
      draftOutline: async (input): Promise<MohsenCurriculumDraft> => {
        await pause()
        const curriculum = findCurriculum(input.curriculumId)
        if (!input.unitTitle.trim()) throw validation('Unit title is required.')
        const count = Math.min(6, Math.max(1, Math.round(input.lessonCount)))
        return {
          units: [
            {
              title: input.unitTitle.trim(),
              objective: `Build ${curriculum.language.label} ${curriculum.level.label} confidence for this unit.`,
              lessons: Array.from({ length: count }, (_, index) => ({
                title: `${input.unitTitle.trim()} — lesson ${index + 1}`,
                objective: `Practise one workplace task and check understanding.`,
                durationMinutes: 45,
                kind: index === count - 1 ? ('assessment' as const) : ('lesson' as const),
              })),
            },
          ],
          grounding: [
            { id: curriculum.id, label: curriculum.title },
            { id: curriculum.language.id, label: `${curriculum.language.label} language record` },
            { id: curriculum.level.id, label: `${curriculum.level.label} level record` },
          ],
          disclaimer:
            'Mohsen draft. Review the outline before adding it to the curriculum.',
        }
      },
    },

    rubrics: {
      list: async (): Promise<RubricList> => {
        await pause()
        return {
          rubrics: state.rubrics.map((rubric) => clone(rubricSummary(rubric))),
          languages: clone(state.languages),
          levels: clone(state.levels),
        }
      },
      get: async (input) => {
        await pause()
        return clone(findRubric(input.rubricId))
      },
      updateDimension: async (input) => {
        await pause()
        if (input.weightPercent < 0 || input.weightPercent > 100) {
          throw validation('Weight must be between 0 and 100.')
        }
        if (input.descriptors.length === 0) {
          throw validation('At least one descriptor is required.')
        }
        const bands = new Set<number>()
        for (const descriptor of input.descriptors) {
          if (!Number.isInteger(descriptor.band) || descriptor.band < 1) {
            throw validation('Every descriptor needs a positive band number.')
          }
          if (bands.has(descriptor.band)) {
            throw validation('Descriptor bands must be unique.')
          }
          if (!descriptor.label.trim() || !descriptor.descriptor.trim()) {
            throw validation('Every descriptor needs a label and text.')
          }
          bands.add(descriptor.band)
        }
        const rubric = findRubric(input.rubricId)
        const dimension = rubric.dimensions.find(
          (item) => item.id === input.dimensionId,
        )
        if (!dimension) throw notFound('Rubric dimension')
        dimension.weightPercent = Math.round(input.weightPercent)
        dimension.descriptors = input.descriptors.map((descriptor) => ({
          band: descriptor.band,
          label: descriptor.label.trim(),
          descriptor: descriptor.descriptor.trim(),
        }))
        rubric.updatedAt = nowIso()
        return clone(rubric)
      },
      publish: async (input) => {
        await pause()
        const rubric = findRubric(input.rubricId)
        const assessed = rubric.dimensions.filter((item) => item.assessed)
        if (assessed.length === 0) {
          throw new ApiError(
            'CONFLICT',
            'Mark at least one dimension as assessed before publishing.',
          )
        }
        const total = sum(assessed.map((item) => item.weightPercent))
        if (total !== 100) {
          throw new ApiError(
            'CONFLICT',
            'Assessed dimension weights must add up to 100 before publishing.',
          )
        }
        rubric.status = 'published'
        rubric.version += 1
        rubric.updatedAt = nowIso()
        return clone(rubric)
      },
    },

    earnings: {
      getLedger: async (): Promise<EarningsLedger> => {
        await pause()
        return clone(state.earnings)
      },
    },

    messages: {
      listThreads: async (): Promise<MessageThread[]> => {
        await pause()
        return clone(state.threads)
      },
      listMessages: async (input): Promise<Message[]> => {
        await pause()
        if (!state.threads.some((thread) => thread.id === input.threadId)) {
          throw notFound('Thread')
        }
        return clone(
          state.messages.filter((message) => message.threadId === input.threadId),
        )
      },
      sendMessage: async (input) => {
        await pause()
        const thread = state.threads.find((item) => item.id === input.threadId)
        if (!thread) throw notFound('Thread')
        const body = input.body.trim()
        if (!body) throw validation('A message is required.')
        const sentAt = nowIso()
        const sent: Message = {
          id: `msg_${Date.now()}_sent`,
          threadId: thread.id,
          author: {
            role: sessionRole === 'instructor' ? 'instructor' : 'academy_owner',
            name: sessionUser()?.displayName ?? 'Demo user',
          },
          fromMe: true,
          body,
          sentAt,
          lang: 'en',
          dir: 'ltr',
        }
        const reply: Message = {
          id: `msg_${Date.now()}_reply`,
          threadId: thread.id,
          author:
            thread.participant.role === 'instructor'
              ? { role: 'instructor', name: thread.participant.name }
              : { role: 'support', name: 'BRIDGIO Academy Support' },
          fromMe: false,
          body:
            thread.participant.role === 'instructor'
              ? 'شكرًا، سأراجع الرسالة قبل الجلسة القادمة.'
              : 'Thanks — this is a mock reply. The real academy support channel is not connected yet.',
          sentAt,
          lang: thread.participant.role === 'instructor' ? 'ar' : 'en',
          dir: thread.participant.role === 'instructor' ? 'rtl' : 'ltr',
        }
        state.messages.push(sent, reply)
        thread.lastMessageAt = sentAt
        return { messages: [sent, reply], repliedBy: reply.author }
      },
    },

    system: {
      getInfo: async () => {
        await pause()
        return {
          contractVersion: CONTRACT_VERSION,
          mode: 'mock',
          mockScenario: scenario,
          endpointStatus: 'PROPOSED',
        }
      },
    },
  }
}

export { seedIds }
