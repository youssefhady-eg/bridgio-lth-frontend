import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * Role home — the shell opens on the academy dashboard.
 *
 * `/academy/*` is the only area in Batch 1; the instructor role is a preview
 * switch (`?as=instructor`) over the same routes, not a separate area. The home
 * route never renders a screen of its own.
 */
export const Route = createFileRoute('/')({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/academy',
      search: { as: search.as, lang: search.lang },
    })
  },
})
