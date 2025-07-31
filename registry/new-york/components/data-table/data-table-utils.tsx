import { DataGroup, DataTableGrouping, FilterValue, ColumnFilter } from './data-table-types'

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

/**
 * Évalue un filtre sur une valeur donnée
 * Utile pour l'implémentation côté serveur
 */
export function evaluateFilter(value: unknown, filter: FilterValue): boolean {
  if (!filter) return true

  switch (filter.operator) {
    case 'equals':
      return value === filter.value

    case 'not_equals':
      return value !== filter.value

    case 'contains':
      if (typeof value === 'string' && typeof filter.value === 'string') {
        return value.toLowerCase().includes(filter.value.toLowerCase())
      }
      return false

    case 'starts_with':
      if (typeof value === 'string' && typeof filter.value === 'string') {
        return value.toLowerCase().startsWith(filter.value.toLowerCase())
      }
      return false

    case 'ends_with':
      if (typeof value === 'string' && typeof filter.value === 'string') {
        return value.toLowerCase().endsWith(filter.value.toLowerCase())
      }
      return false

    case 'greater_than':
      return Number(value) > Number(filter.value)

    case 'greater_or_equal':
      return Number(value) >= Number(filter.value)

    case 'less_than':
      return Number(value) < Number(filter.value)

    case 'less_or_equal':
      return Number(value) <= Number(filter.value)

    case 'between': {
      const numValue = Number(value)
      const min = Number(filter.value)
      const max = Number(filter.value2)
      return numValue >= min && numValue <= max
    }

    case 'in':
      return filter.values?.includes(value) ?? false

    case 'not_in':
      return !(filter.values?.includes(value) ?? false)

    case 'is_null':
      return value === null || value === undefined

    case 'is_not_null':
      return value !== null && value !== undefined

    default:
      return true
  }
}

/**
 * Applique une liste de filtres sur un objet de données
 * Utile pour l'implémentation côté serveur
 */
export function applyFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: ColumnFilter[]
): T[] {
  if (!filters.length) return data

  return data.filter(item => {
    return filters.every(filter => {
      const value = getNestedValue(item, filter.path)
      return evaluateFilter(value, filter.filter)
    })
  })
}
