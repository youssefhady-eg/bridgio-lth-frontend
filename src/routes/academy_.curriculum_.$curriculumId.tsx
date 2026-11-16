import { createFileRoute } from '@tanstack/react-router'
import { curriculumQueryOptions } from '~/api/queries'
import { CurriculumBuilderScreen } from '~/components/academy/CurriculumBuilderScreen'
import { stringsFor } from '~/shell/useStrings'

/** Screen 15 — curriculum and lesson builder at `/academy/curriculum/$curriculumId`. */
export const Route = createFileRoute('/academy_/curriculum_/$curriculumId')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).curriculum.headTitle }],
  }),
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(
        curriculumQueryOptions(params.curriculumId),
      )
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: CurriculumBuilderRoute,
})

function CurriculumBuilderRoute() {
  const { curriculumId } = Route.useParams()
  return <CurriculumBuilderScreen curriculumId={curriculumId} />
}
