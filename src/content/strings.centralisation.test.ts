import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ar, assistant, brand, en } from './strings'

/**
 * Centralisation guard: UI copy lives in `strings.ts`, not in components/routes.
 *
 * The scan covers the rendering tree only. Test fixtures and the mock adapter's
 * seed / refusal data are demo content by design, not UI chrome, so they are
 * intentionally outside this guard.
 */

// Arabic letters only: Arabic-Indic digits (٣) and the percent sign (٪) are
// formatting output, not translatable copy.
const ARABIC = /[\u0621-\u064A]/

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    if (!/\.(ts|tsx)$/.test(entry)) return []
    if (entry.includes('.test.')) return []
    return [path]
  })
}

describe('centralised UI strings', () => {
  it('has no Arabic copy hard-coded in components or routes', () => {
    const roots = ['src/components', 'src/routes']
    const offenders = roots
      .flatMap(sourceFiles)
      .filter((path) => ARABIC.test(readFileSync(path, 'utf8')))

    expect(offenders).toEqual([])
  })

  it('gives every academy screen a badge that is not its own heading', () => {
    // Regression from the inherited shell: an eyebrow that repeats the H1
    // duplicates the heading on every screen.
    for (const copy of [
      ar.onboarding,
      ar.dashboard,
      ar.cohorts,
      ar.roster,
      ar.curriculum,
      ar.rubric,
      ar.earnings,
      en.onboarding,
      en.dashboard,
      en.cohorts,
      en.roster,
      en.curriculum,
      en.rubric,
      en.earnings,
    ]) {
      expect(copy.badge.length).toBeGreaterThan(0)
      expect(copy.title).not.toBe(copy.badge)
      expect(copy.headTitle).toContain(brand.name)
    }
  })

  it('keeps the two preview roles in the copy without an auth claim', () => {
    for (const copy of [ar.profile, en.profile]) {
      expect(copy.previewHeading.length).toBeGreaterThan(0)
      expect(copy.roles.academy_owner.length).toBeGreaterThan(0)
      expect(copy.roles.instructor.length).toBeGreaterThan(0)
      expect(copy.previewNote.length).toBeGreaterThan(0)
    }
    expect(ar.profile.previewNote).not.toContain('تسجيل الدخول')
  })

  it('builds every named mention from the two working-name swap points', () => {
    expect(brand.name.length).toBeGreaterThan(0)
    expect(assistant.nameAr.length).toBeGreaterThan(0)

    expect(ar.head.title).toContain(brand.name)
    expect(ar.help.headTitle).toContain(brand.name)
    expect(ar.guide.headTitle).toContain(brand.name)
    expect(ar.curriculum.mohsen.heading).toContain(assistant.nameAr)
    expect(ar.curriculum.mohsen.disclaimer).toContain(assistant.nameAr)
    expect(en.curriculum.mohsen.heading).toContain(assistant.name)
  })
})
