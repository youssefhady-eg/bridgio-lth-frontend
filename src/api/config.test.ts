import { describe, expect, it } from 'vitest'
import { createApiConfig } from './config'

function env(values: Record<string, string>): ImportMetaEnv {
  return values as unknown as ImportMetaEnv
}

describe('API config', () => {
  it('defaults to the mock adapter, seeded demo data and an academy session', () => {
    const config = createApiConfig(env({}))
    expect(config.mode).toBe('mock')
    expect(config.baseUrl).toBe('http://localhost:3001/api/v1')
    expect(config.mock.scenario).toBe('seeded')
    expect(config.mock.session).toBe('academy')
    expect(config.requestTimeoutMs).toBe(15_000)
  })

  it('switches to HTTP by configuration only and normalises the URL', () => {
    const config = createApiConfig(
      env({
        VITE_API_ADAPTER: 'http',
        VITE_API_URL: 'https://mentingo.example.test/api/v1///',
        VITE_API_TIMEOUT_MS: '9000',
      }),
    )
    expect(config.mode).toBe('http')
    expect(config.baseUrl).toBe('https://mentingo.example.test/api/v1')
    expect(config.requestTimeoutMs).toBe(9_000)
  })

  it('rejects an unknown adapter mode instead of silently falling back', () => {
    expect(() => createApiConfig(env({ VITE_API_ADAPTER: 'mentingo' }))).toThrow(
      /VITE_API_ADAPTER/,
    )
  })

  it('supports the empty mock scenario and both preview sessions', () => {
    const instructor = createApiConfig(
      env({
        VITE_MOCK_SCENARIO: 'empty',
        VITE_MOCK_SESSION: 'instructor',
      }),
    )
    expect(instructor.mock.scenario).toBe('empty')
    expect(instructor.mock.session).toBe('instructor')

    expect(
      createApiConfig(env({ VITE_MOCK_SESSION: 'none' })).mock.session,
    ).toBe('none')
  })

  it('accepts the legacy hosted "teacher" value as the academy alias', () => {
    // Hosted preview builds baked VITE_MOCK_SESSION=teacher before the LTH
    // rename. The old value must keep working so a rebuild is not required.
    const config = createApiConfig(env({ VITE_MOCK_SESSION: 'teacher' }))
    expect(config.mock.session).toBe('academy')
  })

  it('rejects a role that does not exist in this build', () => {
    expect(() =>
      createApiConfig(env({ VITE_MOCK_SESSION: 'student' })),
    ).toThrow(/VITE_MOCK_SESSION/)
  })

  it('falls back to safe numbers for a bad timeout', () => {
    expect(
      createApiConfig(env({ VITE_API_TIMEOUT_MS: 'not-a-number' }))
        .requestTimeoutMs,
    ).toBe(15_000)
    expect(
      createApiConfig(env({ VITE_API_TIMEOUT_MS: '-5' })).requestTimeoutMs,
    ).toBe(15_000)
  })

  it('treats a blank adapter value as the mock default', () => {
    const config = createApiConfig(
      env({ VITE_API_ADAPTER: '', VITE_API_URL: '', VITE_MOCK_SESSION: '' }),
    )
    expect(config.mode).toBe('mock')
    expect(config.baseUrl).toBe('http://localhost:3001/api/v1')
    expect(config.mock.session).toBe('academy')
  })
})
