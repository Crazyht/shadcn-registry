import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Props pour le composant AnimatedCounter
 */
export interface AnimatedCounterProps {
  /** Valeur finale du compteur */
  value: number
  /** Durée de l'animation en ms */
  duration?: number
  /** Préfixe (ex: '$') */
  prefix?: string
  /** Suffixe (ex: '%') */
  suffix?: string
  /** Nombre de décimales */
  decimals?: number
  /** Classes CSS additionnelles */
  className?: string
  /** Ref optionnelle (React 19) */
  ref?: React.Ref<HTMLSpanElement>
}

/**
 * Compteur animé qui incrémente progressivement vers une valeur cible
 * @component
 * @example
 * ```tsx
 * <AnimatedCounter value={1234} prefix="$" duration={2000} />
 * ```
 */
export function AnimatedCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  ref
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)

  useEffect(() => {
    const startValue = previousValue.current
    const startTime = Date.now()
    const endValue = value

    const updateValue = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)

      // Easing function pour une animation plus naturelle
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      } else {
        previousValue.current = endValue
      }
    }

    requestAnimationFrame(updateValue)
  }, [value, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}
