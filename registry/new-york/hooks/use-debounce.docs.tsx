import { DocSectionHeader } from '../../../src/components/doc-navigation-zustand'
import { DocSample } from '../../../src/components/registry/doc-sample'
import {
  BasicExample,
  SearchExample,
  DelayComparisonExample,
  ValidationExample
} from './samples'

/**
 * Documentation pour useDebounce - Version avec DocSample unifié
 * Fichier interne - Non inclus dans la registry
 */
export function UseDebounceDocumentationNew() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">useDebounce</h1>
          <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950/50 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300">
            React Hook
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un hook React pour retarder la mise à jour d'une valeur, idéal pour optimiser les performances
          lors de recherches, validations, ou appels d'API. Évite les requêtes excessives en attendant
          que l'utilisateur termine sa saisie.
        </p>
      </div>

      {/* Features section... */}

      {/* Examples - Version avec DocSample unifié */}
      <DocSectionHeader id="examples" title="Exemples">
        🎯 Exemples
      </DocSectionHeader>
      <div className="space-y-8">

        <DocSample
          id="basic-example"
          title="Utilisation de base"
          description={
            <div>
              <p className="mb-3">Exemple simple montrant le délai entre la valeur originale et debouncée.</p>
              <div>
                <p><strong>💡 Points clés :</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Délai de 500ms pour éviter les mises à jour trop fréquentes</li>
                  <li>Affichage visuel de la différence entre valeur originale et debouncée</li>
                  <li>Parfait pour les champs de recherche ou validation en temps réel</li>
                </ul>
              </div>
            </div>
          }
          sourceCode={`import { useState } from 'react'
import { useDebounce } from './use-debounce'
import { Input } from './components/ui/input'

export function BasicExample() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">
          Recherche (délai: 500ms)
        </label>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tapez pour rechercher..."
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
}`}
        >
          <BasicExample />
        </DocSample>

        <DocSample
          id="search-example"
          title="Recherche en temps réel"
          description={
            <div>
              <p className="mb-3">Implémentation d'une recherche avec API simulée.</p>
              <div>
                <p><strong>🔍 Cas d'usage :</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Délai de 300ms optimisé pour la recherche</li>
                  <li>Gestion d'état de chargement pendant les requêtes</li>
                  <li>Évite les appels API multiples lors de la frappe</li>
                  <li>Nettoie automatiquement les résultats si le champ est vide</li>
                </ul>
              </div>
            </div>
          }
          sourceCode={`import { useState, useEffect } from 'react'
import { useDebounce } from './use-debounce'
import { Input } from './components/ui/input'

export function SearchExample() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  const searchItems = async (searchTerm: string): Promise<string[]> => {
    if (!searchTerm.trim()) return []

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    const mockData = ['React Hook', 'Vue Composition API', 'Angular Service']
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
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher des technologies..."
      />

      {isLoading ? (
        <p>Recherche en cours...</p>
      ) : (
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      )}
    </div>
  )
}`}
        >
          <SearchExample />
        </DocSample>

        <DocSample
          id="delay-comparison"
          title="Comparaison des délais"
          description={
            <div>
              <p className="mb-3">Démonstration visuelle de différents délais de debounce.</p>
              <div>
                <p><strong>⏱️ Comparaison :</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>100ms</strong> - Très rapide, pour feedback immédiat</li>
                  <li><strong>500ms</strong> - Équilibre performance/réactivité</li>
                  <li><strong>1000ms</strong> - Plus lent, pour validations coûteuses</li>
                </ul>
              </div>
            </div>
          }
          sourceCode={`// Code source pour DelayComparisonExample...`}
        >
          <DelayComparisonExample />
        </DocSample>

        <DocSample
          id="validation-example"
          title="Validation d'email"
          description={
            <div>
              <p className="mb-3">Validation en temps réel avec feedback visuel.</p>
              <div>
                <p><strong>✨ Fonctionnalités :</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Validation de format email en temps réel</li>
                  <li>Feedback visuel avec indicateurs colorés</li>
                  <li>Délai optimisé pour éviter la sur-validation</li>
                  <li>Messages d'erreur contextuels</li>
                </ul>
              </div>
            </div>
          }
          sourceCode={`// Code source pour ValidationExample...`}
        >
          <ValidationExample />
        </DocSample>

      </div>

      {/* API Reference section... */}

    </div>
  )
}
