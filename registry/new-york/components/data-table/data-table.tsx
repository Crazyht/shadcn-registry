import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2, ChevronRight, Filter, FilterX } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

/**
 * Configuration d'icônes personnalisées pour le tri
 */
export interface SortIcons {
  /** Icône affichée quand aucun tri n'est appliqué sur la colonne */
  default?: React.ComponentType<{ className?: string }>
  /** Icône affichée pour le tri croissant */
  asc?: React.ComponentType<{ className?: string }>
  /** Icône affichée pour le tri décroissant */
  desc?: React.ComponentType<{ className?: string }>
  /** Classes CSS personnalisées pour chaque état de tri */
  classNames?: {
    default?: string
    asc?: string
    desc?: string
  }
}

/**
 * Configuration d'icônes personnalisées pour le filtrage
 */
export interface FilterIcons {
  /** Icône affichée pour ouvrir le filtre */
  default?: React.ComponentType<{ className?: string }>
  /** Icône affichée quand un filtre est actif */
  active?: React.ComponentType<{ className?: string }>
  /** Classes CSS personnalisées pour chaque état de filtre */
  classNames?: {
    default?: string
    active?: string
  }
}

/**
 * Type pour un filtre de colonne
 */
export interface ColumnFilter {
  /** Chemin de la colonne filtrée */
  path: string
  /** Valeur du filtre */
  value: unknown
}

/**
 * Props pour un contrôle de filtre personnalisé
 */
export interface FilterControlProps {
  /** Valeur actuelle du filtre */
  value: unknown
  /** Callback appelé quand la valeur change */
  onChange: (value: unknown) => void
  /** Callback pour fermer la popover */
  onClose: () => void
}

/**
 * Type pour une colonne du tableau
 */
export interface DataTableColumn<T> {
  /** Libellé affiché dans l'en-tête */
  label: string
  /** Description de la colonne (tooltip) */
  description?: string
  /** Chemin vers la propriété dans les données (ex: 'user.name') - Optionnel pour colonnes d'actions */
  path?: string
  /** Si la colonne peut être triée - Automatiquement false si path n'est pas défini */
  isSortable?: boolean
  /** Si la colonne peut être filtrée - Automatiquement false si path n'est pas défini */
  isFilterable?: boolean
  /** Contrôle de filtre personnalisé pour cette colonne */
  filterControl?: React.ComponentType<FilterControlProps>
  /** Fonction de rendu personnalisée pour la cellule */
  render?: (value: unknown, row: T) => React.ReactNode
  /** Largeur de la colonne */
  width?: string
  /** Alignement du contenu */
  align?: 'left' | 'center' | 'right'
  /** Type de colonne pour clarifier l'usage */
  type?: 'data' | 'action' | 'computed'
}

/**
 * Type pour le tri
 */
export interface SortColumn {
  /** Chemin de la colonne à trier */
  path: string
  /** Direction du tri */
  direction: 'asc' | 'desc'
}

/**
 * Type pour le groupement
 */
export interface DataTableGrouping {
  /** Chemin de la colonne à grouper (ex: 'status', 'category') */
  path: string
  /** Fonction de rendu personnalisée pour l'en-tête de groupe */
  renderGroupHeader?: (groupValue: unknown, count: number, isExpanded: boolean) => React.ReactNode
  /** Si le groupe est expandable/collapsible (défaut: true) */
  expandable?: boolean
  /** État initial des groupes (défaut: true = tous expandés) */
  defaultExpanded?: boolean
  /** Mode accordéon - si true, un seul groupe peut être ouvert à la fois (défaut: false) */
  accordion?: boolean
}

/**
 * Type pour un groupe de données
 */
export interface DataGroup<T> {
  /** Valeur de groupement */
  groupValue: unknown
  /** Nombre d'éléments dans le groupe */
  count: number
  /** Les données du groupe */
  items: T[]
  /** Si le groupe est actuellement expandé */
  isExpanded: boolean
}

/**
 * Type pour la réponse de getData avec pagination
 */
export interface DataTableResponse<T> {
  /** Les données de la page actuelle */
  data: T[]
  /** Nombre total d'éléments */
  totalCount: number
  /** Numéro de la dernière ligne retournée */
  lastRow: number
  /** Informations de groupement (optionnel) */
  groups?: DataGroup<T>[]
}

/**
 * Mode de pagination pour le DataTable
 */
export type PaginationMode =
  | 'None'                    // Pas de pagination automatique, l'appelant gère le paging
  | 'InfiniteScroll'          // Scroll infini avec chargement automatique
  | 'Pagination'              // Pagination classique sans contrôle de taille
  | 'PaginationWithSize'      // Pagination avec contrôle de taille de page

/**
 * Props pour le composant DataTable
 */
export interface DataTableProps<T> {
  /** Schéma Zod pour valider les données */
  schema: z.ZodSchema<T>
  /** Configuration des colonnes */
  columns: DataTableColumn<T>[]
  /** Fonction pour récupérer les données avec tri et pagination */
  getData: (sortColumns: SortColumn[], startRow: number, pageSize: number, grouping?: DataTableGrouping, filters?: ColumnFilter[]) => Promise<DataTableResponse<T>> | DataTableResponse<T>
  /** Classes CSS additionnelles */
  className?: string
  /** Message à afficher quand aucune donnée */
  emptyMessage?: string
  /** Message de chargement */
  loadingMessage?: string
  /** Callback de sélection de ligne */
  onRowSelect?: (row: T) => void
  /** Ligne sélectionnée */
  selectedRow?: T
  /** Clé à utiliser pour comparer les lignes sélectionnées (ex: 'id') */
  rowKey?: string
  /** Taille de page pour la pagination (défaut: 50) */
  pageSize?: number
  /** Mode de pagination (défaut: 'PaginationWithSize') */
  paginationMode?: PaginationMode
  /** Afficher un bouton "Charger plus" en fallback pour infinite scroll */
  showLoadMoreButton?: boolean
  /** Options de taille de page disponibles pour PaginationWithSize */
  pageSizeOptions?: number[]
  /** Afficher les informations de pagination (ex: "Affichage de 1 à 10 sur 50 éléments") */
  showPaginationInfo?: boolean
  /** Afficher la pagination même s'il n'y a qu'une seule page */
  showSinglePagePagination?: boolean
  /** Configuration du groupement */
  grouping?: DataTableGrouping
  /** Configuration d'icônes personnalisées pour le tri */
  sortIcons?: SortIcons
  /** Configuration d'icônes personnalisées pour les filtres */
  filterIcons?: FilterIcons
}

/**
 * Génère les numéros de page à afficher dans la pagination
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
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
 * Fonction utilitaire pour obtenir une valeur par son chemin
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

/**
 * Normalise les colonnes pour gérer les règles de tri
 * - Si path n'est pas défini, isSortable = false
 * - Si plusieurs colonnes ont le même path, seule la première peut être triable
 */
function normalizeColumns<T>(columns: DataTableColumn<T>[]): DataTableColumn<T>[] {
  const seenPaths = new Set<string>()

  return columns.map(column => {
    // Si pas de path, forcer isSortable à false
    if (!column.path) {
      return {
        ...column,
        isSortable: false
      }
    }

    // Si le path a déjà été vu et que cette colonne veut être triable
    if (seenPaths.has(column.path) && column.isSortable) {
      return {
        ...column,
        isSortable: false
      }
    }

    // Marquer ce path comme utilisé
    if (column.isSortable) {
      seenPaths.add(column.path)
    }

    return column
  })
}

/**
 * Composant de tableau de données avec tri et validation Zod
 * @component
 * @example
 * ```tsx
 * const UserSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 *   email: z.string().email(),
 * })
 *
 * const columns: DataTableColumn<User>[] = [
 *   { label: 'ID', path: 'id', isSortable: true },
 *   { label: 'Nom', path: 'name', isSortable: true },
 *   { label: 'Email', path: 'email', isSortable: true },
 * ]
 *
 * <DataTable
 *   schema={UserSchema}
 *   columns={columns}
 *   getData={async (sortColumns, startRow, pageSize) => {
 *     const response = await fetch('/api/users', {
 *       method: 'POST',
 *       body: JSON.stringify({ sort: sortColumns, startRow, pageSize })
 *     })
 *     const result = await response.json()
 *     return {
 *       data: result.data,
 *       totalCount: result.totalCount,
 *       lastRow: startRow + result.data.length - 1
 *     }
 *   }}
 * />
 * ```
 */
/**
 * Fonction utilitaire pour grouper les données côté client
 */
function groupDataClientSide<T extends Record<string, unknown>>(
  data: T[],
  grouping: DataTableGrouping
): DataGroup<T>[] {
  const groups = new Map<string, T[]>()

  // Grouper les données par valeur
  data.forEach(item => {
    const groupValue = getValueByPath(item, grouping.path)
    const groupKey = String(groupValue ?? 'null')

    if (!groups.has(groupKey)) {
      groups.set(groupKey, [])
    }
    groups.get(groupKey)!.push(item)
  })

  // Convertir en DataGroup[]
  const result = Array.from(groups.entries()).map(([key, items], index) => {
    let isExpanded: boolean

    if (grouping.accordion) {
      // En mode accordéon, seul le premier groupe est ouvert si defaultExpanded est true
      isExpanded = grouping.defaultExpanded !== false && index === 0
    } else {
      // Mode normal : tous les groupes suivent defaultExpanded
      isExpanded = grouping.defaultExpanded !== false
    }

    return {
      groupValue: key === 'null' ? null : items[0] ? getValueByPath(items[0], grouping.path) : key,
      count: items.length,
      items,
      isExpanded
    }
  })

  return result
}

/**
 * Composant FilterPopover pour gérer les filtres de colonnes
 */
interface FilterPopoverProps<T> {
  column: DataTableColumn<T>
  filterValue: unknown
  onFilterChange: (value: unknown) => void
  onClearFilter: () => void
  icon: React.ReactNode
}

function FilterPopover<T>({ column, filterValue, onFilterChange, onClearFilter, icon }: FilterPopoverProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState(filterValue)

  // Synchroniser la valeur temporaire avec la valeur du filtre
  useEffect(() => {
    setTempValue(filterValue)
  }, [filterValue])

  const handleApplyFilter = () => {
    onFilterChange(tempValue)
    setIsOpen(false)
  }

  const handleClearFilter = () => {
    setTempValue(undefined)
    onClearFilter()
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempValue(filterValue)
    setIsOpen(false)
  }

  const renderFilterControl = () => {
    if (column.filterControl) {
      const FilterControl = column.filterControl
      return (
        <FilterControl
          value={tempValue}
          onChange={setTempValue}
          onClose={() => setIsOpen(false)}
        />
      )
    }

    // Contrôle par défaut : input texte
    return (
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Filtrer par {column.label.toLowerCase()}</label>
          <input
            type="text"
            value={tempValue as string || ''}
            onChange={(e) => setTempValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={`Saisir ${column.label.toLowerCase()}...`}
          />
        </div>
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
        >
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4">
          <div className="font-medium text-sm">Filtrer la colonne "{column.label}"</div>

          {renderFilterControl()}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilter}
              className="text-xs"
            >
              Effacer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-xs"
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleApplyFilter}
              className="text-xs"
            >
              Filtrer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Contrôles de filtre prédéfinis
 */

// Filtre texte simple
export function TextFilterControl({ value, onChange }: FilterControlProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Rechercher</label>
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Saisir le texte à rechercher..."
        />
      </div>
    </div>
  )
}

// Filtre nombre avec opérateurs
export function NumberFilterControl({ value, onChange }: FilterControlProps) {
  const [operator, setOperator] = useState('=')
  const [numberValue, setNumberValue] = useState('')

  useEffect(() => {
    if (value && typeof value === 'object' && 'operator' in value && 'value' in value) {
      const filter = value as { operator: string; value: string }
      setOperator(filter.operator)
      setNumberValue(filter.value)
    }
  }, [value])

  const handleChange = (newOperator: string, newValue: string) => {
    setOperator(newOperator)
    setNumberValue(newValue)
    if (newValue) {
      onChange({ operator: newOperator, value: newValue })
    } else {
      onChange(null)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Filtrer par nombre</label>
        <div className="flex gap-2 mt-1">
          <Select value={operator} onValueChange={(op) => handleChange(op, numberValue)}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="=">=</SelectItem>
              <SelectItem value="!=">≠</SelectItem>
              <SelectItem value="<">&lt;</SelectItem>
              <SelectItem value="<=">&le;</SelectItem>
              <SelectItem value=">">&gt;</SelectItem>
              <SelectItem value=">=">&ge;</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="number"
            value={numberValue}
            onChange={(e) => handleChange(operator, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Valeur..."
          />
        </div>
      </div>
    </div>
  )
}

// Filtre select avec options
export function SelectFilterControl({ value, onChange, options }: FilterControlProps & { options: { label: string; value: string }[] }) {
  const handleValueChange = (newValue: string) => {
    if (newValue === '__all__') {
      onChange('') // Convertir la valeur spéciale en chaîne vide pour le filtre
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Sélectionner une option</label>
        <Select value={value as string || '__all__'} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Choisir une option..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes les options</SelectItem>
            {options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function DataTable<T extends Record<string, unknown>>({
  schema,
  columns,
  getData,
  className,
  emptyMessage = 'Aucune donnée disponible',
  loadingMessage = 'Chargement...',
  onRowSelect,
  selectedRow,
  rowKey = 'id',
  pageSize = 50,
  paginationMode = 'PaginationWithSize',
  showLoadMoreButton = true,
  pageSizeOptions = [10, 25, 50, 100],
  showPaginationInfo = true,
  showSinglePagePagination = false,
  grouping,
  sortIcons,
  filterIcons,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [groups, setGroups] = useState<DataGroup<T>[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([])
  const [filters, setFilters] = useState<ColumnFilter[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const tableRef = useRef<HTMLDivElement>(null)

  // Normaliser les colonnes selon les règles définies
  const normalizedColumns = normalizeColumns(columns)

  // Calculer les métriques de pagination
  const totalPages = Math.ceil(totalCount / currentPageSize)
  const startItem = currentPage * currentPageSize + 1
  const endItem = Math.min((currentPage + 1) * currentPageSize, totalCount)
  const hasNextPage = currentPage < totalPages - 1
  const hasPrevPage = currentPage > 0

  // Déterminer si on doit afficher la pagination
  const shouldShowPagination = (paginationMode === 'Pagination' || paginationMode === 'PaginationWithSize') &&
    totalCount > 0 &&
    (totalPages > 1 || showSinglePagePagination)

  // Charger les données
  const loadData = useCallback(async (append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setError(null)
      }

      let startRow = 0
      let requestSize = currentPageSize

      switch (paginationMode) {
        case 'None':
          startRow = 0
          requestSize = 1000000 // Grande valeur pour récupérer toutes les données
          break
        case 'InfiniteScroll':
          startRow = append ? data.length : 0
          requestSize = currentPageSize
          break
        case 'Pagination':
        case 'PaginationWithSize':
          startRow = currentPage * currentPageSize
          requestSize = currentPageSize
          break
      }

      const response = await getData(sortColumns, startRow, requestSize, grouping, filters)

      // Valider les données avec le schéma Zod
      const validatedData = z.array(schema).parse(response.data)

      if (append && paginationMode === 'InfiniteScroll') {
        setData(prevData => [...prevData, ...validatedData])
      } else {
        setData(validatedData)
      }
      setTotalCount(response.totalCount)

      // Gérer les groupes
      if (grouping) {
        if (response.groups) {
          // Utiliser les groupes fournis par le serveur
          setGroups(response.groups)
        } else {
          // Grouper côté client si le serveur ne le fait pas
          const clientGroups = groupDataClientSide(validatedData, grouping)
          setGroups(clientGroups)
        }
      } else {
        setGroups([])
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(`Erreur de validation : ${err.issues?.map(issue => issue.message).join(', ') || 'Données invalides'}`)
      } else {
        setError(`Erreur lors du chargement des données : ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
      }
      if (!append) {
        setData([])
        setTotalCount(0)
        setGroups([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [getData, schema, sortColumns, currentPage, currentPageSize, paginationMode, data.length, grouping, filters])

  // Charger les données au montage et quand le tri change
  useEffect(() => {
    loadData()
  }, [sortColumns, loadData])

  // Recharger les données quand la page ou la taille de page change (sauf en mode InfiniteScroll)
  useEffect(() => {
    if (paginationMode !== 'InfiniteScroll') {
      loadData()
    }
  }, [currentPage, currentPageSize, paginationMode, loadData])

  // Remettre à zéro la pagination quand le tri change
  useEffect(() => {
    setCurrentPage(0)
  }, [sortColumns])

  // Remettre à zéro la pagination quand les filtres changent
  useEffect(() => {
    setCurrentPage(0)
  }, [filters])

  // Gérer l'infinite scroll
  useEffect(() => {
    if (paginationMode !== 'InfiniteScroll') return

    const handleScroll = () => {
      if (!tableRef.current || loadingMore) return

      const { scrollTop, scrollHeight, clientHeight } = tableRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

      if (isNearBottom && data.length < totalCount) {
        loadData(true)
      }
    }

    const currentTable = tableRef.current
    if (currentTable) {
      currentTable.addEventListener('scroll', handleScroll)
      return () => currentTable.removeEventListener('scroll', handleScroll)
    }
  }, [paginationMode, loadingMore, data.length, totalCount, loadData])

  // Handlers de pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setCurrentPageSize(newSize)
    setCurrentPage(0)
  }

  const handleLoadMore = () => {
    if (paginationMode === 'InfiniteScroll' && !loadingMore) {
      loadData(true)
    }
  }

  // Gérer le tri d'une colonne
  const handleSort = (columnPath: string, event?: React.MouseEvent) => {
    setSortColumns(prevSort => {
      const existingSort = prevSort.find(s => s.path === columnPath)
      const isMultiSort = event?.ctrlKey || event?.shiftKey

      if (existingSort) {
        if (existingSort.direction === 'asc') {
          // Passer à desc
          const updatedSort = { ...existingSort, direction: 'desc' as const }

          if (isMultiSort) {
            // Mode multi-colonne : garder les autres tris
            return prevSort.map(s =>
              s.path === columnPath ? updatedSort : s
            )
          } else {
            // Mode simple : remplacer tous les tris
            return [updatedSort]
          }
        } else {
          // Supprimer le tri de cette colonne
          const filteredSort = prevSort.filter(s => s.path !== columnPath)

          if (isMultiSort) {
            // Mode multi-colonne : garder les autres tris
            return filteredSort
          } else {
            // Mode simple : si on supprime le seul tri, tout effacer
            return filteredSort.length === prevSort.length - 1 ? [] : filteredSort
          }
        }
      } else {
        // Ajouter un nouveau tri en asc
        const newSort = { path: columnPath, direction: 'asc' as const }

        if (isMultiSort) {
          // Mode multi-colonne : ajouter à la liste existante
          return [...prevSort, newSort]
        } else {
          // Mode simple : remplacer tous les tris
          return [newSort]
        }
      }
    })
  }

  // Obtenir l'icône de tri pour une colonne
  const getSortIcon = (columnPath: string) => {
    const sortIndex = sortColumns.findIndex(s => s.path === columnPath)
    const sort = sortColumns[sortIndex]

    if (!sort) {
      // Aucun tri appliqué - utiliser l'icône par défaut
      const DefaultIcon = sortIcons?.default || ChevronsUpDown
      const defaultClassName = sortIcons?.classNames?.default || "h-4 w-4 text-muted-foreground"
      return <DefaultIcon className={defaultClassName} />
    }

    const isMultiSort = sortColumns.length > 1
    const sortNumber = isMultiSort ? sortIndex + 1 : null

    // Choisir l'icône et les classes selon la direction
    const SortIcon = sort.direction === 'asc'
      ? (sortIcons?.asc || ChevronUp)
      : (sortIcons?.desc || ChevronDown)

    const iconClassName = sort.direction === 'asc'
      ? (sortIcons?.classNames?.asc || "h-4 w-4 text-foreground")
      : (sortIcons?.classNames?.desc || "h-4 w-4 text-foreground")

    return (
      <div className="flex items-center gap-1">
        <SortIcon className={iconClassName} />
        {sortNumber && (
          <span className="text-xs font-medium text-foreground bg-muted rounded px-1 min-w-[16px] text-center">
            {sortNumber}
          </span>
        )}
      </div>
    )
  }

  // Fonctions de gestion des filtres
  const handleFilterChange = (columnPath: string, value: unknown) => {
    setFilters(prevFilters => {
      const existingFilterIndex = prevFilters.findIndex(f => f.path === columnPath)

      if (value === null || value === undefined || value === '') {
        // Supprimer le filtre si la valeur est vide
        return prevFilters.filter(f => f.path !== columnPath)
      }

      const newFilter: ColumnFilter = { path: columnPath, value }

      if (existingFilterIndex >= 0) {
        // Mettre à jour le filtre existant
        return prevFilters.map((f, index) =>
          index === existingFilterIndex ? newFilter : f
        )
      } else {
        // Ajouter un nouveau filtre
        return [...prevFilters, newFilter]
      }
    })
  }

  const clearFilter = (columnPath: string) => {
    setFilters(prevFilters => prevFilters.filter(f => f.path !== columnPath))
  }

  // Obtenir l'icône de filtre pour une colonne
  const getFilterIcon = (columnPath: string) => {
    const hasFilter = filters.some(f => f.path === columnPath)

    if (hasFilter) {
      const ActiveIcon = filterIcons?.active || FilterX
      const activeClassName = filterIcons?.classNames?.active || "h-4 w-4 text-primary"
      return <ActiveIcon className={activeClassName} />
    } else {
      const DefaultIcon = filterIcons?.default || Filter
      const defaultClassName = filterIcons?.classNames?.default || "h-4 w-4 text-muted-foreground"
      return <DefaultIcon className={defaultClassName} />
    }
  }

  const getFilterValue = (columnPath: string) => {
    const filter = filters.find(f => f.path === columnPath)
    return filter ? filter.value : undefined
  }

  // Gérer la sélection de ligne
  const handleRowClick = (row: T) => {
    onRowSelect?.(row)
  }

  // Gérer l'expansion/collapse des groupes
  const toggleGroupExpansion = (groupValue: unknown) => {
    setGroups(prevGroups => {
      if (grouping?.accordion) {
        // Mode accordéon : fermer tous les autres groupes
        return prevGroups.map(group => {
          if (group.groupValue === groupValue) {
            return { ...group, isExpanded: !group.isExpanded }
          } else {
            return { ...group, isExpanded: false }
          }
        })
      } else {
        // Mode normal : toggle seulement le groupe cliqué
        return prevGroups.map(group =>
          group.groupValue === groupValue
            ? { ...group, isExpanded: !group.isExpanded }
            : group
        )
      }
    })
  }

  // Rendu d'un en-tête de groupe
  const renderGroupHeader = (group: DataGroup<T>) => {
    const { groupValue, count, isExpanded } = group
    const isExpandable = grouping?.expandable !== false

    if (grouping?.renderGroupHeader) {
      return grouping.renderGroupHeader(groupValue, count, isExpanded)
    }

    return (
      <div className="flex items-center gap-2 font-medium">
        {isExpandable && (
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        )}
        <span>
          {String(groupValue ?? 'Non défini')} ({count} élément{count > 1 ? 's' : ''})
        </span>
      </div>
    )
  }

  // Rendu des lignes avec grouping
  const renderGroupedRows = () => {
    return groups.map((group, groupIndex) => {
      const isExpandable = grouping?.expandable !== false
      const rows = []

      // En-tête de groupe
      rows.push(
        <tr
          key={`group-${groupIndex}`}
          className={cn(
            'border-b bg-muted/30 transition-colors',
            isExpandable && 'cursor-pointer hover:bg-muted/50'
          )}
          onClick={() => isExpandable && toggleGroupExpansion(group.groupValue)}
        >
          <td
            colSpan={normalizedColumns.length}
            className="h-12 px-4 font-medium"
          >
            {renderGroupHeader(group)}
          </td>
        </tr>
      )

      // Lignes du groupe (si expandé)
      if (group.isExpanded) {
        group.items.forEach((row, rowIndex) => {
          rows.push(
            <tr
              key={`group-${groupIndex}-row-${rowIndex}`}
              className={cn(
                'border-b transition-colors hover:bg-muted/50',
                onRowSelect && 'cursor-pointer',
                isRowSelected(row) && 'bg-muted'
              )}
              onClick={() => handleRowClick(row)}
            >
              {normalizedColumns.map((column, colIndex) => {
                const value = column.path ? getValueByPath(row, column.path) : undefined
                const displayValue = column.render ? column.render(value, row) : (value as React.ReactNode)

                return (
                  <td
                    key={colIndex}
                    className={cn(
                      'p-4 align-middle',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {displayValue}
                  </td>
                )
              })}
            </tr>
          )
        })
      }

      return rows
    }).flat()
  }

  // Rendu des lignes normales (sans grouping)
  const renderNormalRows = () => {
    return data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className={cn(
          'border-b transition-colors hover:bg-muted/50',
          onRowSelect && 'cursor-pointer',
          isRowSelected(row) && 'bg-muted'
        )}
        onClick={() => handleRowClick(row)}
      >
        {normalizedColumns.map((column, colIndex) => {
          const value = column.path ? getValueByPath(row, column.path) : undefined
          const displayValue = column.render ? column.render(value, row) : (value as React.ReactNode)

          return (
            <td
              key={colIndex}
              className={cn(
                'p-4 align-middle',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right'
              )}
            >
              {displayValue}
            </td>
          )
        })}
      </tr>
    ))
  }

  // Vérifier si une ligne est sélectionnée
  const isRowSelected = (row: T) => {
    if (!selectedRow) return false
    if (rowKey) {
      return getValueByPath(row, rowKey) === getValueByPath(selectedRow, rowKey)
    }
    return selectedRow === row
  }

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="text-muted-foreground">{loadingMessage}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="text-destructive">{error}</div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={tableRef}
        className={cn(
          'rounded-md border',
          paginationMode === 'InfiniteScroll' && 'max-h-96 overflow-auto'
        )}
      >
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b sticky top-0 bg-background">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {normalizedColumns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                    column.isSortable && column.path && 'cursor-pointer select-none hover:text-foreground',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={(event) => column.isSortable && column.path && handleSort(column.path, event)}
                  title={
                    column.isSortable && column.path
                      ? `${column.description || column.label} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes`
                      : column.description
                  }
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    <div className="flex items-center gap-1">
                      {column.isSortable && column.path && getSortIcon(column.path)}
                      {column.isFilterable && column.path && (
                        <FilterPopover
                          column={column}
                          filterValue={getFilterValue(column.path)}
                          onFilterChange={(value) => handleFilterChange(column.path!, value)}
                          onClearFilter={() => clearFilter(column.path!)}
                          icon={getFilterIcon(column.path)}
                        />
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.length === 0 && groups.length === 0 ? (
              <tr>
                <td
                  colSpan={normalizedColumns.length}
                  className="h-24 px-4 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : grouping && groups.length > 0 ? (
              renderGroupedRows()
            ) : (
              renderNormalRows()
            )}
          </tbody>
        </table>

        {/* Infinite scroll loading indicator */}
        {paginationMode === 'InfiniteScroll' && loadingMore && (
          <div className="flex items-center justify-center p-4 border-t">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Chargement...</span>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {paginationMode === 'InfiniteScroll' && showLoadMoreButton && data.length < totalCount && !loadingMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          >
            Charger plus
          </button>
        </div>
      )}

      {shouldShowPagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center gap-4">
            {showPaginationInfo && (
              <div className="text-sm text-muted-foreground">
                Affichage de {startItem} à {endItem} sur {totalCount} éléments
              </div>
            )}

            {paginationMode === 'PaginationWithSize' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Éléments par page:</span>
                <Select
                  value={currentPageSize.toString()}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map(size => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (hasPrevPage) handlePageChange(currentPage - 1)
                  }}
                  className={!hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {generatePageNumbers(currentPage, totalPages).map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                      size="icon"
                    >
                      {page + 1}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (hasNextPage) handlePageChange(currentPage + 1)
                  }}
                  className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Info pour mode None */}
      {paginationMode === 'None' && totalCount > 0 && (
        <div className="flex items-center justify-center px-2 py-4">
          <div className="text-sm text-muted-foreground">
            {totalCount} éléments au total
          </div>
        </div>
      )}
    </div>
  )
}

DataTable.displayName = 'DataTable'
