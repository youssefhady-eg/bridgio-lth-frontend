/**
 * R1–R4 "before" screenshots.
 *
 * Captured from a detached worktree at the Batch 0 base commit (5aa4413), so
 * the before/after pair in the delivery note is a real run of the previous
 * code, not a reconstructed mock. Serve that worktree on GATE_BASE (3002) and
 * run: GATE_BASE=http://localhost:3002 node scripts/gate/screenshots-before.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from './cdp.mjs'

const OUT = join(process.cwd(), 'docs', 'screenshots', 'batch-0', 'before')
mkdirSync(OUT, { recursive: true })

const browser = await launch({ port: 9340 })
const written = []

async function capture({ name, path, lang, theme, width, collapsed = false, height = 1080 }) {
  await browser.setViewport({ width, height, mobile: width === 390 })
  await browser.visit({ path, lang, theme })
  if (collapsed) {
    await browser.evaluate(`localStorage.setItem('bridgio-sidebar', 'collapsed')`)
    await browser.page('Page.reload')
    await browser.waitLoad()
    await browser.sleep(500)
  } else {
    await browser.evaluate(`localStorage.setItem('bridgio-sidebar', 'expanded')`)
  }
  const image = await browser.screenshot({ width, height })
  writeFileSync(join(OUT, `${name}.png`), image)
  written.push(name)
}

for (const lang of ['en', 'ar']) {
  await capture({ name: `dashboard-${lang}-light-1920`, path: '/academy', lang, theme: 'light', width: 1920 })
  await capture({ name: `dashboard-${lang}-light-1920-collapsed`, path: '/academy', lang, theme: 'light', width: 1920, collapsed: true })
  await capture({ name: `roster-${lang}-light-1920`, path: '/academy/cohorts/coh_de_a2_evening', lang, theme: 'light', width: 1920 })
  await capture({ name: `roster-${lang}-light-390`, path: '/academy/cohorts/coh_de_a2_evening', lang, theme: 'light', width: 390 })
}

browser.close()
console.log(`Wrote ${written.length} before screenshots to docs/screenshots/batch-0/before/`)
for (const name of written) console.log(`  ${name}.png`)