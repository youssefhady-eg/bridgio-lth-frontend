/**
 * Part C gate — contrast + C10 link visibility.
 *
 * Part 1 reads tokens.css directly and measures every text/background pair in
 * light and dark, blending the alpha neutrals over the surface they actually
 * sit on. Part 2 measures real links in the running app for C10 (no underline
 * at rest): colour, weight and the contrast against surrounding text.
 *
 * Usage: npm run gate:contrast
 * Output: docs/gate/contrast-report.txt (+ .json)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BASE, launch } from './cdp.mjs'
import { ROUTES } from './routes.mjs'

const OUT = join(process.cwd(), 'docs', 'gate')
mkdirSync(OUT, { recursive: true })

const css = readFileSync(join(process.cwd(), 'src', 'styles', 'tokens.css'), 'utf8')
const darkStart = css.indexOf(":root[data-theme='dark']")
const lightCss = darkStart === -1 ? css : css.slice(0, darkStart)
const darkCss = darkStart === -1 ? '' : css.slice(darkStart)

function readToken(source, name) {
  const match = new RegExp(`${name}:\\s*([^;]+);`).exec(source)
  if (!match?.[1]) throw new Error(`token ${name} not found`)
  return match[1].trim()
}

function parse(value, tokens) {
  let text = value.trim()
  const alias = /^var\((--[a-z0-9-]+)\)$/i.exec(text)
  if (alias?.[1]) text = readToken(tokens, alias[1])
  const hex = /^#([0-9a-f]{6})/i.exec(text)
  if (hex?.[1]) {
    const int = Number.parseInt(hex[1], 16)
    return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255, a: 1 }
  }
  const rgba = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?\s*\)/i.exec(text)
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    }
  }
  throw new Error(`cannot parse colour: ${value}`)
}

function blend(foreground, background) {
  const a = foreground.a
  return {
    r: foreground.r * a + background.r * (1 - a),
    g: foreground.g * a + background.g * (1 - a),
    b: foreground.b * a + background.b * (1 - a),
    a: 1,
  }
}

function luminance({ r, g, b }) {
  const channels = [r, g, b].map((value) => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(foreground, background) {
  const solidBg = background.a === 1 ? background : blend(background, { r: 255, g: 255, b: 255, a: 1 })
  const fg = foreground.a === 1 ? foreground : blend(foreground, solidBg)
  const l1 = luminance(fg)
  const l2 = luminance(solidBg)
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (light + 0.05) / (dark + 0.05)
}

const PAIRS = [
  // Light theme
  { theme: 'light', fg: '--text-primary', bg: '--bridgio-cream', min: 4.5, use: 'Body / headings on the page' },
  { theme: 'light', fg: '--text-primary', bg: '--bridgio-paper', min: 4.5, use: 'Body on cards and surfaces' },
  { theme: 'light', fg: '--text-secondary', bg: '--bridgio-cream', min: 4.5, use: 'Secondary copy on the page' },
  { theme: 'light', fg: '--text-secondary', bg: '--bridgio-paper', min: 4.5, use: 'Secondary copy on cards' },
  { theme: 'light', fg: '--text-muted', bg: '--bridgio-paper', min: 4.5, use: 'Caption 13 / hints' },
  { theme: 'light', fg: '--bridgio-cream', bg: '--bridgio-maroon', min: 4.5, use: 'Primary button label' },
  { theme: 'light', fg: '--bridgio-maroon', bg: '--bridgio-paper', min: 4.5, use: 'Links and ink on cards' },
  { theme: 'light', fg: '--bridgio-success', bg: '--bridgio-paper', min: 4.5, use: 'Success text' },
  { theme: 'light', fg: '--bridgio-info', bg: '--bridgio-paper', min: 4.5, use: 'Info text' },
  { theme: 'light', fg: '--bridgio-error', bg: '--bridgio-paper', min: 4.5, use: 'Error text' },
  // Dark theme
  { theme: 'dark', fg: '--text-primary', bg: '--bridgio-cream', min: 4.5, use: 'Body / headings on the page' },
  { theme: 'dark', fg: '--text-primary', bg: '--bridgio-paper', min: 4.5, use: 'Body on cards and surfaces' },
  { theme: 'dark', fg: '--text-secondary', bg: '--bridgio-cream', min: 4.5, use: 'Secondary copy on the page' },
  { theme: 'dark', fg: '--text-secondary', bg: '--bridgio-paper', min: 4.5, use: 'Secondary copy on cards' },
  { theme: 'dark', fg: '--text-muted', bg: '--bridgio-paper', min: 4.5, use: 'Caption 13 / hints' },
  { theme: 'dark', fg: '--bridgio-cream', bg: '--bridgio-maroon', min: 4.5, use: 'Primary button label' },
  { theme: 'dark', fg: '--bridgio-maroon', bg: '--bridgio-paper', min: 4.5, use: 'Links and ink on cards' },
  { theme: 'dark', fg: '--bridgio-success', bg: '--bridgio-paper', min: 4.5, use: 'Success text' },
  { theme: 'dark', fg: '--bridgio-info', bg: '--bridgio-paper', min: 4.5, use: 'Info text' },
  { theme: 'dark', fg: '--bridgio-error', bg: '--bridgio-paper', min: 4.5, use: 'Error text' },
]

const tokenRows = PAIRS.map((pair) => {
  const tokens = pair.theme === 'light' ? lightCss : darkCss
  const fg = parse(readToken(tokens, pair.fg), tokens)
  const bg = parse(readToken(tokens, pair.bg), tokens)
  const ratio = contrast(fg, bg)
  return { ...pair, ratio, pass: ratio >= pair.min }
})

// ---- Part 2: real links in the running app --------------------------------

const browser = await launch({ port: 9338 })
const linkRows = []

const probe = `(() => {
  const inline = [...document.querySelectorAll(
    '.screen-link, .page-back, .ds-breadcrumbs__link, .ds-button--textlink'
  )]
  const toRgba = (value) => {
    const probe = document.createElement('span')
    probe.style.color = value
    document.body.append(probe)
    const resolved = getComputedStyle(probe).color
    probe.remove()
    return resolved
  }
  return inline.map((el) => {
    const style = getComputedStyle(el)
    const parentStyle = getComputedStyle(el.parentElement)
    return {
      text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 48),
      selector: el.className || el.tagName.toLowerCase(),
      color: style.color,
      parentColor: parentStyle.color,
      weight: style.fontWeight,
      parentWeight: parentStyle.fontWeight,
      decoration: style.textDecorationLine,
      parentBackground: parentStyle.backgroundColor,
    }
  })
})()`

/**
 * C10 needs prose surfaces, where links sit inside sentences. The academy
 * route list has almost none, so add the shared prose screens explicitly.
 */
const C10_ROUTES = [
  ...ROUTES,
  { path: '/profile', name: 'profile' },
  { path: '/help', name: 'help' },
  { path: '/guide', name: 'guide' },
  { path: '/sign-in', name: 'sign-in' },
]

for (const route of C10_ROUTES) {
  for (const theme of ['light', 'dark']) {
    try {
      await browser.setViewport({ width: 1440, height: 1080 })
      await browser.visit({ path: route.path, lang: 'en', theme })
      const links = await browser.evaluate(probe)
      linkRows.push({ route: route.name, theme, links })
    } catch (error) {
      linkRows.push({ route: route.name, theme, error: String(error), links: [] })
    }
  }
}

browser.close()

const c10Lines = []
for (const row of linkRows) {
  if (row.error) {
    c10Lines.push(`  ERROR ${row.route} ${row.theme}: ${row.error}`)
    continue
  }
  const unique = new Map()
  for (const link of row.links) {
    const key = `${link.color}|${link.parentColor}|${link.weight}|${link.decoration}`
    if (!unique.has(key)) unique.set(key, link)
  }
  if (unique.size === 0) {
    c10Lines.push(`  ${row.route} ${row.theme}: no inline links on this surface`)
    continue
  }
  for (const link of unique.values()) {
    c10Lines.push(
      `  ${row.route} ${row.theme}: "${link.text}" ${link.selector} — ` +
        `colour ${link.color} vs surrounding ${link.parentColor}, ` +
        `weight ${link.weight} vs ${link.parentWeight}, ` +
        `decoration ${link.decoration}`,
    )
  }
}

const tokenFailures = tokenRows.filter((row) => !row.pass)
const lines = [
  'BRIDGIO LTH — contrast report (Batch 0)',
  `Token source: src/styles/tokens.css (light :root, dark :root[data-theme='dark'])`,
  `Threshold: 4.5:1 for normal text (WCAG 2.2 AA); 3:1 for large text / UI`,
  '',
  'Part 1 — token pairs',
  ...tokenRows.map(
    (row) =>
      `${row.pass ? 'PASS' : 'FAIL'}  ${row.theme.padEnd(5)} ${row.fg} on ${row.bg}  ` +
      `${row.ratio.toFixed(2)}:1 (min ${row.min})  ${row.use}`,
  ),
  '',
  `Part 1 summary: ${tokenRows.length - tokenFailures.length}/${tokenRows.length} pairs pass.`,
  '',
  'Part 2 — C10 link visibility in the running app (no underline at rest)',
  `Base URL: ${BASE}`,
  'Links are distinguished by weight and by the hover/focus underline, not by',
  'colour alone. Where colour differs from surrounding text by < 3:1 the weight',
  'step (600/700 vs 400) is the required non-colour cue (WCAG 1.4.1).',
  ...c10Lines,
  '',
]

writeFileSync(join(OUT, 'contrast-report.txt'), lines.join('\n'))
writeFileSync(
  join(OUT, 'contrast-report.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      threshold: 4.5,
      tokenPairs: tokenRows,
      c10: linkRows,
    },
    null,
    2,
  ),
)

console.log(lines.join('\n'))
process.exitCode = tokenFailures.length === 0 ? 0 : 1