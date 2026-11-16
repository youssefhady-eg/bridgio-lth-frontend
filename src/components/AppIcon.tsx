import type { SVGProps } from 'react'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Compass,
  FileQuestion,
  Globe,
  House,
  ListChecks,
  Menu,
  MessageSquare,
  Moon,
  Sun,
  User,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react'

/**
 * Small icon set for the LTH shell (sidebar + utility header).
 *
 * Lucide is the single BRIDGIO icon source (owner decision 2026-11-13). Stroke
 * uses `currentColor`, so every icon inherits the surrounding text colour in
 * both themes and both directions. Decorative by default: callers pass an
 * accessible name on the surrounding control, so `aria-hidden` is set here.
 */

export type AppIconName =
  | 'menu'
  | 'close'
  | 'globe'
  | 'chat'
  | 'user'
  | 'dashboard'
  | 'onboarding'
  | 'cohorts'
  | 'curriculum'
  | 'rubrics'
  | 'earnings'
  | 'help'
  | 'guide'
  | 'sun'
  | 'moon'
  | 'collapse'
  | 'expand'

/** AppIconName → Lucide component. */
const icons: Record<AppIconName, LucideIcon> = {
  menu: Menu,
  close: X,
  globe: Globe,
  chat: MessageSquare,
  user: User,
  dashboard: House,
  onboarding: ListChecks,
  cohorts: Users,
  curriculum: BookOpen,
  rubrics: ClipboardCheck,
  earnings: Wallet,
  help: FileQuestion,
  guide: Compass,
  sun: Sun,
  moon: Moon,
  collapse: ChevronLeft,
  expand: ChevronRight,
}

interface AppIconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: AppIconName
  size?: number
}

export function AppIcon({ name, size = 20, ...rest }: AppIconProps) {
  const Icon = icons[name]

  return (
    <Icon
      size={size}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  )
}

/** Map a nav destination id to the closest icon. */
export function navIconName(id: string): AppIconName {
  switch (id) {
    case 'academy-dashboard':
      return 'dashboard'
    case 'academy-onboarding':
      return 'onboarding'
    case 'academy-cohorts':
      return 'cohorts'
    case 'academy-curriculum':
      return 'curriculum'
    case 'academy-rubrics':
      return 'rubrics'
    case 'academy-earnings':
      return 'earnings'
    default:
      return 'dashboard'
  }
}
