import { useState } from 'react'
import { AnimatedCounter } from '../animated-counter'

export function InteractiveExample() {
  const [value, setValue] = useState(1234)

  const presetValues = [500, 1234, 5678, 12500, 99999]

  return (
    <div className="text-center space-y-6">
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
        <div className="text-5xl font-bold text-blue-600 mb-4">
          <AnimatedCounter value={value} prefix="$" />
        </div>
        <p className="text-sm text-muted-foreground">
          Cliquez sur les boutons pour voir l'animation
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presetValues.map(preset => (
          <button
            key={preset}
            onClick={() => setValue(preset)}
            className="px-3 py-2 text-sm border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            ${preset.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  )
}
