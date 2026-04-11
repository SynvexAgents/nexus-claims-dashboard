import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, BarChart3, Clock, AlertTriangle, Mail, History, CheckCircle, XCircle, ArrowUpCircle } from 'lucide-react'
import { ScoreGauge } from '../ui/ScoreGauge'
import { StatusBadge, SeverityBadge } from '../ui/StatusBadge'
import { formatDate, formatDateTime, formatCurrency, cn, getInitials } from '../../lib/utils'
import type { Dossier } from '../../types'

const tabs = [
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'scoring', label: 'Scoring', icon: BarChart3 },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'historique', label: 'Historique', icon: History },
]

interface Props {
  dossier: Dossier
  onClose: () => void
}

export function DossierDetail({ dossier: d, onClose }: Props) {
  const [tab, setTab] = useState('resume')

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-bg-primary border-l border-border-default z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default bg-bg-surface-1/50">
          <div className="flex items-center gap-4">
            <ScoreGauge score={d.score_confiance} size={56} strokeWidth={5} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold text-accent-blue">{d.ref_dossier}</span>
                <StatusBadge status={d.status} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">{d.nom_assure}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-surface-2 transition-colors">
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-2 border-b border-border-default overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                tab === t.id ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <t.icon size={12} />
              {t.label}
              {t.id === 'anomalies' && d.anomalies.length > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-accent-red/20 text-accent-red text-[9px] font-bold flex items-center justify-center">{d.anomalies.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {tab === 'resume' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: 'Evenement', v: d.nom_evenement },
                  { l: 'Plateforme', v: d.plateforme },
                  { l: 'Montant dossard', v: formatCurrency(d.montant_dossard) },
                  { l: 'Motif', v: d.motif_declare },
                  { l: 'Date souscription', v: formatDate(d.date_souscription) },
                  { l: 'Date evenement', v: formatDate(d.date_evenement) },
                  { l: 'Date annulation', v: formatDate(d.date_annulation) },
                  { l: 'Date reception', v: formatDateTime(d.date_reception) },
                ].map(item => (
                  <div key={item.l} className="rounded-lg bg-bg-surface-1 border border-border-default p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1">{item.l}</p>
                    <p className="text-sm text-text-primary font-medium">{item.v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-bg-surface-1 border border-border-default p-4">
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">Detail du motif</p>
                <p className="text-sm text-text-secondary leading-relaxed">{d.motif_detail}</p>
              </div>
              <div className="rounded-lg bg-bg-surface-1 border border-border-default p-4">
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">Decision de l'agent</p>
                <p className="text-sm text-text-secondary leading-relaxed">{d.raison_decision}</p>
                {d.template_utilise && (
                  <p className="mt-2 text-xs font-mono text-accent-cyan">Template : {d.template_utilise}</p>
                )}
              </div>
              {d.document_analysis && (
                <div className="rounded-lg bg-bg-surface-1 border border-border-default p-4">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-3">Analyse documentaire (OCR)</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-text-muted">Type :</span> <span className="text-text-primary font-medium">{d.document_analysis.type_document}</span></div>
                    <div><span className="text-text-muted">Date :</span> <span className="text-text-primary font-medium">{d.document_analysis.date_document}</span></div>
                    <div><span className="text-text-muted">Emetteur :</span> <span className="text-text-primary font-medium">{d.document_analysis.emetteur.nom}</span></div>
                    <div><span className="text-text-muted">Qualite :</span> <span className="text-text-primary font-medium">{d.document_analysis.qualite_document}</span></div>
                    {d.document_analysis.diagnostic && <div className="col-span-2"><span className="text-text-muted">Diagnostic :</span> <span className="text-text-primary font-medium">{d.document_analysis.diagnostic}</span></div>}
                    <div><span className="text-text-muted">Coherence :</span> <span className={cn('font-medium', d.document_analysis.coherence_apparente === 'oui' ? 'text-accent-green' : d.document_analysis.coherence_apparente === 'non' ? 'text-accent-red' : 'text-accent-orange')}>{d.document_analysis.coherence_apparente}</span></div>
                    <div><span className="text-text-muted">Modification :</span> <span className={cn('font-medium', d.document_analysis.signes_modification === 'oui' ? 'text-accent-red' : 'text-accent-green')}>{d.document_analysis.signes_modification}</span></div>
                  </div>
                  {d.document_analysis.raison_incoherence && (
                    <div className="mt-3 p-2 rounded bg-accent-red/5 border border-accent-red/10">
                      <p className="text-xs text-accent-red">{d.document_analysis.raison_incoherence}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'scoring' && (
            <div className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <ScoreGauge score={d.score_confiance} size={100} strokeWidth={8} />
                <div>
                  <p className="text-2xl font-bold font-mono text-text-primary">{d.score_confiance}/100</p>
                  <StatusBadge status={d.decision === 'auto_validé' ? 'auto_validé' : d.decision} />
                </div>
              </div>
              {d.score_details && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent-green/5 border border-accent-green/10">
                    <span className="text-sm text-accent-green font-medium">Score de base</span>
                    <span className="text-lg font-bold font-mono text-accent-green">100</span>
                  </div>
                  {d.score_details.deductions.map((ded, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent-red/5 border border-accent-red/10">
                      <span className="text-xs text-text-secondary flex-1 mr-4">{ded.raison}</span>
                      <span className="text-sm font-bold font-mono text-accent-red whitespace-nowrap">{ded.impact}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-bg-surface-2 border border-border-default mt-2">
                    <span className="text-sm font-bold text-text-primary">Score final</span>
                    <span className={cn('text-xl font-bold font-mono', d.score_confiance >= 75 ? 'text-accent-green' : d.score_confiance >= 40 ? 'text-accent-orange' : 'text-accent-red')}>{d.score_details.score_final}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'timeline' && (
            <div className="space-y-0 ml-4">
              {[
                { label: 'Souscription assurance', date: d.date_souscription, color: 'bg-accent-blue', done: true },
                { label: 'Demande d\'annulation', date: d.date_annulation, color: 'bg-accent-orange', done: true },
                { label: 'Reception par l\'agent', date: d.date_reception, color: 'bg-accent-cyan', done: true },
                { label: 'Analyse documentaire (OCR)', date: d.date_reception, color: 'bg-accent-purple', done: true },
                { label: `Scoring & decision : ${d.decision}`, date: d.date_reception, color: d.decision === 'auto_validé' ? 'bg-accent-green' : d.decision === 'attente' ? 'bg-accent-orange' : 'bg-accent-red', done: true },
                { label: 'Reponse envoyee', date: d.date_reponse || '', color: 'bg-accent-green', done: !!d.date_reponse },
                { label: 'Evenement sportif', date: d.date_evenement, color: 'bg-text-muted', done: false },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 pb-6 relative">
                  <div className="flex flex-col items-center">
                    <div className={cn('w-3 h-3 rounded-full border-2 border-bg-primary z-10', step.done ? step.color : 'bg-bg-surface-3')} />
                    {i < 6 && <div className="w-0.5 flex-1 bg-border-default" />}
                  </div>
                  <div className="pb-1">
                    <p className={cn('text-sm font-medium', step.done ? 'text-text-primary' : 'text-text-muted')}>{step.label}</p>
                    <p className="text-[11px] text-text-muted">{step.date ? formatDateTime(step.date) : 'En attente'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'anomalies' && (
            <div className="space-y-3">
              {d.anomalies.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle size={32} className="text-accent-green mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-text-muted">Aucune anomalie detectee</p>
                </div>
              ) : (
                d.anomalies.map((a, i) => (
                  <div key={i} className={cn('rounded-lg border p-4', a.severite === 'critique' ? 'bg-accent-red/5 border-accent-red/20' : 'bg-bg-surface-1 border-border-default')}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('text-xs font-semibold capitalize', a.type === 'temporelle' ? 'text-accent-orange' : a.type === 'documentaire' ? 'text-accent-red' : 'text-accent-purple')}>{a.type}</span>
                      <SeverityBadge severity={a.severite} />
                      <span className="text-xs font-mono font-bold text-accent-red">{a.impact_score} pts</span>
                    </div>
                    <p className="text-sm text-text-secondary">{a.description}</p>
                    {a.reference_cg && <p className="text-[11px] text-accent-cyan mt-2 font-mono">{a.reference_cg}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-4">
              {d.email_envoye ? (
                <div className="rounded-lg bg-bg-surface-1 border border-border-default p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail size={14} className="text-accent-blue" />
                    <span className="text-xs font-semibold text-text-primary">Email envoye</span>
                    {d.template_utilise && <span className="text-[10px] font-mono text-accent-cyan">({d.template_utilise})</span>}
                  </div>
                  <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{d.email_envoye}</div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Mail size={32} className="text-text-muted mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-text-muted">Aucun email envoye</p>
                  <p className="text-xs text-text-muted mt-1">Le dossier est en {d.status}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'historique' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-bg-surface-1 border border-border-default p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-bg-surface-3 flex items-center justify-center">
                    <span className="text-sm font-bold text-text-secondary">{getInitials(d.nom_assure)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{d.nom_assure}</p>
                    <p className="text-xs text-text-muted">{d.email_assure}</p>
                  </div>
                  {d.historique_assure.flag_suspect && (
                    <span className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded bg-accent-red/10 text-accent-red text-[10px] font-bold">
                      <AlertTriangle size={10} /> SUSPECT
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-bg-surface-2">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Demandes totales</p>
                    <p className="text-lg font-bold font-mono text-text-primary">{d.historique_assure.nb_demandes_total}</p>
                  </div>
                  <div className="p-3 rounded bg-bg-surface-2">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">6 derniers mois</p>
                    <p className={cn('text-lg font-bold font-mono', d.historique_assure.nb_demandes_6mois >= 3 ? 'text-accent-red' : 'text-text-primary')}>{d.historique_assure.nb_demandes_6mois}</p>
                  </div>
                  <div className="p-3 rounded bg-bg-surface-2 col-span-2">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Montant total rembourse</p>
                    <p className="text-lg font-bold font-mono text-text-primary">{formatCurrency(d.historique_assure.montant_total_rembourse)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-3 border-t border-border-default flex gap-2 bg-bg-surface-1/50">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-green/10 text-accent-green text-sm font-medium hover:bg-accent-green/20 transition-colors">
            <CheckCircle size={14} /> Valider
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-orange/10 text-accent-orange text-sm font-medium hover:bg-accent-orange/20 transition-colors">
            <XCircle size={14} /> Corriger
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-red/10 text-accent-red text-sm font-medium hover:bg-accent-red/20 transition-colors">
            <ArrowUpCircle size={14} /> Escalader
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
