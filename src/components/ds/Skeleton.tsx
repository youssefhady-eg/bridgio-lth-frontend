/**
 * Skeletons for the academy loading states. They preserve the shape of the
 * content that is about to appear and announce the wait once through a
 * visually hidden status line, so screen readers do not read every block.
 */

export function Skeleton({
  width,
  height = 16,
  radius = 'sm',
  className,
}: {
  width?: string | number
  height?: string | number
  radius?: 'sm' | 'md' | 'pill'
  className?: string
}) {
  return (
    <span
      className={['ds-skeleton', `ds-skeleton--${radius}`, className]
        .filter(Boolean)
        .join(' ')}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <span className="ds-skeleton-text" aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} width={index === lines - 1 ? '62%' : '100%'} />
      ))}
    </span>
  )
}

export function SkeletonStats({ count = 3 }: { count?: number }) {
  return (
    <div className="ds-skeleton-stats" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="ds-skeleton-card">
          <Skeleton width="42%" height={12} />
          <Skeleton width="68%" height={26} />
          <Skeleton width="55%" height={12} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({
  rows = 4,
  columns = 4,
}: {
  rows?: number
  columns?: number
}) {
  return (
    <div className="ds-skeleton-table" aria-hidden="true">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="ds-skeleton-table__row">
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton key={column} width={column === 0 ? '80%' : '58%'} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonScreen() {
  return (
    <div className="ds-skeleton-screen" role="status">
      <span className="visually-hidden">Loading</span>
      <Skeleton width="30%" height={12} />
      <Skeleton width="46%" height={34} />
      <SkeletonText lines={2} />
      <SkeletonStats />
      <SkeletonTable />
    </div>
  )
}