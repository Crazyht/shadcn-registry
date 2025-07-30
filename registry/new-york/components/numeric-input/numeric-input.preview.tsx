import { NumericInput } from './numeric-input'
import { useState } from 'react'

/**
 * Preview pour NumericInput
 * Fichier interne - Non inclus dans la registry
 */
export function NumericInputPreview() {
  const [value, setValue] = useState<number | undefined>(25)

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-xs">
        <NumericInput
          value={value}
          min={0}
          max={100}
          step={5}
          suffix="%"
          onValueChange={setValue}
          placeholder="Entrez un nombre"
        />
      </div>
    </div>
  )
}
