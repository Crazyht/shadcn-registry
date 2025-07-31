import { useState, useEffect } from 'react'
import { useDebounce } from '../use-debounce'

export function SearchExample() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  // Simulated search function
  const searchItems = async (searchTerm: string): Promise<string[]> => {
    if (!searchTerm.trim()) return []

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    const mockData = [
      'React Hook', 'Vue Composition API', 'Angular Service',
      'Svelte Store', 'Redux Toolkit', 'Zustand', 'MobX',
      'TypeScript Interface', 'JavaScript Function', 'CSS Module'
    ]

    return mockData.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true)
      searchItems(debouncedQuery).then(data => {
        setResults(data)
        setIsLoading(false)
      })
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [debouncedQuery])

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">Recherche en temps réel</label>
        <input
          type="text"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Rechercher des technologies..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="rounded-lg border p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Recherche en cours...</p>
        ) : results.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Résultats ({results.length}):</p>
            <ul className="space-y-1">
              {results.map((result, index) => (
                <li key={index} className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        ) : query && debouncedQuery ? (
          <p className="text-sm text-muted-foreground">Aucun résultat trouvé</p>
        ) : (
          <p className="text-sm text-muted-foreground">Commencez à taper pour rechercher</p>
        )}
      </div>
    </div>
  )
}
