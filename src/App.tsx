import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { CommandPalette } from './components/layout/CommandPalette'
import { DashboardPage } from './pages/DashboardPage'
import { DossiersPage } from './pages/DossiersPage'
import { AnomaliesPage } from './pages/AnomaliesPage'
import { ChatPage } from './pages/ChatPage'
import { DossierDetail } from './components/dossiers/DossierDetail'
import { ToastContainer, useToasts, useAutoToasts } from './components/ui/Toast'
import type { PageId, Dossier } from './types'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const { toasts, addToast, removeToast } = useToasts()

  useAutoToasts(addToast)

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
      {/* Mesh gradient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-blue/[0.03] rounded-full blur-[150px] animate-[float_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-purple/[0.03] rounded-full blur-[150px] animate-[float_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent-cyan/[0.02] rounded-full blur-[120px] animate-[float_15s_ease-in-out_infinite]" />
      </div>

      <Sidebar currentPage={page} onNavigate={setPage} />

      <main className="lg:ml-[260px] min-h-screen relative z-10">
        <Header currentPage={page} onOpenSearch={toggleSearch} />

        <AnimatePresence mode="wait">
          <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {page === 'dashboard' && <DashboardPage onViewDossier={setSelectedDossier} onNavigate={setPage} />}
            {page === 'dossiers' && <DossiersPage onViewDossier={setSelectedDossier} />}
            {page === 'anomalies' && <AnomaliesPage onViewDossier={setSelectedDossier} />}
            {page === 'chat' && <ChatPage />}
          </motion.div>
        </AnimatePresence>
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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
