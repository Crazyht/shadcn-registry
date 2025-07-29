import { AnimatedCounter } from './animated-counter'

/**
 * Preview pour AnimatedCounter
 * Fichier interne - Non inclus dans la registry
 */
export function AnimatedCounterPreview() {
  return (
    <div className="flex items-center justify-center p-8">
      <AnimatedCounter
        value={1234}
        prefix="$"
        className="text-3xl font-bold"
      />
    </div>
  )
}
