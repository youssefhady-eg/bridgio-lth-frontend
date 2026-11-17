import { Breadcrumb, Breadcrumbs, Link } from 'react-aria-components'

/**
 * Breadcrumbs on React Aria Components. The last item is the current page and
 * carries `aria-current`; it is not a link.
 */

export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
}

export function BreadcrumbsNav({
  items,
  label = 'Breadcrumb',
}: {
  items: BreadcrumbItem[]
  label?: string
}) {
  return (
    <nav className="ds-breadcrumbs-nav" aria-label={label}>
      <Breadcrumbs className="ds-breadcrumbs">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <Breadcrumb
              key={item.id}
              className={[
                'ds-breadcrumbs__item',
                isCurrent ? 'is-current' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href} className="ds-breadcrumbs__link">
                  {item.label}
                </Link>
              )}
            </Breadcrumb>
          )
        })}
      </Breadcrumbs>
    </nav>
  )
}