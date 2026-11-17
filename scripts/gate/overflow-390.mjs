/**
 * C39 / Part C gate — 390 px overflow.
 *
 * Loads every LTH route at a 390 px viewport in both directions and both
 * themes, then fails if the document scrolls horizontally or if any visible
 * element sticks out of the viewport. Off-canvas furniture (the closed phone
 * sidebar drawer) is excluded because it is translated out on purpose.
 *
 * Usage: node scripts/gate/overflow-390.mjs
 * Output: docs/gate/overflow-390-report.txt (+ .json)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BASE, launch } from './cdp.mjs'
import { ROUTES, VARIANTS } from './routes.mjs'

const OUT = join(process.cwd(), 'docs', 'gate')
mkdirSync(OUT, { recursive: true })

const browser = await launch({ port: 9335 })
const rows = []

const probe = `(() => {
  const width = window.innerWidth
  const visible = (el) => {
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') return false
    if (Number(style.opacity) === 0) return false
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return false
    return true
  }
  const ignored = (el) =>
    el.closest('.app-sidebar:not(.is-open)') ||
    el.closest('[aria-hidden="true"]') ||
    el.closest('.visually-hidden') ||
    el.closest('.ds-overlay') ||
    // The skip link parks itself off-canvas until it is focused. It never
    // widens the document, so it is not a 390 px overflow.
    (el.closest('.skip-link') && !el.matches(':focus-visible')) ||
    el.hasAttribute('data-gate-ignore')

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

  const offenders = []
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || ignored(el)) continue
    const rect = el.getBoundingClientRect()
    if (rect.right > width + 1 || rect.left < -1) {
      offenders.push({
        selector: describe(el),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      })
      if (offenders.length >= 25) break
    }
  }

  return {
    innerWidth: width,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    offenders,
  }
})()`

for (const route of ROUTES) {
  for (const variant of VARIANTS) {
    try {
      await browser.setViewport({ width: 390, height: 844, mobile: true })
      await browser.visit({ path: route.path, ...variant })
      const result = await browser.evaluate(probe)
      const scrolls = result.scrollWidth > 391
      rows.push({
        route: route.name,
        path: route.path,
        ...variant,
        ...result,
        scrollsHorizontally: scrolls,
        pass: !scrolls && result.offenders.length === 0,
        consoleErrors: browser.consoleErrors(),
      })
    } catch (error) {
      rows.push({
        route: route.name,
        path: route.path,
        ...variant,
        error: String(error),
        pass: false,
      })
    }
  }
}

browser.close()

const failed = rows.filter((row) => !row.pass)
const lines = [
  'BRIDGIO LTH — 390 px overflow gate (Batch 0, C39)',
  `Base URL: ${BASE}`,
  `Viewport: 390 × 844, mobile emulation, both themes, EN + AR`,
  `Routes: ${ROUTES.length}, runs: ${rows.length}`,
  '',
  ...rows.map((row) => {
    const head = `${row.pass ? 'PASS' : 'FAIL'}  ${row.route}  ${row.lang}/${row.theme}`
    if (row.error) return `${head}  ERROR ${row.error}`
    const detail = `  scrollWidth=${row.scrollWidth} (viewport ${row.innerWidth}), offenders=${row.offenders.length}`
    const list = row.offenders
      .map((o) => `      - ${o.selector}  [${o.left} … ${o.right}] w=${o.width}`)
      .join('\n')
    const errors = row.consoleErrors?.length
      ? `\n      console: ${row.consoleErrors.join(' | ')}`
      : ''
    return `${head}${detail}${list ? `\n${list}` : ''}${errors}`
  }),
  '',
  `Summary: ${rows.length - failed.length}/${rows.length} runs clean.`,
]

writeFileSync(join(OUT, 'overflow-390-report.txt'), lines.join('\n'))
writeFileSync(
  join(OUT, 'overflow-390-report.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, rows }, null, 2),
)

console.log(lines.join('\n'))
process.exitCode = failed.length === 0 ? 0 : 1