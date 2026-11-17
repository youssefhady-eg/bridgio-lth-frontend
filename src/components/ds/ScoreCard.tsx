import type { ReactNode } from 'react'

/**
 * ScoreCard (brief §12.7): dimension, value, explanation, then the appeal path.
 * A score is never colour alone — the value is written, the explanation says
 * why, and the appeal action is always present when a score exists.
 */

export interface ScoreCardProps {
  dimension: string
  value: number | null
  explanation: string
  appeal?: ReactNode
  /** Optional band label, e.g. "Strong" / "Developing". */
  band?: string
  unavailableLabel?: string
}

export function ScoreCard({
  dimension,
  value,
  explanation,
  appeal,
  band,
  unavailableLabel = 'Not assessed',
}: ScoreCardProps) {
  const hasValue = value !== null && Number.isFinite(value)
  const clamped = hasValue ? Math.min(100, Math.max(0, value)) : 0

  return (
    <article className="ds-score-card">
      <header className="ds-score-card__head">
        <h3 className="ds-score-card__dimension">{dimension}</h3>
        <p
          className={
            hasValue ? 'ds-score-card__value' : 'ds-score-card__value is-empty'
          }
        >
          {hasValue ? `${Math.round(value)}%` : unavailableLabel}
        </p>
      </header>
      {hasValue ? (
        <div
          className="ds-score-card__track"
          role="img"
          aria-label={`${dimension}: ${Math.round(value)} percent`}
        >
          <span
            className="ds-score-card__fill"
            style={{ inlineSize: `${clamped}%` }}
          />
        </div>
      ) : null}
      {band ? <p className="ds-score-card__band">{band}</p> : null}
      <p className="ds-score-card__explanation">{explanation}</p>
      {appeal ? <div className="ds-score-card__appeal">{appeal}</div> : null}
    </article>
  )
}