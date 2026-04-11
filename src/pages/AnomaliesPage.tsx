import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock, FileWarning, Users, Filter } from 'lucide-react'
import { mockDossiers } from '../data/mockDossiers'
import { StatusBadge, SeverityBadge } from '../components/ui/StatusBadge'
import { ScoreMini } from '../components/ui/ScoreGauge'
import { cn } from '../lib/utils'
import type { Dossier, AnomalieType, AnomalieSeverite } from '../types'

const typeConfig: Record<AnomalieType, { icon: typeof Clock; label: string; color: string }> = {
  temporelle: { icon: Clock, label: 'Temporelle', color: 'text-accent-orange' },
  documentaire: { icon: FileWarning, label: 'Documentaire', color: 'text-accent-red' },
  comportementale: { icon: Users, label: 'Comportementale', color: 'text-accent-purple' },
}

interface AnomaliesPageProps {
  onViewDossier: (d: Dossier) => void
}

export function AnomaliesPage({ onViewDossier }: AnomaliesPageProps) {
  const [typeFilter, setTypeFilter] = useState<AnomalieType | 'all'>('all')
  const [sevFilter, setSevFilter] = useState<AnomalieSeverite | 'all'>('all')

  const dossiersWithAnomalies = useMemo(() => {
    return mockDossiers.filter(d => d.anomalies.length > 0)
  }, [])

  const allAnomalies = useMemo(() => {
    return dossiersWithAnomalies.flatMap(d =>
      d.anomalies.map(a => ({ ...a, dossier: d }))
    )
  }, [dossiersWithAnomalies])

  const filtered = useMemo(() => {
    return allAnomalies.filter(a => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false
      if (sevFilter !== 'all' && a.severite !== sevFilter) return false
      return true
    })
  }, [allAnomalies, typeFilter, sevFilter])

  const counts = {
    total: allAnomalies.length,
    critique: allAnomalies.filter(a => a.severite === 'critique').length,
    elevee: allAnomalies.filter(a => a.severite === 'elevee').length,
    moyenne: allAnomalies.filter(a => a.severite === 'moyenne').length,
    faible: allAnomalies.filter(a => a.severite === 'faible').length,
  }

  return (
    <div className="p-6 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: counts.total, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
          { label: 'Critiques', value: counts.critique, color: 'text-accent-red', bg: 'bg-accent-red/10' },
          { label: 'Élevées', value: counts.elevee, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
          { label: 'Moyennes', value: counts.moyenne, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
          { label: 'Faibles', value: counts.faible, color: 'text-text-secondary', bg: 'bg-bg-surface-2' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn('rounded-xl border border-border-default p-4 text-center', item.bg)}
          >
            <div className={cn('text-2xl font-bold font-mono', item.color)}>{item.value}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-1 font-medium">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-muted" />
          <span className="text-xs text-text-muted font-medium">Type :</span>
          {(['all', 'temporelle', 'documentaire', 'comportementale'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                typeFilter === t ? 'bg-accent-blue/15 text-accent-blue' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {t === 'all' ? 'Toutes' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Severite :</span>
          {(['all', 'critique', 'elevee', 'moyenne', 'faible'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSevFilter(s)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                sevFilter === s ? 'bg-accent-blue/15 text-accent-blue' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {s === 'all' ? 'Toutes' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Anomalies List */}
      <div className="space-y-3">
        {filtered.map((a, i) => {
          const cfg = typeConfig[a.type]
          const Icon = cfg.icon
          return (
            <motion.div
              key={`${a.dossier.id}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              onClick={() => onViewDossier(a.dossier)}
              className="rounded-xl bg-bg-surface-1 border border-border-default p-4 hover:border-border-hover cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', `bg-${cfg.color.replace('text-', '')}/10`)}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={cn('text-xs font-semibold', cfg.color)}>{cfg.label}</span>
                    <SeverityBadge severity={a.severite} />
                    <span className="text-xs font-mono font-bold text-accent-red">{a.impact_score} pts</span>
                  </div>
                  <p className="text-sm text-text-primary mb-2">{a.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] font-mono text-accent-blue">{a.dossier.ref_dossier}</span>
                    <span className="text-[11px] text-text-muted">{a.dossier.nom_assure}</span>
                    <ScoreMini score={a.dossier.score_confiance} />
                    <StatusBadge status={a.dossier.status} />
                  </div>
                </div>
                {a.dossier.historique_assure.flag_suspect && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent-red/10 text-accent-red text-[10px] font-bold">
                      <AlertTriangle size={10} /> SUSPECT
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <AlertTriangle size={32} className="text-text-muted mx-auto mb-3 opacity-50" />
          <p className="text-sm text-text-muted">Aucune anomalie ne correspond aux filtres.</p>
        </div>
      )}
    </div>
  )
}
