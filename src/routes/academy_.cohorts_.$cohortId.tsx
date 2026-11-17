import { createFileRoute } from '@tanstack/react-router'
import { cohortRosterQueryOptions } from '~/api/queries'
import { RosterScreen } from '~/components/academy/RosterScreen'
import { stringsFor } from '~/shell/useStrings'

/**
 * Screen 14 — roster and attendance at `/academy/cohorts/$cohortId`.
 *
 * The attendance sheet is loaded by the screen after it picks a session; the
 * loader only prefetches the roster so the page has its cohort data on SSR.
 */
export const Route = createFileRoute('/academy_/cohorts_/$cohortId')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).roster.headTitle }],
  }),
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(
        cohortRosterQueryOptions(params.cohortId),
      )
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: RosterRoute,
})

function RosterRoute() {
  const { cohortId } = Route.useParams()
  return <RosterScreen cohortId={cohortId} />
}
