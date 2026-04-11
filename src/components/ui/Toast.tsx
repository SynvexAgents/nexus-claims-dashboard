import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, X, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ToastItem {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
}

const icons = { success: CheckCircle, warning: AlertTriangle, error: AlertTriangle, info: Info }
const colors = {
  success: 'border-accent-green/30 bg-accent-green/5',
  warning: 'border-accent-orange/30 bg-accent-orange/5',
  error: 'border-accent-red/30 bg-accent-red/5',
  info: 'border-accent-blue/30 bg-accent-blue/5',
}
const iconColors = { success: 'text-accent-green', warning: 'text-accent-orange', error: 'text-accent-red', info: 'text-accent-blue' }

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}`
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[70] space-y-2 w-80">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              className={cn('glass rounded-xl border p-4 flex gap-3', colors[toast.type])}
            >
              <Icon size={18} className={cn('flex-shrink-0 mt-0.5', iconColors[toast.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary">{toast.title}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{toast.message}</p>
              </div>
              <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 text-text-muted hover:text-text-secondary">
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export function useAutoToasts(addToast: (toast: Omit<ToastItem, 'id'>) => void) {
  useEffect(() => {
    const t1 = setTimeout(() => addToast({ type: 'success', title: 'Dossier auto-valide', message: 'REF-2026-04891 · Gabriel Mercier · Score 95' }), 4000)
    const t2 = setTimeout(() => addToast({ type: 'error', title: 'Anomalie critique detectee', message: 'REF-2026-04915 · Document retouche · Score 22' }), 12000)
    const t3 = setTimeout(() => addToast({ type: 'warning', title: 'Dossier en attente', message: 'REF-2026-04909 · Certificat vague · Score 62' }), 20000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [addToast])
}
