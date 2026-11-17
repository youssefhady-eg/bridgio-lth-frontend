/**
 * Part B measurement — type sizes actually rendered.
 *
 * tokens.css sets one scale for phones and overrides it at ≥1024 px. The C42
 * condition around those overrides is not known, so this script does not
 * guess: it records the computed value at 390 px and at 1920 px and names the
 * set that was measured.
 *
 * Usage: npm run gate:type
 * Output: docs/gate/type-measure.txt (+ .json)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BASE, launch } from './cdp.mjs'

const OUT = join(process.cwd(), 'docs', 'gate')
mkdirSync(OUT, { recursive: true })

const TARGETS = [
  ['page h1', 'h1'],
  ['section h2', '.academy-section__head h2'],
  ['page lead', '.dashboard__lead'],
  ['body copy', '.academy-section p'],
  ['body small', '.academy-notice'],
  ['label', '.app-sidebar__link'],
  ['caption', '.academy-stat__label'],
  ['table cell', '.academy-table td'],
  ['status chip', '.status-chip'],
]

const browser = await launch({ port: 9341 })
const rows = []

for (const width of [390, 1920]) {
  await browser.setViewport({ width, height: width === 390 ? 844 : 1080, mobile: width === 390 })
  await browser.visit({ path: '/academy/cohorts/coh_de_a2_evening', lang: 'en', theme: 'light' })

  const result = await browser.evaluate(`(() => {
    const root = getComputedStyle(document.documentElement)
    const read = ([name, selector]) => {
      const el = document.querySelector(selector)
      if (!el) return { name, selector, missing: true }
      const s = getComputedStyle(el)
      return {
        name,
        selector,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        fontWeight: s.fontWeight,
        fontFamily: s.fontFamily.split(',')[0].replace(/["']/g, ''),
      }
    }
    return {
      rootFontSize: root.fontSize,
      tokens: {
        h1: root.getPropertyValue('--font-display-size-h1').trim(),
        h2: root.getPropertyValue('--font-display-size-h2').trim(),
        h3: root.getPropertyValue('--font-display-size-h3').trim(),
        body: root.getPropertyValue('--font-body-size').trim(),
        bodySmall: root.getPropertyValue('--font-body-small-size').trim(),
        label: root.getPropertyValue('--font-label-size').trim(),
        caption: root.getPropertyValue('--font-caption-size').trim(),
      },
      elements: ${JSON.stringify(TARGETS)}.map(read),
    }
  })()`)

  rows.push({ width, ...result })
}

browser.close()

const lines = [
  'BRIDGIO LTH — rendered type measurement (Batch 0)',
  `Base URL: ${BASE}`,
  `Route: /academy/cohorts/coh_de_a2_evening (EN, light)`,
  '',
  'tokens.css lines 157-162 are the ≥1024 px overrides. The C42 condition',
  'around them is not known, so both sets are measured below and the note',
  'records which set each row came from.',
  '',
  ...rows.flatMap((row) => [
    `Viewport ${row.width}px (measured set: ${row.width >= 1024 ? 'desktop ≥1024 override' : 'base / phone'})`,
    `  root font-size: ${row.rootFontSize}`,
    `  token values: h1=${row.tokens.h1} h2=${row.tokens.h2} h3=${row.tokens.h3} ` +
      `body=${row.tokens.body} bodySmall=${row.tokens.bodySmall} label=${row.tokens.label} caption=${row.tokens.caption}`,
    ...row.elements.map((element) =>
      element.missing
        ? `  ${element.name.padEnd(12)} ${element.selector} — not on this screen`
        : `  ${element.name.padEnd(12)} ${element.selector} — ${element.fontSize} / ${element.lineHeight}, ` +
          `weight ${element.fontWeight}, ${element.fontFamily}`,
    ),
    '',
  ]),
]

writeFileSync(join(OUT, 'type-measure.txt'), lines.join('\n'))
writeFileSync(
  join(OUT, 'type-measure.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, rows }, null, 2),
)
console.log(lines.join('\n'))