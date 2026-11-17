/**
 * R3 measurement — collapsed rail width and icon centres.
 *
 * The owner asked for a 72 px rail with every icon on one centre line at
 * 1024 / 1440 / 1920, in both directions. This records the computed rail
 * width and the centre x of the nav, utility and toggle icons.
 *
 * Usage: npm run gate:rail
 * Output: docs/gate/rail-measure.txt (+ .json)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BASE, launch } from './cdp.mjs'

const OUT = join(process.cwd(), 'docs', 'gate')
mkdirSync(OUT, { recursive: true })

const browser = await launch({ port: 9343 })
const rows = []

for (const width of [1024, 1440, 1920]) {
  for (const lang of ['en', 'ar']) {
    await browser.setViewport({ width, height: 1080 })
    await browser.visit({ path: '/academy', lang, theme: 'light' })
    await browser.evaluate(`localStorage.setItem('bridgio-sidebar', 'collapsed')`)
    await browser.page('Page.reload')
    await browser.waitLoad()
    await browser.waitForStableWidth('.app-sidebar')

    const result = await browser.evaluate(`(() => {
      const rail = document.querySelector('.app-sidebar')
      if (!rail) return { missing: true }
      const railRect = rail.getBoundingClientRect()
      const centre = (el) => {
        const rect = el.getBoundingClientRect()
        return Math.round((rect.left + rect.width / 2) * 10) / 10
      }
      const sample = (selector) =>
        [...document.querySelectorAll(selector)].map(centre)
      return {
        railWidth: Math.round(railRect.width * 10) / 10,
        navIconCentres: sample('.app-sidebar__icon'),
        utilityIconCentres: sample('.utility-links__icon'),
        toggleCentre: sample('.app-sidebar__toggle > svg'),
      }
    })()`)

    rows.push({ width, lang, ...result })
  }
}

browser.close()

const lines = [
  'BRIDGIO LTH — collapsed rail measurement (Batch 0, R3)',
  `Base URL: ${BASE}`,
  '',
  ...rows.flatMap((row) => [
    `${row.lang.toUpperCase()} @ ${row.width}px — rail ${row.railWidth}px`,
    `  nav icon centres:     ${row.navIconCentres.join(', ')}`,
    `  utility icon centres: ${row.utilityIconCentres.join(', ')}`,
    `  toggle centre:        ${row.toggleCentre.join(', ')}`,
    `  one centre line: ${new Set([...row.navIconCentres, ...row.utilityIconCentres, ...row.toggleCentre]).size === 1 ? 'YES' : 'NO'}`,
    '',
  ]),
]

writeFileSync(join(OUT, 'rail-measure.txt'), lines.join('\n'))
writeFileSync(
  join(OUT, 'rail-measure.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, rows }, null, 2),
)
console.log(lines.join('\n'))