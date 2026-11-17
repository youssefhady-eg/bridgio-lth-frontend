/**
 * Avatar — initials by default, an image when one exists. Decorative when a
 * display name sits next to it; labelled when it stands alone.
 */

export interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'cream' | 'maroon'
  /** Set false when the name is already visible beside the avatar. */
  labelled?: boolean
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase()
}

export function Avatar({
  name,
  src,
  size = 'md',
  tone = 'cream',
  labelled = false,
}: AvatarProps) {
  return (
    <span
      className={`ds-avatar ds-avatar--${size} ds-avatar--${tone}`}
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? name : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {src ? (
        <img src={src} alt="" className="ds-avatar__image" />
      ) : (
        <span className="ds-avatar__initials" aria-hidden="true">
          {initialsFor(name)}
        </span>
      )}
    </span>
  )
}