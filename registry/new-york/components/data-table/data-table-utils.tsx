import { DataGroup, DataTableGrouping } from './data-table-types'

/**
 * Génère les numéros de page à afficher dans la pagination
 */
export function generatePageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []
  const maxVisiblePages = 7

  if (totalPages <= maxVisiblePages) {
    // Afficher toutes les pages si peu de pages
    for (let i = 0; i < totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Toujours inclure la première page
    pages.push(0)

    if (currentPage <= 3) {
      // Début: 1, 2, 3, 4, 5, ..., last
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages - 1)
    } else if (currentPage >= totalPages - 4) {
      // Fin: 1, ..., last-4, last-3, last-2, last-1, last
      pages.push('ellipsis')
      for (let i = totalPages - 5; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Milieu: 1, ..., current-1, current, current+1, ..., last
      pages.push('ellipsis')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages - 1)
    }
  }

  return pages
}

/**
 * Obtient la valeur d'une propriété dans un objet via un chemin de type "user.name"
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj as unknown)
}

/**
 * Fonction utilitaire pour grouper les données côté client
 */
export function groupDataClientSide<T extends Record<string, unknown>>(
  data: T[],
  grouping: DataTableGrouping
): DataGroup<T>[] {
  const groups = new Map<unknown, T[]>()

  // Grouper les données par valeur de la colonne de groupement
  data.forEach(item => {
    const groupValue = getNestedValue(item, grouping.path)
    if (!groups.has(groupValue)) {
      groups.set(groupValue, [])
    }
    groups.get(groupValue)!.push(item)
  })

  // Convertir en format DataGroup avec état d'expansion
  return Array.from(groups.entries()).map(([groupValue, items], index) => ({
    groupValue,
    count: items.length,
    items,
    isExpanded: grouping.accordion
      ? (grouping.defaultExpanded !== false && index === 0) // En mode accordéon, seul le premier groupe est ouvert
      : (grouping.defaultExpanded !== false) // Mode normal : tous les groupes suivent defaultExpanded
  }))
}
