import type { ReactNode } from 'react'
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from 'react-aria-components'

/**
 * C18 — button variants are Primary / Secondary / Focus / Disabled. Focus,
 * pressed, disabled and loading are STATES, not variants. Tertiary and
 * TextLink come from the code side; Danger is a code variant for destructive
 * actions. No variant underlines its label (C10).
 */

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'focus'
  | 'tertiary'
  | 'textlink'
  | 'danger'

export type ButtonSize = 'md' | 'sm'

export interface ButtonProps extends RACButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <RACButton
      {...rest}
      isDisabled={rest.isDisabled || loading}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      className={[
        'ds-button',
        `ds-button--${variant}`,
        `ds-button--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? <span className="ds-button__spinner" aria-hidden="true" /> : null}
      <span className="ds-button__label">{children}</span>
    </RACButton>
  )
}