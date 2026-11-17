import type {
  AcademyId,
  DimensionId,
  IsoDateTime,
  LanguageId,
  LevelId,
  RubricId,
} from './common'
import type { Language, Level } from './languages'

/**
 * Structured CEFR grading rubric.
 *
 * PROPOSED — Mentingo/BFF to implement on restore/rebuild.
 * The five speaking dimensions are locked product language, but Mentingo's
 * five-dimension scoring coverage is NOT VERIFIED. A dimension the rubric does
 * not assess is rendered as "not assessed"; the UI never invents a value.
 */

export type RubricStatus = 'draft' | 'published'

export type RubricDimensionKey =
  | 'pronunciation'
  | 'fluency'
  | 'empathy'
  | 'vocabulary'
  | 'listening'

export interface RubricDescriptor {
  band: number
  label: string
  descriptor: string
}

export interface RubricDimension {
  id: DimensionId
  key: RubricDimensionKey
  assessed: boolean
  weightPercent: number
  descriptors: RubricDescriptor[]
}

export interface Rubric {
  id: RubricId
  academyId: AcademyId
  title: string
  version: number
  status: RubricStatus
  language: Language
  level: Level
  dimensions: RubricDimension[]
  updatedAt: IsoDateTime
  /** Optional coverage note from the contract; null when none is supplied. */
  coverageNote: string | null
}

export interface RubricSummary {
  id: RubricId
  title: string
  status: RubricStatus
  version: number
  language: Language
  level: Level
  updatedAt: IsoDateTime
}

export interface RubricList {
  rubrics: RubricSummary[]
  languages: Language[]
  levels: Level[]
}

export interface UpdateRubricDimensionInput {
  rubricId: RubricId
  dimensionId: DimensionId
  weightPercent: number
  descriptors: RubricDescriptor[]
}

export interface PublishRubricInput {
  rubricId: RubricId
}
