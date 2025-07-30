import { NumericInput } from './numeric-input'
import { useState } from 'react'

/**
 * Documentation pour NumericInput
 * Fichier interne - Non inclus dans la registry
 */
export function NumericInputDocumentation() {
  const [basicValue, setBasicValue] = useState<number | undefined>(25)
  const [priceValue, setPriceValue] = useState<number | undefined>(99.99)
  const [percentValue, setPercentValue] = useState<number | undefined>(75)
  const [rangeValue, setRangeValue] = useState<number | undefined>(5)

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

      {/* Interactive Demo */}
      <div className="rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🎮 Démo Interactive
            </h3>
            <p className="text-sm text-muted-foreground">
              Testez différentes configurations et interactions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Input numérique basique</label>
                <NumericInput
                  value={basicValue}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={setBasicValue}
                  placeholder="0-100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valeur: {basicValue ?? 'aucune'} (min: 0, max: 100)
                </p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Prix avec décimales</label>
                <NumericInput
                  value={priceValue}
                  min={0}
                  max={999.99}
                  step={0.01}
                  decimals={2}
                  prefix="€"
                  onValueChange={setPriceValue}
                  placeholder="Prix en euros"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Prix: {priceValue !== undefined ? `€${priceValue}` : 'aucun'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Pourcentage</label>
                <NumericInput
                  value={percentValue}
                  min={0}
                  max={100}
                  step={5}
                  suffix="%"
                  onValueChange={setPercentValue}
                  placeholder="0-100%"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Pourcentage: {percentValue !== undefined ? `${percentValue}%` : 'aucun'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Note (1-10)</label>
                <NumericInput
                  value={rangeValue}
                  min={1}
                  max={10}
                  step={1}
                  decimals={0}
                  onValueChange={setRangeValue}
                  placeholder="1 à 10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Note: {rangeValue ?? 'aucune'}/10
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <div className="rounded-lg bg-muted p-4">
          <code className="text-sm">npm install clsx tailwind-merge lucide-react</code>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Exemples d'utilisation</h2>

        {/* Basic Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Utilisation de base</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<NumericInput
  value={25}
  onValueChange={(value) => setValue(value)}
/>`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Input numérique simple avec contrôles +/- et touches ↑/↓</p>
            </div>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
              <NumericInput value={25} className="w-full max-w-xs" />
            </div>
          </div>
        </div>

        {/* With Constraints */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Avec contraintes min/max</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<NumericInput
  value={50}
  min={0}
  max={100}
  step={10}
  onValueChange={(value) => setValue(value)}
/>`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Contraintes et pas d'incrémentation personnalisés</p>
            </div>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
              <NumericInput value={50} min={0} max={100} step={10} className="w-full max-w-xs" />
            </div>
          </div>
        </div>

        {/* With Prefix/Suffix */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Avec préfixe et suffixe</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<NumericInput
  value={299.99}
  min={0}
  decimals={2}
  prefix="$"
  onValueChange={(value) => setPrice(value)}
/>`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Prix avec devise et décimales</p>
            </div>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
              <NumericInput value={299.99} min={0} decimals={2} prefix="$" className="w-full max-w-xs" />
            </div>
          </div>
        </div>

        {/* Without Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sans contrôles +/-</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<NumericInput
  value={75}
  suffix="%"
  showControls={false}
  onValueChange={(value) => setPercent(value)}
/>`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Input simple sans boutons +/-</p>
            </div>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
              <NumericInput value={75} suffix="%" showControls={false} className="w-full max-w-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* API Reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Référence API</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Prop</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Défaut</th>
                <th className="text-left p-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">value</td>
                <td className="p-4 text-sm"><code>number | undefined</code></td>
                <td className="p-4 text-sm">-</td>
                <td className="p-4 text-sm">Valeur contrôlée du composant</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">defaultValue</td>
                <td className="p-4 text-sm"><code>number</code></td>
                <td className="p-4 text-sm">-</td>
                <td className="p-4 text-sm">Valeur par défaut (non contrôlée)</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">min</td>
                <td className="p-4 text-sm"><code>number</code></td>
                <td className="p-4 text-sm">-Infinity</td>
                <td className="p-4 text-sm">Valeur minimum autorisée</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">max</td>
                <td className="p-4 text-sm"><code>number</code></td>
                <td className="p-4 text-sm">Infinity</td>
                <td className="p-4 text-sm">Valeur maximum autorisée</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">step</td>
                <td className="p-4 text-sm"><code>number</code></td>
                <td className="p-4 text-sm">1</td>
                <td className="p-4 text-sm">Pas d'incrémentation/décrémentation</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">decimals</td>
                <td className="p-4 text-sm"><code>number</code></td>
                <td className="p-4 text-sm">0</td>
                <td className="p-4 text-sm">Nombre de décimales à afficher</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">prefix</td>
                <td className="p-4 text-sm"><code>string</code></td>
                <td className="p-4 text-sm">-</td>
                <td className="p-4 text-sm">Texte affiché avant la valeur</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">suffix</td>
                <td className="p-4 text-sm"><code>string</code></td>
                <td className="p-4 text-sm">-</td>
                <td className="p-4 text-sm">Texte affiché après la valeur</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">showControls</td>
                <td className="p-4 text-sm"><code>boolean</code></td>
                <td className="p-4 text-sm">true</td>
                <td className="p-4 text-sm">Afficher les boutons +/-</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">disabled</td>
                <td className="p-4 text-sm"><code>boolean</code></td>
                <td className="p-4 text-sm">false</td>
                <td className="p-4 text-sm">Désactiver le composant</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">readOnly</td>
                <td className="p-4 text-sm"><code>boolean</code></td>
                <td className="p-4 text-sm">false</td>
                <td className="p-4 text-sm">Lecture seule</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-sm">onValueChange</td>
                <td className="p-4 text-sm"><code>(value: number | undefined) =&gt; void</code></td>
                <td className="p-4 text-sm">-</td>
                <td className="p-4 text-sm">Callback de changement de valeur</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-world Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Cas d'usage réels</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* E-commerce */}
          <div className="space-y-3">
            <h4 className="font-medium">E-commerce</h4>
            <div className="p-4 border rounded-lg bg-card space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Prix du produit</label>
                <NumericInput
                  value={49.99}
                  min={0}
                  max={9999.99}
                  step={0.01}
                  decimals={2}
                  prefix="€"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Quantité</label>
                <NumericInput
                  value={1}
                  min={1}
                  max={10}
                  step={1}
                  placeholder="Quantité"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Remise</label>
                <NumericInput
                  value={10}
                  min={0}
                  max={90}
                  step={5}
                  suffix="%"
                  placeholder="0%"
                />
              </div>
            </div>
          </div>

          {/* Settings/Config */}
          <div className="space-y-3">
            <h4 className="font-medium">Configuration</h4>
            <div className="p-4 border rounded-lg bg-card space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Timeout (secondes)</label>
                <NumericInput
                  value={30}
                  min={1}
                  max={300}
                  step={5}
                  suffix="s"
                  placeholder="Timeout"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Nombre de tentatives</label>
                <NumericInput
                  value={3}
                  min={1}
                  max={10}
                  step={1}
                  placeholder="Tentatives"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Température (°C)</label>
                <NumericInput
                  value={22.5}
                  min={-50}
                  max={50}
                  step={0.5}
                  decimals={1}
                  suffix="°C"
                  placeholder="Température"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Fonctionnalités</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Validation automatique</h4>
              <p className="text-sm text-muted-foreground">Contraintes min/max appliquées automatiquement</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Contrôles intégrés</h4>
              <p className="text-sm text-muted-foreground">Boutons +/- et touches ↑/↓ pour incrémenter/décrémenter</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Formatage décimales</h4>
              <p className="text-sm text-muted-foreground">Contrôle précis du nombre de décimales</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Préfixe/Suffixe</h4>
              <p className="text-sm text-muted-foreground">Support pour devises, unités, pourcentages</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Accessible</h4>
              <p className="text-sm text-muted-foreground">Navigation clavier et lecteurs d'écran</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">TypeScript</h4>
              <p className="text-sm text-muted-foreground">Types complets pour une meilleure DX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default export for dynamic loading
export default NumericInputDocumentation
