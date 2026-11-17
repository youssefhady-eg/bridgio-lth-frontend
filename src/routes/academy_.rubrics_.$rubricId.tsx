import { createFileRoute } from '@tanstack/react-router'
import { rubricQueryOptions } from '~/api/queries'
import { RubricScreen } from '~/components/academy/RubricScreen'
import { stringsFor } from '~/shell/useStrings'

/** Screen 16 — grading rubric detail at `/academy/rubrics/$rubricId`. */
export const Route = createFileRoute('/academy_/rubrics_/$rubricId')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).rubric.headTitle }],
  }),
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(
        rubricQueryOptions(params.rubricId),
      )
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: RubricRoute,
})

function RubricRoute() {
  const { rubricId } = Route.useParams()
  return <RubricScreen rubricId={rubricId} />
}
