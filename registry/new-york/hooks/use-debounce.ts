// registry/new-york/hooks/use-debounce.ts
import { useState, useEffect } from 'react'

/**
 * Hook pour retarder la mise à jour d'une valeur
 * @param value - Valeur à debouncer
 * @param delay - Délai en millisecondes
 * @returns Valeur debouncée
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   // Effectuer la recherche avec debouncedSearchTerm
 * }, [debouncedSearchTerm])
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
