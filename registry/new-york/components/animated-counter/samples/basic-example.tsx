import { AnimatedCounter } from '../animated-counter'

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
}
