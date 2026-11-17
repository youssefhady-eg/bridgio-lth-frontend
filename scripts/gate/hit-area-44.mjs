/**
 * Part C gate — 44 px hit area.
 *
 * Measures every interactive control on every LTH route at desktop and phone
 * width. WCAG 2.5.8 (AA) wants 24 × 24; the owner's LTH baseline is 44 × 44.
 * Controls that are genuinely inline inside a sentence are recorded as
 * exceptions (WCAG 2.5.8 inline exception) rather than failures, but they are
 * still listed so the number is never hidden.
 *
 * Usage: node scripts/gate/hit-area-44.mjs
 * Output: docs/gate/hit-area-44-report.txt (+ .json)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BASE, launch } from './cdp.mjs'
import { ROUTES } from './routes.mjs'

const OUT = join(process.cwd(), 'docs', 'gate')
mkdirSync(OUT, { recursive: true })

const MIN = 44

const browser = await launch({ port: 9336 })
const rows = []

const probe = `(() => {
  const ignored = (el) =>
    el.closest('.visually-hidden') ||
    el.closest('[aria-hidden="true"]') ||
    el.closest('.app-sidebar:not(.is-open)') ||
    el.closest('.ds-overlay')

  const inlineException = (el) => {
    // Inline text links sit inside a sentence; WCAG exempts them.
    if (el.tagName !== 'A') return false
    const parent = el.parentElement
    if (!parent) return false
    const text = (parent.textContent || '').trim()
    if (text.length <= (el.textContent || '').trim().length + 2) return false
    return getComputedStyle(parent).display !== 'flex' &&
      getComputedStyle(parent).display !== 'grid'
  }

  const describe = (el) => {
    const parts = []
    let node = el
    for (let depth = 0; node && depth < 4; depth += 1) {
      let part = node.tagName.toLowerCase()
      if (node.id) part += '#' + node.id
      const cls = (node.className && typeof node.className === 'string')
        ? node.className.trim().split(/\\s+/).slice(0, 2).join('.')
        : ''
      if (cls) part += '.' + cls
      parts.unshift(part)
      node = node.parentElement
    }
    return parts.join(' > ')
  }

  const selector = [
    'a[href]',
    'button',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[role="switch"]',
    '[role="checkbox"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  const controls = []
  for (const el of document.querySelectorAll(selector)) {
    if (ignored(el)) continue
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) continue

    const label = (
      el.getAttribute('aria-label') ||
      el.textContent ||
      el.getAttribute('name') ||
      el.getAttribute('type') ||
      ''
    ).trim().replace(/\\s+/g, ' ').slice(0, 60)

    controls.push({
      selector: describe(el),
      label,
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
      inlineException: inlineException(el),
      fails: rect.width < ${MIN} - 0.5 || rect.height < ${MIN} - 0.5,
    })
  }

  return controls
})()`

for (const route of ROUTES) {
  for (const width of [1920, 390]) {
    try {
      await browser.setViewport({ width, height: width === 390 ? 844 : 1080, mobile: width === 390 })
      await browser.visit({ path: route.path, lang: 'en', theme: 'light' })
      const controls = await browser.evaluate(probe)
      const failures = controls.filter((control) => control.fails && !control.inlineException)
      const exceptions = controls.filter((control) => control.fails && control.inlineException)
      rows.push({
        route: route.name,
        path: route.path,
        width,
        controls: controls.length,
        failures,
        exceptions,
        pass: failures.length === 0,
      })
    } catch (error) {
      rows.push({ route: route.name, path: route.path, width, error: String(error), pass: false })
    }
  }
}

browser.close()

const failed = rows.filter((row) => !row.pass)
const lines = [
  'BRIDGIO LTH — 44 px hit-area gate (Batch 0)',
  `Base URL: ${BASE}`,
  `Minimum: ${MIN} × ${MIN} px. Inline sentence links are listed separately.`,
  '',
  ...rows.flatMap((row) => {
    const head = `${row.pass ? 'PASS' : 'FAIL'}  ${row.route}  @${row.width}px`
    if (row.error) return [`${head}  ERROR ${row.error}`]
    const failLines = row.failures.map(
      (control) =>
        `      FAIL ${control.selector} "${control.label}" ${control.width}×${control.height}`,
    )
    const exceptionLines = row.exceptions.map(
      (control) =>
        `      inline-exception ${control.selector} "${control.label}" ${control.width}×${control.height}`,
    )
    return [
      `${head}  controls=${row.controls}, failures=${row.failures.length}, inline exceptions=${row.exceptions.length}`,
      ...failLines,
      ...exceptionLines,
    ]
  }),
  '',
  `Summary: ${rows.length - failed.length}/${rows.length} route/viewport runs have no non-inline control under ${MIN} px.`,
]

writeFileSync(join(OUT, 'hit-area-44-report.txt'), lines.join('\n'))
writeFileSync(
  join(OUT, 'hit-area-44-report.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, min: MIN, rows }, null, 2),
)

console.log(lines.join('\n'))
process.exitCode = failed.length === 0 ? 0 : 1