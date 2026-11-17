/**
 * C14 — the Alexandria Bold lockup. Two supplied assets, one per surface.
 * Never retyped, mirrored or stretched. Alt text is plain brand text and must
 * not carry internal wording (N5). Decorative by default: the header already
 * links to the home route, so a duplicate accessible name is noise.
 */

export interface LogoProps {
  surface?: 'light' | 'dark'
  width?: number
  alt?: string
  decorative?: boolean
  className?: string
}

const SOURCES = {
  light: '/brand/wordmark-alex-maroon-red-arch.svg',
  dark: '/brand/wordmark-alex-cream-red-arch.svg',
} as const

export function Logo({
  surface = 'light',
  width = 136,
  alt = 'BRIDGIO',
  decorative = false,
  className,
}: LogoProps) {
  return (
    <img
      className={['ds-logo', className].filter(Boolean).join(' ')}
      src={SOURCES[surface]}
      alt={decorative ? '' : alt}
      aria-hidden={decorative ? true : undefined}
      width={width}
      height={Math.round(width * 0.44)}
      decoding="async"
    />
  )
}