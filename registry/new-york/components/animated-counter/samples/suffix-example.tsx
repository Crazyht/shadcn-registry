import { AnimatedCounter } from '../animated-counter'

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
}
