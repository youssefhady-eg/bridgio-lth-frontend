import type { ReactNode } from 'react'

/**
 * Desktop grid (owner answer 2026-11-14): a 1440 px content column, 12
 * columns, 24 px gaps. Blocks span 4 / 6 / 8 / 12. Below 900 px every block
 * falls back to the 4-column mobile grid and then to one column on phones.
 */

export function BlockGrid({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'ul'
}) {
  return (
    <Tag className={['ds-block-grid', className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}

export function Block({
  children,
  span = 12,
  className,
}: {
  children: ReactNode
  span?: 4 | 6 | 8 | 12
  className?: string
}) {
  return (
    <div className={['ds-block', `ds-block--${span}`, className]
      .filter(Boolean)
      .join(' ')}>
      {children}
    </div>
  )
}