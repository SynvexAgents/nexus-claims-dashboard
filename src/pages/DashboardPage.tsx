import { motion } from 'framer-motion'
import { FileCheck, CheckCircle, Clock, AlertTriangle, MessageSquare, Shield, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { Sparkline } from '../components/ui/Sparkline'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ScoreMini } from '../components/ui/ScoreGauge'
import { kpiData, autoValidationData, volumeData, motifData, statusData, activityFeed, comparisonData } from '../data/mockStats'
import { mockDossiers } from '../data/mockDossiers'
import { HeatmapChart } from '../components/dashboard/HeatmapChart'
import { timeAgo } from '../lib/utils'
import type { Dossier } from '../types'

const iconMap: Record<string, typeof FileCheck> = { FileCheck, CheckCircle, Clock, AlertTriangle, MessageSquare, Shield }

const sparklineColors: Record<string, string> = {
  'text-accent-blue': '#3b82f6', 'text-accent-green': '#10b981', 'text-accent-cyan': '#22d3ee',
  'text-accent-red': '#ef4444', 'text-accent-purple': '#a78bfa', 'text-accent-orange': '#f59e0b',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 border border-border-default text-xs">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: {p.value}{typeof p.value === 'number' && p.value < 100 ? '' : ''}</p>
      ))}
    </div>
  )
}

interface DashboardPageProps {
  onViewDossier: (d: Dossier) => void
  onNavigate: (page: 'dossiers') => void
}

export function DashboardPage({ onViewDossier, onNavigate }: DashboardPageProps) {
  const recentDossiers = mockDossiers.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, i) => {
          const Icon = iconMap[kpi.icon] || FileCheck
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative rounded-xl bg-bg-surface-1 border border-border-default p-4 hover:border-border-hover transition-all duration-300 group ${kpi.glowClass} overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${sparklineColors[kpi.color]}15, transparent 70%)` }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Icon size={16} className={kpi.color} />
                  <Sparkline data={kpi.sparkline} width={48} height={16} color={sparklineColors[kpi.color]} />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary">
                  <AnimatedCounter value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.value % 1 !== 0 ? 1 : 0} />
                </div>
                <p className="text-[11px] text-text-muted mt-1 font-medium">{kpi.label}</p>
                <div className="flex items-center gap-1 mt-2">
                  {kpi.trend > 0 ? <TrendingUp size={10} className="text-accent-green" /> : kpi.trend < 0 ? <TrendingDown size={10} className="text-accent-green" /> : null}
                  <span className={`text-[10px] font-semibold ${kpi.trend < 0 ? 'text-accent-green' : kpi.trend > 0 ? 'text-accent-green' : 'text-text-muted'}`}>
                    {kpi.trend > 0 ? '+' : ''}{kpi.trend}% {kpi.trendLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Auto-validation Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl bg-bg-surface-1 border border-border-default p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Taux d'auto-validation</h3>
              <p className="text-[11px] text-text-muted">30 derniers jours · Objectif 96%</p>
            </div>
            <span className="text-xs font-mono font-bold text-accent-green">94.2%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={autoValidationData}>
              <defs>
                <linearGradient id="gradAuto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2842" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#4a5870' }} axisLine={false} tickLine={false} interval={6} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: '#4a5870' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="taux" stroke="#10b981" strokeWidth={2} fill="url(#gradAuto)" name="Taux" animationDuration={2000} />
              {/* 96% target line */}
              <Area type="monotone" dataKey={() => 96} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Objectif" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Volume Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl bg-bg-surface-1 border border-border-default p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Volume quotidien</h3>
              <p className="text-[11px] text-text-muted">7 derniers jours · Recus vs traites</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={volumeData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2842" vertical={false} />
              <XAxis dataKey="jour" tick={{ fontSize: 10, fill: '#4a5870' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#4a5870' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="recus" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Reçus" animationDuration={1500} />
              <Bar dataKey="traites" fill="#10b981" radius={[4, 4, 0, 0]} name="Traités" animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Motif Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl bg-bg-surface-1 border border-border-default p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Repartition par motif</h3>
            <p className="text-[11px] text-text-muted">Distribution des motifs d'annulation</p>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={motifData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" animationDuration={1500} stroke="none">
                  {motifData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {motifData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-text-primary">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-xl bg-bg-surface-1 border border-border-default p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Repartition par statut</h3>
            <p className="text-[11px] text-text-muted">Decisions de l'agent cette semaine</p>
          </div>
          <div className="space-y-3">
            {statusData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary">{item.name}</span>
                  <span className="text-xs font-mono font-semibold text-text-primary">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-bg-surface-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Heatmap */}
      <HeatmapChart />

      {/* Bottom Section: Activity Feed + Comparison + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="rounded-xl bg-bg-surface-1 border border-border-default p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Activite en temps reel</h3>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {activityFeed.map((item) => {
              const colors: Record<string, string> = { auto_validé: 'text-accent-green', attente: 'text-accent-orange', escaladé: 'text-accent-red', réclamation: 'text-accent-purple', analyse: 'text-accent-cyan', email_envoyé: 'text-accent-blue' }
              return (
                <div key={item.id} className="flex gap-3 items-start group">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colors[item.type]?.replace('text-', 'bg-') || 'bg-text-muted'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-secondary truncate">{item.message}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-accent-blue">{item.ref_dossier}</span>
                      <span className="text-[10px] text-text-muted">{timeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="rounded-xl bg-bg-surface-1 border border-border-default p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-1">Avant / Apres agent</h3>
          <p className="text-[11px] text-text-muted mb-4">Impact de l'automatisation</p>
          <div className="space-y-3">
            {comparisonData.map((item) => (
              <div key={item.metrique} className="rounded-lg bg-bg-surface-2 border border-border-default p-3">
                <p className="text-[11px] text-text-muted mb-2 font-medium">{item.metrique}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary line-through opacity-60">{item.avant}</span>
                  <ArrowRight size={12} className="text-text-muted" />
                  <span className="text-sm font-bold text-text-primary">{item.apres}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: item.gainColor }}>{item.gain}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Dossiers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="rounded-xl bg-bg-surface-1 border border-border-default p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Dossiers recents</h3>
            <button onClick={() => onNavigate('dossiers')} className="text-[11px] text-accent-blue hover:text-accent-cyan transition-colors font-medium">
              Voir tous →
            </button>
          </div>
          <div className="space-y-2">
            {recentDossiers.map((d) => (
              <button
                key={d.id}
                onClick={() => onViewDossier(d)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-surface-2 transition-colors text-left group"
              >
                <ScoreMini score={d.score_confiance} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{d.nom_assure}</p>
                  <p className="text-[10px] text-text-muted truncate">{d.nom_evenement}</p>
                </div>
                <StatusBadge status={d.status} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
