import { createFileRoute } from '@tanstack/react-router'
import { academyDashboardQueryOptions } from '~/api/queries'
import { AcademyDashboardScreen } from '~/components/academy/AcademyDashboardScreen'
import { stringsFor } from '~/shell/useStrings'

/**
 * Screen 12 — academy dashboard at `/academy`.
 *
 * The loader prefetches the dashboard aggregate (PROPOSED) so the SSR render
 * already contains the totals, sessions and alerts. A failed prefetch is
 * swallowed on purpose: the screen renders its own error note from the query
 * status instead of the framework's default English error screen.
 */
export const Route = createFileRoute('/academy')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).dashboard.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(academyDashboardQueryOptions())
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: AcademyDashboardScreen,
})
