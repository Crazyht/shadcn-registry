import { AnimatedCounter } from '../animated-counter'

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
}
