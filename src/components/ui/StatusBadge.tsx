import { cn } from '../../lib/utils'

const config: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  'auto_validé': { label: 'Auto-validé', bg: 'bg-accent-green/10', text: 'text-accent-green', dot: 'bg-accent-green' },
  'traité': { label: 'Traité', bg: 'bg-accent-green/10', text: 'text-accent-green', dot: 'bg-accent-green' },
  'attente': { label: 'En attente', bg: 'bg-accent-orange/10', text: 'text-accent-orange', dot: 'bg-accent-orange' },
  'escaladé': { label: 'Escaladé', bg: 'bg-accent-red/10', text: 'text-accent-red', dot: 'bg-accent-red' },
  'réclamation': { label: 'Réclamation', bg: 'bg-accent-purple/10', text: 'text-accent-purple', dot: 'bg-accent-purple' },
  'nouveau': { label: 'Nouveau', bg: 'bg-accent-blue/10', text: 'text-accent-blue', dot: 'bg-accent-blue' },
  'analysé': { label: 'Analysé', bg: 'bg-accent-cyan/10', text: 'text-accent-cyan', dot: 'bg-accent-cyan' },
  'clos': { label: 'Clos', bg: 'bg-bg-surface-2', text: 'text-text-muted', dot: 'bg-text-muted' },
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const c = config[status] || config['nouveau']
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-transparent', c.bg, c.text, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot, status === 'escaladé' && 'animate-pulse-glow')} />
      {c.label}
    </span>
  )
}

export function MotifBadge({ motif, className }: { motif: string; className?: string }) {
  const colors: Record<string, string> = {
    'Blessure': 'bg-accent-red/10 text-accent-red',
    'Maladie': 'bg-accent-orange/10 text-accent-orange',
    'Professionnel': 'bg-accent-blue/10 text-accent-blue',
    'Familial': 'bg-accent-purple/10 text-accent-purple',
    'Personnel': 'bg-accent-pink/10 text-accent-pink',
    'Autre': 'bg-bg-surface-2 text-text-secondary',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', colors[motif] || colors['Autre'], className)}>
      {motif}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    'critique': 'bg-accent-red/15 text-accent-red border-accent-red/20',
    'elevee': 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
    'moyenne': 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
    'faible': 'bg-bg-surface-2 text-text-secondary border-border-default',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', colors[severity] || colors['faible'])}>
      {severity}
    </span>
  )
}
