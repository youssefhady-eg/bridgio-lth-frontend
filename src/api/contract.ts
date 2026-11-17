import type {
  Academy,
  AcademyDashboard,
  AcademyOnboarding,
  AddLessonInput,
  AddUnitInput,
  AdapterInfo,
  AttendanceSheet,
  Cohort,
  CohortList,
  CompleteOnboardingStepInput,
  CreateCohortInput,
  CreateCurriculumInput,
  Curriculum,
  CurriculumList,
  DraftCurriculumOutlineInput,
  EarningsLedger,
  Language,
  LanguageId,
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
} from './types'

/**
 * BRIDGIO Learn-to-Hire API CONTRACT v0.2 — PROPOSED ONLY.
 *
 * Mentingo's local source was deleted by the owner (2026-11-01), so there are NO
 * confirmed Mentingo endpoints in this build. EVERY method below is
 * "PROPOSED — Mentingo to implement on restore/rebuild". Do not present any
 * method or shape as an existing Mentingo API.
 *
 * One layer only: screens/components call this interface (through the exported
 * client), never `fetch`. The mock adapter and the HTTP adapter implement this
 * same interface, method names and request/response shapes. Swapping mock for
 * the real backend is a configuration change (`VITE_API_ADAPTER` + `VITE_API_URL`),
 * not a screen rewrite.
 *
 * Auth note: Mentingo owns auth/users/roles. The exact auth transport is an open
 * integration gap. No token is exposed by this contract.
 */
export interface BridgioApi {
  readonly contractVersion: string
  readonly mode: 'mock' | 'http'

  auth: {
    /** PROPOSED — Mentingo to implement on restore/rebuild. */
    getSession(): Promise<Session | null>
    /** PROPOSED — credential shape unconfirmed; delegates to Mentingo auth when available. */
    signIn(input: SignInInput): Promise<Session>
    /** PROPOSED — Mentingo to implement on restore/rebuild. */
    signOut(): Promise<void>
  }

  /**
   * Language and level records. The UI never hard-codes a language list; every
   * label, code and direction comes from here.
   */
  languages: {
    /** PROPOSED — Mentingo/BFF to implement on restore/rebuild. */
    list(): Promise<Language[]>
    /** PROPOSED — levels are language-scoped data, not a UI constant. */
    listLevels(input: { languageId: LanguageId }): Promise<Level[]>
  }

  /**
   * Academy profile, calibration and dashboard aggregate.
   *
   * PROPOSED — tenant provisioning and calibration APIs are NOT VERIFIED. This
   * is a proposed BFF aggregate, not an existing Mentingo surface.
   */
  academies: {
    /** PROPOSED — the signed-in academy owner's academy. */
    get(): Promise<Academy>
    /** PROPOSED — partner onboarding and calibration state. */
    getOnboarding(): Promise<AcademyOnboarding>
    /** PROPOSED — one aggregate call for screen 12. */
    getDashboard(): Promise<AcademyDashboard>
    /** PROPOSED — update the demo partner profile. */
    updateProfile(input: UpdateAcademyProfileInput): Promise<Academy>
    /** PROPOSED — mark one onboarding step complete. */
    completeOnboardingStep(
      input: CompleteOnboardingStepInput,
    ): Promise<AcademyOnboarding>
  }

  /**
   * Cohorts, roster and attendance.
   *
   * PROPOSED — the cohort model is a proposal; attendance is NOT VERIFIED.
   */
  cohorts: {
    /** PROPOSED — cohorts with the language, level and instructor reference data. */
    list(): Promise<CohortList>
    /** PROPOSED — one cohort. */
    get(input: { cohortId: string }): Promise<Cohort>
    /** PROPOSED — create a draft cohort. */
    create(input: CreateCohortInput): Promise<Cohort>
    /** PROPOSED — publish seats; requires at least one available seat. */
    publish(input: PublishCohortInput): Promise<Cohort>
    /** PROPOSED — roster plus the session list and attendance summary. */
    getRoster(input: { cohortId: string }): Promise<Roster>
    /** PROPOSED — one session's attendance sheet. */
    getAttendanceSheet(input: {
      cohortId: string
      sessionId: string
    }): Promise<AttendanceSheet>
    /** PROPOSED — save attendance for one session. */
    markAttendance(input: MarkAttendanceInput): Promise<AttendanceSheet>
  }

  /**
   * Curriculum and lesson builder.
   *
   * PROPOSED — Mentingo has no verified curriculum model. The whole resource is
   * a proposal for the BFF.
   */
  curricula: {
    /** PROPOSED — academy curricula with language and level reference data. */
    list(): Promise<CurriculumList>
    /** PROPOSED — one curriculum with units and lessons. */
    get(input: { curriculumId: string }): Promise<Curriculum>
    /** PROPOSED — create a draft curriculum. */
    create(input: CreateCurriculumInput): Promise<Curriculum>
    /** PROPOSED — append a unit. */
    addUnit(input: AddUnitInput): Promise<Curriculum>
    /** PROPOSED — append a lesson to a unit. */
    addLesson(input: AddLessonInput): Promise<Curriculum>
    /** PROPOSED — publish a curriculum; requires at least one lesson. */
    publish(input: PublishCurriculumInput): Promise<Curriculum>
    /** PROPOSED — Mohsen drafts an outline; nothing is saved until the owner adds it. */
    draftOutline(
      input: DraftCurriculumOutlineInput,
    ): Promise<MohsenCurriculumDraft>
  }

  /**
   * Structured CEFR grading rubric.
   *
   * PROPOSED — five-dimension coverage is NOT VERIFIED; a dimension the rubric
   * does not assess is shown as "not assessed".
   */
  rubrics: {
    /** PROPOSED — academy rubrics with language and level reference data. */
    list(): Promise<RubricList>
    /** PROPOSED — one rubric with dimensions and descriptors. */
    get(input: { rubricId: string }): Promise<Rubric>
    /** PROPOSED — update one dimension's weight and descriptors. */
    updateDimension(input: UpdateRubricDimensionInput): Promise<Rubric>
    /** PROPOSED — publish a rubric. */
    publish(input: PublishRubricInput): Promise<Rubric>
  }

  /**
   * Earnings, escrow and payout ledger.
   *
   * PROPOSED — every amount is a placeholder until the legal and finance review.
   */
  earnings: {
    /** PROPOSED — summary, entries and payout schedule. */
    getLedger(): Promise<EarningsLedger>
  }

  /**
   * In-app human messages — PROPOSED, mock only. Never an external channel; no
   * real-time transport and no notifications are claimed.
   */
  messages: {
    /** PROPOSED — the signed-in user's conversation threads. */
    listThreads(): Promise<MessageThread[]>
    /** PROPOSED — messages in one thread, oldest first. */
    listMessages(input: { threadId: string }): Promise<Message[]>
    /** PROPOSED — sends a message; the mock answers with a deterministic reply. */
    sendMessage(input: SendMessageInput): Promise<SendMessageResult>
  }

  system: {
    /** Adapter-local diagnostics, NOT a Mentingo endpoint. */
    getInfo(): Promise<AdapterInfo>
  }
}
