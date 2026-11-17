/**
 * Part C gate — axe-core accessibility report.
 *
 * axe-core is loaded from node_modules (shipped by @storybook/addon-a11y),
 * never installed as a direct dependency and never fetched from the network.
 * The report covers the default WCAG 2.2 A/AA + best-practice rules, and
 * calls out `link-in-text-block` separately because C10 removed underlines and
 * links must still be distinguishable without them.
 *
 * Usage: node scripts/gate/axe.mjs
 * Output: docs/gate/axe-report.txt (+ .json)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BASE, launch } from './cdp.mjs'
import { ROUTES } from './routes.mjs'

const OUT = join(process.cwd(), 'docs', 'gate')
mkdirSync(OUT, { recursive: true })

let axeSource = ''
let axeVersion = 'node_modules/axe-core (shipped with @storybook/addon-a11y)'
try {
  const fs = await import('node:fs')
  const localPath = new URL('../../node_modules/axe-core/axe.min.js', import.meta.url)
  axeSource = fs.readFileSync(localPath, 'utf8')
} catch (error) {
  const AXE_URL = 'https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js'
  try {
    const response = await fetch(AXE_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    axeSource = await response.text()
    axeVersion = AXE_URL
  } catch (inner) {
    const message = [
      'BRIDGIO LTH — axe report (Batch 0)',
      `Base URL: ${BASE}`,
      '',
      `BLOCKED: axe-core could not be loaded locally or from ${AXE_URL}.`,
      `Reason: ${String(inner)}`,
      '',
      'Re-run with node_modules present (npm ci).',
    ].join('\\n')
    writeFileSync(join(OUT, 'axe-report.txt'), message)
    console.log(message)
    process.exitCode = 1
    process.exit()
  }
}

const browser = await launch({ port: 9337 })
const rows = []

const VARIANTS = [
  { lang: 'en', theme: 'light', width: 1920 },
  { lang: 'en', theme: 'light', width: 390 },
  { lang: 'ar', theme: 'light', width: 1920 },
  { lang: 'ar', theme: 'dark', width: 1920 },
]

for (const route of ROUTES) {
  for (const variant of VARIANTS) {
    try {
      await browser.setViewport({
        width: variant.width,
        height: variant.width === 390 ? 844 : 1080,
        mobile: variant.width === 390,
      })
      await browser.visit({ path: route.path, ...variant })


      await browser.evaluate(axeSource)

      const results = await browser.evaluate(`(async () => {
        const result = await window.axe.run(document, {
          resultTypes: ['violations', 'incomplete'],
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
          },
        })
        const map = (entries) =>
          entries.map((entry) => ({
            id: entry.id,
            impact: entry.impact,
            help: entry.help,
            nodes: entry.nodes.map((node) => ({
              target: node.target,
              summary: (node.failureSummary || '').replace(/\\s+/g, ' ').slice(0, 240),
            })),
          }))
        return {
          violations: map(result.violations),
          incomplete: map(result.incomplete),
        }
      })()`)

      rows.push({
        route: route.name,
        path: route.path,
        ...variant,
        violations: results.violations,
        incomplete: results.incomplete,
        consoleErrors: browser.consoleErrors(),
      })
    } catch (error) {
      rows.push({ route: route.name, path: route.path, ...variant, error: String(error) })
    }
  }
}

browser.close()

const totalViolations = rows.reduce(
  (sum, row) => sum + (row.violations?.length ?? 0),
  0,
)
const linkRows = rows.flatMap((row) => {
  const rule = row.violations?.find((entry) => entry.id === 'link-in-text-block')
  const ruleIncomplete = row.incomplete?.find((entry) => entry.id === 'link-in-text-block')
  return rule || ruleIncomplete
    ? [{ row, rule, ruleIncomplete }]
    : []
})

const lines = [
  'BRIDGIO LTH — axe-core report (Batch 0)',
  `Base URL: ${BASE}`,
  `axe-core: ${axeVersion}`,
  'Rules: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice',
  `Runs: ${rows.length}`,
  '',
  ...rows.flatMap((row) => {
    const head = `${row.error ? 'ERROR' : row.violations.length === 0 ? 'PASS' : 'FAIL'}  ${row.route}  ${row.lang}/${row.theme}/@${row.width}`
    if (row.error) return [`${head}  ${row.error}`]
    const violations = row.violations.flatMap((entry) => [
      `      ${entry.id} (${entry.impact}) — ${entry.help}`,
      ...entry.nodes.map((node) => `        → ${node.target.join(' ')} :: ${node.summary}`),
    ])
    const incomplete = row.incomplete.flatMap((entry) => [
      `      review: ${entry.id} (${entry.impact}) — ${entry.help}`,
      ...entry.nodes.map((node) => `        → ${node.target.join(' ')}`),
    ])
    return [
      `${head}  violations=${row.violations.length}, incomplete=${row.incomplete.length}`,
      ...violations,
      ...incomplete,
    ]
  }),
  '',
  'C10 link visibility (link-in-text-block):',
  linkRows.length === 0
    ? '  PASS — no link-in-text-block violation or manual review item in any run.'
    : linkRows
        .map(({ row, rule, ruleIncomplete }) => {
          const entry = rule ?? ruleIncomplete
          const status = rule ? 'VIOLATION' : 'REVIEW'
          return `  ${status} ${row.route} ${row.lang}/${row.theme}/@${row.width}: ${entry.nodes
            .map((node) => node.target.join(' '))
            .join(', ')}`
        })
        .join('\\n'),
  '',
  `Summary: ${rows.length - rows.filter((row) => row.error || row.violations.length > 0).length}/${rows.length} runs with zero violations; ${totalViolations} violation groups total.`,
]

writeFileSync(join(OUT, 'axe-report.txt'), lines.join('\\n'))
writeFileSync(
  join(OUT, 'axe-report.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      base: BASE,
      axe: axeVersion,
      rows,
    },
    null,
    2,
  ),
)

console.log(lines.join('\\n'))
process.exitCode = rows.some((row) => row.error || row.violations.length > 0) ? 1 : 0