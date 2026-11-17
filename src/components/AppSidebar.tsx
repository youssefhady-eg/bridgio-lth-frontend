import { Link, useRouterState } from '@tanstack/react-router'
import { AppIcon, navIconName } from '~/components/AppIcon'
import { useRef } from 'react'
import { isNavItemActive, navFor } from '~/shell/nav'
import { useFocusScope } from '~/shell/useFocusScope'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Primary navigation sidebar — the single source of navigation for both roles.
 *
 * Desktop: a fixed sidebar with an icon and a word for each item, active state
 * included. Phone: rendered as a drawer opened from the header menu button and
 * closed by the backdrop, the close button, or any nav link.
 *
 * The instructor set is a subset of the academy set (no onboarding, no
 * earnings); the role comes from the same `?as` preview switch as the header.
 */

interface AppSidebarProps {
  open: boolean
  onClose: () => void
  /** Desktop only: the sidebar is folded to an icon rail. */
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function AppSidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapsed,
}: AppSidebarProps) {
  const role = usePreviewRole()
  const lang = useLang()
  const strings = useStrings()
  const { pathname } = useRouterState({
    select: (state) => state.location,
  })

  const items = navFor(role)

  function isActive(item: (typeof items)[number]): boolean {
    return isNavItemActive(pathname, item)
  }

  const utilityLinks = [
    { id: 'help', to: '/help', label: strings.sidebar.helpLabel, icon: 'help' },
    {
      id: 'guide',
      to: '/guide',
      label: strings.sidebar.guideLabel,
      icon: 'guide',
    },
    {
      id: 'profile',
      to: '/profile',
      label: strings.sidebar.profileLabel,
      icon: 'user',
    },
  ] as const

  // Below 1024px the sidebar is a drawer: while it is open keep focus inside,
  // close on Escape, and return focus to the menu button. On desktop it is never
  // `open`, so this does nothing.
  const drawerRef = useRef<HTMLElement>(null)
  useFocusScope(open, drawerRef, onClose)

  return (
    <aside
      ref={drawerRef}
      id="app-sidebar"
      className={`app-sidebar${open ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}
      aria-label={strings.sidebar.navLabel}
    >
      <div className="app-sidebar__head">
        <button
          type="button"
          className="app-sidebar__close"
          onClick={onClose}
          aria-label={strings.sidebar.closeLabel}
        >
          <AppIcon name="close" size={20} />
        </button>
      </div>

      <nav className="app-sidebar__nav" aria-label={strings.sidebar.navLabel}>
        <ul className="app-sidebar__list">
          {items.map((item) => {
            const active = isActive(item)
            return (
              <li key={item.id}>
                <Link
                  to={item.to}
                  search={{ as: role, lang }}
                  className={`app-sidebar__link${active ? ' is-active' : ''}`}
                  title={collapsed ? strings.nav[item.id] : undefined}
                  aria-current={active ? 'page' : undefined}
                  preload={false}
                  onClick={onClose}
                >
                  <span className="app-sidebar__icon" aria-hidden="true">
                    <AppIcon
                      name={navIconName(item.id)}
                      size={22}
                      strokeWidth={2}
                    />
                  </span>
                  <span className="app-sidebar__label">
                    {strings.nav[item.id]}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Pinned utilities: the same three screens for every role. */}
        <ul className="utility-links" aria-label={strings.sidebar.utilitiesLabel}>
          {utilityLinks.map((link) => {
            const active = pathname === link.to
            return (
              <li key={link.id}>
                <Link
                  to={link.to}
                  search={{ as: role, lang }}
                  className={`utility-links__link${active ? ' is-active' : ''}`}
                  title={collapsed ? link.label : undefined}
                  aria-current={active ? 'page' : undefined}
                  preload={false}
                  onClick={onClose}
                >
                  <span className="utility-links__icon" aria-hidden="true">
                    <AppIcon name={link.icon} size={22} strokeWidth={2} />
                  </span>
                  <span className="app-sidebar__label">{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop only (hidden on the phone drawer): fold to an icon rail. */}
      <div className="app-sidebar__foot">
        <button
          type="button"
          className="app-sidebar__toggle"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar"
          aria-label={
            collapsed ? strings.sidebar.expandLabel : strings.sidebar.collapseLabel
          }
          title={
            collapsed ? strings.sidebar.expandLabel : strings.sidebar.collapseLabel
          }
        >
          <AppIcon
            name={collapsed ? 'expand' : 'collapse'}
            size={22}
            strokeWidth={2}
          />
          <span className="app-sidebar__label">
            {collapsed ? strings.sidebar.expandLabel : strings.sidebar.collapseLabel}
          </span>
        </button>
      </div>
    </aside>
  )
}
