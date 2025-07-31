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
 * Opérateurs de filtrage supportés
 */
export type FilterOperator =
  | 'equals'           // Égalité exacte
  | 'not_equals'       // Différent de
  | 'contains'         // Contient (texte)
  | 'starts_with'      // Commence par (texte)
  | 'ends_with'        // Finit par (texte)
  | 'greater_than'     // Plus grand que (nombre/date)
  | 'greater_or_equal' // Plus grand ou égal (nombre/date)
  | 'less_than'        // Plus petit que (nombre/date)
  | 'less_or_equal'    // Plus petit ou égal (nombre/date)
  | 'between'          // Entre deux valeurs (nombre/date)
  | 'in'               // Dans une liste de valeurs
  | 'not_in'           // Pas dans une liste de valeurs
  | 'is_null'          // Est nul
  | 'is_not_null'      // N'est pas nul

/**
 * Valeur de filtre uniforme
 */
export interface FilterValue {
  /** Opérateur de filtrage */
  operator: FilterOperator
  /** Valeur principale du filtre */
  value?: unknown
  /** Valeur secondaire pour les opérateurs comme 'between' */
  value2?: unknown
  /** Liste de valeurs pour les opérateurs 'in' et 'not_in' */
  values?: unknown[]
}

/**
 * Type pour un filtre de colonne avec structure uniforme
 */
export interface ColumnFilter {
  /** Chemin de la colonne filtrée */
  path: string
  /** Valeur du filtre avec opérateur et valeur(s) */
  filter: FilterValue
}

/**
 * Props pour un contrôle de filtre personnalisé
 */
export interface FilterControlProps {
  /** Valeur actuelle du filtre */
  value: FilterValue | undefined
  /** Callback appelé quand la valeur change */
  onChange: (value: FilterValue | undefined) => void
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
  /** Nombre total d'éléments (toutes pages confondues) */
  totalCount: number
  /** Index de la dernière ligne de cette page (pour infinite scroll) */
  lastRow?: number
  /** Groupes pré-calculés côté serveur (optionnel) */
  groups?: DataGroup<T>[]
}

/**
 * Mode de pagination pour le DataTable
 */
export type PaginationMode =
  | 'None'                    // Pas de pagination automatique, l'appelant gère le paging
  | 'InfiniteScroll'          // Scroll infini avec chargement automatique
  | 'Pagination'              // Pagination classique sans contrôle de taille
  | 'PaginationWithSize'      // Pagination avec sélecteur de taille de page

/**
 * Props pour le composant DataTable
 */
export interface DataTableProps<T> {
  /** Schéma Zod pour la validation des données */
  schema: z.ZodSchema<T>
  /** Configuration des colonnes */
  columns: DataTableColumn<T>[]
  /** Fonction pour récupérer les données avec tri, pagination et filtres */
  getData: (
    sortColumns: SortColumn[],
    startRow: number,
    pageSize: number,
    grouping?: DataTableGrouping,
    filters?: ColumnFilter[]
  ) => Promise<DataTableResponse<T>> | DataTableResponse<T>
  /** Mode de pagination */
  paginationMode?: PaginationMode
  /** Taille de page par défaut */
  defaultPageSize?: number
  /** Taille de page (override defaultPageSize) */
  pageSize?: number
  /** Options de taille de page disponibles */
  pageSizeOptions?: number[]
  /** Afficher les informations de pagination (ex: "Affichage de 1 à 10 sur 50 éléments") */
  showPaginationInfo?: boolean
  /** Afficher la pagination même s'il n'y a qu'une seule page */
  showSinglePagePagination?: boolean
  /** Message à afficher quand il n'y a pas de données */
  emptyMessage?: string
  /** Callback appelé quand une ligne est sélectionnée */
  onRowSelect?: (row: T) => void
  /** Ligne actuellement sélectionnée (pour surlignage) */
  selectedRow?: T
  /** Clé pour identifier une ligne sélectionnée (ex: 'id') */
  rowKey?: string
  /** Fonction de comparaison pour identifier une ligne sélectionnée */
  rowComparison?: (row1: T, row2: T) => boolean
  /** Configuration du groupement */
  grouping?: DataTableGrouping
  /** Configuration d'icônes personnalisées pour le tri */
  sortIcons?: SortIcons
  /** Configuration d'icônes personnalisées pour les filtres */
  filterIcons?: FilterIcons
  /** Afficher un bouton "Charger plus" pour le mode InfiniteScroll (défaut: false) */
  showLoadMoreButton?: boolean
  /** Message à afficher pendant le chargement des données */
  loadingMessage?: string
}
