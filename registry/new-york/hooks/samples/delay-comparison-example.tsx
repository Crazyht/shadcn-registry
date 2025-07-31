import { useState } from 'react'
import { useDebounce } from '../use-debounce'

export function DelayComparisonExample() {
  const [inputValue, setInputValue] = useState('')
  const fastDebounce = useDebounce(inputValue, 100)
  const mediumDebounce = useDebounce(inputValue, 500)
  const slowDebounce = useDebounce(inputValue, 1000)

  const resetValue = () => {
    setInputValue('')
  }

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          placeholder="Comparez différents délais..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          onClick={resetValue}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-3">
        <div className="p-3 border rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Rapide (100ms)</span>
            <span className="text-xs text-muted-foreground">⚡ Réactif</span>
          </div>
          <p className="text-sm text-orange-600 font-mono">"{fastDebounce}"</p>
        </div>

        <div className="p-3 border rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Moyen (500ms)</span>
            <span className="text-xs text-muted-foreground">⚖️ Équilibré</span>
          </div>
          <p className="text-sm text-blue-600 font-mono">"{mediumDebounce}"</p>
        </div>

        <div className="p-3 border rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Lent (1000ms)</span>
            <span className="text-xs text-muted-foreground">🐌 Économe</span>
          </div>
          <p className="text-sm text-purple-600 font-mono">"{slowDebounce}"</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Tapez rapidement pour voir la différence entre les délais
      </p>
    </div>
  )
}
