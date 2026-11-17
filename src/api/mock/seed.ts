import type {
  Academy,
  AttendanceMark,
  AttendanceRecord,
  AttendanceSummary,
  Cohort,
  CohortId,
  CohortSession,
  Curriculum,
  EarningsLedger,
  InstructorSummary,
  Language,
  LearnerId,
  Lesson,
  Level,
  Message,
  MessageThread,
  Money,
  Rubric,
  RubricDescriptor,
  RubricDimension,
  RosterMember,
  SessionId,
  User,
} from '../types'

/**
 * Mock seed data for the BRIDGIO Learn-to-Hire academy surface.
 *
 * This is DEMO DATA, not product copy and not real academy, learner or payment
 * data. No academy brand, BPO name, salary or counter here is a claim. Every
 * money value is a placeholder; dates are generated relative to now so the demo
 * never hard-codes a date. All Arabic wording is DRAFT and centralised for later
 * replacement.
 */

const DAY = 24 * 60 * 60 * 1000
const now = new Date()

function isoDate(offsetDays: number): string {
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offsetDays),
  )
  return date.toISOString().slice(0, 10)
}

function isoAt(offsetDays: number, hour = 9): string {
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offsetDays),
  )
  date.setUTCHours(hour, 0, 0, 0)
  return date.toISOString()
}

function placeholderMoney(): Money {
  return { amount: null, currency: 'XXX', isPlaceholder: true }
}

export const seedIds = {
  owner: 'usr_demo_owner',
  instructorKarim: 'usr_demo_instructor_karim',
  instructorLina: 'usr_demo_instructor_lina',
  instructorJonas: 'usr_demo_instructor_jonas',
  academy: 'acad_demo',
  cohortGermanA2: 'coh_de_a2_evening',
  cohortDutchB1: 'coh_nl_b1_morning',
  cohortItalianA1: 'coh_it_a1_evening',
  cohortGermanB2: 'coh_de_b2_intensive',
  curriculumGermanA2: 'cur_de_a2_workplace',
  curriculumDutchB1: 'cur_nl_b1_support',
  curriculumItalianA1: 'cur_it_a1_arrival',
  rubricGermanA2: 'rub_de_a2_workplace',
  rubricDutchB1: 'rub_nl_b1_support',
  rubricItalianA1: 'rub_it_a1_arrival',
  threadSupport: 'thr_support',
  threadInstructor: 'thr_instructor',
} as const

export const seedLanguages: Language[] = [
  {
    id: 'lang_de',
    code: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    direction: 'ltr',
    script: 'Latin',
    numeralSystem: 'western',
    appealOwnerReady: true,
  },
  {
    id: 'lang_nl',
    code: 'nl',
    label: 'Dutch',
    nativeLabel: 'Nederlands',
    direction: 'ltr',
    script: 'Latin',
    numeralSystem: 'western',
    appealOwnerReady: false,
  },
  {
    id: 'lang_it',
    code: 'it',
    label: 'Italian',
    nativeLabel: 'Italiano',
    direction: 'ltr',
    script: 'Latin',
    numeralSystem: 'western',
    appealOwnerReady: false,
  },
  {
    id: 'lang_ar',
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    direction: 'rtl',
    script: 'Arabic',
    numeralSystem: 'arabic-indic',
    appealOwnerReady: true,
  },
]

export const seedLevels: Level[] = [
  { id: 'lvl_a1', label: 'A1', order: 1, framework: 'CEFR' },
  { id: 'lvl_a2', label: 'A2', order: 2, framework: 'CEFR' },
  { id: 'lvl_b1', label: 'B1', order: 3, framework: 'CEFR' },
  { id: 'lvl_b2', label: 'B2', order: 4, framework: 'CEFR' },
]

export const seedOwner: User = {
  id: seedIds.owner,
  role: 'academy_owner',
  displayName: 'Yara Mansour',
  email: 'owner@example.test',
  avatarUrl: null,
}

export const seedInstructorUser: User = {
  id: seedIds.instructorKarim,
  role: 'instructor',
  displayName: 'Karim Adel',
  email: 'instructor@example.test',
  avatarUrl: null,
}

export const seedInstructors: InstructorSummary[] = [
  { id: seedIds.instructorKarim, displayName: 'Karim Adel', email: 'karim@example.test' },
  { id: seedIds.instructorLina, displayName: 'Lina Haddad', email: 'lina@example.test' },
  { id: seedIds.instructorJonas, displayName: 'Jonas Weber', email: 'jonas@example.test' },
]

const learnerNames = [
  'Layla Hassan',
  'Omar Khaled',
  'Nour El-Sayed',
  'Youssef Ibrahim',
  'Salma Adel',
  'Ahmed Samir',
  'Farida Mostafa',
  'Hassan Ali',
  'Mariam Tarek',
  'Ziad Nabil',
  'Rana Hany',
  'Khaled Magdy',
  'Aya Fathy',
  'Tamer Sherif',
  'Dina Sameh',
  'Mahmoud Ezz',
  'Sara Gamal',
  'Ali Refaat',
  'Hana Fawzy',
  'Mohamed Ashraf',
  'Yasmin Nader',
  'Adham Salah',
  'Nada Hosny',
  'Bassem Rami',
] as const

interface LearnerRecord {
  id: LearnerId
  displayName: string
  email: string
}

const learners: LearnerRecord[] = learnerNames.map((displayName, index) => ({
  id: `usr_learner_${String(index + 1).padStart(2, '0')}`,
  displayName,
  email: `learner${String(index + 1).padStart(2, '0')}@example.test`,
}))

function languageById(id: string): Language {
  const language = seedLanguages.find((item) => item.id === id)
  if (!language) throw new Error(`Seed language missing: ${id}`)
  return language
}

function levelById(id: string): Level {
  const level = seedLevels.find((item) => item.id === id)
  if (!level) throw new Error(`Seed level missing: ${id}`)
  return level
}

export const seedAcademy: Academy = {
  id: seedIds.academy,
  name: 'Demo Academy',
  status: 'active',
  languageIds: seedLanguages.map((language) => language.id),
  contactEmail: 'academy@example.test',
  createdAt: isoAt(-180, 9),
}

function makeCohort(input: {
  id: string
  label: string
  languageId: string
  levelId: string
  schedule: string
  capacity: number
  seatsFilled: number
  status: Cohort['status']
  instructorId: string
  startOffset: number
  endOffset: number
}): Cohort {
  const instructor = seedInstructors.find((item) => item.id === input.instructorId) ?? null
  return {
    id: input.id,
    academyId: seedIds.academy,
    label: input.label,
    language: languageById(input.languageId),
    level: levelById(input.levelId),
    schedule: input.schedule,
    capacity: input.capacity,
    seatsFilled: input.seatsFilled,
    seatsAvailable: input.capacity - input.seatsFilled,
    status: input.status,
    instructor,
    startDate: isoDate(input.startOffset),
    endDate: isoDate(input.endOffset),
    price: placeholderMoney(),
    attendanceModel: 'proposed',
  }
}

export const seedCohorts: Cohort[] = [
  makeCohort({
    id: seedIds.cohortGermanA2,
    label: 'German A2 — Evening',
    languageId: 'lang_de',
    levelId: 'lvl_a2',
    schedule: 'Sun & Tue · 18:00–19:30',
    capacity: 18,
    seatsFilled: 14,
    status: 'active',
    instructorId: seedIds.instructorKarim,
    startOffset: -28,
    endOffset: 56,
  }),
  makeCohort({
    id: seedIds.cohortDutchB1,
    label: 'Dutch B1 — Morning',
    languageId: 'lang_nl',
    levelId: 'lvl_b1',
    schedule: 'Mon & Wed · 09:00–10:30',
    capacity: 16,
    seatsFilled: 16,
    status: 'published',
    instructorId: seedIds.instructorLina,
    startOffset: 14,
    endOffset: 112,
  }),
  makeCohort({
    id: seedIds.cohortItalianA1,
    label: 'Italian A1 — Evening',
    languageId: 'lang_it',
    levelId: 'lvl_a1',
    schedule: 'Tue & Thu · 19:00–20:30',
    capacity: 20,
    seatsFilled: 9,
    status: 'draft',
    instructorId: seedIds.instructorJonas,
    startOffset: 28,
    endOffset: 126,
  }),
  makeCohort({
    id: seedIds.cohortGermanB2,
    label: 'German B2 — Intensive',
    languageId: 'lang_de',
    levelId: 'lvl_b2',
    schedule: 'Daily · 10:00–12:00',
    capacity: 12,
    seatsFilled: 12,
    status: 'completed',
    instructorId: seedIds.instructorKarim,
    startOffset: -84,
    endOffset: -28,
  }),
]

const attendancePatterns: AttendanceMark[][] = [
  [
    'present',
    'present',
    'present',
    'present',
    'present',
    'present',
    'present',
    'present',
    'present',
    'present',
    'present',
    'present',
  ],
  [
    'present',
    'late',
    'present',
    'present',
    'absent',
    'present',
    'present',
    'excused',
    'present',
    'present',
    'present',
    'present',
  ],
  [
    'late',
    'present',
    'present',
    'excused',
    'present',
    'absent',
    'present',
    'present',
    'present',
    'late',
    'present',
    'present',
  ],
]

function statusFor(memberIndex: number, sessionIndex: number): AttendanceMark {
  const pattern = attendancePatterns[sessionIndex % attendancePatterns.length]
  if (!pattern) return 'present'
  return pattern[memberIndex % pattern.length] ?? 'present'
}

function emptySummary(): AttendanceSummary {
  return {
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    recordedSessions: 0,
    attendanceRate: null,
  }
}

function attendanceRate(summary: AttendanceSummary): number | null {
  const counted = summary.present + summary.late + summary.absent
  if (counted === 0) return null
  return Math.round(((summary.present + summary.late) / counted) * 100)
}

function rosterFor(cohort: Cohort, offset: number): RosterMember[] {
  return learners.slice(offset, offset + cohort.seatsFilled).map((learner) => ({
    learnerId: learner.id,
    displayName: learner.displayName,
    email: learner.email,
    status: cohort.status === 'draft' ? 'invited' : 'active',
    joinedAt: isoAt(-30 + offset, 9),
    attendance: emptySummary(),
  }))
}

function sessionsFor(cohort: Cohort, index: number): CohortSession[] {
  const pastCount = cohort.status === 'draft' ? 0 : cohort.status === 'completed' ? 5 : 3
  const upcomingCount = cohort.status === 'completed' ? 0 : 2
  const sessions: CohortSession[] = []
  for (let i = pastCount; i > 0; i -= 1) {
    sessions.push({
      id: `${cohort.id}_sess_past_${i}`,
      cohortId: cohort.id,
      topic: `Session ${pastCount - i + 1}: ${
        cohort.language.label
      } ${cohort.level.label} practice`,
      startsAt: isoAt(-7 * i, 18),
      durationMinutes: 90,
      status: 'completed',
      attendanceRecorded: true,
    })
  }
  for (let i = 1; i <= upcomingCount; i += 1) {
    sessions.push({
      id: `${cohort.id}_sess_next_${i}`,
      cohortId: cohort.id,
      topic: `Session ${pastCount + i}: ${cohort.language.label} ${
        cohort.level.label
      } practice`,
      startsAt: isoAt(i * 7 + index, 18),
      durationMinutes: 90,
      status: 'scheduled',
      attendanceRecorded: false,
    })
  }
  return sessions
}

function buildRostersAndAttendance(): {
  rosters: Record<CohortId, RosterMember[]>
  sessions: Record<CohortId, CohortSession[]>
  attendance: Record<SessionId, AttendanceRecord[]>
} {
  const rosters: Record<CohortId, RosterMember[]> = {}
  const sessions: Record<CohortId, CohortSession[]> = {}
  const attendance: Record<SessionId, AttendanceRecord[]> = {}

  seedCohorts.forEach((cohort, cohortIndex) => {
    const members = rosterFor(cohort, cohortIndex * 3)
    const cohortSessions = sessionsFor(cohort, cohortIndex)
    sessions[cohort.id] = cohortSessions

    for (const session of cohortSessions) {
      if (!session.attendanceRecorded) continue
      const records: AttendanceRecord[] = members.map((member, memberIndex) => ({
        learnerId: member.learnerId,
        status: statusFor(memberIndex + cohortIndex, cohortSessions.indexOf(session)),
        note: null,
      }))
      attendance[session.id] = records
      records.forEach((record, memberIndex) => {
        const summary = members[memberIndex]?.attendance
        if (!summary) return
        summary.recordedSessions += 1
        if (record.status === 'not_recorded') return
        summary[record.status] += 1
      })
    }

    members.forEach((member) => {
      member.attendance.attendanceRate = attendanceRate(member.attendance)
    })
    rosters[cohort.id] = members
  })

  return { rosters, sessions, attendance }
}

const rosterData = buildRostersAndAttendance()

export const seedRosters = rosterData.rosters
export const seedSessions = rosterData.sessions
export const seedAttendance = rosterData.attendance

function descriptorSet(
  emerging: string,
  developing: string,
  competent: string,
  strong: string,
): RubricDescriptor[] {
  return [
    { band: 1, label: 'Emerging', descriptor: emerging },
    { band: 2, label: 'Developing', descriptor: developing },
    { band: 3, label: 'Competent', descriptor: competent },
    { band: 4, label: 'Strong', descriptor: strong },
  ]
}

function dimension(
  id: string,
  key: RubricDimension['key'],
  weightPercent: number,
  descriptors: RubricDescriptor[],
  assessed = true,
): RubricDimension {
  return { id, key, assessed, weightPercent, descriptors }
}

const standardDimensions = (prefix: string): RubricDimension[] => [
  dimension(
    `${prefix}_pron`,
    'pronunciation',
    20,
    descriptorSet(
      'Frequent errors make the message hard to follow.',
      'Understandable with noticeable effort for the listener.',
      'Clear and understandable with minor errors.',
      'Clear, natural and easy to follow throughout.',
    ),
  ),
  dimension(
    `${prefix}_flu`,
    'fluency',
    20,
    descriptorSet(
      'Long pauses and fragmented answers.',
      'Steady with some hesitation and repair.',
      'Mostly steady with occasional hesitation.',
      'Steady, connected and confident delivery.',
    ),
  ),
  dimension(
    `${prefix}_emp`,
    'empathy',
    20,
    descriptorSet(
      'Does not recognise the customer concern.',
      'Acknowledges the concern briefly.',
      'Acknowledges the concern and responds appropriately.',
      'Acknowledges, reassures and adapts the response.',
    ),
  ),
  dimension(
    `${prefix}_vocab`,
    'vocabulary',
    20,
    descriptorSet(
      'Limited range for the task.',
      'Basic range with repetition.',
      'Sufficient range for the task.',
      'Flexible, precise range for the task.',
    ),
  ),
  dimension(
    `${prefix}_listen`,
    'listening',
    20,
    descriptorSet(
      'Needs repetition to understand the task.',
      'Understands simple questions with support.',
      'Understands the main points at natural speed.',
      'Understands detail and nuance at natural speed.',
    ),
  ),
]

function lesson(
  id: string,
  title: string,
  objective: string,
  order: number,
  durationMinutes: number,
  kind: Lesson['kind'],
  languageId: string,
): Lesson {
  return {
    id,
    title,
    objective,
    order,
    durationMinutes,
    kind,
    contentLanguage: languageById(languageId),
    materials: [
      {
        id: `${id}_mat_1`,
        title: 'Lesson notes',
        kind: 'text',
        url: null,
      },
      {
        id: `${id}_mat_2`,
        title: 'Audio practice',
        kind: 'audio',
        url: null,
      },
    ],
  }
}

export const seedCurricula: Curriculum[] = [
  {
    id: seedIds.curriculumGermanA2,
    academyId: seedIds.academy,
    title: 'Workplace German — A2',
    description:
      'A practical A2 course for shift handovers, customer calls and escalation language.',
    status: 'published',
    language: languageById('lang_de'),
    level: levelById('lvl_a2'),
    updatedAt: isoAt(-2, 11),
    units: [
      {
        id: 'unit_de_a2_shift',
        title: 'Starting a shift',
        objective: 'Hand over a shift clearly and confirm the next task.',
        order: 1,
        lessons: [
          lesson(
            'les_de_a2_shift_1',
            'Schichtübergabe',
            'Die wichtigsten Begriffe für die Schichtübergabe verstehen und anwenden.',
            1,
            45,
            'lesson',
            'lang_de',
          ),
          lesson(
            'les_de_a2_shift_2',
            'Dienstplan lesen',
            'Einen Dienstplan lesen und die eigene Schicht bestätigen.',
            2,
            45,
            'practice',
            'lang_de',
          ),
          lesson(
            'les_de_a2_shift_3',
            'Checkpoint: Schichtübergabe',
            'Eine kurze Übergabe verständlich zusammenfassen.',
            3,
            30,
            'assessment',
            'lang_de',
          ),
        ],
      },
      {
        id: 'unit_de_a2_calls',
        title: 'Customer calls',
        objective: 'Open a call, confirm the request and close politely.',
        order: 2,
        lessons: [
          lesson(
            'les_de_a2_calls_1',
            'Anruf eröffnen',
            'Ein Gespräch höflich eröffnen und den Anliegen bestätigen.',
            1,
            45,
            'lesson',
            'lang_de',
          ),
          lesson(
            'les_de_a2_calls_2',
            'Anliegen klären',
            'Rückfragen stellen und das Anliegen korrekt zusammenfassen.',
            2,
            45,
            'practice',
            'lang_de',
          ),
        ],
      },
      {
        id: 'unit_de_a2_escalate',
        title: 'Escalating an issue',
        objective: 'Escalate a case with the facts the next team needs.',
        order: 3,
        lessons: [
          lesson(
            'les_de_a2_escalate_1',
            'Fall weitergeben',
            'Einen Fall strukturiert und respektvoll weitergeben.',
            1,
            45,
            'lesson',
            'lang_de',
          ),
        ],
      },
    ],
  },
  {
    id: seedIds.curriculumDutchB1,
    academyId: seedIds.academy,
    title: 'Customer Support Dutch — B1',
    description: 'A B1 support course focused on written clarity and call control.',
    status: 'published',
    language: languageById('lang_nl'),
    level: levelById('lvl_b1'),
    updatedAt: isoAt(-9, 15),
    units: [
      {
        id: 'unit_nl_b1_written',
        title: 'Written support',
        objective: 'Write clear, polite replies within the support tone.',
        order: 1,
        lessons: [
          lesson(
            'les_nl_b1_written_1',
            'Een duidelijke reactie',
            'Een duidelijk en vriendelijk antwoord schrijven.',
            1,
            45,
            'lesson',
            'lang_nl',
          ),
          lesson(
            'les_nl_b1_written_2',
            'Samenvatten',
            'Een klantvraag correct samenvatten.',
            2,
            45,
            'practice',
            'lang_nl',
          ),
        ],
      },
      {
        id: 'unit_nl_b1_calls',
        title: 'Call control',
        objective: 'Keep a call on track and confirm the next step.',
        order: 2,
        lessons: [
          lesson(
            'les_nl_b1_calls_1',
            'Het gesprek sturen',
            'Een gesprek vriendelijk en doelgericht sturen.',
            1,
            45,
            'lesson',
            'lang_nl',
          ),
        ],
      },
    ],
  },
  {
    id: seedIds.curriculumItalianA1,
    academyId: seedIds.academy,
    title: 'Italian A1 — Arrival',
    description: 'Draft A1 course for first contact and everyday workplace phrases.',
    status: 'draft',
    language: languageById('lang_it'),
    level: levelById('lvl_a1'),
    updatedAt: isoAt(-1, 10),
    units: [
      {
        id: 'unit_it_a1_hello',
        title: 'First contact',
        objective: 'Greet a colleague and introduce yourself.',
        order: 1,
        lessons: [
          lesson(
            'les_it_a1_hello_1',
            'Ciao, mi presento',
            'Sich vorstellen und einfache Begrüßungen verwenden.',
            1,
            45,
            'lesson',
            'lang_it',
          ),
        ],
      },
    ],
  },
]

function rubric(
  id: string,
  title: string,
  languageId: string,
  levelId: string,
  version: number,
  status: Rubric['status'],
  dimensions: RubricDimension[],
  coverageNote: string | null,
): Rubric {
  return {
    id,
    academyId: seedIds.academy,
    title,
    version,
    status,
    language: languageById(languageId),
    level: levelById(levelId),
    dimensions,
    updatedAt: isoAt(-3, 16),
    coverageNote,
  }
}

const dutchDimensions = standardDimensions('rub_nl')
const dutchListening = dutchDimensions[4]
if (dutchListening) {
  dutchDimensions[4] = {
    ...dutchListening,
    assessed: false,
    weightPercent: 0,
  }
}

export const seedRubrics: Rubric[] = [
  rubric(
    seedIds.rubricGermanA2,
    'German A2 — Workplace speaking',
    'lang_de',
    'lvl_a2',
    3,
    'published',
    standardDimensions('rub_de'),
    'Speaking coverage only. Writing and listening coverage are not confirmed.',
  ),
  rubric(
    seedIds.rubricDutchB1,
    'Dutch B1 — Support calls',
    'lang_nl',
    'lvl_b1',
    1,
    'draft',
    dutchDimensions,
    'Listening is not assessed in this draft.',
  ),
  rubric(
    seedIds.rubricItalianA1,
    'Italian A1 — First contact',
    'lang_it',
    'lvl_a1',
    1,
    'draft',
    standardDimensions('rub_it'),
    null,
  ),
]

export const seedEarnings: EarningsLedger = {
  summary: {
    available: placeholderMoney(),
    pending: placeholderMoney(),
    held: placeholderMoney(),
    paidToDate: placeholderMoney(),
    nextPayoutDate: isoDate(14),
    payoutAccountStatus: 'pending',
    provisional: true,
    updatedAt: isoAt(0, 8),
  },
  entries: [
    {
      id: 'led_001',
      date: isoDate(-3),
      type: 'tuition',
      status: 'available',
      description: 'Cohort tuition — German A2 — Evening',
      amount: placeholderMoney(),
      cohortId: seedIds.cohortGermanA2,
      cohortLabel: 'German A2 — Evening',
      reference: 'INV-DEMO-001',
    },
    {
      id: 'led_002',
      date: isoDate(-3),
      type: 'platform_fee',
      status: 'available',
      description: 'Platform fee — German A2 — Evening',
      amount: placeholderMoney(),
      cohortId: seedIds.cohortGermanA2,
      cohortLabel: 'German A2 — Evening',
      reference: 'FEE-DEMO-001',
    },
    {
      id: 'led_003',
      date: isoDate(-7),
      type: 'instructor_share',
      status: 'held',
      description: 'Instructor share — German A2 — Evening',
      amount: placeholderMoney(),
      cohortId: seedIds.cohortGermanA2,
      cohortLabel: 'German A2 — Evening',
      reference: 'INS-DEMO-001',
    },
    {
      id: 'led_004',
      date: isoDate(-7),
      type: 'escrow_hold',
      status: 'held',
      description: 'Escrow hold until session verification',
      amount: placeholderMoney(),
      cohortId: seedIds.cohortGermanA2,
      cohortLabel: 'German A2 — Evening',
      reference: 'ESC-DEMO-001',
    },
    {
      id: 'led_005',
      date: isoDate(-14),
      type: 'tuition',
      status: 'pending',
      description: 'Cohort tuition — Dutch B1 — Morning',
      amount: placeholderMoney(),
      cohortId: seedIds.cohortDutchB1,
      cohortLabel: 'Dutch B1 — Morning',
      reference: 'INV-DEMO-002',
    },
    {
      id: 'led_006',
      date: isoDate(-28),
      type: 'payout',
      status: 'paid',
      description: 'Payout — previous cycle',
      amount: placeholderMoney(),
      cohortId: null,
      cohortLabel: null,
      reference: 'PAY-DEMO-001',
    },
    {
      id: 'led_007',
      date: isoDate(-35),
      type: 'adjustment',
      status: 'reversed',
      description: 'Adjustment — duplicate ledger line',
      amount: placeholderMoney(),
      cohortId: null,
      cohortLabel: null,
      reference: 'ADJ-DEMO-001',
    },
    {
      id: 'led_008',
      date: isoDate(-42),
      type: 'tuition',
      status: 'paid',
      description: 'Cohort tuition — German B2 — Intensive',
      amount: placeholderMoney(),
      cohortId: seedIds.cohortGermanB2,
      cohortLabel: 'German B2 — Intensive',
      reference: 'INV-DEMO-003',
    },
  ],
  payoutSchedule: [
    {
      id: 'pay_sched_1',
      label: 'Next scheduled payout',
      date: isoDate(14),
      amount: placeholderMoney(),
      status: 'scheduled',
    },
    {
      id: 'pay_sched_2',
      label: 'Following payout',
      date: isoDate(28),
      amount: placeholderMoney(),
      status: 'scheduled',
    },
    {
      id: 'pay_sched_3',
      label: 'Previous payout',
      date: isoDate(-28),
      amount: placeholderMoney(),
      status: 'paid',
    },
  ],
}

const supportParticipant = {
  role: 'support' as const,
  name: 'BRIDGIO Academy Support',
}

const instructorParticipant = {
  role: 'instructor' as const,
  name: 'Karim Adel',
}

export const seedThreads: MessageThread[] = [
  {
    id: seedIds.threadSupport,
    title: 'Academy support',
    participant: supportParticipant,
    lastMessageAt: isoAt(-1, 14),
  },
  {
    id: seedIds.threadInstructor,
    title: 'German A2 — check-in',
    participant: instructorParticipant,
    lastMessageAt: isoAt(0, 8),
  },
]

export const seedMessages: Message[] = [
  {
    id: 'msg_001',
    threadId: seedIds.threadSupport,
    author: supportParticipant,
    fromMe: false,
    body: 'Welcome to the academy preview. Calibration and payout steps are demo-only until the BFF is connected.',
    sentAt: isoAt(-2, 10),
    lang: 'en',
    dir: 'ltr',
  },
  {
    id: 'msg_002',
    threadId: seedIds.threadSupport,
    author: {
      role: 'academy_owner',
      name: seedOwner.displayName,
    },
    fromMe: true,
    body: 'Understood. I am reviewing the cohort roster and attendance sheet now.',
    sentAt: isoAt(-2, 11),
    lang: 'en',
    dir: 'ltr',
  },
  {
    id: 'msg_003',
    threadId: seedIds.threadSupport,
    author: supportParticipant,
    fromMe: false,
    body: 'The attendance model is marked proposed on the screen. No attendance figure is a claim.',
    sentAt: isoAt(-1, 14),
    lang: 'en',
    dir: 'ltr',
  },
  {
    id: 'msg_004',
    threadId: seedIds.threadInstructor,
    author: instructorParticipant,
    fromMe: false,
    body: 'أهلًا بك. سجل الحضور للجلسة الأخيرة جاهز للمراجعة.',
    sentAt: isoAt(0, 7),
    lang: 'ar',
    dir: 'rtl',
  },
  {
    id: 'msg_005',
    threadId: seedIds.threadInstructor,
    author: {
      role: 'academy_owner',
      name: seedOwner.displayName,
    },
    fromMe: true,
    body: 'Thanks. I will review the German A2 roster before the next session.',
    sentAt: isoAt(0, 8),
    lang: 'en',
    dir: 'ltr',
  },
]

export interface SeedData {
  academy: Academy
  owner: User
  instructors: InstructorSummary[]
  languages: Language[]
  levels: Level[]
  cohorts: Cohort[]
  rosters: Record<CohortId, RosterMember[]>
  sessions: Record<CohortId, CohortSession[]>
  attendance: Record<SessionId, AttendanceRecord[]>
  curricula: Curriculum[]
  rubrics: Rubric[]
  earnings: EarningsLedger
  threads: MessageThread[]
  messages: Message[]
}

/** A fresh, mutable copy per adapter instance; no data survives a reload. */
export function createSeed(): SeedData {
  return {
    academy: { ...seedAcademy, languageIds: [...seedAcademy.languageIds] },
    owner: { ...seedOwner },
    instructors: seedInstructors.map((item) => ({ ...item })),
    languages: seedLanguages.map((item) => ({ ...item })),
    levels: seedLevels.map((item) => ({ ...item })),
    cohorts: seedCohorts.map((item) => ({
      ...item,
      language: { ...item.language },
      level: { ...item.level },
      instructor: item.instructor ? { ...item.instructor } : null,
      price: { ...item.price },
    })),
    rosters: Object.fromEntries(
      Object.entries(seedRosters).map(([key, members]) => [
        key,
        members.map((member) => ({
          ...member,
          attendance: { ...member.attendance },
        })),
      ]),
    ),
    sessions: Object.fromEntries(
      Object.entries(seedSessions).map(([key, sessions]) => [
        key,
        sessions.map((session) => ({ ...session })),
      ]),
    ),
    attendance: Object.fromEntries(
      Object.entries(seedAttendance).map(([key, records]) => [
        key,
        records.map((record) => ({ ...record })),
      ]),
    ),
    curricula: seedCurricula.map((curriculum) => ({
      ...curriculum,
      language: { ...curriculum.language },
      level: { ...curriculum.level },
      units: curriculum.units.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((item) => ({
          ...item,
          contentLanguage: { ...item.contentLanguage },
          materials: item.materials.map((material) => ({ ...material })),
        })),
      })),
    })),
    rubrics: seedRubrics.map((rubricItem) => ({
      ...rubricItem,
      language: { ...rubricItem.language },
      level: { ...rubricItem.level },
      dimensions: rubricItem.dimensions.map((item) => ({
        ...item,
        descriptors: item.descriptors.map((descriptor) => ({ ...descriptor })),
      })),
    })),
    earnings: {
      summary: { ...seedEarnings.summary },
      entries: seedEarnings.entries.map((entry) => ({ ...entry })),
      payoutSchedule: seedEarnings.payoutSchedule.map((item) => ({ ...item })),
    },
    threads: seedThreads.map((thread) => ({ ...thread })),
    messages: seedMessages.map((message) => ({ ...message })),
  }
}

/** Exported for tests that need the date helper without re-implementing it. */
export { DAY }
