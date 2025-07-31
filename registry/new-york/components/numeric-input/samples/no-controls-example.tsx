import { useState } from 'react'
import { NumericInput } from '../numeric-input'

export function NoControlsExample() {
  const [value, setValue] = useState<number | undefined>(42)

  return (
    <div className="w-full max-w-sm space-y-3">
      <div>
        <label className="text-sm font-medium block mb-2">Sans boutons +/-</label>
        <NumericInput
          value={value}
          showControls={false}
          onValueChange={setValue}
          placeholder="Input simple"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Input numérique sans contrôles visuels | Valeur: {value ?? 'aucune'}
      </p>
    </div>
  )
}
