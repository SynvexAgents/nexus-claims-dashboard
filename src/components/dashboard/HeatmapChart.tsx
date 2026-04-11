import { motion } from 'framer-motion'

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const hours = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h']

const data: number[][] = [
  [1, 5, 8, 6, 7, 3, 1, 0],
  [2, 6, 9, 5, 8, 4, 2, 0],
  [1, 4, 7, 5, 6, 3, 1, 0],
  [2, 7, 10, 7, 9, 5, 2, 1],
  [1, 5, 8, 6, 7, 4, 1, 0],
  [0, 1, 2, 2, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0],
]

function getColor(value: number): string {
  if (value === 0) return 'rgba(28, 40, 66, 0.3)'
  if (value <= 2) return 'rgba(59, 130, 246, 0.15)'
  if (value <= 4) return 'rgba(59, 130, 246, 0.35)'
  if (value <= 6) return 'rgba(34, 211, 238, 0.4)'
  if (value <= 8) return 'rgba(34, 211, 238, 0.6)'
  return 'rgba(16, 185, 129, 0.65)'
}

export function HeatmapChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-xl bg-bg-surface-1 border border-border-default p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Heatmap des demandes</h3>
          <p className="text-[11px] text-text-muted">Volume par jour et heure · semaine en cours</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-text-muted">Moins</span>
          {[0, 2, 4, 6, 8, 10].map(v => (
            <div key={v} className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: getColor(v) }} />
          ))}
          <span className="text-[9px] text-text-muted">Plus</span>
        </div>
      </div>
      <div className="grid grid-cols-[32px_repeat(8,1fr)] gap-[3px]">
        {/* Header */}
        <div />
        {hours.map(h => (
          <div key={h} className="text-center text-[9px] text-text-muted font-mono py-0.5">{h}</div>
        ))}
        {/* Rows */}
        {days.flatMap((day, di) => [
          <div key={`label-${day}`} className="flex items-center justify-end pr-1">
            <span className="text-[10px] text-text-muted font-medium">{day}</span>
          </div>,
          ...hours.map((_, hi) => (
            <motion.div
              key={`${day}-${hi}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + (di * 8 + hi) * 0.008 }}
              className="h-[22px] rounded-[3px] cursor-default group relative transition-all duration-200 hover:ring-1 hover:ring-text-muted/30 hover:scale-105"
              style={{ backgroundColor: getColor(data[di][hi]) }}
              title={`${day} ${hours[hi]} : ${data[di][hi]} demandes`}
            >
              {data[di][hi] > 0 && (
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  {data[di][hi]}
                </span>
              )}
            </motion.div>
          )),
        ])}
      </div>
    </motion.div>
  )
}
