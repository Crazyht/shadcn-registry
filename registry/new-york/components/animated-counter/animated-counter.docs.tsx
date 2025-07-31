import { DocSample } from '../../../../src/components/registry'
import {
  BasicExample,
  PrefixExample,
  SuffixExample,
  CustomDurationExample,
  InteractiveExample
} from './samples'

/**
 * Documentation pour AnimatedCounter
 * Fichier interne - Non inclus dans la registry
 */
export function AnimatedCounterDocumentation() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Animated Counter</h1>
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            Animation Component
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un compteur animé qui incrémente progressivement vers une valeur cible avec des options de personnalisation complètes.
          Parfait pour afficher des statistiques, des métriques, ou tout nombre qui nécessite une présentation dynamique.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          ✨ Fonctionnalités
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🎬</div>
            <div>
              <h3 className="font-medium">Animation Fluide</h3>
              <p className="text-sm text-muted-foreground">60fps avec requestAnimationFrame</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="font-medium">Easing Naturel</h3>
              <p className="text-sm text-muted-foreground">Fonction d'accélération intégrée</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🎨</div>
            <div>
              <h3 className="font-medium">Formatage Avancé</h3>
              <p className="text-sm text-muted-foreground">Préfixes, suffixes et décimales</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">⚙️</div>
            <div>
              <h3 className="font-medium">Configurable</h3>
              <p className="text-sm text-muted-foreground">Durée et style personnalisables</p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📦 Installation
        </h2>
        <div className="rounded-lg bg-muted p-4">
          <code className="text-sm">npx shadcn@latest add animated-counter</code>
        </div>
        <p className="text-sm text-muted-foreground">
          Les dépendances (clsx, tailwind-merge) sont installées automatiquement.
        </p>
      </div>

      {/* API Reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📚 Référence API
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">AnimatedCounterProps</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Défaut</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-4 font-mono">value</td>
                    <td className="p-4"><code>number</code></td>
                    <td className="p-4">-</td>
                    <td className="p-4">Valeur finale du compteur (requis)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono">duration</td>
                    <td className="p-4"><code>number</code></td>
                    <td className="p-4">1000</td>
                    <td className="p-4">Durée de l'animation en millisecondes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono">prefix</td>
                    <td className="p-4"><code>string</code></td>
                    <td className="p-4">""</td>
                    <td className="p-4">Texte affiché avant le nombre (ex: "$")</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono">suffix</td>
                    <td className="p-4"><code>string</code></td>
                    <td className="p-4">""</td>
                    <td className="p-4">Texte affiché après le nombre (ex: "%")</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono">decimals</td>
                    <td className="p-4"><code>number</code></td>
                    <td className="p-4">0</td>
                    <td className="p-4">Nombre de décimales à afficher</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono">className</td>
                    <td className="p-4"><code>string</code></td>
                    <td className="p-4">""</td>
                    <td className="p-4">Classes CSS additionnelles</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono">ref</td>
                    <td className="p-4"><code>React.Ref&lt;HTMLSpanElement&gt;</code></td>
                    <td className="p-4">-</td>
                    <td className="p-4">Référence React (optionnelle)</td>
                  </tr>
                </tbody>
              </table>
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
            description="Compteur animé simple sans formatage"
            sourceCode={`import { AnimatedCounter } from './animated-counter'

export function BasicExample() {
  return (
    <div className="text-center space-y-3">
      <div className="text-4xl font-bold">
        <AnimatedCounter value={1234} />
      </div>
      <p className="text-sm text-muted-foreground">
        Compteur animé simple
      </p>
    </div>
  )
}`}
          >
            <BasicExample />
          </DocSample>

          <DocSample
            title="Avec préfixe (devise)"
            description="Parfait pour afficher des montants financiers"
            sourceCode={`import { AnimatedCounter } from './animated-counter'

export function PrefixExample() {
  return (
    <div className="text-center space-y-3">
      <div className="text-4xl font-bold text-green-600">
        <AnimatedCounter value={9876} prefix="$" />
      </div>
      <p className="text-sm text-muted-foreground">
        Parfait pour afficher des montants financiers
      </p>
    </div>
  )
}`}
          >
            <PrefixExample />
          </DocSample>

          <DocSample
            title="Avec suffixe (pourcentages)"
            description="Idéal pour les statistiques et métriques"
            sourceCode={`import { AnimatedCounter } from './animated-counter'

export function SuffixExample() {
  return (
    <div className="text-center space-y-3">
      <div className="text-4xl font-bold text-blue-600">
        <AnimatedCounter value={87.3} suffix="%" decimals={1} />
      </div>
      <p className="text-sm text-muted-foreground">
        Idéal pour les statistiques et métriques
      </p>
    </div>
  )
}`}
          >
            <SuffixExample />
          </DocSample>

          <DocSample
            title="Durée personnalisée"
            description="Animation plus lente pour l'effet dramatique"
            sourceCode={`import { AnimatedCounter } from './animated-counter'

export function CustomDurationExample() {
  return (
    <div className="text-center space-y-3">
      <div className="text-4xl font-bold text-purple-600">
        <AnimatedCounter value={123456} duration={3000} />
      </div>
      <p className="text-sm text-muted-foreground">
        Animation plus lente (3 secondes) pour l'effet dramatique
      </p>
    </div>
  )
}`}
          >
            <CustomDurationExample />
          </DocSample>

          <DocSample
            title="Exemple interactif"
            description="Démonstration complète avec contrôles utilisateur"
            sourceCode={`import { useState } from 'react'
import { AnimatedCounter } from './animated-counter'

export function InteractiveExample() {
  const [value, setValue] = useState(1234)

  const presetValues = [500, 1234, 5678, 12500, 99999]

  return (
    <div className="text-center space-y-6">
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
        <div className="text-5xl font-bold text-blue-600 mb-4">
          <AnimatedCounter value={value} prefix="$" />
        </div>
        <p className="text-sm text-muted-foreground">
          Cliquez sur les boutons pour voir l'animation
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presetValues.map(preset => (
          <button
            key={preset}
            onClick={() => setValue(preset)}
            className="px-3 py-2 text-sm border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            \${preset.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  )
}`}
          >
            <InteractiveExample />
          </DocSample>
        </div>
      </div>
    </div>
  )
}

// Default export for dynamic loading
export default AnimatedCounterDocumentation
