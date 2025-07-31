import { useState } from 'react'
import { useDebounce } from '../use-debounce'

export function BasicExample() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">Recherche (délai: 500ms)</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          placeholder="Tapez pour rechercher..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Valeur actuelle:</span>
          <span className="ml-2 text-muted-foreground">"{searchTerm}"</span>
        </p>
        <p>
          <span className="font-medium">Valeur debouncée:</span>
          <span className="ml-2 text-blue-600">"{debouncedSearchTerm}"</span>
        </p>
      </div>
    </div>
  )
}
