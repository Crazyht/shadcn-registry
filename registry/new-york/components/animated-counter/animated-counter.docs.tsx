import { AnimatedCounter } from './animated-counter'

/**
 * Documentation pour AnimatedCounter
 * Fichier interne - Non inclus dans la registry
 */
export function AnimatedCounterDocumentation() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Animated Counter</h2>
        <p className="text-muted-foreground mt-2">
          Un compteur animé qui incrémente progressivement vers une valeur cible avec des options de personnalisation.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Installation</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`npm install clsx tailwind-merge`}</code>
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Utilisation</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { AnimatedCounter } from '@registry/new-york/components/animated-counter'

export function Stats() {
  return (
    <div className="grid gap-4">
      <AnimatedCounter value={1234} prefix="$" />
      <AnimatedCounter value={98.5} suffix="%" decimals={1} />
      <AnimatedCounter value={42} duration={2000} />
    </div>
  )
}`}</code>
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Exemples</h3>
        <div className="grid gap-4 p-6 border rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Montant en dollars</p>
            <AnimatedCounter value={9876} prefix="$" className="text-2xl font-bold" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Pourcentage avec décimales</p>
            <AnimatedCounter value={87.3} suffix="%" decimals={1} className="text-2xl font-bold" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Animation lente</p>
            <AnimatedCounter value={123456} duration={3000} className="text-2xl font-bold" />
          </div>
        </div>
      </div>
    </div>
  )
}
