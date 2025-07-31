import { useState } from 'react'
import { NumericInput } from '../numeric-input'

export function ConstraintsExample() {
  const [value, setValue] = useState<number | undefined>(50)

  return (
    <div className="w-full max-w-sm space-y-3">
      <div>
        <label className="text-sm font-medium block mb-2">Valeur entre 0 et 100</label>
        <NumericInput
          value={value}
          min={0}
          max={100}
          step={10}
          onValueChange={setValue}
          placeholder="0-100"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Min: 0, Max: 100, Step: 10 | Valeur: {value ?? 'aucune'}
      </p>
    </div>
  )
}
