import { describe, expect, it } from 'vitest'
import type { BridgioApi } from '../contract'
import { ApiError } from '../errors'
import { createMockApi } from './mock-adapter'
import { seedIds } from './seed'

const created = () =>
  createMockApi({ scenario: 'seeded', session: 'academy', latencyMs: 0 })

function methodPaths(api: BridgioApi): string[] {
  const paths: string[] = []
  for (const [namespace, value] of Object.entries(api)) {
    if (typeof value !== 'object' || value === null) continue
    for (const [name, member] of Object.entries(value)) {
      if (typeof member === 'function') paths.push(`${namespace}.${name}`)
    }
  }
  return paths.sort()
}

const EXPECTED_METHODS = [
  'auth.getSession',
  'auth.signIn',
  'auth.signOut',
  'languages.list',
  'languages.listLevels',
  'academies.get',
  'academies.getOnboarding',
  'academies.getDashboard',
  'academies.updateProfile',
  'academies.completeOnboardingStep',
  'cohorts.list',
  'cohorts.get',
  'cohorts.create',
  'cohorts.publish',
  'cohorts.getRoster',
  'cohorts.getAttendanceSheet',
  'cohorts.markAttendance',
  'curricula.list',
  'curricula.get',
  'curricula.create',
  'curricula.addUnit',
  'curricula.addLesson',
  'curricula.publish',
  'curricula.draftOutline',
  'rubrics.list',
  'rubrics.get',
  'rubrics.updateDimension',
  'rubrics.publish',
  'earnings.getLedger',
  'messages.listThreads',
  'messages.listMessages',
  'messages.sendMessage',
  'system.getInfo',
].sort()

describe('mock adapter — contract surface', () => {
  it('implements every method of the BridgioApi contract', () => {
    const api = created()
    expect(api.mode).toBe('mock')
    expect(methodPaths(api)).toEqual(EXPECTED_METHODS)
  })

  it('reports its adapter status as PROPOSED', async () => {
    const info = await created().system.getInfo()
    expect(info.endpointStatus).toBe('PROPOSED')
    expect(info.mode).toBe('mock')
    expect(info.mockScenario).toBe('seeded')
    expect(info.contractVersion).toBe(created().contractVersion)
  })
})

describe('mock adapter — preview roles and auth shape', () => {
  it('starts with the academy owner session by default', async () => {
    const session = await created().auth.getSession()
    expect(session?.user.id).toBe(seedIds.owner)
    expect(session?.user.role).toBe('academy_owner')
    expect(session?.expiresAt).toBeNull()
  })

  it('previews the instructor role when the session option says so', async () => {
    const api = createMockApi({ session: 'instructor', latencyMs: 0 })
    const session = await api.auth.getSession()
    expect(session?.user.role).toBe('instructor')
    expect(session?.user.id).toBe(seedIds.instructorKarim)
  })

  it('starts signed out when the session option is none', async () => {
    const api = createMockApi({ session: 'none', latencyMs: 0 })
    await expect(api.auth.getSession()).resolves.toBeNull()
  })

  it('signs in by demo email and can sign out again', async () => {
    const api = created()
    const session = await api.auth.signIn({
      email: 'new.instructor@example.test',
      password: 'demo',
    })
    expect(session.user.role).toBe('instructor')

    const owner = await api.auth.signIn({
      email: 'owner@example.test',
      password: 'demo',
    })
    expect(owner.user.role).toBe('academy_owner')

    await api.auth.signOut()
    expect(await api.auth.getSession()).toBeNull()
  })

  it('rejects empty credentials instead of inventing a session', async () => {
    await expect(
      created().auth.signIn({ email: ' ', password: 'demo' }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })
})

describe('mock adapter — languages are data', () => {
  it('returns language records with their own direction and numeral system', async () => {
    const languages = await created().languages.list()
    expect(languages.map((language) => language.code)).toEqual([
      'de',
      'nl',
      'it',
      'ar',
    ])
    const arabic = languages.find((language) => language.code === 'ar')
    expect(arabic?.direction).toBe('rtl')
    expect(arabic?.numeralSystem).toBe('arabic-indic')
    expect(languages.every((language) => language.nativeLabel.length > 0)).toBe(
      true,
    )
  })

  it('lists levels only for a known language', async () => {
    const levels = await created().languages.listLevels({
      languageId: 'lang_de',
    })
    expect(levels.map((level) => level.id)).toContain('lvl_a2')
    await expect(
      created().languages.listLevels({ languageId: 'lang_missing' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})

describe('mock adapter — academy dashboard and onboarding', () => {
  it('returns the academy profile', async () => {
    const academy = await created().academies.get()
    expect(academy.id).toBe(seedIds.academy)
    expect(academy.status).toBe('active')
    expect(academy.languageIds.length).toBeGreaterThan(0)
  })

  it('aggregates active cohorts, upcoming sessions, alerts and a provisional figure', async () => {
    const dashboard = await created().academies.getDashboard()
    expect(dashboard.totals.activeCohorts).toBe(2)
    expect(dashboard.totals.activeLearners).toBe(30)
    expect(dashboard.cohorts.length).toBe(2)
    expect(dashboard.upcomingSessions.length).toBeGreaterThan(0)
    expect(dashboard.alerts.map((alert) => alert.kind)).toEqual(
      expect.arrayContaining(['roster_incomplete', 'curriculum_draft', 'rubric_draft', 'payout_profile']),
    )
    expect(dashboard.earnings.isPlaceholder).toBe(true)
    expect(dashboard.earnings.amount).toBeNull()
  })

  it('sorts the upcoming sessions by start time', async () => {
    const dashboard = await created().academies.getDashboard()
    const starts = dashboard.upcomingSessions.map((session) => session.startsAt)
    expect(starts).toEqual([...starts].sort())
    expect(
      dashboard.upcomingSessions.every(
        (session) => session.cohortLabel.length > 0 && session.languageLabel.length > 0,
      ),
    ).toBe(true)
  })

  it('keeps every aggregate list empty in the empty scenario', async () => {
    const api = createMockApi({ scenario: 'empty', latencyMs: 0 })
    const dashboard = await api.academies.getDashboard()
    expect(dashboard.cohorts).toEqual([])
    expect(dashboard.upcomingSessions).toEqual([])
    expect(dashboard.totals.activeCohorts).toBe(0)
    expect(dashboard.totals.activeLearners).toBe(0)
    expect((await api.cohorts.list()).cohorts).toEqual([])
    expect((await api.curricula.list()).curricula).toEqual([])
    expect((await api.rubrics.list()).rubrics).toEqual([])
  })

  it('updates the demo partner profile and validates its fields', async () => {
    const api = created()
    const updated = await api.academies.updateProfile({
      academyId: seedIds.academy,
      name: 'Demo Academy — renamed',
      contactEmail: 'hello@example.test',
    })
    expect(updated.name).toBe('Demo Academy — renamed')
    expect(updated.contactEmail).toBe('hello@example.test')

    await expect(
      api.academies.updateProfile({
        academyId: seedIds.academy,
        name: ' ',
        contactEmail: 'hello@example.test',
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('moves an onboarding step to complete and raises completion', async () => {
    const api = created()
    const before = await api.academies.getOnboarding()
    const sample = before.steps.find((step) => step.id === 'sample_lesson')
    expect(sample?.status).toBe('in_progress')

    const after = await api.academies.completeOnboardingStep({
      academyId: seedIds.academy,
      stepId: 'sample_lesson',
    })
    const completed = after.steps.find((step) => step.id === 'sample_lesson')
    expect(completed?.status).toBe('complete')
    expect(completed?.completedAt).not.toBeNull()
    expect(after.completionPercent).toBeGreaterThan(before.completionPercent)
  })

  it('returns a blocked payout step for the seeded demo, never a fake success', async () => {
    const onboarding = await created().academies.getOnboarding()
    const payout = onboarding.steps.find(
      (step) => step.id === 'payout_profile',
    )
    expect(payout?.status).toBe('blocked')
    expect(onboarding.calibration.status).toBe('in_review')
  })

  it('starts onboarding from zero in the empty scenario', async () => {
    const api = createMockApi({ scenario: 'empty', latencyMs: 0 })
    const onboarding = await api.academies.getOnboarding()
    expect(onboarding.steps.every((step) => step.status === 'pending')).toBe(
      true,
    )
    expect(onboarding.completionPercent).toBe(0)
    expect(onboarding.calibration.status).toBe('not_started')
  })
})

describe('mock adapter — cohorts', () => {
  it('lists cohorts with language, level and instructor reference data', async () => {
    const list = await created().cohorts.list()
    expect(list.cohorts).toHaveLength(4)
    expect(list.languages.length).toBe(4)
    expect(list.levels.length).toBeGreaterThanOrEqual(4)
    expect(list.instructors).toHaveLength(3)

    const german = list.cohorts.find(
      (cohort) => cohort.id === seedIds.cohortGermanA2,
    )
    expect(german).toMatchObject({
      language: { code: 'de' },
      level: { label: 'A2' },
      status: 'active',
      seatsFilled: 14,
      seatsAvailable: 4,
    })
  })

  it('returns one cohort and rejects an unknown id', async () => {
    const cohort = await created().cohorts.get({
      cohortId: seedIds.cohortGermanA2,
    })
    expect(cohort.label).toBe('German A2 — Evening')
    expect(cohort.price.isPlaceholder).toBe(true)
    expect(cohort.attendanceModel).toBe('proposed')

    await expect(
      created().cohorts.get({ cohortId: 'missing' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('creates a draft cohort with an unpublished placeholder price', async () => {
    const api = created()
    const cohort = await api.cohorts.create({
      languageId: 'lang_de',
      levelId: 'lvl_b1',
      label: 'German B1 — Weekend',
      schedule: 'Sat · 10:00–12:00',
      capacity: 16,
      instructorId: seedIds.instructorLina,
      startDate: '2027-01-09',
      endDate: '2027-04-03',
    })
    expect(cohort.status).toBe('draft')
    expect(cohort.seatsAvailable).toBe(16)
    expect(cohort.price.isPlaceholder).toBe(true)

    const list = await api.cohorts.list()
    expect(list.cohorts.some((item) => item.id === cohort.id)).toBe(true)
  })

  it('adds a published cohort to the dashboard aggregate', async () => {
    const api = created()
    const before = await api.academies.getDashboard()
    const cohort = await api.cohorts.create({
      languageId: 'lang_it',
      levelId: 'lvl_a2',
      label: 'Italian A2 — New',
      schedule: 'Mon · 10:00–12:00',
      capacity: 12,
      instructorId: seedIds.instructorJonas,
      startDate: '2027-02-01',
      endDate: '2027-05-01',
    })
    await api.cohorts.publish({ cohortId: cohort.id })

    const after = await api.academies.getDashboard()
    expect(after.totals.activeCohorts).toBe(before.totals.activeCohorts + 1)
    expect(after.cohorts.map((item) => item.id)).toContain(cohort.id)
  })

  it('validates label, capacity and instructor when creating a cohort', async () => {
    const api = created()
    const base = {
      languageId: 'lang_de',
      levelId: 'lvl_b1',
      label: 'Draft',
      schedule: 'Sun · 10:00–12:00',
      capacity: 10,
      instructorId: seedIds.instructorLina,
      startDate: '2027-01-09',
      endDate: '2027-04-03',
    }

    await expect(
      api.cohorts.create({ ...base, label: ' ' }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
    await expect(
      api.cohorts.create({ ...base, capacity: 0 }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
    await expect(
      api.cohorts.create({ ...base, capacity: 201 }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
    await expect(
      api.cohorts.create({ ...base, instructorId: 'usr_missing' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('publishes a draft with available seats', async () => {
    const api = created()
    const published = await api.cohorts.publish({
      cohortId: seedIds.cohortItalianA1,
    })
    expect(published.status).toBe('published')
  })

  it('refuses to publish a cohort with no available seat', async () => {
    await expect(
      created().cohorts.publish({ cohortId: seedIds.cohortDutchB1 }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('refuses to publish a cohort with no schedule', async () => {
    const api = created()
    const cohort = await api.cohorts.create({
      languageId: 'lang_de',
      levelId: 'lvl_a1',
      label: 'No schedule yet',
      schedule: ' ',
      capacity: 8,
      instructorId: seedIds.instructorJonas,
      startDate: '2027-02-01',
      endDate: '2027-05-01',
    })
    await expect(
      api.cohorts.publish({ cohortId: cohort.id }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })
})

describe('mock adapter — roster and attendance (PROPOSED model)', () => {
  it('returns the roster, sessions and a rate computed from recorded sessions only', async () => {
    const roster = await created().cohorts.getRoster({
      cohortId: seedIds.cohortGermanA2,
    })
    expect(roster.members).toHaveLength(14)
    expect(roster.sessions).toHaveLength(5)
    expect(roster.attendanceRate).toBeGreaterThanOrEqual(0)
    expect(roster.attendanceRate).toBeLessThanOrEqual(100)
    expect(
      roster.members.every((member) => member.attendance.recordedSessions === 3),
    ).toBe(true)
  })

  it('shows an unrecorded session as not_recorded with no recordedAt', async () => {
    const sheet = await created().cohorts.getAttendanceSheet({
      cohortId: seedIds.cohortGermanA2,
      sessionId: `${seedIds.cohortGermanA2}_sess_next_1`,
    })
    expect(sheet.records).toHaveLength(14)
    expect(sheet.records.every((record) => record.status === 'not_recorded')).toBe(
      true,
    )
    expect(sheet.recordedAt).toBeNull()
  })

  it('rejects a session that is not on the cohort', async () => {
    await expect(
      created().cohorts.getAttendanceSheet({
        cohortId: seedIds.cohortGermanA2,
        sessionId: 'sess_missing',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('returns the recorded marks and timestamp for a completed session', async () => {
    const sheet = await created().cohorts.getAttendanceSheet({
      cohortId: seedIds.cohortGermanA2,
      sessionId: `${seedIds.cohortGermanA2}_sess_past_1`,
    })
    expect(sheet.recordedAt).not.toBeNull()
    expect(sheet.records.every((record) => record.status !== 'not_recorded')).toBe(
      true,
    )
  })

  it('rejects a roster for an unknown cohort', async () => {
    await expect(
      created().cohorts.getRoster({ cohortId: 'missing' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('requires a mark for every roster member and rejects duplicates or outsiders', async () => {
    const api = created()
    const roster = await api.cohorts.getRoster({
      cohortId: seedIds.cohortGermanA2,
    })
    const sessionId = `${seedIds.cohortGermanA2}_sess_next_1`
    const records = roster.members.map((member) => ({
      learnerId: member.learnerId,
      status: 'present' as const,
    }))

    await expect(
      api.cohorts.markAttendance({
        cohortId: seedIds.cohortGermanA2,
        sessionId,
        records: records.slice(0, 3),
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })

    await expect(
      api.cohorts.markAttendance({
        cohortId: seedIds.cohortGermanA2,
        sessionId,
        records: [records[0]!, records[0]!],
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })

    await expect(
      api.cohorts.markAttendance({
        cohortId: seedIds.cohortGermanA2,
        sessionId,
        records: [
          ...records.slice(0, 13),
          { learnerId: 'usr_missing', status: 'present' },
        ],
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('saves a full sheet and recomputes each member rate from the records', async () => {
    const api = created()
    const cohortId = seedIds.cohortGermanA2
    const sessionId = `${cohortId}_sess_next_1`
    const roster = await api.cohorts.getRoster({ cohortId })

    const saved = await api.cohorts.markAttendance({
      cohortId,
      sessionId,
      records: roster.members.map((member) => ({
        learnerId: member.learnerId,
        status: 'present' as const,
      })),
    })
    expect(saved.recordedAt).not.toBeNull()
    expect(saved.records.every((record) => record.status === 'present')).toBe(
      true,
    )

    const after = await api.cohorts.getRoster({ cohortId })
    const first = after.members[0]
    expect(first?.attendance.recordedSessions).toBe(4)
    expect(first?.attendance.attendanceRate).toBe(100)
    expect(after.attendanceRate).toBeGreaterThan(0)
  })
})

describe('mock adapter — curriculum and lesson builder', () => {
  it('lists curricula with unit and lesson counts', async () => {
    const list = await created().curricula.list()
    expect(list.curricula).toHaveLength(3)
    const german = list.curricula.find(
      (curriculum) => curriculum.id === seedIds.curriculumGermanA2,
    )
    expect(german).toMatchObject({ status: 'published', unitCount: 3, lessonCount: 6 })
  })

  it('rejects an unknown curriculum', async () => {
    await expect(
      created().curricula.get({ curriculumId: 'missing' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('creates a draft curriculum and validates its fields', async () => {
    const api = created()
    const curriculum = await api.curricula.create({
      languageId: 'lang_de',
      levelId: 'lvl_b1',
      title: 'German B1 — Escalations',
      description: 'Handling a difficult case.',
    })
    expect(curriculum.status).toBe('draft')
    expect(curriculum.units).toEqual([])

    await expect(
      api.curricula.create({
        languageId: 'lang_de',
        levelId: 'lvl_b1',
        title: ' ',
        description: 'Handling a difficult case.',
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
    await expect(
      api.curricula.create({
        languageId: 'lang_de',
        levelId: 'lvl_b1',
        title: 'Title',
        description: ' ',
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('adds a unit and lessons, then publishes the curriculum', async () => {
    const api = created()
    const createdCurriculum = await api.curricula.create({
      languageId: 'lang_nl',
      levelId: 'lvl_a2',
      title: 'Dutch A2 — Intake',
      description: 'Front-desk intake language.',
    })

    const withUnit = await api.curricula.addUnit({
      curriculumId: createdCurriculum.id,
      title: 'First contact',
      objective: 'Greet a visitor and confirm the reason for the visit.',
    })
    expect(withUnit.units).toHaveLength(1)
    const unitId = withUnit.units[0]?.id
    if (!unitId) throw new Error('expected a unit')

    await expect(
      api.curricula.publish({ curriculumId: createdCurriculum.id }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })

    const withLesson = await api.curricula.addLesson({
      curriculumId: createdCurriculum.id,
      unitId,
      title: 'Aan de balie',
      objective: 'Ask for the appointment details.',
      durationMinutes: 45,
      contentLanguageId: 'lang_nl',
      kind: 'lesson',
    })
    expect(withLesson.units[0]?.lessons).toHaveLength(1)
    expect(withLesson.units[0]?.lessons[0]?.contentLanguage.code).toBe('nl')

    const published = await api.curricula.publish({
      curriculumId: createdCurriculum.id,
    })
    expect(published.status).toBe('published')
  })

  it('validates lesson duration and unit ownership', async () => {
    const api = created()
    const base = {
      curriculumId: seedIds.curriculumGermanA2,
      unitId: 'unit_de_a2_shift',
      title: 'Lesson',
      objective: 'Objective',
      contentLanguageId: 'lang_de',
      kind: 'lesson' as const,
    }
    await expect(
      api.curricula.addLesson({ ...base, durationMinutes: 2 }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
    await expect(
      api.curricula.addLesson({
        ...base,
        unitId: 'unit_missing',
        durationMinutes: 45,
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('drafts a Mohsen outline with grounding and does not save it', async () => {
    const api = created()
    const before = await api.curricula.get({
      curriculumId: seedIds.curriculumGermanA2,
    })
    const draft = await api.curricula.draftOutline({
      curriculumId: seedIds.curriculumGermanA2,
      unitTitle: 'Handling a complaint',
      lessonCount: 4,
    })

    expect(draft.units).toHaveLength(1)
    expect(draft.units[0]?.lessons).toHaveLength(4)
    expect(draft.units[0]?.lessons[3]?.kind).toBe('assessment')
    expect(draft.grounding.length).toBeGreaterThan(0)
    expect(draft.disclaimer.length).toBeGreaterThan(0)

    const after = await api.curricula.get({
      curriculumId: seedIds.curriculumGermanA2,
    })
    expect(after.units).toHaveLength(before.units.length)
  })

  it('stores the lesson content language and direction as data', async () => {
    const api = created()
    const curriculum = await api.curricula.get({
      curriculumId: seedIds.curriculumGermanA2,
    })
    const unit = curriculum.units[0]
    if (!unit) throw new Error('expected a unit')

    const updated = await api.curricula.addLesson({
      curriculumId: curriculum.id,
      unitId: unit.id,
      title: 'مراجعة سريعة',
      objective: 'Review the shift handover in Arabic.',
      durationMinutes: 30,
      contentLanguageId: 'lang_ar',
      kind: 'practice',
    })
    const lesson = updated.units[0]?.lessons.at(-1)
    expect(lesson?.contentLanguage.code).toBe('ar')
    expect(lesson?.contentLanguage.direction).toBe('rtl')
  })
})

describe('mock adapter — grading rubric', () => {
  it('lists rubric summaries and one rubric with five dimensions', async () => {
    const list = await created().rubrics.list()
    expect(list.rubrics).toHaveLength(3)

    const rubric = await created().rubrics.get({
      rubricId: seedIds.rubricGermanA2,
    })
    expect(rubric.dimensions).toHaveLength(5)
    expect(rubric.dimensions.map((dimension) => dimension.key)).toEqual([
      'pronunciation',
      'fluency',
      'empathy',
      'vocabulary',
      'listening',
    ])
    expect(
      rubric.dimensions.reduce(
        (total, dimension) => total + dimension.weightPercent,
        0,
      ),
    ).toBe(100)
  })

  it('marks an unassessed dimension instead of inventing a weight', async () => {
    const rubric = await created().rubrics.get({
      rubricId: seedIds.rubricDutchB1,
    })
    const listening = rubric.dimensions.find(
      (dimension) => dimension.key === 'listening',
    )
    expect(listening?.assessed).toBe(false)
    expect(listening?.weightPercent).toBe(0)
    expect(rubric.coverageNote).toContain('not assessed')
  })

  it('validates a weight and its descriptors', async () => {
    const api = created()
    const rubric = await api.rubrics.get({
      rubricId: seedIds.rubricGermanA2,
    })
    const dimension = rubric.dimensions[0]
    if (!dimension) throw new Error('expected a dimension')

    await expect(
      api.rubrics.updateDimension({
        rubricId: rubric.id,
        dimensionId: dimension.id,
        weightPercent: 101,
        descriptors: dimension.descriptors,
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })

    await expect(
      api.rubrics.updateDimension({
        rubricId: rubric.id,
        dimensionId: dimension.id,
        weightPercent: 20,
        descriptors: [],
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })

    await expect(
      api.rubrics.updateDimension({
        rubricId: rubric.id,
        dimensionId: dimension.id,
        weightPercent: 20,
        descriptors: [
          { band: 1, label: 'A', descriptor: 'First.' },
          { band: 1, label: 'B', descriptor: 'Second.' },
        ],
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('saves a dimension weight and then publishes a 100% rubric', async () => {
    const api = created()
    const rubric = await api.rubrics.get({ rubricId: seedIds.rubricDutchB1 })
    const pronunciation = rubric.dimensions.find(
      (dimension) => dimension.id === 'rub_nl_pron',
    )
    if (!pronunciation) throw new Error('expected the pronunciation dimension')

    const updated = await api.rubrics.updateDimension({
      rubricId: rubric.id,
      dimensionId: pronunciation.id,
      weightPercent: 40,
      descriptors: pronunciation.descriptors,
    })
    expect(
      updated.dimensions.find((dimension) => dimension.id === pronunciation.id)
        ?.weightPercent,
    ).toBe(40)

    const published = await api.rubrics.publish({ rubricId: rubric.id })
    expect(published.status).toBe('published')
    expect(published.version).toBeGreaterThan(rubric.version)
  })

  it('refuses to publish a rubric whose assessed weights do not total 100', async () => {
    await expect(
      created().rubrics.publish({ rubricId: seedIds.rubricDutchB1 }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('publishes a draft whose assessed dimensions already total 100', async () => {
    const api = created()
    const published = await api.rubrics.publish({
      rubricId: seedIds.rubricItalianA1,
    })
    expect(published.status).toBe('published')
  })

  it('rejects publishing a rubric that does not exist', async () => {
    await expect(
      created().rubrics.publish({ rubricId: 'missing' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})

describe('mock adapter — earnings and escrow ledger', () => {
  it('returns provisional placeholder figures, never an invented amount', async () => {
    const ledger = await created().earnings.getLedger()
    expect(ledger.summary.provisional).toBe(true)
    expect(ledger.summary.available).toMatchObject({
      amount: null,
      currency: 'XXX',
      isPlaceholder: true,
    })
    expect(ledger.entries.length).toBeGreaterThan(0)
    expect(
      ledger.entries.every(
        (entry) => entry.amount.amount === null && entry.amount.isPlaceholder,
      ),
    ).toBe(true)
    expect(ledger.summary.payoutAccountStatus).toBe('pending')
    expect(ledger.payoutSchedule.length).toBeGreaterThan(0)
  })

  it('returns an empty ledger in the empty scenario', async () => {
    const api = createMockApi({ scenario: 'empty', latencyMs: 0 })
    const ledger = await api.earnings.getLedger()
    expect(ledger.entries).toEqual([])
    expect(ledger.payoutSchedule).toEqual([])
    expect(ledger.summary.provisional).toBe(true)
  })
})

describe('mock adapter — academy messages', () => {
  it('lists threads and their messages in order', async () => {
    const api = created()
    const threads = await api.messages.listThreads()
    expect(threads.map((thread) => thread.id)).toEqual([
      seedIds.threadSupport,
      seedIds.threadInstructor,
    ])

    const messages = await api.messages.listMessages({
      threadId: seedIds.threadSupport,
    })
    expect(messages.length).toBeGreaterThan(0)
    expect(messages[0]?.fromMe).toBe(false)
    expect(messages.some((message) => message.fromMe)).toBe(true)
  })

  it('rejects an unknown thread and an empty message', async () => {
    const api = created()
    await expect(
      api.messages.listMessages({ threadId: 'thr_missing' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
    await expect(
      api.messages.sendMessage({ threadId: seedIds.threadSupport, body: ' ' }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('appends the sent message and a deterministic mock reply', async () => {
    const api = created()
    const before = await api.messages.listMessages({
      threadId: seedIds.threadSupport,
    })
    const result = await api.messages.sendMessage({
      threadId: seedIds.threadSupport,
      body: 'Please confirm the roster.',
    })

    expect(result.messages).toHaveLength(2)
    expect(result.messages[0]).toMatchObject({
      fromMe: true,
      body: 'Please confirm the roster.',
    })
    expect(result.messages[1]?.fromMe).toBe(false)
    expect(result.repliedBy?.role).toBe('support')

    const after = await api.messages.listMessages({
      threadId: seedIds.threadSupport,
    })
    expect(after).toHaveLength(before.length + 2)
  })

  it('answers an instructor thread with an Arabic, right-to-left block', async () => {
    const api = created()
    const result = await api.messages.sendMessage({
      threadId: seedIds.threadInstructor,
      body: 'See you on Sunday.',
    })
    const reply = result.messages[1]
    expect(reply?.lang).toBe('ar')
    expect(reply?.dir).toBe('rtl')
    expect(reply?.author.role).toBe('instructor')
  })

  it('has no threads in the empty scenario', async () => {
    const api = createMockApi({ scenario: 'empty', latencyMs: 0 })
    await expect(api.messages.listThreads()).resolves.toEqual([])
  })

  it('authors a sent message as the instructor when previewing that role', async () => {
    const api = createMockApi({ session: 'instructor', latencyMs: 0 })
    const result = await api.messages.sendMessage({
      threadId: seedIds.threadSupport,
      body: 'Checking in.',
    })
    expect(result.messages[0]?.author.role).toBe('instructor')
    expect(result.messages[0]?.author.name).toBe('Karim Adel')
  })
})

describe('mock adapter — errors', () => {
  it('throws ApiError for missing records', async () => {
    const api = created()
    const error = await api.cohorts
      .get({ cohortId: 'missing' })
      .catch((value) => value)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'NOT_FOUND', status: null })
  })
})
