import { DocSample, InstallationCommand } from '../../../src/components/registry'
import {
  BasicExample,
  SearchExample,
  DelayComparisonExample,
  ValidationExample
} from './samples'

/**
 * Documentation pour useDebounce
 * Fichier interne - Non inclus dans la registry
 */
export function UseDebounceDocumentation() {
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

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          ✨ Fonctionnalités
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="font-medium">Optimisation Performance</h3>
              <p className="text-sm text-muted-foreground">Réduit les appels d'API et calculs inutiles</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🔧</div>
            <div>
              <h3 className="font-medium">Configurable</h3>
              <p className="text-sm text-muted-foreground">Délai personnalisable selon le cas d'usage</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-medium">TypeScript</h3>
              <p className="text-sm text-muted-foreground">Support complet des types génériques</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🧹</div>
            <div>
              <h3 className="font-medium">Cleanup Automatique</h3>
              <p className="text-sm text-muted-foreground">Gestion automatique des timeouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📦 Installation
        </h2>
        <InstallationCommand componentPath="hooks/use-debounce" />
        <p className="text-sm text-muted-foreground">
          Aucune dépendance externe requise, utilise uniquement les hooks React natifs.
        </p>
      </div>

      {/* API Reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📚 Référence API
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">useDebounce&lt;T&gt;</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Paramètre</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-4 font-mono">value</td>
                    <td className="p-4"><code>T</code></td>
                    <td className="p-4">Valeur à debouncer (peut être de n'importe quel type)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono">delay</td>
                    <td className="p-4"><code>number</code></td>
                    <td className="p-4">Délai en millisecondes avant la mise à jour</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Valeur de retour</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="p-4"><code>T</code></td>
                    <td className="p-4">Valeur debouncée qui se met à jour après le délai spécifié</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Délais recommandés</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-orange-600">100-200ms</h4>
                <p className="text-sm text-muted-foreground mt-1">Autocomplete, suggestions</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-blue-600">300-500ms</h4>
                <p className="text-sm text-muted-foreground mt-1">Recherche, filtrage</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-purple-600">800-1000ms</h4>
                <p className="text-sm text-muted-foreground mt-1">Validation, sauvegarde</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          🎯 Exemples
        </h2>

        <div className="grid gap-6">
          <DocSample
            title="Utilisation de base"
            description="Exemple simple montrant le délai entre la valeur originale et debouncée"
            sourceCode={`import { useState } from 'react'
import { useDebounce } from './use-debounce'
import { Input } from './components/ui/input'

export function BasicExample() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">Recherche (délai: 500ms)</label>
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
            title="Recherche en temps réel"
            description="Implémentation d'une recherche avec API simulée"
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
            title="Comparaison des délais"
            description="Démonstration visuelle de différents délais de debounce"
            sourceCode={`import { useState } from 'react'
import { useDebounce } from './use-debounce'
import { Input } from './components/ui/input'

export function DelayComparisonExample() {
  const [inputValue, setInputValue] = useState('')
  const fastDebounce = useDebounce(inputValue, 100)
  const mediumDebounce = useDebounce(inputValue, 500)
  const slowDebounce = useDebounce(inputValue, 1000)

  return (
    <div className="space-y-4">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Comparez différents délais..."
      />

      <div className="grid gap-3">
        <div className="p-3 border rounded-lg">
          <span className="font-medium">Rapide (100ms):</span>
          <span className="text-orange-600"> "{fastDebounce}"</span>
        </div>
        <div className="p-3 border rounded-lg">
          <span className="font-medium">Moyen (500ms):</span>
          <span className="text-blue-600"> "{mediumDebounce}"</span>
        </div>
        <div className="p-3 border rounded-lg">
          <span className="font-medium">Lent (1000ms):</span>
          <span className="text-purple-600"> "{slowDebounce}"</span>
        </div>
      </div>
    </div>
  )
}`}
          >
            <DelayComparisonExample />
          </DocSample>

          <DocSample
            title="Validation d'email"
            description="Validation en temps réel avec feedback visuel"
            sourceCode={`import { useState, useEffect } from 'react'
import { useDebounce } from './use-debounce'
import { Input } from './components/ui/input'

export function ValidationExample() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const debouncedEmail = useDebounce(email, 400)

  const validateEmail = async (emailValue: string): Promise<string[]> => {
    const validationErrors: string[] = []
    if (!emailValue) return validationErrors

    // Email format validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
    if (!emailRegex.test(emailValue)) {
      validationErrors.push('Format d\\'email invalide')
    }

    // Simulate async validation
    await new Promise(resolve => setTimeout(resolve, 300))

    const existingEmails = ['test@example.com', 'admin@test.com']
    if (existingEmails.includes(emailValue.toLowerCase())) {
      validationErrors.push('Cette adresse email est déjà utilisée')
    }

    return validationErrors
  }

  useEffect(() => {
    if (debouncedEmail) {
      setIsValidating(true)
      validateEmail(debouncedEmail).then(validationErrors => {
        setErrors(validationErrors)
        setIsValidating(false)
      })
    } else {
      setErrors([])
    }
  }, [debouncedEmail])

  return (
    <div className="space-y-3">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="exemple@domaine.com"
        className={errors.length > 0 ? 'border-red-500' : ''}
      />

      {isValidating && <p className="text-sm">Validation en cours...</p>}
      {errors.map((error, index) => (
        <p key={index} className="text-sm text-red-600">{error}</p>
      ))}
      {!isValidating && email && errors.length === 0 && (
        <p className="text-sm text-green-600">✓ Email valide</p>
      )}
    </div>
  )
}`}
          >
            <ValidationExample />
          </DocSample>
        </div>
      </div>
    </div>
  )
}

// Default export for dynamic loading
export default UseDebounceDocumentation
