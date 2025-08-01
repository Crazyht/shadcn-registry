import { DocSample, InstallationCommand } from '../../../../src/components/registry'
import { DocSectionHeader } from '../../../../src/components/doc-navigation-zustand'
import {
  BasicExample,
  PrefixExample,
  SuffixExample,
  CustomDurationExample,
  InteractiveExample
} from './samples'

/**
 * Documentation pour AnimatedCounter - Migrée vers DocSample unifié
 * Fichier interne - Non inclus dans la registry
 */
export function AnimatedCounterDocumentation() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Animated Counter</h1>
          <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950/50 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300">
            Animation Component
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un composant d'animation de compteur fluide avec support des préfixes, suffixes et décimales.
          Parfait pour les statistiques, métriques et affichages de données dynamiques.
        </p>
      </div>

            {/* Features */}
      <DocSectionHeader id="features" title="Fonctionnalités">
        ✨ Fonctionnalités
      </DocSectionHeader>
      <div className="space-y-4">
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
      <DocSectionHeader id="installation" title="Installation">
        📦 Installation
      </DocSectionHeader>
      <div className="space-y-4">
        <InstallationCommand componentPath="components/animated-counter" />
        <p className="text-sm text-muted-foreground">
          Les dépendances (clsx, tailwind-merge) sont installées automatiquement.
        </p>
      </div>

      {/* API Reference */}
      <DocSectionHeader id="api-reference" title="Référence API">
        📚 Référence API
      </DocSectionHeader>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">AnimatedCounterProps</h4>
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
                  <td className="p-4">Valeur cible à animer</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">duration</td>
                  <td className="p-4"><code>number</code></td>
                  <td className="p-4">1000</td>
                  <td className="p-4">Durée de l'animation (en ms)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">decimals</td>
                  <td className="p-4"><code>number</code></td>
                  <td className="p-4">0</td>
                  <td className="p-4">Nombre de décimales</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">prefix</td>
                  <td className="p-4"><code>string</code></td>
                  <td className="p-4">""</td>
                  <td className="p-4">Texte avant la valeur</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">suffix</td>
                  <td className="p-4"><code>string</code></td>
                  <td className="p-4">""</td>
                  <td className="p-4">Texte après la valeur</td>
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

        <div className="mt-6 p-4 bg-muted/30 border-l-4 border-blue-500 rounded-r-lg">
          <h5 className="font-medium mb-2">Interface TypeScript</h5>
          <pre className="bg-background p-3 rounded text-sm overflow-x-auto">
            <code>{`interface AnimatedCounterProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  ref?: React.Ref<HTMLSpanElement>
}`}</code>
          </pre>
        </div>
      </div>

      {/* Examples */}
      <DocSectionHeader id="examples" title="Exemples">
        🎯 Exemples
      </DocSectionHeader>
      <div className="space-y-8">

        <DocSample
          id="basic-usage"
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
          id="with-prefix"
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
          id="with-suffix"
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
          id="custom-duration"
          title="Durée personnalisée"
          description="Contrôle précis de la vitesse d'animation"
          sourceCode={`import { AnimatedCounter } from './animated-counter'

export function CustomDurationExample() {
  return (
    <div className="text-center space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded">
          <div className="text-xl font-bold text-red-600">
            <AnimatedCounter value={500} duration={500} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Rapide (500ms)</p>
        </div>
        <div className="p-4 border rounded">
          <div className="text-xl font-bold text-blue-600">
            <AnimatedCounter value={1000} duration={1000} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Normal (1000ms)</p>
        </div>
        <div className="p-4 border rounded">
          <div className="text-xl font-bold text-green-600">
            <AnimatedCounter value={2000} duration={2000} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Lent (2000ms)</p>
        </div>
      </div>
    </div>
  )
}`}
        >
          <CustomDurationExample />
        </DocSample>

        <DocSample
          id="interactive-example"
          title="Exemple interactif"
          description="Testez les différentes options en temps réel"
          sourceCode={`import { useState } from 'react'
import { AnimatedCounter } from './animated-counter'
import { Button } from '@/components/ui/button'

export function InteractiveExample() {
  const [value, setValue] = useState(1000)
  const [showPrefix, setShowPrefix] = useState(false)
  const [showSuffix, setShowSuffix] = useState(false)

  const randomValue = () => setValue(Math.floor(Math.random() * 10000))

  return (
    <div className="text-center space-y-6">
      <div className="text-4xl font-bold text-purple-600">
        <AnimatedCounter
          value={value}
          prefix={showPrefix ? '$' : ''}
          suffix={showSuffix ? '%' : ''}
          decimals={showSuffix ? 1 : 0}
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={randomValue} variant="outline">
          🎲 Valeur Aléatoire
        </Button>
        <Button
          onClick={() => setShowPrefix(!showPrefix)}
          variant={showPrefix ? "default" : "outline"}
        >
          💲 Préfixe
        </Button>
        <Button
          onClick={() => setShowSuffix(!showSuffix)}
          variant={showSuffix ? "default" : "outline"}
        >
          📊 Suffixe
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Cliquez sur les boutons pour tester les options
      </p>
    </div>
  )
}`}
        >
          <InteractiveExample />
        </DocSample>
      </div>
    </div>
  )
}

// Default export for dynamic loading
export default AnimatedCounterDocumentation
