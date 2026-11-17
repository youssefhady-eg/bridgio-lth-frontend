import { Link } from '@tanstack/react-router'
import { PageHero } from '~/components/shared/PageHero'
import { useLang } from '~/shell/useStrings'
import { useStrings } from '~/shell/useStrings'

const ROLE_KEYS = ['academy', 'instructor', 'learner', 'assessor', 'desk'] as const

export function SignInView() {
  const strings = useStrings()
  const lang = useLang()
  const copy = strings.auth

  const roleLabel = (key: (typeof ROLE_KEYS)[number]) => {
    switch (key) {
      case 'academy':
        return copy.academyRole
      case 'instructor':
        return copy.instructorRole
      case 'learner':
        return copy.learnerRole
      case 'assessor':
        return copy.assessorRole
      case 'desk':
        return copy.deskRole
    }
  }

  const enabled = (key: (typeof ROLE_KEYS)[number]) =>
    key === 'academy' || key === 'instructor'

  return (
    <div className="auth-card">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />

      <ul className="signin-roles" aria-label={copy.badge}>
        {ROLE_KEYS.map((key) => (
          <li key={key}>
            {enabled(key) ? (
              <Link
                to="/academy"
                search={{
                  as: key === 'instructor' ? 'instructor' : 'academy',
                  lang,
                }}
                className="signin-role signin-role--enabled"
              >
                <span className="signin-role__label">{roleLabel(key)}</span>
                <span className="signin-role__hint">{copy.enterPreview}</span>
              </Link>
            ) : (
              <div className="signin-role signin-role--disabled" aria-disabled="true">
                <span className="signin-role__label">{roleLabel(key)}</span>
                <span className="signin-role__hint">{copy.landsLater}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Link
        to="/academy"
        search={{ as: 'academy', lang, guest: '1' }}
        className="button button--secondary signin-guest"
      >
        {copy.guestButton}
      </Link>

      <p className="finish-note" role="status">
        {copy.status}
      </p>
    </div>
  )
}