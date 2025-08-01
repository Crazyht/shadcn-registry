import { useEffect } from 'react'
import { useDocNavigationStore } from '@/stores/doc-navigation-store'

/**
 * Hook simple pour enregistrer automatiquement une section
 * Pas de complexité avec les contextes ou les dépendances
 */
export function useDocSection(id: string, title: string, level: number = 2) {
  const registerSection = useDocNavigationStore(state => state.registerSection)
  const unregisterSection = useDocNavigationStore(state => state.unregisterSection)

  useEffect(() => {
    // Register section
    registerSection({ id, title, level })

    // Cleanup: unregister on unmount
    return () => {
      unregisterSection(id)
    }
  }, [id, title, level, registerSection, unregisterSection])
}

/**
 * Hook pour détecter automatiquement si on est sur une page de documentation
 */
export function useDocPageDetection() {
  const setIsDocPage = useDocNavigationStore(state => state.setIsDocPage)

  useEffect(() => {
    const checkIfDocPage = () => {
      const path = window.location.pathname
      const isDocPage = path.includes('/ui/') ||
                       path.includes('/components/') ||
                       path.includes('/hooks/') ||
                       path.includes('/lib/') ||
                       path.includes('/blocks/') ||
                       path.includes('/pages/') ||
                       path.includes('/files/') ||
                       path.includes('/styles/') ||
                       path.includes('/themes/') ||
                       path.includes('/items/')

      setIsDocPage(isDocPage)
    }

    // Check initially
    checkIfDocPage()

    // Listen for route changes
    const handlePopState = () => {
      setTimeout(checkIfDocPage, 0)
    }

    window.addEventListener('popstate', handlePopState)

    // For SPA navigation, we also need to check on pathname changes
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      setTimeout(checkIfDocPage, 0)
    }

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      setTimeout(checkIfDocPage, 0)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [setIsDocPage])
}
