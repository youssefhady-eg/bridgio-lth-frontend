/**
 * Batch 0 screenshots — every changed surface.
 *
 * Matrix: the two surfaces Batch 0 restyled (dashboard grid, cohort roster) at
 * 1920 and 390, light + dark, EN + AR; the collapsed sidebar rail at the three
 * owner widths; and the design-system stories from the static Storybook build.
 *
 * Usage: npm run gate:screenshots
 * Output: docs/screenshots/batch-0/
 */
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { launch } from './cdp.mjs'

const OUT = join(process.cwd(), 'docs', 'screenshots', 'batch-0')
mkdirSync(OUT, { recursive: true })

const browser = await launch({ port: 9339 })
const written = []

async function capture({ name, path, lang, theme, width, collapsed = false, height = 1080, url }) {
  await browser.setViewport({ width, height, mobile: width === 390 })

  if (url) {
    await browser.page('Page.navigate', { url })
    await browser.waitLoad()
    await browser.sleep(900)
  } else {
    await browser.visit({ path, lang, theme })

    if (collapsed) {
      await browser.evaluate(
        `localStorage.setItem('bridgio-sidebar', 'collapsed')`,
      )
      await browser.page('Page.reload')
      await browser.waitLoad()
      await browser.waitForStableWidth('.app-sidebar')
    }
  }

  const image = await browser.screenshot({ width, height })
  const file = join(OUT, `${name}.png`)
  writeFileSync(file, image)
  written.push({ name, file, path: path ?? url, lang, theme, width, collapsed })
}

// ---- App surfaces ---------------------------------------------------------

const SURFACES = [
  { name: 'dashboard', path: '/academy' },
  { name: 'roster', path: '/academy/cohorts/coh_de_a2_evening' },
]

for (const surface of SURFACES) {
  for (const lang of ['en', 'ar']) {
    for (const theme of ['light', 'dark']) {
      for (const width of [1920, 390]) {
        await capture({
          name: `${surface.name}-${lang}-${theme}-${width}`,
          path: surface.path,
          lang,
          theme,
          width,
        })
      }
    }
  }
}

// ---- R3 collapsed rail at the owner widths --------------------------------

for (const width of [1024, 1440, 1920]) {
  for (const lang of ['en', 'ar']) {
    await capture({
      name: `rail-collapsed-${lang}-${width}`,
      path: '/academy',
      lang,
      theme: 'light',
      width,
      collapsed: true,
    })
  }
}

// ---- Design-system stories from the static build --------------------------

const STORYBOOK_DIR = join(process.cwd(), 'storybook-static')
const STORYBOOK_PORT = 6100

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
}

let server
if (existsSync(join(STORYBOOK_DIR, 'iframe.html'))) {
  server = createServer((request, response) => {
    const raw = (request.url ?? '/').split('?')[0]
    let file = join(STORYBOOK_DIR, normalize(raw).replace(/^(\.\.[/\\])+/, ''))
    if (!existsSync(file) || raw.endsWith('/')) file = join(STORYBOOK_DIR, 'iframe.html')
    try {
      const body = readFileSync(file)
      response.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
      response.end(body)
    } catch {
      response.writeHead(404)
      response.end('not found')
    }
  })
  await new Promise((resolve) => server.listen(STORYBOOK_PORT, resolve))

  const STORIES = [
    'buttons',
    'fields',
    'dialogs',
    'dialog-open',
    'drawer-open',
    'toasts',
    'toasts-open',
    'avatars',
    'breadcrumbs',
    'tabs',
    'logos',
    'grid',
    'skeletons',
    'score-cards',
    'typography-ar',
    'icons',
  ]

  for (const story of STORIES) {
    for (const theme of ['light', 'dark']) {
      await capture({
        name: `ds-${story}-${theme}`,
        url: `http://localhost:${STORYBOOK_PORT}/iframe.html?id=design-system-overview--${story}&globals=theme:${theme};direction:ltr&viewMode=story`,
        lang: 'en',
        theme,
        width: 1920,
        height: 1200,
      })
    }
  }
} else {
  console.warn('storybook-static/iframe.html not found — run npm run build-storybook first')
}

browser.close()
server?.close()

writeFileSync(
  join(OUT, 'index.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), shots: written }, null, 2),
)

console.log(`Wrote ${written.length} screenshots to docs/screenshots/batch-0/`)
for (const shot of written) console.log(`  ${shot.name}.png`)