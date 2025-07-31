import { AnimatedCounter } from '../animated-counter'

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
}
