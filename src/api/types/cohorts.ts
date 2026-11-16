import type {
  AcademyId,
  CohortId,
  IsoDate,
  IsoDateTime,
  LanguageId,
  LearnerId,
  LevelId,
  Money,
  SessionId,
  UserId,
} from './common'
import type { Language, Level } from './languages'

/**
 * Cohorts, roster and attendance.
 *
 * PROPOSED — Mentingo/BFF to implement on restore/rebuild.
 * The cohort model itself is a proposal. "No cohorts or attendance" and "groups
 * as cohorts" are NOT VERIFIED Mentingo claims, so nothing here is presented as
 * an existing Mentingo entity. Attendance is a proposed model and the screen
 * says so.
 */

export type CohortStatus = 'draft' | 'published' | 'active' | 'completed'

export interface InstructorSummary {
  id: UserId
  displayName: string
  email: string
}

export interface Cohort {
  id: CohortId
  academyId: AcademyId
  label: string
  language: Language
  level: Level
  /** Human-readable schedule supplied by the backend, not a UI assumption. */
  schedule: string
  capacity: number
  seatsFilled: number
  seatsAvailable: number
  status: CohortStatus
  instructor: InstructorSummary | null
  startDate: IsoDate
  endDate: IsoDate
  /** Every price is a placeholder until the finance review. */
  price: Money
  /** Marks the attendance model as proposed, never as a confirmed feature. */
  attendanceModel: 'proposed'
}

export interface CohortSummary {
  id: CohortId
  label: string
  language: Language
  level: Level
  /** Human-readable schedule supplied by the backend, not a UI assumption. */
  schedule: string
  status: CohortStatus
  capacity: number
  seatsFilled: number
  seatsAvailable: number
  instructor: InstructorSummary | null
  startDate: IsoDate
}

export interface CohortList {
  cohorts: CohortSummary[]
  languages: Language[]
  levels: Level[]
  instructors: InstructorSummary[]
}

export interface CreateCohortInput {
  languageId: LanguageId
  levelId: LevelId
  label: string
  schedule: string
  capacity: number
  instructorId: UserId
  startDate: IsoDate
  endDate: IsoDate
}

export interface PublishCohortInput {
  cohortId: CohortId
}

export type RosterMemberStatus = 'active' | 'invited' | 'withdrawn'
export type AttendanceMark = 'present' | 'late' | 'absent' | 'excused'
export type AttendanceStatus = AttendanceMark | 'not_recorded'

export interface AttendanceSummary {
  present: number
  late: number
  absent: number
  excused: number
  recordedSessions: number
  /** Null when no session has been recorded yet — never guessed as 0. */
  attendanceRate: number | null
}

export interface RosterMember {
  learnerId: LearnerId
  displayName: string
  email: string
  status: RosterMemberStatus
  joinedAt: IsoDateTime
  attendance: AttendanceSummary
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'

export interface CohortSession {
  id: SessionId
  cohortId: CohortId
  topic: string
  startsAt: IsoDateTime
  durationMinutes: number
  status: SessionStatus
  attendanceRecorded: boolean
}

export interface AttendanceRecord {
  learnerId: LearnerId
  status: AttendanceStatus
  note: string | null
}

export interface AttendanceSheet {
  cohort: Cohort
  session: CohortSession
  records: AttendanceRecord[]
  recordedAt: IsoDateTime | null
}

export interface Roster {
  cohort: Cohort
  members: RosterMember[]
  sessions: CohortSession[]
  /** Null when the cohort has no recorded attendance yet. */
  attendanceRate: number | null
}

export interface MarkAttendanceInput {
  cohortId: CohortId
  sessionId: SessionId
  records: Array<{ learnerId: LearnerId; status: AttendanceMark }>
}
