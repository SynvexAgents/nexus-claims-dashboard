import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, AlertTriangle, MessageCircle, LayoutDashboard } from 'lucide-react'
import { mockDossiers } from '../../data/mockDossiers'
import { ScoreMini } from '../ui/ScoreGauge'
import { StatusBadge } from '../ui/StatusBadge'
import type { Dossier, PageId } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
  onSelectDossier: (d: Dossier) => void
  onNavigate: (page: PageId) => void
}

export function CommandPalette({ open, onClose, onSelectDossier, onNavigate }: Props) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (open) setQuery('')
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const results = useMemo(() => {
    if (!query.trim()) return { pages: [
      { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'dossiers' as PageId, label: 'Dossiers', icon: FileText },
      { id: 'anomalies' as PageId, label: 'Anomalies', icon: AlertTriangle },
      { id: 'chat' as PageId, label: 'Chat Agent', icon: MessageCircle },
    ], dossiers: mockDossiers.slice(0, 5) }

    const q = query.toLowerCase()
    const dossiers = mockDossiers.filter(d =>
      d.nom_assure.toLowerCase().includes(q) ||
      d.ref_dossier.toLowerCase().includes(q) ||
      d.nom_evenement.toLowerCase().includes(q)
    ).slice(0, 8)

    return { pages: [], dossiers }
  }, [query])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[60]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[60]"
      >
        <div className="glass rounded-xl border border-border-default shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
            <Search size={16} className="text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un dossier, une page..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              autoFocus
            />
            <kbd className="px-1.5 py-0.5 rounded bg-bg-surface-3 text-[10px] font-mono text-text-muted border border-border-default">ESC</kbd>
          </div>

          <div className="max-h-[320px] overflow-y-auto p-2">
            {results.pages.length > 0 && (
              <div className="mb-2">
                <p className="px-2 py-1 text-[10px] text-text-muted uppercase tracking-wider font-medium">Pages</p>
                {results.pages.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onNavigate(p.id); onClose() }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-surface-2 transition-colors"
                  >
                    <p.icon size={16} className="text-text-muted" />
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {results.dossiers.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] text-text-muted uppercase tracking-wider font-medium">Dossiers</p>
                {results.dossiers.map(d => (
                  <button
                    key={d.id}
                    onClick={() => { onSelectDossier(d); onClose() }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-surface-2 transition-colors"
                  >
                    <ScoreMini score={d.score_confiance} />
                    <div className="flex-1 text-left">
                      <p className="text-xs font-medium text-text-primary">{d.nom_assure}</p>
                      <p className="text-[10px] text-text-muted">{d.ref_dossier} · {d.nom_evenement}</p>
                    </div>
                    <StatusBadge status={d.status} />
                  </button>
                ))}
              </div>
            )}

            {results.dossiers.length === 0 && query.trim() && (
              <div className="py-6 text-center">
                <p className="text-sm text-text-muted">Aucun resultat pour "{query}"</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
