/**
 * Help Center and Guide link targets.
 *
 * Article titles, bodies, steps and link labels are copy and live in
 * `src/content/strings.ts`. The URL a link id opens is code, so the map lives
 * here with the rest of the navigation metadata (`nav.ts`). The record is
 * exhaustive over `HelpLinkId`, so adding an id without a route is a compile
 * error rather than a missing button at run time.
 */

import type { HelpLinkId } from '~/content/strings'
import { defaultRoleForPath, type AppRole } from '~/shell/nav'

/** Link id → the real screen a Help or Guide link opens. */
export const linkRoutes: Record<HelpLinkId, string> = {
  profile: '/profile',
  onboarding: '/academy/onboarding',
  dashboard: '/academy',
  cohorts: '/academy/cohorts',
  roster: '/academy/cohorts',
  curriculum: '/academy/curriculum',
  rubrics: '/academy/rubrics',
  earnings: '/academy/earnings',
}

/**
 * Screens every role shares. Opening one keeps the role the visitor is already
 * in, so the sidebar does not flip under them; a role-specific screen carries
 * its own area role instead (`defaultRoleForPath`).
 */
const sharedRoutes: ReadonlySet<string> = new Set(['/profile'])

/** The `?as` preview role a Help or Guide link carries. */
export function linkSearchRole(to: string, currentRole: AppRole): AppRole {
  return sharedRoutes.has(to) ? currentRole : defaultRoleForPath(to)
}
