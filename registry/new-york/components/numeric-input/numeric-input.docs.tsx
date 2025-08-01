import { DocSample, InstallationCommand } from '../../../../src/components/registry'
import { DocSectionHeader } from '../../../../src/components/doc-navigation-zustand'
import {
  BasicExample,
  ConstraintsExample,
  PrefixSuffixExample,
  NoControlsExample
} from './samples'

/**
 * Documentation pour NumericInput - Migrée vers DocSample unifié
 * Fichier interne - Non inclus dans la registry
 */
export function NumericInputDocumentation() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Numeric Input</h1>
          <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-950/50 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300">
            Input Component
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un composant d'input numérique avancé avec contrôles +/-, validation automatique, contraintes min/max,
          et formatage des décimales. Utilisez les touches ↑/↓ ou les boutons pour incrémenter/décrémenter.
        </p>
      </div>

      {/* Features */}
      <DocSectionHeader id="features" title="Fonctionnalités">
        ✨ Fonctionnalités
      </DocSectionHeader>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🎛️</div>
            <div>
              <h3 className="font-medium">Contrôles Intuitifs</h3>
              <p className="text-sm text-muted-foreground">Boutons +/- et navigation clavier (↑/↓)</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="font-medium">Validation Automatique</h3>
              <p className="text-sm text-muted-foreground">Contraintes min/max appliquées en temps réel</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">💰</div>
            <div>
              <h3 className="font-medium">Préfixes & Suffixes</h3>
              <p className="text-sm text-muted-foreground">Support pour devises, unités, pourcentages</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-medium">Précision Décimale</h3>
              <p className="text-sm text-muted-foreground">Contrôle précis du formatage numérique</p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <DocSectionHeader id="installation" title="Installation">
        📦 Installation
      </DocSectionHeader>
      <div className="space-y-4">
        <InstallationCommand componentPath="components/numeric-input" />
        <p className="text-sm text-muted-foreground">
          Les dépendances (clsx, tailwind-merge, lucide-react) sont installées automatiquement.
        </p>
      </div>

      {/* API Reference */}
      <DocSectionHeader id="api-reference" title="Référence API">
        📚 Référence API
      </DocSectionHeader>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">NumericInputProps</h4>
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
                  <td className="p-4"><code>number | undefined</code></td>
                  <td className="p-4">-</td>
                  <td className="p-4">Valeur contrôlée du composant</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">defaultValue</td>
                  <td className="p-4"><code>number</code></td>
                  <td className="p-4">-</td>
                  <td className="p-4">Valeur par défaut (non contrôlée)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">min</td>
                  <td className="p-4"><code>number</code></td>
                  <td className="p-4">-Infinity</td>
                  <td className="p-4">Valeur minimum autorisée</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">max</td>
                  <td className="p-4"><code>number</code></td>
                  <td className="p-4">Infinity</td>
                  <td className="p-4">Valeur maximum autorisée</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">step</td>
                  <td className="p-4"><code>number</code></td>
                  <td className="p-4">1</td>
                  <td className="p-4">Pas d'incrémentation/décrémentation</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">decimals</td>
                  <td className="p-4"><code>number</code></td>
                  <td className="p-4">0</td>
                  <td className="p-4">Nombre de décimales à afficher</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">prefix</td>
                  <td className="p-4"><code>string</code></td>
                  <td className="p-4">-</td>
                  <td className="p-4">Texte affiché avant la valeur</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">suffix</td>
                  <td className="p-4"><code>string</code></td>
                  <td className="p-4">-</td>
                  <td className="p-4">Texte affiché après la valeur</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">showControls</td>
                  <td className="p-4"><code>boolean</code></td>
                  <td className="p-4">true</td>
                  <td className="p-4">Afficher les boutons +/-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">disabled</td>
                  <td className="p-4"><code>boolean</code></td>
                  <td className="p-4">false</td>
                  <td className="p-4">Désactiver le composant</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono">readOnly</td>
                  <td className="p-4"><code>boolean</code></td>
                  <td className="p-4">false</td>
                  <td className="p-4">Lecture seule</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono">onValueChange</td>
                  <td className="p-4"><code>(value: number | undefined) =&gt; void</code></td>
                  <td className="p-4">-</td>
                  <td className="p-4">Callback de changement de valeur</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/30 border-l-4 border-blue-500 rounded-r-lg">
          <h5 className="font-medium mb-2">Interface TypeScript</h5>
          <pre className="bg-background p-3 rounded text-sm overflow-x-auto">
            <code>{`interface NumericInputProps {
  value?: number | undefined
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  decimals?: number
  prefix?: string
  suffix?: string
  showControls?: boolean
  disabled?: boolean
  readOnly?: boolean
  onValueChange?: (value: number | undefined) => void
  placeholder?: string
  className?: string
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
          description="Input numérique simple avec contrôles +/- et navigation clavier"
          sourceCode={`import { useState } from 'react'
import { NumericInput } from './numeric-input'

export function BasicExample() {
  const [value, setValue] = useState<number | undefined>(25)

  return (
    <div className="w-full max-w-sm space-y-3">
      <div>
        <label className="text-sm font-medium block mb-2">Valeur numérique</label>
        <NumericInput
          value={value}
          onValueChange={setValue}
          placeholder="Entrez un nombre"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Valeur actuelle: {value ?? 'aucune'}
      </p>
    </div>
  )
}`}
        >
          <BasicExample />
        </DocSample>

        <DocSample
          id="constraints-example"
          title="Avec contraintes min/max"
          description="Validation automatique avec limites et pas d'incrémentation"
          sourceCode={`import { useState } from 'react'
import { NumericInput } from './numeric-input'

export function ConstraintsExample() {
  const [value, setValue] = useState<number | undefined>(50)

  return (
    <div className="w-full max-w-sm space-y-3">
      <div>
        <label className="text-sm font-medium block mb-2">Valeur entre 0 et 100</label>
        <NumericInput
          value={value}
          min={0}
          max={100}
          step={10}
          onValueChange={setValue}
          placeholder="0-100"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Min: 0, Max: 100, Step: 10 | Valeur: {value ?? 'aucune'}
      </p>
    </div>
  )
}`}
        >
          <ConstraintsExample />
        </DocSample>

        <DocSample
          id="prefix-suffix-example"
          title="Préfixes et suffixes"
          description="Formatage pour devises, pourcentages et unités"
          sourceCode={`import { useState } from 'react'
import { NumericInput } from './numeric-input'

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
          Prix: {price !== undefined ? \`€\${price.toFixed(2)}\` : 'aucun'}
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
          Pourcentage: {percentage !== undefined ? \`\${percentage}%\` : 'aucun'}
        </p>
      </div>
    </div>
  )
}`}
        >
          <PrefixSuffixExample />
        </DocSample>

        <DocSample
          id="no-controls-example"
          title="Sans contrôles visuels"
          description="Input simple sans boutons +/- pour un design épuré"
          sourceCode={`import { useState } from 'react'
import { NumericInput } from './numeric-input'

export function NoControlsExample() {
  const [value, setValue] = useState<number | undefined>(42)

  return (
    <div className="w-full max-w-sm space-y-3">
      <div>
        <label className="text-sm font-medium block mb-2">Sans boutons +/-</label>
        <NumericInput
          value={value}
          showControls={false}
          onValueChange={setValue}
          placeholder="Input simple"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Input numérique sans contrôles visuels | Valeur: {value ?? 'aucune'}
      </p>
    </div>
  )
}`}
        >
          <NoControlsExample />
        </DocSample>
      </div>
    </div>
  )
}

// Default export for dynamic loading
export default NumericInputDocumentation
