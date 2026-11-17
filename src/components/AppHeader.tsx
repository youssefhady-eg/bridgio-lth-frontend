import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { AppIcon } from '~/components/AppIcon'
import { hrefWithLang } from '~/shell/lang'
import { usePreviewRole } from '~/shell/usePreviewRole'
import type { Theme } from '~/shell/theme-state'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Slim utility header — refinement branch.
 *
 * The header no longer carries the primary navigation (that is the sidebar's
 * job). It holds only utility controls: the menu button (phone only), the
 * brand, the language toggle, the messages trigger and the account area.
 *
 * Three brand size states are unchanged (see app.css), one DOM, media queries:
 *  - ≥ 1024 px : large header — adopted wordmark, maroon fill, 136 px
 *    (the 200 px colour lockup is no longer rendered in the header; the asset
 *    stays in the repo for large/cover use)
 *   768–1023 : light small header — adopted wordmark, maroon fill, 148 px
 *   <768 px  : dark band — adopted wordmark, cream fill, 136 px
 *
 * No component here fetches data; the account area is a labelled placeholder
 * only, and every label comes from the central strings.
 */

interface AppHeaderProps {
  onOpenSidebar: () => void
  onOpenChat: () => void
  theme: Theme
  onToggleTheme: () => void
  sidebarCollapsed?: boolean
}

export function AppHeader({
  onOpenSidebar,
  onOpenChat,
  theme,
  onToggleTheme,
  sidebarCollapsed = false,
}: AppHeaderProps) {
  const { pathname, href } = useRouterState({ select: (state) => state.location })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''
  const lang = useLang()
  const role = usePreviewRole()
  const strings = useStrings()
  const nextLang = lang === 'en' ? 'ar' : 'en'

  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!accountOpen) return
    function onPointerDown(event: PointerEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false)
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [accountOpen])

  return (
    <header className={`app-header${sidebarCollapsed ? ' app-header--collapsed' : ''}`}>
      <div className="app-header__inner">
        <button
          type="button"
          className="app-header__menu"
          onClick={onOpenSidebar}
          aria-label={strings.header.menuLabel}
        >
          <AppIcon name="menu" size={22} />
        </button>

        <Link
          to="/academy"
          search={{ as: role, lang }}
          className="app-header__brand"
          aria-label={strings.header.wordmarkAlt}
        >
          {/* C14 LOCKED — Alexandria Bold lockup. Fills are baked in the files
              and are never recoloured. One of the two is visible per
              breakpoint/theme (see app.css): cream on dark surfaces, maroon on
              light surfaces. Never retyped, mirrored or stretched. */}
          <img
            className="app-header__wordmark app-header__wordmark--cream"
            src="/brand/wordmark-alex-cream-red-arch.svg"
            alt={strings.header.wordmarkAlt}
            width={136}
            height={60}
            decoding="async"
          />
          <img
            className="app-header__wordmark app-header__wordmark--maroon"
            src="/brand/wordmark-alex-maroon-red-arch.svg"
            alt={strings.header.wordmarkAlt}
            width={148}
            height={66}
            decoding="async"
          />
        </Link>

        <div
          className="app-header__utilities"
          role="group"
          aria-label={strings.header.utilityLabel}
        >
          <a
            className="app-utility__button app-utility__button--lang"
            href={hrefWithLang(pathname, searchStr, nextLang)}
            lang={nextLang}
            hrefLang={nextLang}
            aria-label={`${
              nextLang === 'en'
                ? strings.header.langGlyphEnglish
                : strings.header.langGlyphArabic
            } ${
              nextLang === 'en'
                ? strings.header.langToEnglish
                : strings.header.langToArabic
            }`}
            title={
              nextLang === 'en'
                ? strings.header.langToEnglish
                : strings.header.langToArabic
            }
          >
            <span className="app-utility__glyph" aria-hidden="true">
              {nextLang === 'en'
                ? strings.header.langGlyphEnglish
                : strings.header.langGlyphArabic}
            </span>
          </a>

          <Link
            to="/search"
            search={{ as: role, lang }}
            className="app-utility__button"
            aria-label={strings.header.searchOpenLabel ?? 'Search'}
            title={strings.header.searchLabel ?? 'Search'}
            preload={false}
          >
            <AppIcon name="search" size={20} />
            <span className="app-utility__label">
              {strings.header.searchLabel ?? 'Search'}
            </span>
          </Link>

          <button
            type="button"
            className="app-utility__button app-utility__button--theme"
            onClick={onToggleTheme}
            aria-label={`${strings.header.themeLabel}: ${
              theme === 'dark'
                ? strings.header.themeToLight
                : strings.header.themeToDark
            }`}
            title={
              theme === 'dark'
                ? strings.header.themeToLight
                : strings.header.themeToDark
            }
          >
            <AppIcon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>

          <button
            type="button"
            className="app-utility__button"
            onClick={onOpenChat}
            aria-label={strings.header.assistantOpenLabel}
          >
            <AppIcon name="chat" size={20} />
            <span className="app-utility__label">
              {strings.header.assistantLabel}
            </span>
          </button>

          <div className="account-menu" ref={accountRef}>
            <button
              type="button"
              className="app-utility__button app-utility__button--account"
              aria-label={strings.header.accountLabel}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              aria-controls="account-menu-panel"
              onClick={() => setAccountOpen((current) => !current)}
            >
              <AppIcon name="user" size={20} />
              <span className="app-utility__label">
                {strings.header.accountLabel}
              </span>
            </button>

            {accountOpen ? (
              <div
                className="account-menu__panel"
                id="account-menu-panel"
                role="menu"
                aria-label={strings.header.accountLabel}
              >
                <Link
                  to="/profile"
                  search={{ as: role, lang }}
                  className="account-menu__item"
                  role="menuitem"
                  preload={false}
                  onClick={() => setAccountOpen(false)}
                >
                  <AppIcon name="user" size={18} />
                  {strings.sidebar.profileLabel}
                </Link>
                <button
                  type="button"
                  className="account-menu__item account-menu__item--theme"
                  role="menuitemcheckbox"
                  aria-checked={theme === 'dark'}
                  onClick={onToggleTheme}
                >
                  <AppIcon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
                  <span className="account-menu__item-label">
                    {strings.header.themeLabel}
                  </span>
                  <span className="account-menu__switch" aria-hidden="true">
                    <span className="account-menu__switch-thumb" />
                  </span>
                </button>
                <Link
                  to="/sign-in"
                  search={{ lang }}
                  className="account-menu__item"
                  role="menuitem"
                  preload={false}
                  onClick={() => setAccountOpen(false)}
                >
                  <AppIcon name="user" size={18} />
                  Sign in
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
