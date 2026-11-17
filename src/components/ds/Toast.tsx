import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Icon } from './Icon'

/**
 * Toast region — status is icon + word, never colour alone. The queue is UI
 * state only; nothing is persisted and nothing is fetched.
 */

export type ToastTone = 'info' | 'success' | 'warning' | 'error'

export interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
}

interface ToastItem extends ToastInput {
  id: number
  tone: ToastTone
}

interface ToastContextValue {
  notify: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneIcon = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
} as const

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((toast: ToastInput) => {
    setToasts((current) => [
      ...current,
      { ...toast, tone: toast.tone ?? 'info', id: Date.now() + current.length },
    ])
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ds-toast-region" role="region" aria-label="Notifications">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => remove(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return context
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem
  onClose: () => void
}) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 6000)
    return () => window.clearTimeout(timer)
  }, [onClose])

  const Glyph = toneIcon[toast.tone]

  return (
    <div
      className={`ds-toast ds-toast--${toast.tone}`}
      role="status"
      aria-live="polite"
    >
      <span className="ds-toast__icon">
        <Icon icon={Glyph} size={20} />
      </span>
      <div className="ds-toast__copy">
        <p className="ds-toast__title">{toast.title}</p>
        {toast.description ? (
          <p className="ds-toast__description">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        className="ds-toast__close"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        <Icon icon={X} size={16} />
      </button>
    </div>
  )
}