import { AnimatedCounter } from './animated-counter'
import { useState } from 'react'

/**
 * Documentation pour AnimatedCounter
 * Fichier interne - Non inclus dans la registry
 */
export function AnimatedCounterDocumentation() {
  const [demoValue, setDemoValue] = useState(1234)
  const [isAnimating, setIsAnimating] = useState(false)

  const triggerAnimation = (newValue: number) => {
    setIsAnimating(true)
    setDemoValue(newValue)
    setTimeout(() => setIsAnimating(false), 1500)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Animated Counter</h1>
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            React Component
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un compteur animé qui incrémente progressivement vers une valeur cible avec des options de personnalisation complètes.
          Parfait pour afficher des statistiques, des métriques, ou tout nombre qui nécessite une présentation dynamique.
        </p>
      </div>

      {/* Interactive Demo */}
      <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🎯 Démo Interactive
            </h3>
            <p className="text-sm text-muted-foreground">
              Cliquez sur les boutons pour voir l'animation en action
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center p-8 bg-white/70 dark:bg-black/20 rounded-lg border">
              <div className="text-6xl font-bold mb-4">
                <AnimatedCounter
                  value={demoValue}
                  prefix="$"
                  className={`transition-colors duration-300 ${isAnimating ? 'text-blue-600' : 'text-foreground'}`}
                />
              </div>
              <p className="text-muted-foreground">Valeur actuelle: {demoValue}</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {[500, 1234, 5678, 12500, 99999].map(value => (
                <button
                  key={value}
                  onClick={() => triggerAnimation(value)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  ${value.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <div className="rounded-lg bg-muted p-4">
          <code className="text-sm">npm install clsx tailwind-merge</code>
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
                <pre className="text-sm overflow-x-auto"><code>{`<AnimatedCounter value={1234} />`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Compteur simple sans formatage</p>
            </div>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
              <AnimatedCounter value={1234} className="text-2xl font-bold" />
            </div>
          </div>
        </div>

        {/* With Prefix */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Avec préfixe (devise)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<AnimatedCounter
  value={9876}
  prefix="$"
  className="text-3xl font-bold"
/>`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Parfait pour afficher des montants</p>
            </div>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
              <AnimatedCounter value={9876} prefix="$" className="text-3xl font-bold text-green-600" />
            </div>
          </div>
        </div>

        {/* With Suffix */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Avec suffixe (pourcentages)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<AnimatedCounter
  value={87.3}
  suffix="%"
  decimals={1}
  className="text-3xl font-bold"
/>`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Idéal pour les statistiques et métriques</p>
            </div>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
              <AnimatedCounter value={87.3} suffix="%" decimals={1} className="text-3xl font-bold text-blue-600" />
            </div>
          </div>
        </div>

        {/* Custom Duration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Durée personnalisée</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-x-auto"><code>{`<AnimatedCounter
  value={123456}
  duration={3000}
  className="text-3xl font-bold"
/>`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground">Animation plus lente pour l'effet dramatique</p>
            </div>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
              <AnimatedCounter value={123456} duration={3000} className="text-3xl font-bold text-purple-600" />
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
                <td className="p-4 text-sm"><code>number</code></td>
                <td className="p-4 text-sm">-</td>
                <td className="p-4 text-sm">Valeur finale du compteur (requis)</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">duration</td>
                <td className="p-4 text-sm"><code>number</code></td>
                <td className="p-4 text-sm">1000</td>
                <td className="p-4 text-sm">Durée de l'animation en millisecondes</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">prefix</td>
                <td className="p-4 text-sm"><code>string</code></td>
                <td className="p-4 text-sm">""</td>
                <td className="p-4 text-sm">Texte affiché avant le nombre (ex: "$")</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">suffix</td>
                <td className="p-4 text-sm"><code>string</code></td>
                <td className="p-4 text-sm">""</td>
                <td className="p-4 text-sm">Texte affiché après le nombre (ex: "%")</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">decimals</td>
                <td className="p-4 text-sm"><code>number</code></td>
                <td className="p-4 text-sm">0</td>
                <td className="p-4 text-sm">Nombre de décimales à afficher</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-mono text-sm">className</td>
                <td className="p-4 text-sm"><code>string</code></td>
                <td className="p-4 text-sm">""</td>
                <td className="p-4 text-sm">Classes CSS additionnelles</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-sm">ref</td>
                <td className="p-4 text-sm"><code>React.Ref&lt;HTMLSpanElement&gt;</code></td>
                <td className="p-4 text-sm">-</td>
                <td className="p-4 text-sm">Référence React (optionnelle)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-world Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Exemples concrets</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Stats Dashboard */}
          <div className="space-y-3">
            <h4 className="font-medium">Tableau de bord</h4>
            <div className="p-4 border rounded-lg bg-card space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Ventes aujourd'hui</p>
                <AnimatedCounter value={15847} prefix="$" className="text-2xl font-bold text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Visiteurs uniques</p>
                <AnimatedCounter value={2456} className="text-2xl font-bold text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Taux de conversion</p>
                <AnimatedCounter value={4.7} suffix="%" decimals={1} className="text-2xl font-bold text-purple-600" />
              </div>
            </div>
          </div>

          {/* Gaming Stats */}
          <div className="space-y-3">
            <h4 className="font-medium">Statistiques de jeu</h4>
            <div className="p-4 border rounded-lg bg-card space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Score</p>
                <AnimatedCounter value={98750} className="text-2xl font-bold text-orange-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pièces</p>
                <AnimatedCounter value={1337} prefix="🪙 " className="text-2xl font-bold text-yellow-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Niveau</p>
                <AnimatedCounter value={42} className="text-2xl font-bold text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="space-y-3">
            <h4 className="font-medium">Indicateurs financiers</h4>
            <div className="p-4 border rounded-lg bg-card space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                <AnimatedCounter value={187654} prefix="€" className="text-2xl font-bold text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Croissance</p>
                <AnimatedCounter value={23.8} prefix="+" suffix="%" decimals={1} className="text-2xl font-bold text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Économies</p>
                <AnimatedCounter value={45230} prefix="$" className="text-2xl font-bold text-blue-600" />
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
              <h4 className="font-medium">Animation fluide</h4>
              <p className="text-sm text-muted-foreground">Utilise requestAnimationFrame pour des animations 60fps</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Easing naturel</h4>
              <p className="text-sm text-muted-foreground">Fonction d'accélération intégrée pour un rendu réaliste</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">TypeScript support</h4>
              <p className="text-sm text-muted-foreground">Types complets pour une meilleure expérience de développement</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Accessible</h4>
              <p className="text-sm text-muted-foreground">Compatible avec les lecteurs d'écran</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default export for dynamic loading
export default AnimatedCounterDocumentation
