import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/shared/PageHero'
import { useStrings } from '~/shell/useStrings'

export const Route = createFileRoute('/search')({
  component: SearchView,
})

function SearchView() {
  const strings = useStrings()
  return (
    <div className="dashboard">
      <PageHero badge={strings.header.searchLabel} title={strings.header.searchLabel} lead="" />
      <p className="academy-muted">Search is not connected in this preview.</p>
    </div>
  )
}