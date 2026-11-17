import type { LucideIcon, LucideProps } from 'lucide-react'

/**
 * C12 — the single icon wrapper.
 *
 * Lucide is the only icon source. Every icon in the design system and in the
 * shell renders through this component so the stroke width stays 1.8 until the
 * owner picks a final value. Icons are decorative by default; the surrounding
 * control carries the accessible name.
 */

export interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon
  size?: number
}

export function Icon({
  icon: Glyph,
  size = 20,
  strokeWidth = 1.8,
  ...rest
}: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  )
}