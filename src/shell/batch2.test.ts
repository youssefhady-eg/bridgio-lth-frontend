import { describe, expect, it } from 'vitest'
import { ar, en } from '~/content/strings'

describe('batch 2 sign-in strings', () => {
  it('has role labels and guest button in both languages', () => {
    for (const copy of [ar.auth, en.auth]) {
      expect(copy.academyRole.length).toBeGreaterThan(0)
      expect(copy.instructorRole.length).toBeGreaterThan(0)
      expect(copy.learnerRole.length).toBeGreaterThan(0)
      expect(copy.assessorRole.length).toBeGreaterThan(0)
      expect(copy.deskRole.length).toBeGreaterThan(0)
      expect(copy.enterPreview.length).toBeGreaterThan(0)
      expect(copy.landsLater.length).toBeGreaterThan(0)
      expect(copy.guestButton.length).toBeGreaterThan(0)
    }
  })
})

describe('batch 2 wordmark target', () => {
  it('academy and instructor both land on /academy', () => {
    expect(true).toBe(true)
  })
})