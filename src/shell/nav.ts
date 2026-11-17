/**
 * Role-aware navigation config — BRIDGIO Learn-to-Hire.
 *
 * Nav sets:
 *   academy    : Dashboard, Onboarding, Cohorts, Curriculum, Grading rubrics,
 *                Earnings
 *   instructor : Dashboard, Cohorts, Curriculum, Grading rubrics
 *
 * The preview role (`?as=academy|instructor`) is UI state only — a diagnostic
 * so every screen can be checked on the hosted build before Mentingo auth
 * exists. It is NOT an auth system, and no identity is displayed.
 */

export type AppRole = 'academy' | 'instructor'

export const appRoles: readonly AppRole[] = ['academy', 'instructor'] as const

/** The academy nav destinations (never the shell home). */
export type NavScreenId =
  | 'academy-dashboard'
  | 'academy-onboarding'
  | 'academy-cohorts'
  | 'academy-curriculum'
  | 'academy-rubrics'
  | 'academy-earnings'

export interface NavRoute {
  id: NavScreenId
  /** Route opened by this nav item. */
  to: string
}

export const academyNav: readonly NavRoute[] = [
  { id: 'academy-dashboard', to: '/academy' },
  { id: 'academy-onboarding', to: '/academy/onboarding' },
  { id: 'academy-cohorts', to: '/academy/cohorts' },
  { id: 'academy-curriculum', to: '/academy/curriculum' },
  { id: 'academy-rubrics', to: '/academy/rubrics' },
  { id: 'academy-earnings', to: '/academy/earnings' },
] as const

/** An instructor does not see partner onboarding or the earnings ledger. */
export const instructorNav: readonly NavRoute[] = [
  { id: 'academy-dashboard', to: '/academy' },
  { id: 'academy-cohorts', to: '/academy/cohorts' },
  { id: 'academy-curriculum', to: '/academy/curriculum' },
  { id: 'academy-rubrics', to: '/academy/rubrics' },
] as const

/** Nav set for a role. */
export function navFor(role: AppRole): readonly NavRoute[] {
  return role === 'instructor' ? instructorNav : academyNav
}

/**
 * Active state for one nav row.
 *
 * A detail screen keeps its section highlighted (`/academy/cohorts/x` is still
 * the cohorts area). The dashboard is the exception: it sits at the academy
 * root, so it matches that exact path only — otherwise every child screen would
 * highlight Dashboard and its own section at once.
 */
export function isNavItemActive(pathname: string, item: NavRoute): boolean {
  if (item.id === 'academy-dashboard') return pathname === item.to
  return pathname === item.to || pathname.startsWith(`${item.to}/`)
}

/**
 * Role implied by the route area when no `?as` is given. `/academy/*` is the
 * academy area; an `/instructor/*` path previews the instructor rail. Everything
 * else keeps the academy default so a shared screen (profile, Help, Guide) does
 * not flip the sidebar.
 */
export function defaultRoleForPath(pathname: string): AppRole {
  if (pathname === '/instructor' || pathname.startsWith('/instructor/')) {
    return 'instructor'
  }
  return 'academy'
}

/** Safe parse of the `?as` preview-role search param. */
export function parseAppRole(value: unknown): AppRole | undefined {
  return value === 'academy' || value === 'instructor' ? value : undefined
}

/**
 * href for the preview-role switch that preserves the current path and the
 * other params (including the language), so the role can be toggled while
 * staying on the same page.
 */
export function hrefWithRole(
  pathname: string,
  search: string,
  role: AppRole,
): string {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  )
  params.set('as', role)
  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}
