// Hook pour détecter le thème actuel (clair/sombre)
import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() => {
    // Vérifier d'abord si le thème est défini dans localStorage
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      return stored
    }

    // Sinon, utiliser la préférence système
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    return 'light'
  })

  useEffect(() => {
    // Observer les changements dans le DOM (class "dark" sur html)
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    })

    // Observer les changements de classe sur l'élément html
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Vérifier l'état initial
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')

    // Observer les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Seulement si aucun thème n'est forcé dans localStorage
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return theme
}
