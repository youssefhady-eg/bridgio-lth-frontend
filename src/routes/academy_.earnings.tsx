import { createFileRoute } from '@tanstack/react-router'
import { earningsLedgerQueryOptions } from '~/api/queries'
import { EarningsScreen } from '~/components/academy/EarningsScreen'
import { stringsFor } from '~/shell/useStrings'

/**
 * Screen 17 — earnings and escrow ledger at `/academy/earnings`.
 *
 * Every amount is provisional; the screen states that before the figures.
 */
export const Route = createFileRoute('/academy_/earnings')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).earnings.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(earningsLedgerQueryOptions())
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: EarningsScreen,
})
