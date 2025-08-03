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
  DataTableMessages,
  FilterValue,
  Path,
  getValue,
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
function normalizeColumns<T>(columns: DataTableColumn<T, Path<T> | undefined, z.ZodType<T>>[]): DataTableColumn<T, Path<T> | undefined, z.ZodType<T>>[] {
  return columns.map(column => ({
    ...column,
    // Si pas de path défini, la colonne n'est pas triable ni filtrable
    isSortable: column.path ? (column.isSortable ?? false) : false,
    isFilterable: column.path ? (column.isFilterable ?? false) : false,
  }))
}

export function DataTable<T extends Record<string, unknown>>({
  schema,
  columns,
  getData,
  messages,
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
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [groups, setGroups] = useState<DataGroup<T>[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortColumns, setSortColumns] = useState<SortColumn<T>[]>([])
  const [filters, setFilters] = useState<ColumnFilter<T>[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize ?? defaultPageSize)
  const tableRef = useRef<HTMLDivElement>(null)
  const dataLengthRef = useRef(0)

  // Fonction utilitaire pour récupérer les messages avec fallback
  const getMessage = useCallback((key: keyof DataTableMessages, defaultValue: string, interpolations?: Record<string, string | number>): string => {
    let message = messages?.[key] || defaultValue

    // Interpolation des variables dans le message
    if (interpolations) {
      Object.entries(interpolations).forEach(([placeholder, value]) => {
        message = message.replace(`{${placeholder}}`, String(value))
      })
    }

    return message
  }, [messages])  // Normaliser les colonnes selon les règles définies
  const normalizedColumns = normalizeColumns(columns)

  // Utiliser les utilitaires responsive
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { columns: responsiveColumns } = useResponsiveColumns(normalizedColumns as any)

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
        setError(getMessage('validationError', `Erreur de validation : ${err.issues?.map(issue => issue.message).join(', ') || 'Données invalides'}`))
      } else {
        setError(getMessage('loadingError', `Erreur lors du chargement des données : ${err instanceof Error ? err.message : getMessage('unknownError', 'Erreur inconnue')}`))
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
  }, [getData, schema, sortColumns, currentPage, currentPageSize, paginationMode, grouping, filters, getMessage])

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
  const handleSort = (columnPath: string | Path<T>, event?: React.MouseEvent) => {
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
  const getSortIcon = (columnPath: string | Path<T>) => {
    const sortIndex = sortColumns.findIndex(s => String(s.path) === String(columnPath))
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
  const handleFilterChange = (columnPath: string | Path<T>, filterValue: FilterValue | undefined) => {
    setFilters(prevFilters => {
      const existingFilterIndex = prevFilters.findIndex(f => String(f.path) === String(columnPath))

      if (filterValue === null || filterValue === undefined) {
        // Supprimer le filtre si la valeur est vide
        return prevFilters.filter(f => String(f.path) !== String(columnPath))
      }

      const newFilter: ColumnFilter<T> = {
        path: columnPath,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filter: filterValue as any
      }

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

  const clearFilter = (columnPath: string | Path<T>) => {
    setFilters(prevFilters => prevFilters.filter(f => String(f.path) !== String(columnPath)))
  }

  // Obtenir l'icône de filtre pour une colonne
  const getFilterIcon = (columnPath: string | Path<T>) => {
    const hasFilter = filters.some(f => String(f.path) === String(columnPath))

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
  const getFilterValue = (columnPath: string | Path<T>): FilterValue | undefined => {
    const filter = filters.find(f => String(f.path) === String(columnPath))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return filter ? filter.filter as any : undefined
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return grouping.renderGroupHeader(groupValue as any, count, isExpanded)
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value = getValue(row, column as any)
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = getValue(row, column as any)
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
      return getNestedValue(row, String(rowKey)) === getNestedValue(selectedRow, String(rowKey))
    }
    // Comparaison par défaut : par référence
    return selectedRow === row
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {getMessage('loadingMessage', 'Chargement des données...')}
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
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    getColumnClasses(column)
                  )}
                  style={{ ...getColumnStyles(column), width: column.width }}
                  title={column.description}
                >
                  <div className="flex items-center gap-2">
                    {column.isFilterable && column.path && (
                      <FilterPopover
                        column={column}
                        filterValue={getFilterValue(column.path)}
                        onFilterChange={(value) => column.path && handleFilterChange(column.path, value)}
                        onClearFilter={() => column.path && clearFilter(column.path)}
                        icon={getFilterIcon(column.path)}
                        messages={messages}
                      />
                    )}
                    <div
                      className={cn(
                        'flex items-center gap-1 flex-1',
                        column.isSortable && column.path && 'cursor-pointer select-none hover:text-foreground'
                      )}
                      onClick={(event) => {
                        if (column.isSortable && column.path) {
                          handleSort(column.path, event)
                        }
                      }}
                      title={
                        column.isSortable && column.path
                          ? getMessage('sortColumnAriaLabel', '{column} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes', { column: column.description || column.label })
                          : undefined
                      }
                    >
                      <span>{column.label}</span>
                      {column.isSortable && column.path && getSortIcon(column.path)}
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
                  {getMessage('emptyMessage', 'Aucune donnée disponible')}
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
            <span className="text-sm text-muted-foreground">{getMessage('loadingIndicator', 'Chargement...')}</span>
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
            {getMessage('loadMoreButton', 'Charger plus')}
          </button>
        </div>
      )}

      {shouldShowPagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center gap-4">
            {showPaginationInfo && (
              <div className="text-sm text-muted-foreground">
                {getMessage('displayInfo', 'Affichage de {start} à {end} sur {total} éléments', {
                  start: startItem,
                  end: endItem,
                  total: totalCount
                })}
              </div>
            )}

            {paginationMode === 'PaginationWithSize' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{getMessage('elementsPerPage', 'Éléments par page:')}</span>
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

          <Pagination role="navigation" aria-label={getMessage('paginationAriaLabel', 'pagination')}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: React.MouseEvent) => {
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
                      onClick={(e: React.MouseEvent) => {
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
                  onClick={(e: React.MouseEvent) => {
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
            {getMessage('totalElements', '{total} éléments au total', { total: totalCount })}
          </div>
        </div>
      )}
    </div>
  )
}

DataTable.displayName = 'DataTable'
