import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

interface ScoreGaugeProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
}

export function ScoreGauge({ score, size = 80, strokeWidth = 6, className, showLabel = true }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference

  const color = score >= 75 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  const glowColor = score >= 75 ? 'rgba(16,185,129,0.3)' : score >= 40 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1c2842" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s ease-out',
            filter: `drop-shadow(0 0 6px ${glowColor})`,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold font-mono" style={{ color }}>{score}</span>
        </div>
      )}
    </div>
  )
}

export function ScoreMini({ score, className }: { score: number; className?: string }) {
  const color = score >= 75 ? 'text-accent-green' : score >= 40 ? 'text-accent-orange' : 'text-accent-red'
  const bg = score >= 75 ? 'bg-accent-green/10' : score >= 40 ? 'bg-accent-orange/10' : 'bg-accent-red/10'
  return (
    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-xs font-bold', bg, color, className)}>
      {score}
    </span>
  )
}
