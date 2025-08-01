import { useEffect, useRef } from 'react'
import { useDocNavigationStore } from '@/stores/doc-navigation-store'

export function useDocSectionObserver() {
  const sections = useDocNavigationStore(state => state.sections)
  const setCurrentSection = useDocNavigationStore(state => state.setCurrentSection)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isUnmountingRef = useRef(false)

  useEffect(() => {
    // Mark as not unmounting when effect runs
    isUnmountingRef.current = false

    // Nettoyer l'observer précédent
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    if (sections.length === 0) return

    // Créer un nouvel observer avec des options optimisées
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Avoid updates if component is unmounting
        if (isUnmountingRef.current) return

        // Traiter seulement l'entrée la plus récente qui intersecte
        const intersectingEntries = entries.filter(entry => entry.isIntersecting)
        if (intersectingEntries.length > 0) {
          // Prendre l'élément le plus haut visible
          const topEntry = intersectingEntries.reduce((prev, current) =>
            prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
          )

          // Use a timeout to avoid conflicts with navigation
          requestAnimationFrame(() => {
            if (!isUnmountingRef.current) {
              setCurrentSection(topEntry.target.id)
            }
          })
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0, 0.1, 0.5]
      }
    )

    // Observer toutes les sections enregistrées
    const elementsToObserve: Element[] = []

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        elementsToObserve.push(element)
      }

      // Observer également les sous-sections
      section.subsections?.forEach((subsection) => {
        const subElement = document.getElementById(subsection.id)
        if (subElement) {
          elementsToObserve.push(subElement)
        }
      })
    })

    // Ajouter tous les éléments à l'observer
    elementsToObserve.forEach(element => {
      observerRef.current?.observe(element)
    })

    // Fonction de nettoyage
    return () => {
      isUnmountingRef.current = true
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [sections, setCurrentSection])

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      isUnmountingRef.current = true
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])
}
