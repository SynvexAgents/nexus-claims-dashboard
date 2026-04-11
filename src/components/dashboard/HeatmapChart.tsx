import { motion } from 'framer-motion'

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const hours = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h']

// Mock: demandes par jour/heure (0-10 scale)
const data: number[][] = [
  [1, 5, 8, 6, 7, 3, 1, 0], // Lun
  [2, 6, 9, 5, 8, 4, 2, 0], // Mar
  [1, 4, 7, 5, 6, 3, 1, 0], // Mer
  [2, 7, 10, 7, 9, 5, 2, 1], // Jeu
  [1, 5, 8, 6, 7, 4, 1, 0], // Ven
  [0, 1, 2, 2, 1, 1, 0, 0], // Sam
  [0, 0, 1, 1, 0, 0, 0, 0], // Dim
]

function getColor(value: number): string {
  if (value === 0) return 'rgba(28, 40, 66, 0.3)'
  if (value <= 2) return 'rgba(59, 130, 246, 0.15)'
  if (value <= 4) return 'rgba(59, 130, 246, 0.3)'
  if (value <= 6) return 'rgba(59, 130, 246, 0.5)'
  if (value <= 8) return 'rgba(34, 211, 238, 0.6)'
  return 'rgba(16, 185, 129, 0.7)'
}

export function HeatmapChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-xl bg-bg-surface-1 border border-border-default p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Heatmap des demandes</h3>
        <p className="text-[11px] text-text-muted">Volume par jour et heure · semaine en cours</p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          {/* Hours header */}
          <div className="flex mb-1 ml-10">
            {hours.map(h => (
              <div key={h} className="flex-1 text-center text-[9px] text-text-muted font-mono">{h}</div>
            ))}
          </div>
          {/* Rows */}
          {days.map((day, di) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <span className="w-9 text-right text-[10px] text-text-muted font-medium pr-1">{day}</span>
              {hours.map((_, hi) => (
                <motion.div
                  key={hi}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + (di * 8 + hi) * 0.01 }}
                  className="flex-1 aspect-square rounded-sm cursor-default group relative"
                  style={{ backgroundColor: getColor(data[di][hi]) }}
                  title={`${day} ${hours[hi]} : ${data[di][hi]} demandes`}
                >
                  {data[di][hi] > 0 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {data[di][hi]}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-10">
            <span className="text-[9px] text-text-muted">Moins</span>
            {[0, 2, 4, 6, 8, 10].map(v => (
              <div key={v} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(v) }} />
            ))}
            <span className="text-[9px] text-text-muted">Plus</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
