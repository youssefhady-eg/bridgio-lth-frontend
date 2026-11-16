import type {
  ContentDirection,
  LanguageId,
  LevelId,
} from './common'

/**
 * Languages and levels are data, never a hard-coded list in the UI.
 *
 * PROPOSED — Mentingo/BFF to implement on restore/rebuild.
 * The direction of a content block comes from the language record, so an
 * Arabic-first UI can hold German, Dutch or Italian lesson content running LTR.
 * Adding a language is a configuration/data change, not a code change.
 */
export interface Language {
  id: LanguageId
  /** BCP 47-style code supplied by the backend. */
  code: string
  /** Working label for the language (demo data until the BFF supplies it). */
  label: string
  nativeLabel: string
  direction: ContentDirection
  script: string
  numeralSystem: string | null
  /** Whether an appeal owner has been confirmed for this language. */
  appealOwnerReady: boolean
}

/** A level record. The values are supplied by the contract, never hard-coded. */
export interface Level {
  id: LevelId
  label: string
  order: number
  /** Framework label supplied by the contract, for example CEFR. */
  framework: string
}
