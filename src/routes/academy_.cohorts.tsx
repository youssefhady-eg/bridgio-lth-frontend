import { createFileRoute } from '@tanstack/react-router'
import { cohortListQueryOptions } from '~/api/queries'
import { CohortsScreen } from '~/components/academy/CohortsScreen'
import { stringsFor } from '~/shell/useStrings'

/** Screen 13 — cohort builder and seat publisher at `/academy/cohorts`. */
export const Route = createFileRoute('/academy_/cohorts')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).cohorts.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(cohortListQueryOptions())
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: CohortsScreen,
})
