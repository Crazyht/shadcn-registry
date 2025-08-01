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
import { z } from 'zod'

// Imports depuis les fichiers séparés
import {
  DataTableProps,
  DataTableColumn,
  SortColumn,
  ColumnFilter,
  DataGroup,
  FilterValue,
} from './data-table-types'
import { generatePageNumbers, getNestedValue, groupDataClientSide } from './data-table-utils'
import { FilterPopover } from './data-table-filters'
import { useResponsiveColumns, getColumnClasses, getColumnStyles } from './data-table-responsive'

// Exporter les types et composants pour l'usage externe
export * from './data-table-types'
export { TextFilterControl, NumberFilterControl, SelectFilterControl } from './data-table-filters'
export { evaluateFilter, applyFilters } from './data-table-utils'
export { useResponsiveColumns, getColumnClasses, getColumnStyles } from './data-table-responsive'

/**
 * Normalise les colonnes selon les règles définies
 */
function normalizeColumns<T>(columns: DataTableColumn<T>[]): DataTableColumn<T>[] {
  return columns.map(column => ({
    ...column,
    // Si pas de path défini, la colonne n'est pas triable ni filtrable
    isSortable: column.path ? (column.isSortable ?? false) : false,
    isFilterable: column.path ? (column.isFilterable ?? false) : false,
  }))
}

/**
 * Obtient la valeur d'une propriété dans un objet via un chemin de type "user.name"
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return getNestedValue(obj, path)
}

export function DataTable<T extends Record<string, unknown>>({
  schema,
  columns,
  getData,
  emptyMessage = 'Aucune donnée disponible',
  paginationMode = 'PaginationWithSize',
  defaultPageSize = 50,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  showPaginationInfo = true,
  showSinglePagePagination = false,
  onRowSelect,
  selectedRow,
  rowKey = 'id',
  rowComparison,
  grouping,
  sortIcons,
  filterIcons,
  showLoadMoreButton = false,
  loadingMessage = 'Chargement des données...',
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
  const [currentPageSize, setCurrentPageSize] = useState(pageSize ?? defaultPageSize)
  const tableRef = useRef<HTMLDivElement>(null)
  const dataLengthRef = useRef(0)

  // Normaliser les colonnes selon les règles définies
  const normalizedColumns = normalizeColumns(columns)

  // Utiliser les utilitaires responsive
  const { columns: responsiveColumns } = useResponsiveColumns(normalizedColumns)

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
          startRow = append ? dataLengthRef.current : 0
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
        setData(prevData => {
          const newData = [...prevData, ...validatedData]
          dataLengthRef.current = newData.length
          return newData
        })
      } else {
        setData(validatedData)
        dataLengthRef.current = validatedData.length
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
      // Utiliser React 18's flushSync pour éviter les erreurs de mise à jour après démontage
      try {
        setLoading(false)
        setLoadingMore(false)
      } catch {
        // Ignorer les erreurs si le composant est démonté
      }
    }
  }, [getData, schema, sortColumns, currentPage, currentPageSize, paginationMode, grouping, filters])

  // Charger les données au montage et quand le tri change
  useEffect(() => {
    loadData()
  }, [sortColumns, loadData])

  // Synchroniser la ref avec la longueur des données
  useEffect(() => {
    dataLengthRef.current = data.length
  }, [data.length])

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
  const handleFilterChange = (columnPath: string, filterValue: FilterValue | undefined) => {
    setFilters(prevFilters => {
      const existingFilterIndex = prevFilters.findIndex(f => f.path === columnPath)

      if (filterValue === null || filterValue === undefined) {
        // Supprimer le filtre si la valeur est vide
        return prevFilters.filter(f => f.path !== columnPath)
      }

      const newFilter: ColumnFilter = { path: columnPath, filter: filterValue }

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
  const getFilterValue = (columnPath: string): FilterValue | undefined => {
    const filter = filters.find(f => f.path === columnPath)
    return filter ? filter.filter : undefined
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
            colSpan={responsiveColumns.length}
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
              {responsiveColumns.map((column, colIndex) => {
                const value = column.path ? getValueByPath(row, column.path) : undefined
                const displayValue = column.render ? column.render(value, row) : (value as React.ReactNode)

                return (
                  <td
                    key={colIndex}
                    className={cn(
                      'p-4 align-middle',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      getColumnClasses(column)
                    )}
                    style={getColumnStyles(column)}
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
        {responsiveColumns.map((column, colIndex) => {
          const value = column.path ? getValueByPath(row, column.path) : undefined
          const displayValue = column.render ? column.render(value, row) : (value as React.ReactNode)

          return (
            <td
              key={colIndex}
              className={cn(
                'p-4 align-middle',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right',
                getColumnClasses(column)
              )}
              style={getColumnStyles(column)}
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
    if (rowComparison) {
      return rowComparison(row, selectedRow)
    }
    if (rowKey) {
      return getValueByPath(row, rowKey) === getValueByPath(selectedRow, rowKey)
    }
    // Comparaison par défaut : par référence
    return selectedRow === row
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingMessage}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">{error}</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        ref={tableRef}
        className={cn(
          'rounded-md border overflow-x-auto',
          paginationMode === 'InfiniteScroll' && 'max-h-96 overflow-auto'
        )}
      >
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b sticky top-0 bg-background">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {responsiveColumns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                    column.isSortable && column.path && 'cursor-pointer select-none hover:text-foreground',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    getColumnClasses(column)
                  )}
                  style={{ ...getColumnStyles(column), width: column.width }}
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
                  colSpan={responsiveColumns.length}
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

          <Pagination role="navigation" aria-label="pagination">
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
