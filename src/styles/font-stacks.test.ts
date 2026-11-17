import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * E1 guard (Batch 0).
 *
 * Stylelint is not installed in this fork, so the literal-ban is implemented
 * here as a test instead of adding a dependency. Every CSS file under src/ that
 * is not tokens.css or fonts.css must name a font stack token, never a family.
 * This keeps C13/C41 enforceable while Thmanyah is still pending.
 */

const SRC = join(process.cwd(), 'src')
const ALLOWED = new Set(['tokens.css', 'fonts.css'])

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return cssFiles(full)
    return full.endsWith('.css') ? [full] : []
  })
}

describe('font stack tokens (E1 guard)', () => {
  const files = cssFiles(SRC)

  it('declares the three locked stack tokens in tokens.css', () => {
    const tokens = readFileSync(join(SRC, 'styles', 'tokens.css'), 'utf8')
    expect(tokens).toMatch(/--font-stack-display:\s*'thmanyahserifdisplay'/)
    expect(tokens).toMatch(/--font-stack-reading:\s*'thmanyahseriftext'/)
    expect(tokens).toMatch(/--font-stack-ui:\s*'Bridgio Label'/)
    expect(tokens).not.toMatch(/--font-stack-ui:[^;]*thmanyahsans/)
  })

  it('uses only stack tokens outside tokens.css and fonts.css', () => {
    const offenders: string[] = []

    for (const file of files) {
      if (ALLOWED.has(file.split(/[\\/]/).pop() ?? '')) continue
      const text = readFileSync(file, 'utf8')
      const declarations = text.match(/font-family\s*:\s*[^;]+;/gi) ?? []
      for (const declaration of declarations) {
        if (!declaration.includes('var(--font-stack-')) {
          offenders.push(`${relative(process.cwd(), file)}: ${declaration}`)
        }
      }
    }

    expect(offenders).toEqual([])
  })

  it('never names a Thmanyah family in a declaration outside the stacks', () => {
    const offenders: string[] = []

    for (const file of files) {
      if (ALLOWED.has(file.split(/[\\/]/).pop() ?? '')) continue
      const text = readFileSync(file, 'utf8')
      if (/font-family\s*:\s*[^;]*thmanyah/i.test(text)) {
        offenders.push(relative(process.cwd(), file))
      }
    }

    expect(offenders).toEqual([])
  })
})