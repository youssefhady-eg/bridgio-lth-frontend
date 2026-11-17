import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Dialog as RACDialog,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components'
import { Icon } from './Icon'

/**
 * Dialog and Drawer on React Aria Components (C16). Focus is trapped, Escape
 * closes, and focus returns to the trigger. Both surfaces are built from tokens
 * and carry no underlined controls.
 */

export interface DialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Dialog({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  className,
}: DialogProps) {
  return (
    <ModalOverlay
      className="ds-overlay"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
    >
      <Modal className={['ds-modal', className].filter(Boolean).join(' ')}>
        <RACDialog className="ds-dialog">
          {({ close }) => (
            <>
              <header className="ds-dialog__head">
                <Heading slot="title" className="ds-dialog__title">
                  {title}
                </Heading>
                <button
                  type="button"
                  className="ds-dialog__close"
                  onClick={close}
                  aria-label="Close"
                >
                  <Icon icon={X} size={20} />
                </button>
              </header>
              <div className="ds-dialog__body">{children}</div>
              {footer ? <footer className="ds-dialog__foot">{footer}</footer> : null}
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  )
}

export interface DrawerProps extends DialogProps {
  placement?: 'start' | 'end'
  width?: 'sm' | 'md' | 'lg'
}

export function Drawer({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  placement = 'end',
  width = 'md',
  className,
}: DrawerProps) {
  return (
    <ModalOverlay
      className="ds-overlay ds-overlay--drawer"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
    >
      <Modal
        className={[
          'ds-drawer',
          `ds-drawer--${placement}`,
          `ds-drawer--${width}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <RACDialog className="ds-dialog ds-dialog--drawer">
          {({ close }) => (
            <>
              <header className="ds-dialog__head">
                <Heading slot="title" className="ds-dialog__title">
                  {title}
                </Heading>
                <button
                  type="button"
                  className="ds-dialog__close"
                  onClick={close}
                  aria-label="Close"
                >
                  <Icon icon={X} size={20} />
                </button>
              </header>
              <div className="ds-dialog__body">{children}</div>
              {footer ? <footer className="ds-dialog__foot">{footer}</footer> : null}
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  )
}