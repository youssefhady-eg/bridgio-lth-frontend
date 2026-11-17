/**
 * Shared Edge CDP harness for the Batch 0 gate scripts.
 *
 * The repo deliberately carries no browser dependency (no Playwright, no
 * Puppeteer): the gate runs against the locally installed Edge through the
 * DevTools protocol, exactly like the screenshot harness used for Batch 1.
 */
import { spawn, spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

export const EDGE =
  process.env.GATE_BROWSER ??
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

export const BASE = process.env.GATE_BASE ?? 'http://localhost:3000'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function launch({ port = 9333 } = {}) {
  const profile = join(tmpdir(), `lth-gate-profile-${Date.now()}-${port}`)
  const child = spawn(
    EDGE,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      'about:blank',
    ],
    { stdio: 'ignore' },
  )

  let browserWsUrl
  for (let i = 0; i < 150; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (res.ok) {
        browserWsUrl = (await res.json()).webSocketDebuggerUrl
        break
      }
    } catch {
      /* retry */
    }
    await sleep(200)
  }
  if (!browserWsUrl) throw new Error('Edge debugging endpoint never came up')

  const ws = new WebSocket(browserWsUrl)
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })

  let nextId = 0
  let sessionId = null
  const pending = new Map()
  const events = []

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(
      typeof event.data === 'string' ? event.data : String(event.data),
    )
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(msg.error.message))
      else resolve(msg.result)
      return
    }
    events.push(msg)
  })

  function send(method, params = {}, withSession = false) {
    return new Promise((resolve, reject) => {
      const id = ++nextId
      pending.set(id, { resolve, reject })
      ws.send(
        JSON.stringify({
          id,
          method,
          params,
          ...(withSession ? { sessionId } : {}),
        }),
      )
    })
  }

  const { targetInfos } = await send('Target.getTargets')
  const pageTarget = targetInfos.find((target) => target.type === 'page')
  const attached = await send('Target.attachToTarget', {
    targetId: pageTarget.targetId,
    flatten: true,
  })
  sessionId = attached.sessionId

  const page = (method, params = {}) => send(method, params, true)

  await page('Page.enable')
  await page('Runtime.enable')
  await page('Emulation.setScrollbarsHidden', { hidden: true }).catch(() => {})

  async function waitLoad() {
    for (let i = 0; i < 300; i += 1) {
      const { result } = await page('Runtime.evaluate', {
        expression: 'document.readyState',
        returnByValue: true,
      })
      if (result.value === 'complete') return
      await sleep(100)
    }
    throw new Error('page never finished loading')
  }

  async function evaluate(expression) {
    const { result, exceptionDetails } = await page('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (exceptionDetails) {
      throw new Error(
        exceptionDetails.exception?.description ?? exceptionDetails.text,
      )
    }
    return result.value
  }

  async function setViewport({ width, height = 1080, mobile = width < 500 }) {
    await page('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
    })
  }

  /**
   * Wait until an element's width stops changing. The sidebar folds with a
   * 250 ms width transition that starts after hydration, so a fixed sleep can
   * measure (and screenshot) the rail mid-animation.
   */
  async function waitForStableWidth(selector, { tries = 40 } = {}) {
    let previous = null
    let stable = 0
    for (let i = 0; i < tries; i += 1) {
      const width = await evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)})
        return el ? Math.round(el.getBoundingClientRect().width * 100) / 100 : null
      })()`)
      if (width !== null && width === previous) {
        stable += 1
        if (stable >= 3) return width
      } else {
        stable = 0
      }
      previous = width
      await sleep(120)
    }
    return previous
  }

  /**
   * Navigate and settle. Theme and language are applied through the same URL
   * parameters and storage keys the app itself uses, so the captured state is
   * a real user state, not an injected override.
   */
  async function visit({ path, lang = 'en', theme = 'light', wait = 700 }) {
    events.length = 0
    const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}lang=${lang}&as=academy`
    await page('Page.navigate', { url })
    await waitLoad()
    await page('Runtime.evaluate', {
      expression: `localStorage.setItem('bridgio-theme', '${theme}')`,
    })
    await page('Page.reload')
    await waitLoad()
    await sleep(wait)
    return { url, events }
  }

  function consoleErrors() {
    return events
      .filter(
        (event) =>
          (event.method === 'Runtime.consoleAPICalled' &&
            event.params.type === 'error') ||
          event.method === 'Runtime.exceptionThrown',
      )
      .map((event) =>
        event.method === 'Runtime.exceptionThrown'
          ? event.params.exceptionDetails.text
          : (event.params.args ?? [])
              .map((arg) => arg.value ?? arg.description ?? '')
              .join(' '),
      )
  }

  async function screenshot({ width, height = 1080, fullPage = true }) {
    const info = await evaluate(`(() => ({
      height: document.documentElement.scrollHeight,
      width: document.documentElement.scrollWidth,
    }))()`)
    const shotHeight = fullPage ? Math.max(info.height, height) : height
    const { data } = await page('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width, height: shotHeight, scale: 1 },
    })
    return Buffer.from(data, 'base64')
  }

  function close() {
    try {
      ws.close()
    } catch {
      /* ignore */
    }
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
      stdio: 'ignore',
    })
  }

  return { page, evaluate, waitLoad, waitForStableWidth, setViewport, visit, consoleErrors, screenshot, close, sleep }
}