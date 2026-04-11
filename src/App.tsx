import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { CommandPalette } from './components/layout/CommandPalette'
import { DashboardPage } from './pages/DashboardPage'
import { DossiersPage } from './pages/DossiersPage'
import { AnomaliesPage } from './pages/AnomaliesPage'
import { ChatPage } from './pages/ChatPage'
import { DossierDetail } from './components/dossiers/DossierDetail'
import type { PageId, Dossier } from './types'

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const toggleSearch = useCallback(() => setSearchOpen(prev => !prev), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        toggleSearch()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleSearch])

  return (
    <div className="noise-bg min-h-screen bg-bg-primary text-text-primary font-sans">
      <Sidebar currentPage={page} onNavigate={setPage} />

      <main className="lg:ml-[260px] min-h-screen">
        <Header currentPage={page} onOpenSearch={toggleSearch} />

        {page === 'dashboard' && <DashboardPage onViewDossier={setSelectedDossier} onNavigate={setPage} />}
        {page === 'dossiers' && <DossiersPage onViewDossier={setSelectedDossier} />}
        {page === 'anomalies' && <AnomaliesPage onViewDossier={setSelectedDossier} />}
        {page === 'chat' && <ChatPage />}
      </main>

      {selectedDossier && (
        <DossierDetail dossier={selectedDossier} onClose={() => setSelectedDossier(null)} />
      )}

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDossier={(d) => { setSelectedDossier(d); setSearchOpen(false) }}
        onNavigate={(p) => { setPage(p); setSearchOpen(false) }}
      />
    </div>
  )
}
