import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { mockChatMessages } from '../data/mockChat'
import { cn } from '../lib/utils'
import type { ChatMessage } from '../types'

const quickActions = [
  'Pourquoi cette decision ?',
  'Risque de fraude ?',
  'Articles CG applicables ?',
  'Historique de l\'assure',
]

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: input, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'agent',
        content: `Je comprends votre question. Pour y repondre precisement, je dois analyser les donnees du dossier concerne.\n\n**Note :** En mode demonstration, les reponses sont pre-enregistrees. En production, l'agent interroge la base Airtable en temps reel et repond en citant les articles des conditions generales.`,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, agentMsg])
      setIsTyping(false)
    }, 1500)
  }

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      let processed = line
      // Bold
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
      // Inline code
      processed = processed.replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-bg-surface-3 text-accent-cyan text-[11px] font-mono">$1</code>')

      if (line.startsWith('| ')) {
        return <div key={i} className="font-mono text-[11px] text-text-secondary whitespace-pre">{line}</div>
      }
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Chat Header */}
      <div className="px-6 py-3 border-b border-border-default flex items-center gap-3 bg-bg-surface-1/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            Nexus Claims Agent
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              En ligne
            </span>
          </h3>
          <p className="text-[10px] text-text-muted">Interrogez l'agent sur n'importe quel dossier · Reponses basees sur les CG</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i < mockChatMessages.length ? 0 : 0.1 }}
            className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div className={cn('flex gap-2.5 max-w-[85%]', msg.role === 'user' ? 'flex-row-reverse' : '')}>
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                msg.role === 'user' ? 'bg-accent-blue/20' : 'bg-bg-surface-3'
              )}>
                {msg.role === 'user' ? <User size={14} className="text-accent-blue" /> : <Bot size={14} className="text-accent-cyan" />}
              </div>
              <div className={cn(
                'rounded-2xl px-4 py-3 text-xs',
                msg.role === 'user'
                  ? 'bg-accent-blue/10 border border-accent-blue/20 text-text-primary rounded-tr-sm'
                  : 'glass border border-border-default text-text-secondary rounded-tl-sm'
              )}>
                {renderContent(msg.content)}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-bg-surface-3 flex items-center justify-center">
                <Bot size={14} className="text-accent-cyan" />
              </div>
              <div className="glass border border-border-default rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-2 flex gap-2 overflow-x-auto">
        {quickActions.map(action => (
          <button
            key={action}
            onClick={() => setInput(action)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface-2 border border-border-default text-[11px] text-text-muted hover:text-text-secondary hover:border-border-hover transition-all"
          >
            <Sparkles size={10} />
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border-default">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Interroger l'agent sur un dossier..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-bg-surface-1 border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl bg-accent-blue text-white font-medium text-sm hover:bg-accent-blue/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
