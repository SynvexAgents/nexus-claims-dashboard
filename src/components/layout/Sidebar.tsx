import { LayoutDashboard, FolderOpen, AlertTriangle, MessageCircle, Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { PageId } from '../../types'
import { useState } from 'react'

const navItems: { id: PageId; icon: typeof LayoutDashboard; label: string; badge?: number }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'dossiers', icon: FolderOpen, label: 'Dossiers', badge: 30 },
  { id: 'anomalies', icon: AlertTriangle, label: 'Anomalies', badge: 3 },
  { id: 'chat', icon: MessageCircle, label: 'Chat Agent' },
]

interface SidebarProps {
  currentPage: PageId
  onNavigate: (page: PageId) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-bg-surface-1 border border-border-default text-text-primary"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-30" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-full w-[260px] glass border-r border-border-default z-40 flex flex-col transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
              <span className="text-white font-bold text-sm">NC</span>
            </div>
            <div>
              <h1 className="gradient-text text-lg font-bold tracking-tight leading-none">Nexus Claims</h1>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium">by Synvex</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  active
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-3'
                )}
              >
                <item.icon size={18} className={cn(active ? 'text-accent-blue' : 'text-text-muted group-hover:text-text-secondary')} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    'min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5',
                    item.id === 'anomalies' ? 'bg-accent-red/20 text-accent-red' : 'bg-bg-surface-2 text-text-muted'
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Agent Status */}
        <div className="p-4 mx-3 mb-3 rounded-lg bg-bg-surface-2 border border-border-default">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green" />
            </span>
            <span className="text-xs font-semibold text-accent-green">Agent actif</span>
          </div>
          <p className="text-[11px] text-text-muted">Derniere analyse il y a 3 min</p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-purple/20 flex items-center justify-center">
              <span className="text-xs font-bold text-accent-purple">AC</span>
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">Assur Connect</p>
              <p className="text-[10px] text-text-muted">BEsafe · Tokio Marine</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
