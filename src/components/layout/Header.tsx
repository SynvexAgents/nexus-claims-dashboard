import { Search, Bell } from 'lucide-react'
import type { PageId } from '../../types'

const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Vue d\'ensemble en temps reel' },
  dossiers: { title: 'Dossiers', subtitle: '30 dossiers · Toutes les demandes de remboursement' },
  anomalies: { title: 'Anomalies & Fraude', subtitle: 'Detection d\'anomalies et patterns suspects' },
  chat: { title: 'Chat Agent', subtitle: 'Interrogez l\'agent sur n\'importe quel dossier' },
}

interface HeaderProps {
  currentPage: PageId
  onOpenSearch: () => void
}

export function Header({ currentPage, onOpenSearch }: HeaderProps) {
  const page = pageTitles[currentPage]
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-default bg-bg-primary/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="lg:pl-0 pl-12">
        <h2 className="text-xl font-bold text-text-primary">{page.title}</h2>
        <p className="text-xs text-text-muted mt-0.5">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface-2 border border-border-default text-text-muted text-sm hover:border-border-hover hover:text-text-secondary transition-all"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Rechercher...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-bg-surface-3 text-[10px] font-mono font-medium text-text-muted border border-border-default">
            Ctrl K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-bg-surface-2 transition-colors">
          <Bell size={18} className="text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-red" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
          <span className="text-xs font-bold text-white">NB</span>
        </div>
      </div>
    </header>
  )
}
