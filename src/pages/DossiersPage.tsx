import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { mockDossiers } from '../data/mockDossiers'
import { StatusBadge, MotifBadge } from '../components/ui/StatusBadge'
import { ScoreMini } from '../components/ui/ScoreGauge'
import { formatDate, formatCurrency, getInitials, cn } from '../lib/utils'
import type { Dossier } from '../types'

interface DossiersPageProps {
  onViewDossier: (d: Dossier) => void
}

export function DossiersPage({ onViewDossier }: DossiersPageProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'montant'>('date')
  const [loading, setLoading] = useState(true)

  useState(() => { setTimeout(() => setLoading(false), 600) })

  const statusFilters = useMemo(() => [
    { id: 'all', label: 'Tous', count: mockDossiers.length },
    { id: 'traité', label: 'Auto-validés', count: mockDossiers.filter(d => d.status === 'traité').length },
    { id: 'attente', label: 'En attente', count: mockDossiers.filter(d => d.status === 'attente').length },
    { id: 'escaladé', label: 'Escaladés', count: mockDossiers.filter(d => d.status === 'escaladé').length },
    { id: 'réclamation', label: 'Réclamations', count: mockDossiers.filter(d => d.status === 'réclamation').length },
  ], [])
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = useMemo(() => {
    let result = [...mockDossiers]
    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(d =>
        d.nom_assure.toLowerCase().includes(q) ||
        d.ref_dossier.toLowerCase().includes(q) ||
        d.nom_evenement.toLowerCase().includes(q) ||
        d.motif_declare.toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'date') cmp = new Date(b.date_reception).getTime() - new Date(a.date_reception).getTime()
      else if (sortBy === 'score') cmp = b.score_confiance - a.score_confiance
      else cmp = b.montant_dossard - a.montant_dossard
      return sortAsc ? -cmp : cmp
    })
    return result
  }, [search, statusFilter, sortBy, sortAsc])

  const handleSort = (col: 'date' | 'score' | 'montant') => {
    if (sortBy === col) setSortAsc(!sortAsc)
    else { setSortBy(col); setSortAsc(false) }
  }

  return (
    <div className="p-6 space-y-4">
      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Rechercher par nom, référence, événement..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-bg-surface-1 border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-surface-1 border border-border-default">
          <SlidersHorizontal size={14} className="text-text-muted ml-2 mr-1" />
          {statusFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                statusFilter === f.id ? 'bg-accent-blue/15 text-accent-blue' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {f.label}
              <span className="ml-1 text-[10px] opacity-60">{f.count}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-xl bg-bg-surface-1 border border-border-default overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                {[
                  { key: 'ref', label: 'Référence', sortable: false },
                  { key: 'assure', label: 'Assuré', sortable: false },
                  { key: 'evenement', label: 'Événement', sortable: false },
                  { key: 'motif', label: 'Motif', sortable: false },
                  { key: 'montant', label: 'Montant', sortable: true, sortKey: 'montant' as const },
                  { key: 'score', label: 'Score', sortable: true, sortKey: 'score' as const },
                  { key: 'status', label: 'Statut', sortable: false },
                  { key: 'date', label: 'Date', sortable: true, sortKey: 'date' as const },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && col.sortKey && handleSort(col.sortKey)}
                    className={cn(
                      'px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                      col.sortable && 'cursor-pointer hover:text-text-secondary'
                    )}
                  >
                    {col.label}
                    {col.sortable && col.sortKey && sortBy === col.sortKey && (
                      <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={`skel-${i}`} className="border-b border-border-default/50">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="skeleton h-4 rounded-md" style={{ width: j === 0 ? 120 : j === 2 ? 160 : 70, animationDelay: `${i * 0.05}s` }} />
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && filtered.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => onViewDossier(d)}
                  className="border-b border-border-default/50 hover:bg-bg-surface-2/50 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-accent-blue">{d.ref_dossier}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-bg-surface-3 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-text-secondary">{getInitials(d.nom_assure)}</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text-primary">{d.nom_assure}</p>
                        <p className="text-[10px] text-text-muted">{d.email_assure}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-xs text-text-primary truncate max-w-[180px]">{d.nom_evenement}</p>
                      <p className="text-[10px] text-text-muted">{d.plateforme}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3"><MotifBadge motif={d.motif_declare} /></td>
                  <td className="px-4 py-3"><span className="text-xs font-mono font-medium text-text-primary">{formatCurrency(d.montant_dossard)}</span></td>
                  <td className="px-4 py-3"><ScoreMini score={d.score_confiance} /></td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3"><span className="text-xs text-text-muted">{formatDate(d.date_reception)}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-text-muted">Aucun dossier ne correspond a vos criteres.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
