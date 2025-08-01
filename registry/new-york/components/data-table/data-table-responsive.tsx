import { useMemo, useEffect, useState } from "react"
import { DataTableColumn, CustomMediaQuery } from "./data-table-types"

// Hook simple pour écouter les changements de taille d'écran
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export function useResponsiveColumns<T>(columns: DataTableColumn<T>[]) {
  const { width } = useWindowSize()

  // Déterminer les breakpoints actuels
  const isMobile = width <= 639
  const isTablet = width >= 640 && width <= 1023
  const isDesktop = width >= 1024

  // Filtrer les colonnes selon le breakpoint actuel
  const visibleColumns = useMemo(() => {
    // Fonction pour vérifier si une media query personnalisée correspond
    const checkCustomMediaQuery = (media: CustomMediaQuery): boolean => {
      const min = media.min ? parseInt(media.min.replace('px', '')) : 0
      const max = media.max ? parseInt(media.max.replace('px', '')) : Infinity
      return width >= min && width <= max
    }

    return columns.filter(column => {
      const responsive = column.responsive

      // Si pas de configuration responsive, la colonne est toujours visible
      if (!responsive || !responsive.medias || responsive.medias.length === 0) {
        return true
      }

      // Vérifier si la colonne doit être visible selon les media queries
      return responsive.medias.some(media => {
        if (typeof media === 'string') {
          // Breakpoint prédéfini
          switch (media) {
            case 'Mobile':
              return isMobile
            case 'Tablet':
              return isTablet
            case 'Desktop':
              return isDesktop
            default:
              return false
          }
        } else {
          // Media query personnalisée
          return checkCustomMediaQuery(media)
        }
      })
    })
  }, [columns, width, isMobile, isTablet, isDesktop])

  return {
    columns: visibleColumns,
    isMobile,
    isTablet,
    isDesktop
  }
}

export function getColumnClasses<T>(_column: DataTableColumn<T>): string {
  // Plus besoin de générer des classes car nous filtrons les colonnes directement
  // Gardé pour compatibilité mais retourne une chaîne vide
  return ''
}

export function getColumnStyles<T>(column: DataTableColumn<T>): React.CSSProperties {
  const responsive = column.responsive
  if (!responsive) return {}

  const styles: React.CSSProperties = {}

  switch (responsive.widthMode) {
    case 'content':
      styles.width = responsive.width || 'auto'
      break
    case 'range':
      styles.minWidth = responsive.minWidth
      styles.maxWidth = responsive.maxWidth
      break
    case 'fill':
      styles.minWidth = responsive.minWidth
      styles.width = '100%'
      break
  }

  return styles
}
