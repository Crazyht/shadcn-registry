import { DocSample, InstallationCommand } from '../../../src/components/registry'
import { DocSectionHeader, DocSubSectionHeader } from '../../../src/components/doc-navigation-zustand'
import {
  MediaQueryResponsiveExample,
  MediaQueryThemeExample,
  MediaQueryCustomExample,
  MediaQueryNavigationExample
} from './samples'

/**
 * Documentation pour useMediaQuery
 * Fichier interne - Non inclus dans la registry
 */
export function UseMediaQueryDocumentation() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">useMediaQuery</h1>
          <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-950/50 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300">
            React Hook
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un hook React pour évaluer les media queries CSS en temps réel. Idéal pour créer des
          interfaces responsives, détecter les préférences utilisateur, et adapter l'expérience
          selon le type d'appareil et les capacités du navigateur.
        </p>
      </div>

      {/* Features */}
      <DocSectionHeader id="features" title="Fonctionnalités">
        ✨ Fonctionnalités
      </DocSectionHeader>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">📱</div>
            <div>
              <h3 className="font-medium">Design Responsif</h3>
              <p className="text-sm text-muted-foreground">Adaptation automatique aux breakpoints</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🔄</div>
            <div>
              <h3 className="font-medium">Temps Réel</h3>
              <p className="text-sm text-muted-foreground">Mise à jour instantanée lors des changements</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🎨</div>
            <div>
              <h3 className="font-medium">Préférences Système</h3>
              <p className="text-sm text-muted-foreground">Détection du thème et accessibilité</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🌐</div>
            <div>
              <h3 className="font-medium">Compatible SSR</h3>
              <p className="text-sm text-muted-foreground">Fonctionne côté serveur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <DocSectionHeader id="installation" title="Installation">
        📦 Installation
      </DocSectionHeader>
      <div className="space-y-4">
        <InstallationCommand componentPath="hooks/use-media-query" />
        <p className="text-sm text-muted-foreground">
          Aucune dépendance externe requise, utilise l'API native `matchMedia`.
        </p>
      </div>

      {/* API Reference */}
      <DocSectionHeader id="api-reference" title="Référence API">
        📚 Référence API
      </DocSectionHeader>
      <div className="space-y-4">
        <div className="space-y-6">
          <div>
            <DocSubSectionHeader id="use-media-query-hook" title="useMediaQuery" />
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
                    <td className="p-4 font-mono">query</td>
                    <td className="p-4"><code>string</code></td>
                    <td className="p-4">Media query CSS à évaluer (ex: "(max-width: 768px)")</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <DocSubSectionHeader id="return-value" title="Valeur de retour" />
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
                    <td className="p-4"><code>boolean</code></td>
                    <td className="p-4">true si la media query correspond, false sinon</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <DocSubSectionHeader id="common-media-queries" title="Media Queries courantes" />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-blue-600 mb-2">📏 Breakpoints</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div>(max-width: 640px) - Mobile</div>
                  <div>(max-width: 768px) - Tablet</div>
                  <div>(min-width: 1024px) - Desktop</div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-purple-600 mb-2">🎨 Préférences</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div>(prefers-color-scheme: dark)</div>
                  <div>(prefers-reduced-motion: reduce)</div>
                  <div>(prefers-contrast: high)</div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-orange-600 mb-2">📱 Orientation</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div>(orientation: landscape)</div>
                  <div>(orientation: portrait)</div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-green-600 mb-2">🖱️ Interaction</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div>(hover: hover) - Souris</div>
                  <div>(pointer: fine) - Précision</div>
                  <div>(hover: none) - Tactile</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <DocSectionHeader id="examples" title="Exemples">
        🎯 Exemples
      </DocSectionHeader>
      <div className="space-y-8">

        <DocSample
          id="responsive-example"
          title="Design responsif"
          description={
            <div>
              <p className="mb-3">Adaptation automatique selon la taille d'écran avec breakpoints courants.</p>
              <div>
                <p><strong>📏 Breakpoints testés :</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Mobile :</strong> ≤ 768px - Affichage en 1 colonne</li>
                  <li><strong>Tablette :</strong> 769px - 1024px - Affichage en 2 colonnes</li>
                  <li><strong>Desktop :</strong> ≥ 1025px - Affichage en 3 colonnes</li>
                </ul>
              </div>
            </div>
          }
          sourceCode={`import { useMediaQuery } from './use-media-query'

export function ResponsiveExample() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')

  return (
    <div className="space-y-4">
      <div className="text-center p-6 border rounded-lg">
        <div className="text-4xl mb-2">
          {isMobile ? '📱' : isTablet ? '📋' : '🖥️'}
        </div>
        <h3 className="text-xl font-bold">
          {isMobile ? 'Mobile' : isTablet ? 'Tablette' : 'Desktop'}
        </h3>
      </div>
    </div>
  )
}`}
        >
          <MediaQueryResponsiveExample />
        </DocSample>

        <DocSample
          id="system-preferences"
          title="Préférences système"
          description={
            <div>
              <p className="mb-3">Détection automatique des préférences utilisateur configurées dans le système d'exploitation.</p>
              <div>
                <p><strong>🎨 Préférences détectées :</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Thème :</strong> Sombre/Clair selon les paramètres OS</li>
                  <li><strong>Animation :</strong> Détection du mode "mouvement réduit"</li>
                  <li><strong>Contraste :</strong> Support du contraste élevé</li>
                </ul>
              </div>
            </div>
          }
          sourceCode={`import { useMediaQuery } from './use-media-query'

export function SystemPreferencesExample() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3>Préférences détectées</h3>
        <p>Thème: {prefersDark ? 'Sombre 🌙' : 'Clair ☀️'}</p>
        <p>Mouvement réduit: {prefersReducedMotion ? 'Oui' : 'Non'}</p>
      </div>
    </div>
  )
}`}
        >
          <MediaQueryThemeExample />
        </DocSample>

        <DocSample
          id="custom-query-tester"
          title="Testeur de media queries"
          description={
            <div>
              <p className="mb-3">Interface interactive pour tester des media queries personnalisées en temps réel.</p>
              <div>
                <p><strong>🔧 Fonctionnalités :</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Test en temps réel :</strong> Saisissez une query et voyez le résultat</li>
                  <li><strong>Requêtes prédéfinies :</strong> Boutons rapides pour les queries courantes</li>
                  <li><strong>Infos appareil :</strong> Dimensions et capacités détectées</li>
                </ul>
              </div>
            </div>
          }
          sourceCode={`import { useState } from 'react'
import { useMediaQuery } from './use-media-query'

export function MediaQueryTester() {
  const [customQuery, setCustomQuery] = useState('(min-width: 600px)')
  const customResult = useMediaQuery(customQuery)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md font-mono"
        />
        <div className={\`px-3 py-2 rounded-md \${
          customResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }\`}>
          {customResult ? '✓ Correspond' : '✗ Ne correspond pas'}
        </div>
      </div>
    </div>
  )
}`}
          >
            <MediaQueryCustomExample />
          </DocSample>

          <DocSample
            id="adaptive-navigation"
            title="Navigation adaptative"
            description={
              <div>
                <p className="mb-3">Interface complète qui s'adapte automatiquement selon l'appareil utilisé.</p>
                <div>
                  <p><strong>🧭 Comportements adaptatifs :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Mobile :</strong> Menu burger avec navigation simplifiée</li>
                    <li><strong>Desktop :</strong> Barre de navigation horizontale complète</li>
                    <li><strong>Transitions :</strong> Respect des préférences d'animation</li>
                  </ul>
                </div>
              </div>
            }
            sourceCode={`import { useMediaQuery } from './use-media-query'

export function AdaptiveNavigation() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return (
      <div className="p-3 bg-gray-100 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Mon App</span>
          <button className="p-2">☰</button>
        </div>
        <p className="text-sm text-orange-600 mt-2">📱 Mode mobile</p>
      </div>
    )
  }

  return (
    <nav className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
      <span className="font-medium">Mon App</span>
      <div className="flex gap-4">
        <button>🏠 Accueil</button>
        <button>📦 Produits</button>
      </div>
      <p className="text-sm text-blue-600">🖥️ Mode desktop</p>
    </nav>
  )
}`}
          >
            <MediaQueryNavigationExample />
          </DocSample>
      </div>
    </div>
  )
}

// Default export for dynamic loading
export default UseMediaQueryDocumentation
