import { useState } from 'react'
import { NumericInput } from '../numeric-input'

export function PrefixSuffixExample() {
  const [price, setPrice] = useState<number | undefined>(299.99)
  const [percentage, setPercentage] = useState<number | undefined>(75)

  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <label className="text-sm font-medium block mb-2">Prix avec devise</label>
        <NumericInput
          value={price}
          min={0}
          decimals={2}
          prefix="€"
          onValueChange={setPrice}
          placeholder="0.00"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Prix: {price !== undefined ? `€${price.toFixed(2)}` : 'aucun'}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Pourcentage</label>
        <NumericInput
          value={percentage}
          min={0}
          max={100}
          suffix="%"
          onValueChange={setPercentage}
          placeholder="0-100%"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Pourcentage: {percentage !== undefined ? `${percentage}%` : 'aucun'}
        </p>
      </div>
    </div>
  )
}
