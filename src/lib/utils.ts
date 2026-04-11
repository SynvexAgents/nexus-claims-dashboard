import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatScore(score: number): string {
  return `${score}/100`
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-accent-green'
  if (score >= 40) return 'text-accent-orange'
  return 'text-accent-red'
}

export function getScoreGlowClass(score: number): string {
  if (score >= 75) return 'glow-green'
  if (score >= 40) return 'glow-orange'
  return 'glow-red'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'auto_validé': 'text-accent-green',
    'traité': 'text-accent-green',
    'attente': 'text-accent-orange',
    'escaladé': 'text-accent-red',
    'réclamation': 'text-accent-purple',
    'nouveau': 'text-accent-blue',
    'analysé': 'text-accent-cyan',
  }
  return colors[status] || 'text-text-secondary'
}

export function getStatusBg(status: string): string {
  const colors: Record<string, string> = {
    'auto_validé': 'bg-accent-green/10 border-accent-green/20',
    'traité': 'bg-accent-green/10 border-accent-green/20',
    'attente': 'bg-accent-orange/10 border-accent-orange/20',
    'escaladé': 'bg-accent-red/10 border-accent-red/20',
    'réclamation': 'bg-accent-purple/10 border-accent-purple/20',
    'nouveau': 'bg-accent-blue/10 border-accent-blue/20',
    'analysé': 'bg-accent-cyan/10 border-accent-cyan/20',
  }
  return colors[status] || 'bg-bg-surface-2 border-border-default'
}

export function getMotifColor(motif: string): string {
  const colors: Record<string, string> = {
    'Blessure': 'text-accent-red',
    'Maladie': 'text-accent-orange',
    'Professionnel': 'text-accent-blue',
    'Familial': 'text-accent-purple',
    'Personnel': 'text-accent-pink',
    'Autre': 'text-text-secondary',
  }
  return colors[motif] || 'text-text-secondary'
}

export function getMotifBg(motif: string): string {
  const colors: Record<string, string> = {
    'Blessure': 'bg-accent-red/10 border-accent-red/20',
    'Maladie': 'bg-accent-orange/10 border-accent-orange/20',
    'Professionnel': 'bg-accent-blue/10 border-accent-blue/20',
    'Familial': 'bg-accent-purple/10 border-accent-purple/20',
    'Personnel': 'bg-accent-pink/10 border-accent-pink/20',
    'Autre': 'bg-bg-surface-2 border-border-default',
  }
  return colors[motif] || 'bg-bg-surface-2 border-border-default'
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'il y a quelques secondes'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `il y a ${days}j`
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
