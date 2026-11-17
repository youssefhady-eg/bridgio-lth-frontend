import type {
  AcademyId,
  CurriculumId,
  IsoDateTime,
  LanguageId,
  LessonId,
  LevelId,
  MaterialId,
  UnitId,
} from './common'
import type { Language, Level } from './languages'

/**
 * Curriculum and lesson builder.
 *
 * PROPOSED — Mentingo/BFF to implement on restore/rebuild.
 * Mentingo has no verified curriculum model, so this structure is a proposal.
 * Every lesson carries its own content language, and the UI sets `lang` and
 * `dir` per block from that record.
 */

export type CurriculumStatus = 'draft' | 'published'

export type LessonKind = 'lesson' | 'practice' | 'assessment'

export type MaterialKind = 'text' | 'pdf' | 'audio' | 'video' | 'link'

export interface LessonMaterial {
  id: MaterialId
  title: string
  kind: MaterialKind
  url: string | null
}

export interface Lesson {
  id: LessonId
  title: string
  objective: string
  order: number
  durationMinutes: number
  kind: LessonKind
  /** Direction for this content block, taken from the language record. */
  contentLanguage: Language
  materials: LessonMaterial[]
}

export interface CurriculumUnit {
  id: UnitId
  title: string
  objective: string
  order: number
  lessons: Lesson[]
}

export interface Curriculum {
  id: CurriculumId
  academyId: AcademyId
  title: string
  description: string
  status: CurriculumStatus
  language: Language
  level: Level
  units: CurriculumUnit[]
  updatedAt: IsoDateTime
}

export interface CurriculumSummary {
  id: CurriculumId
  title: string
  status: CurriculumStatus
  language: Language
  level: Level
  unitCount: number
  lessonCount: number
  updatedAt: IsoDateTime
}

export interface CurriculumList {
  curricula: CurriculumSummary[]
  languages: Language[]
  levels: Level[]
}

export interface CreateCurriculumInput {
  languageId: LanguageId
  levelId: LevelId
  title: string
  description: string
}

export interface AddUnitInput {
  curriculumId: CurriculumId
  title: string
  objective: string
}

export interface AddLessonInput {
  curriculumId: CurriculumId
  unitId: UnitId
  title: string
  objective: string
  durationMinutes: number
  contentLanguageId: LanguageId
  kind: LessonKind
}

export interface PublishCurriculumInput {
  curriculumId: CurriculumId
}

export interface GroundingRef {
  id: string
  label: string
}

export interface CurriculumDraftLesson {
  title: string
  objective: string
  durationMinutes: number
  kind: LessonKind
}

export interface CurriculumDraftUnit {
  title: string
  objective: string
  lessons: CurriculumDraftLesson[]
}

/**
 * A Mohsen-authored outline. It is a draft suggestion, not a saved unit and not
 * a source of truth; the academy owner still reviews and adds it.
 */
export interface MohsenCurriculumDraft {
  units: CurriculumDraftUnit[]
  grounding: GroundingRef[]
  disclaimer: string
}

export interface DraftCurriculumOutlineInput {
  curriculumId: CurriculumId
  unitTitle: string
  lessonCount: number
}
