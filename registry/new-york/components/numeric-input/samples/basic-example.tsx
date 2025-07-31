import { useState } from 'react'
import { NumericInput } from '../numeric-input'

export function BasicExample() {
  const [value, setValue] = useState<number | undefined>(25)

  return (
    <div className="w-full max-w-sm space-y-3">
      <div>
        <label className="text-sm font-medium block mb-2">Valeur numérique</label>
        <NumericInput
          value={value}
          onValueChange={setValue}
          placeholder="Entrez un nombre"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Valeur actuelle: {value ?? 'aucune'}
      </p>
    </div>
  )
}
