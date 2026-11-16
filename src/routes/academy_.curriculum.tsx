import { createFileRoute } from '@tanstack/react-router'
import { curriculumListQueryOptions } from '~/api/queries'
import { CurriculumListScreen } from '~/components/academy/CurriculumListScreen'
import { stringsFor } from '~/shell/useStrings'

/** Screen 15 — curriculum list at `/academy/curriculum`. */
export const Route = createFileRoute('/academy_/curriculum')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).curriculum.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(curriculumListQueryOptions())
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: CurriculumListScreen,
})
