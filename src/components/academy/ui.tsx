import type { ReactNode } from 'react'
import type { Money } from '~/api/types'
import { formatMoney } from '~/components/dashboard/format'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Shared academy screen furniture. Copy always comes from the central string
 * file; data always comes from the adapter through the screen. Nothing here
 * fetches or stores anything.
 */

export function AcademyPage({
  badge,
  title,
  lead,
  children,
}: {
  badge: string
  title: string
  lead: string
  children: ReactNode
}) {
  const strings = useStrings()
  return (
    <div className="dashboard academy">
      <header className="dashboard__hero">
        <p className="app-shell__badge">{badge}</p>
        <h1>{title}</h1>
        <p className="dashboard__lead">{lead}</p>
      </header>
      <p className="academy-demo-notice">{strings.common.demoNotice}</p>
      {children}
    </div>
  )
}

export function Section({
  id,
  title,
  lead,
  actions,
  children,
}: {
  id: string
  title: string
  lead?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="academy-section" aria-labelledby={`${id}-heading`}>
      <header className="academy-section__head">
        <div>
          <h2 id={`${id}-heading`}>{title}</h2>
          {lead ? <p className="academy-section__lead">{lead}</p> : null}
        </div>
        {actions ? <div className="academy-section__actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  )
}

/** Placeholder-safe money. Never derives a figure from a missing amount. */
export function MoneyText({ money }: { money: Money }) {
  const lang = useLang()
  const strings = useStrings()
  return (
    <span className={money.isPlaceholder ? 'academy-money is-placeholder' : 'academy-money'}>
      {formatMoney(money, strings.common.pricePlaceholder, lang)}
    </span>
  )
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <div className="academy-stat">
      <p className="academy-stat__label">{label}</p>
      <p className="academy-stat__value">{value}</p>
      {hint ? <p className="academy-stat__hint">{hint}</p> : null}
    </div>
  )
}

/** Visible notice; status is icon + word elsewhere, this is informational. */
export function Notice({
  children,
  tone = 'info',
}: {
  children: ReactNode
  tone?: 'info' | 'provisional'
}) {
  return (
    <p className={`academy-notice academy-notice--${tone}`} role="note">
      {children}
    </p>
  )
}

export function LoadingNote() {
  const strings = useStrings()
  return (
    <p className="loading-note" role="status">
      {strings.common.loading}
    </p>
  )
}

export function ErrorNote({ body }: { body: string }) {
  const strings = useStrings()
  return (
    <p className="academy-error" role="alert">
      <strong>{strings.common.loadErrorTitle}</strong> {body}
    </p>
  )
}
