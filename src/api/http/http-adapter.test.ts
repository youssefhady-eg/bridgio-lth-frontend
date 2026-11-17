import { describe, expect, it } from 'vitest'
import type { BridgioApi } from '../contract'
import { ApiError } from '../errors'
import { createMockApi } from '../mock/mock-adapter'
import { createHttpApi } from './http-adapter'

const BASE_URL = 'https://api.example.test/api/v1'

type Call = { url: string; init: RequestInit | undefined }

function fakeFetch(handler?: (call: Call) => Response): {
  fetchImpl: typeof fetch
  calls: Call[]
} {
  const calls: Call[] = []
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const call = {
      url: input instanceof Request ? input.url : String(input),
      init,
    }
    calls.push(call)
    if (handler) return handler(call)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }) as typeof fetch
  return { fetchImpl, calls }
}

function methodPaths(api: BridgioApi): string[] {
  const paths: string[] = []
  for (const [namespace, value] of Object.entries(api)) {
    if (typeof value !== 'object' || value === null) continue
    for (const [name, member] of Object.entries(value)) {
      if (typeof member === 'function') paths.push(`${namespace}.${name}`)
    }
  }
  return paths.sort()
}

function adapter(fetchImpl: typeof fetch) {
  return createHttpApi({
    baseUrl: BASE_URL,
    requestTimeoutMs: 1_000,
    fetchImpl,
  })
}

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}

describe('http adapter — interface parity', () => {
  it('implements the same method names as the mock adapter', () => {
    const { fetchImpl } = fakeFetch()
    const http = createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      fetchImpl,
    })
    const mock = createMockApi({ latencyMs: 0 })
    expect(methodPaths(http)).toEqual(methodPaths(mock))
    expect(http.mode).toBe('http')
  })

  it('reports the same PROPOSED status as the mock adapter', async () => {
    const { fetchImpl } = fakeFetch()
    const info = await createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      fetchImpl,
    }).system.getInfo()
    expect(info).toMatchObject({
      mode: 'http',
      endpointStatus: 'PROPOSED',
      mockScenario: null,
    })
  })
})

describe('http adapter — request construction', () => {
  it('builds a PROPOSED path, attaches the optional bearer token and parses JSON', async () => {
    const { fetchImpl, calls } = fakeFetch(() => json({ id: 'acad_demo' }))
    const http = createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      getAccessToken: () => 'demo-token',
      fetchImpl,
    })

    const result = await http.academies.get()
    expect(result).toEqual({ id: 'acad_demo' })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toBe(`${BASE_URL}/academies/current`)
    expect(calls[0]?.init?.method).toBe('GET')
    expect(
      (calls[0]?.init?.headers as Record<string, string>).Authorization,
    ).toBe('Bearer demo-token')
  })

  it('encodes path ids and serialises JSON bodies', async () => {
    const { fetchImpl, calls } = fakeFetch(() =>
      json({ id: 'coh_1', localizations: [] }),
    )
    const http = adapter(fetchImpl)

    await http.languages.listLevels({ languageId: 'lang de/1' })
    expect(calls[0]?.url).toBe(
      `${BASE_URL}/languages/lang%20de%2F1/levels`,
    )

    await http.cohorts.get({ cohortId: 'coh 1' })
    expect(calls[1]?.url).toBe(`${BASE_URL}/cohorts/coh%201`)

    await http.messages.sendMessage({
      threadId: 'thr_1',
      body: 'Hello',
    })
    expect(calls[2]?.init?.method).toBe('POST')
    expect(calls[2]?.url).toBe(`${BASE_URL}/messages/threads/thr_1/messages`)
    expect(JSON.parse(String(calls[2]?.init?.body))).toEqual({
      body: 'Hello',
    })
  })

  it('returns undefined for 204 responses', async () => {
    const { fetchImpl } = fakeFetch(() => new Response(null, { status: 204 }))
    await expect(adapter(fetchImpl).auth.signOut()).resolves.toBeUndefined()
  })
})

describe('http adapter — academy and cohort routes', () => {
  it('reads the academy dashboard and onboarding from the proposal', async () => {
    const { fetchImpl, calls } = fakeFetch(() => json({}))
    const http = adapter(fetchImpl)

    await http.academies.getDashboard()
    await http.academies.getOnboarding()
    await http.academies.completeOnboardingStep({
      academyId: 'acad_demo',
      stepId: 'sample_lesson',
    })

    expect(calls.map((call) => [call.init?.method, call.url])).toEqual([
      ['GET', `${BASE_URL}/academies/current/dashboard`],
      ['GET', `${BASE_URL}/academies/current/onboarding`],
      [
        'POST',
        `${BASE_URL}/academies/current/onboarding/steps/sample_lesson/complete`,
      ],
    ])
  })

  it('creates and publishes a cohort through the proposal', async () => {
    const { fetchImpl, calls } = fakeFetch(() => json({ id: 'coh_1' }))
    const http = adapter(fetchImpl)
    const input = {
      languageId: 'lang_de',
      levelId: 'lvl_a2',
      label: 'German A2 — Evening',
      schedule: 'Sun & Tue · 18:00–19:30',
      capacity: 18,
      instructorId: 'usr_instructor',
      startDate: '2027-01-10',
      endDate: '2027-04-10',
    }

    await http.cohorts.create(input)
    await http.cohorts.publish({ cohortId: 'coh_1' })

    expect(calls[0]?.init?.method).toBe('POST')
    expect(calls[0]?.url).toBe(`${BASE_URL}/cohorts`)
    expect(JSON.parse(String(calls[0]?.init?.body))).toEqual(input)
    expect(calls[1]?.url).toBe(`${BASE_URL}/cohorts/coh_1/publish`)
  })

  it('reads and writes one session attendance sheet on the same path', async () => {
    const { fetchImpl, calls } = fakeFetch(() => json({ records: [] }))
    const http = adapter(fetchImpl)
    const records = [{ learnerId: 'usr_learner_01', status: 'present' as const }]

    await http.cohorts.getAttendanceSheet({
      cohortId: 'coh_1',
      sessionId: 'sess_1',
    })
    await http.cohorts.markAttendance({
      cohortId: 'coh_1',
      sessionId: 'sess_1',
      records,
    })

    const path = `${BASE_URL}/cohorts/coh_1/sessions/sess_1/attendance`
    expect(calls[0]?.init?.method).toBe('GET')
    expect(calls[0]?.url).toBe(path)
    expect(calls[1]?.init?.method).toBe('PUT')
    expect(calls[1]?.url).toBe(path)
    expect(JSON.parse(String(calls[1]?.init?.body))).toEqual({ records })
  })
})

describe('http adapter — curriculum and rubric routes', () => {
  it('sends units and lessons under their curriculum and unit', async () => {
    const { fetchImpl, calls } = fakeFetch(() => json({ id: 'cur_1' }))
    const http = adapter(fetchImpl)

    await http.curricula.addUnit({
      curriculumId: 'cur_1',
      title: 'Starting a shift',
      objective: 'Hand over a shift.',
    })
    await http.curricula.addLesson({
      curriculumId: 'cur_1',
      unitId: 'unit_1',
      title: 'Schichtübergabe',
      objective: 'Hand over clearly.',
      durationMinutes: 45,
      contentLanguageId: 'lang_de',
      kind: 'lesson',
    })
    await http.curricula.draftOutline({
      curriculumId: 'cur_1',
      unitTitle: 'Handling a complaint',
      lessonCount: 3,
    })

    expect(calls[0]?.url).toBe(`${BASE_URL}/curricula/cur_1/units`)
    expect(calls[1]?.url).toBe(
      `${BASE_URL}/curricula/cur_1/units/unit_1/lessons`,
    )
    expect(JSON.parse(String(calls[1]?.init?.body))).toMatchObject({
      durationMinutes: 45,
      contentLanguageId: 'lang_de',
      kind: 'lesson',
    })
    expect(calls[2]?.url).toBe(
      `${BASE_URL}/curricula/cur_1/draft-outline`,
    )
    expect(JSON.parse(String(calls[2]?.init?.body))).toEqual({
      unitTitle: 'Handling a complaint',
      lessonCount: 3,
    })
  })

  it('patches one rubric dimension and posts the publish action', async () => {
    const { fetchImpl, calls } = fakeFetch(() => json({ id: 'rub_1' }))
    const http = adapter(fetchImpl)
    const descriptors = [
      { band: 1, label: 'Emerging', descriptor: 'Hard to follow.' },
    ]

    await http.rubrics.updateDimension({
      rubricId: 'rub_1',
      dimensionId: 'dim_1',
      weightPercent: 20,
      descriptors,
    })
    await http.rubrics.publish({ rubricId: 'rub_1' })

    expect(calls[0]?.init?.method).toBe('PATCH')
    expect(calls[0]?.url).toBe(
      `${BASE_URL}/rubrics/rub_1/dimensions/dim_1`,
    )
    expect(JSON.parse(String(calls[0]?.init?.body))).toEqual({
      weightPercent: 20,
      descriptors,
    })
    expect(calls[1]?.url).toBe(`${BASE_URL}/rubrics/rub_1/publish`)
  })
})

describe('http adapter — earnings ledger', () => {
  it('reads the provisional ledger from the proposal', async () => {
    const { fetchImpl, calls } = fakeFetch(() => json({ entries: [] }))
    const ledger = await adapter(fetchImpl).earnings.getLedger()
    expect(ledger).toEqual({ entries: [] })
    expect(calls[0]?.init?.method).toBe('GET')
    expect(calls[0]?.url).toBe(`${BASE_URL}/earnings/ledger`)
  })
})

describe('http adapter — getSession null handling', () => {
  it('returns null, not undefined, for a 204 response', async () => {
    const { fetchImpl } = fakeFetch(() => new Response(null, { status: 204 }))
    const session = await adapter(fetchImpl).auth.getSession()
    expect(session).toBeNull()
    expect(session).not.toBeUndefined()
  })

  it('returns null for a 200 response with an empty body', async () => {
    const { fetchImpl } = fakeFetch(() => new Response('', { status: 200 }))
    await expect(adapter(fetchImpl).auth.getSession()).resolves.toBeNull()
  })

  it('returns null for a 200 response with a JSON null body', async () => {
    const { fetchImpl } = fakeFetch(
      () =>
        new Response('null', {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
    )
    await expect(adapter(fetchImpl).auth.getSession()).resolves.toBeNull()
  })

  it('still returns the session when the backend sends one', async () => {
    const payload = { user: { id: 'usr_1', role: 'academy_owner' } }
    const { fetchImpl } = fakeFetch(() => json(payload))
    await expect(adapter(fetchImpl).auth.getSession()).resolves.toEqual(
      payload,
    )
  })

  it('leaves void methods such as signOut resolving undefined, not null', async () => {
    const { fetchImpl } = fakeFetch(() => new Response(null, { status: 204 }))
    const result = await adapter(fetchImpl).auth.signOut()
    expect(result).toBeUndefined()
  })
})

describe('http adapter — errors', () => {
  it('maps backend errors to ApiError with the shared code', async () => {
    const { fetchImpl } = fakeFetch(() =>
      new Response(
        JSON.stringify({ code: 'NOT_FOUND', message: 'Cohort not found.' }),
        {
          status: 404,
          headers: { 'content-type': 'application/json' },
        },
      ),
    )

    const error = await adapter(fetchImpl)
      .cohorts.get({ cohortId: 'missing' })
      .catch((value) => value)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      code: 'NOT_FOUND',
      status: 404,
      message: 'Cohort not found.',
    })
  })

  it('maps a network failure to ApiError NETWORK', async () => {
    const fetchImpl = (async () => {
      throw new TypeError('offline')
    }) as typeof fetch

    const error = await adapter(fetchImpl)
      .auth.getSession()
      .catch((value) => value)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'NETWORK' })
  })
})
