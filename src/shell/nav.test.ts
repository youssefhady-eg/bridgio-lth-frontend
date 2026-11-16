import { describe, expect, it } from 'vitest'
import {
  academyNav,
  appRoles,
  defaultRoleForPath,
  hrefWithRole,
  instructorNav,
  isNavItemActive,
  navFor,
  parseAppRole,
} from './nav'

describe('shell nav', () => {
  it('academy nav is Dashboard, Onboarding, Cohorts, Curriculum, Rubrics, Earnings — in that order', () => {
    expect(academyNav.map((item) => item.id)).toEqual([
      'academy-dashboard',
      'academy-onboarding',
      'academy-cohorts',
      'academy-curriculum',
      'academy-rubrics',
      'academy-earnings',
    ])
    expect(academyNav.map((item) => item.to)).toEqual([
      '/academy',
      '/academy/onboarding',
      '/academy/cohorts',
      '/academy/curriculum',
      '/academy/rubrics',
      '/academy/earnings',
    ])
  })

  it('instructor nav is the assigned-work subset, in canonical order', () => {
    expect(instructorNav.map((item) => item.id)).toEqual([
      'academy-dashboard',
      'academy-cohorts',
      'academy-curriculum',
      'academy-rubrics',
    ])
    // No partner onboarding and no earnings ledger for an instructor.
    expect(instructorNav.map((item) => item.id)).not.toContain(
      'academy-onboarding',
    )
    expect(instructorNav.map((item) => item.id)).not.toContain(
      'academy-earnings',
    )
  })

  it('selects the nav set by role', () => {
    expect(navFor('academy')).toBe(academyNav)
    expect(navFor('instructor')).toBe(instructorNav)
  })

  it('has exactly the two LTH preview roles', () => {
    expect(appRoles).toEqual(['academy', 'instructor'])
    expect(parseAppRole('academy')).toBe('academy')
    expect(parseAppRole('instructor')).toBe('instructor')
  })

  it('rejects roles that do not exist in LTH', () => {
    expect(parseAppRole('teacher')).toBeUndefined()
    expect(parseAppRole('student')).toBeUndefined()
    expect(parseAppRole('parent')).toBeUndefined()
    expect(parseAppRole('assistant')).toBeUndefined()
    expect(parseAppRole(null)).toBeUndefined()
  })

  it('defaults to the academy area for every LTH path', () => {
    expect(defaultRoleForPath('/academy')).toBe('academy')
    expect(defaultRoleForPath('/academy/cohorts')).toBe('academy')
    expect(defaultRoleForPath('/academy/cohorts/coh_1')).toBe('academy')
    expect(defaultRoleForPath('/profile')).toBe('academy')
    expect(defaultRoleForPath('/')).toBe('academy')
    expect(defaultRoleForPath('/does-not-exist')).toBe('academy')
  })

  it('previews the instructor rail only on an explicit /instructor path', () => {
    expect(defaultRoleForPath('/instructor')).toBe('instructor')
    expect(defaultRoleForPath('/instructor/cohorts')).toBe('instructor')
    // A path that only shares the first letters is not the instructor area.
    expect(defaultRoleForPath('/instructors-archive')).toBe('academy')
  })

  it('every academy nav destination opens in the academy role', () => {
    for (const item of academyNav) {
      expect(defaultRoleForPath(item.to)).toBe('academy')
    }
  })

  it('every instructor destination also exists in the full academy nav', () => {
    const destinations = academyNav.map((item) => item.to)
    for (const item of instructorNav) {
      expect(destinations).toContain(item.to)
    }
  })

  it('highlights only the dashboard on the dashboard route', () => {
    const dashboard = academyNav[0] as (typeof academyNav)[number]
    const cohorts = academyNav[2] as (typeof academyNav)[number]
    expect(isNavItemActive('/academy', dashboard)).toBe(true)
    expect(isNavItemActive('/academy/curriculum/cur_1', dashboard)).toBe(false)
    expect(isNavItemActive('/academy/curriculum/cur_1', cohorts)).toBe(false)
    expect(isNavItemActive('/academy/cohorts/coh_1', cohorts)).toBe(true)
    expect(isNavItemActive('/academy/cohorts', cohorts)).toBe(true)
  })
  it('hrefWithRole keeps the path and other params, sets the role', () => {
    expect(hrefWithRole('/academy/cohorts', '', 'instructor')).toBe(
      '/academy/cohorts?as=instructor',
    )
    expect(hrefWithRole('/academy', '?lang=en&as=academy', 'instructor')).toBe(
      '/academy?lang=en&as=instructor',
    )
    expect(hrefWithRole('/profile', '?as=instructor', 'academy')).toBe(
      '/profile?as=academy',
    )
    expect(hrefWithRole('/', '?x=1', 'academy')).toBe('/?x=1&as=academy')
  })
})
