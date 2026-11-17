import { Link } from '@tanstack/react-router'
import { PageHero } from '~/components/shared/PageHero'
import { useLang } from '~/shell/useStrings'
import { useStrings } from '~/shell/useStrings'

const ROLES = [
  { key: 'academy', label: 'Academy', to: '/academy', as: 'academy', enabled: true },
  { key: 'instructor', label: 'Instructor', to: '/academy', as: 'instructor', enabled: true },
  { key: 'learner', label: 'Learner', to: null, as: null, enabled: false },
  { key: 'assessor', label: 'Assessor', to: null, as: null, enabled: false },
  { key: 'desk', label: 'Desk', to: null, as: null, enabled: false },
] as const

export function SignInView() {
  const strings = useStrings()
  const lang = useLang()
  const copy = strings.auth

  return (
    <div className="auth-card">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />

      <ul className="signin-roles" aria-label={copy.badge}>
        {ROLES.map((role) => (
          <li key={role.key}>
            {role.enabled ? (
              <Link
                to={role.to!}
                search={{ as: role.as!, lang }}
                className="signin-role signin-role--enabled"
              >
                <span className="signin-role__label">{role.label}</span>
                <span className="signin-role__hint">Enter preview</span>
              </Link>
            ) : (
              <div className="signin-role signin-role--disabled" aria-disabled="true">
                <span className="signin-role__label">{role.label}</span>
                <span className="signin-role__hint">Lands in a later wave</span>
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
        Continue as a guest
      </Link>

      <p className="finish-note" role="status">
        {copy.status}
      </p>
    </div>
  )
}