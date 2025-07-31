import { useState } from 'react'
import { useMediaQuery } from '../use-media-query'

export function MediaQueryCustomExample() {
  const [customQuery, setCustomQuery] = useState('(min-width: 600px)')
  const [testQueries] = useState([
    '(max-width: 480px)',
    '(min-width: 600px)',
    '(orientation: landscape)',
    '(orientation: portrait)',
    '(hover: hover)',
    '(pointer: fine)',
    '(display-mode: standalone)',
    '(prefers-color-scheme: dark)'
  ])

  const customResult = useMediaQuery(customQuery)

  // Utiliser les hooks pour chaque query
  const queryResults = [
    { query: testQueries[0], matches: useMediaQuery(testQueries[0]) },
    { query: testQueries[1], matches: useMediaQuery(testQueries[1]) },
    { query: testQueries[2], matches: useMediaQuery(testQueries[2]) },
    { query: testQueries[3], matches: useMediaQuery(testQueries[3]) },
    { query: testQueries[4], matches: useMediaQuery(testQueries[4]) },
    { query: testQueries[5], matches: useMediaQuery(testQueries[5]) },
    { query: testQueries[6], matches: useMediaQuery(testQueries[6]) },
    { query: testQueries[7], matches: useMediaQuery(testQueries[7]) }
  ]

  return (
    <div className="space-y-6">
      {/* Testeur de requête personnalisée */}
      <div className="space-y-3">
        <h3 className="font-medium">🔧 Testeur de Media Query personnalisée</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="(min-width: 768px)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
          />
          <div className={`px-3 py-2 rounded-md text-sm font-medium ${
            customResult
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {customResult ? '✓ Correspond' : '✗ Ne correspond pas'}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Saisissez une media query CSS valide pour tester en temps réel
        </p>
      </div>

      {/* Requêtes prédéfinies */}
      <div className="space-y-3">
        <h3 className="font-medium">📋 Media Queries courantes</h3>
        <div className="grid gap-2">
          {queryResults.map(({ query, matches }, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 border rounded-md transition-colors ${
                matches ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <code className="text-sm font-mono text-gray-700">{query}</code>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${matches ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className={`text-sm font-medium ${matches ? 'text-green-600' : 'text-gray-500'}`}>
                  {matches ? 'Vrai' : 'Faux'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requêtes rapides */}
      <div className="space-y-3">
        <h3 className="font-medium">⚡ Tests rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {testQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => setCustomQuery(query)}
              className="p-2 text-sm border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {query.split(':')[0].replace('(', '').replace(')', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Info sur l'appareil actuel */}
      <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          📱 Informations sur votre appareil
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300">Largeur d'écran:</span>
            <span className="ml-2 font-mono">{typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Hauteur d'écran:</span>
            <span className="ml-2 font-mono">{typeof window !== 'undefined' ? window.innerHeight : 'N/A'}px</span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Orientation:</span>
            <span className="ml-2 font-mono">
              {useMediaQuery('(orientation: landscape)') ? 'Paysage' : 'Portrait'}
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Tactile:</span>
            <span className="ml-2 font-mono">
              {useMediaQuery('(hover: none)') ? 'Oui' : 'Non'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
