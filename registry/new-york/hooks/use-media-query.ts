// registry/new-york/hooks/use-media-query.ts
import { useState, useEffect } from 'react'

/**
 * Hook pour détecter les media queries
 * @param query - Media query à évaluer
 * @returns true si la media query correspond
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Vérifier la correspondance initiale
    setMatches(media.matches)

    // Écouter les changements
    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    // Utiliser addEventListener pour une meilleure compatibilité
    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
    } else {
      // Fallback pour les anciens navigateurs
      media.addListener(handleChange)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleChange)
      } else {
        media.removeListener(handleChange)
      }
    }
  }, [query])

  return matches
}
