import { createFileRoute } from '@tanstack/react-router'
import { rubricListQueryOptions } from '~/api/queries'
import { RubricListScreen } from '~/components/academy/RubricScreen'
import { stringsFor } from '~/shell/useStrings'

/** Screen 16 — grading rubric list at `/academy/rubrics`. */
export const Route = createFileRoute('/academy_/rubrics')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).rubric.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(rubricListQueryOptions())
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: RubricListScreen,
})
