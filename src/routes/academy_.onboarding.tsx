import { createFileRoute } from '@tanstack/react-router'
import { academyOnboardingQueryOptions } from '~/api/queries'
import { OnboardingScreen } from '~/components/academy/OnboardingScreen'
import { stringsFor } from '~/shell/useStrings'

/**
 * Screen 11 — partner onboarding and calibration at `/academy/onboarding`.
 *
 * Non-nested on purpose: the dashboard route owns `/academy` and must not
 * render behind a child screen.
 */
export const Route = createFileRoute('/academy_/onboarding')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).onboarding.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(academyOnboardingQueryOptions())
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: OnboardingScreen,
})
