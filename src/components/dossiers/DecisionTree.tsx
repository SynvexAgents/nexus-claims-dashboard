import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, ArrowDown, FileSearch, Shield, Mail } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { Dossier } from '../../types'

interface Props {
  dossier: Dossier
}

export function DecisionTree({ dossier: d }: Props) {
  const steps = [
    {
      icon: FileSearch,
      label: 'Analyse documentaire',
      detail: d.document_analysis
        ? `${d.document_analysis.type_document} — Qualite: ${d.document_analysis.qualite_document}`
        : 'Aucun document fourni',
      status: d.document_analysis?.coherence_apparente === 'oui' ? 'pass' : d.document_analysis?.coherence_apparente === 'non' ? 'fail' : d.document_analysis ? 'warn' : 'fail',
    },
    {
      icon: Shield,
      label: 'Verification conditions generales',
      detail: d.score_details?.deductions
        .filter(ded => ded.raison.toLowerCase().includes('motif') || ded.raison.toLowerCase().includes('couvert') || ded.raison.toLowerCase().includes('cg'))
        .map(ded => ded.raison).join(', ') || 'Motif conforme aux CG',
      status: d.score_details?.deductions.some(ded => ded.impact <= -40) ? 'fail' : d.score_details?.deductions.some(ded => ded.impact <= -15) ? 'warn' : 'pass',
    },
    {
      icon: AlertTriangle,
      label: 'Detection anomalies',
      detail: d.anomalies.length > 0
        ? `${d.anomalies.length} anomalie(s) : ${d.anomalies.map(a => `${a.type} (${a.impact_score}pts)`).join(', ')}`
        : 'Aucune anomalie detectee',
      status: d.anomalies.some(a => a.severite === 'critique') ? 'fail' : d.anomalies.length > 0 ? 'warn' : 'pass',
    },
    {
      icon: Shield,
      label: 'Score de confiance',
      detail: `Score final: ${d.score_confiance}/100 — Seuil: ≥75 auto, 40-74 attente, <40 escalade`,
      status: d.score_confiance >= 75 ? 'pass' : d.score_confiance >= 40 ? 'warn' : 'fail',
    },
    {
      icon: d.decision === 'auto_validé' ? CheckCircle : d.decision === 'attente' ? AlertTriangle : XCircle,
      label: `Decision: ${d.decision === 'auto_validé' ? 'Auto-validation' : d.decision === 'attente' ? 'Mise en attente' : 'Escalade'}`,
      detail: d.raison_decision,
      status: d.decision === 'auto_validé' ? 'pass' : d.decision === 'attente' ? 'warn' : 'fail',
    },
    {
      icon: Mail,
      label: d.template_utilise ? `Email: ${d.template_utilise}` : 'En attente d\'action',
      detail: d.date_reponse ? `Reponse envoyee le ${d.date_reponse}` : d.decision === 'attente' ? 'Demande de complement envoyee' : 'Rapport transmis au gestionnaire',
      status: d.date_reponse ? 'pass' : 'pending',
    },
  ]

  const statusConfig = {
    pass: { color: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/20', line: 'bg-accent-green/40' },
    warn: { color: 'text-accent-orange', bg: 'bg-accent-orange/10 border-accent-orange/20', line: 'bg-accent-orange/40' },
    fail: { color: 'text-accent-red', bg: 'bg-accent-red/10 border-accent-red/20', line: 'bg-accent-red/40' },
    pending: { color: 'text-text-muted', bg: 'bg-bg-surface-2 border-border-default', line: 'bg-border-default' },
  }

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const cfg = statusConfig[step.status as keyof typeof statusConfig]
        const Icon = step.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex gap-3">
              {/* Vertical line + icon */}
              <div className="flex flex-col items-center">
                <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0', cfg.bg)}>
                  <Icon size={14} className={cfg.color} />
                </div>
                {i < steps.length - 1 && (
                  <div className="flex flex-col items-center py-1">
                    <ArrowDown size={10} className="text-text-muted/40" />
                    <div className={cn('w-0.5 h-3', cfg.line)} />
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pb-3 pt-1">
                <p className={cn('text-xs font-semibold', cfg.color)}>{step.label}</p>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{step.detail}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
