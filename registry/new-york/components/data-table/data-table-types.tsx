import { z } from 'zod'

/**
 * Breakpoints prédéfinis pour la gestion responsive
 */
export type MediaBreakpoint = 'Mobile' | 'Tablet' | 'Desktop'

/**
 * Media query personnalisée
 */
export interface CustomMediaQuery {
  min?: string
  max?: string
}

/**
 * Type pour définir les media queries (breakpoint prédéfini ou personnalisé)
 */
export type MediaQuery = MediaBreakpoint | CustomMediaQuery

/**
 * Mode de largeur pour les colonnes
 */
export type ColumnWidthMode =
  | 'content'     // Largeur ajustée au contenu
  | 'range'       // Largeur entre min et max
  | 'fill'        // Prend la place restante

/**
 * Configuration responsive pour une colonne
 */
export interface ColumnResponsive {
  /** Breakpoints où la colonne est visible. Si vide ou undefined = visible partout */
  medias?: MediaQuery[]
  /** Mode de largeur */
  widthMode?: ColumnWidthMode
  /** Largeur minimale */
  minWidth?: string
  /** Largeur maximale */
  maxWidth?: string
  /** Largeur fixe */
  width?: string
}

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

// Mapping des types vers les opérateurs valides
type OperatorsForType<T> =
  T extends string ? 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with' | 'in' | 'not_in' | 'is_null' | 'is_not_null' :
  T extends number ? 'equals' | 'not_equals' | 'greater_than' | 'greater_or_equal' | 'less_than' | 'less_or_equal' | 'between' | 'in' | 'not_in' | 'is_null' | 'is_not_null' :
  T extends boolean ? 'equals' | 'not_equals' | 'is_null' | 'is_not_null' :
  T extends Date ? 'equals' | 'not_equals' | 'greater_than' | 'greater_or_equal' | 'less_than' | 'less_or_equal' | 'between' | 'is_null' | 'is_not_null' :
  FilterOperator;

/**
 * Valeur de filtre type-safe
 */
export type FilterValue<T = unknown> = T extends unknown
  ? {
      [O in OperatorsForType<T>]: O extends 'is_null' | 'is_not_null'
        ? { operator: O }
        : O extends 'between'
        ? { operator: O; value: T; value2: T }
        : O extends 'in' | 'not_in'
        ? { operator: O; values: T[] }
        : { operator: O; value: T }
    }[OperatorsForType<T>]
  : {
      operator: FilterOperator;
      value?: T;
      value2?: T;
      values?: T[];
    };

/**
 * Type pour un filtre de colonne avec structure uniforme
 */
export interface ColumnFilter<T = unknown, P extends Path<T> = Path<T>> {
  /** Chemin de la colonne filtrée */
  path: P
  /** Valeur du filtre avec opérateur et valeur(s) */
  filter: FilterValue<PathValue<T, P>>
}

/**
 * Props pour un contrôle de filtre personnalisé
 */
export interface FilterControlProps<T = unknown> {
  /** Valeur actuelle du filtre */
  value: FilterValue<T> | undefined
  /** Callback appelé quand la valeur change */
  onChange: (value: FilterValue<T> | undefined) => void
  /** Callback pour fermer la popover */
  onClose: () => void
}

// Type helper pour générer tous les chemins possibles d'un objet
type PathImpl<T, K extends keyof T> =
  K extends string
    ? T[K] extends Record<string, unknown>
      ? T[K] extends ArrayLike<unknown>
        ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof unknown[]>>}`
        : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
      : K
    : never;

export type Path<T> = PathImpl<T, keyof T> | keyof T;

export type PathValue<T, P extends Path<T>> =
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? Rest extends Path<T[K]>
        ? PathValue<T[K], Rest>
        : never
      : never
    : P extends keyof T
      ? T[P]
      : never;

// Types de données supportés
export type DataType =
  | 'string'
  | 'email'
  | 'url'
  | 'date'       // Date complète (YYYY-MM-DD)
  | 'time'       // Heure seule (HH:MM)
  | 'datetime'   // Date et heure
  | 'currency'
  | 'int'
  | 'decimal'
  | 'boolean'
  | 'none';

// Custom Zod types pour différencier date/time/datetime
export const dateOnly = () => z.date().describe('date');
export const timeOnly = () => z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).describe('time');
export const dateTime = () => z.date().describe('datetime');

// Type helper pour extraire la description d'un type Zod
type GetZodDescription<Z> = Z extends { _def: { description?: string } } ? Z['_def']['description'] : never;

// Mapper Zod types vers DataTypes
type ZodToDataType<Z> =
  Z extends z.ZodString ?
    Z extends z.ZodEmail ? 'email' :
    Z extends { _def: { checks: ReadonlyArray<{ kind: string }> } } ?
      Z['_def']['checks'][number]['kind'] extends 'url' ? 'url' :
      GetZodDescription<Z> extends 'time' ? 'time' : 'string' :
    'string' :
  Z extends z.ZodNumber ?
    Z extends { _def: { checks: ReadonlyArray<{ kind: string }> } } ?
      Z['_def']['checks'][number]['kind'] extends 'int' ? 'int' : 'decimal' :
    'decimal' :
  Z extends z.ZodDate ?
    GetZodDescription<Z> extends 'date' ? 'date' :
    GetZodDescription<Z> extends 'datetime' ? 'datetime' :
    'date' :
  Z extends z.ZodBoolean ? 'boolean' :
  Z extends z.ZodObject<any> ? 'none' : // eslint-disable-line @typescript-eslint/no-explicit-any
  Z extends z.ZodOptional<infer T> ? ZodToDataType<T> :
  Z extends z.ZodNullable<infer T> ? ZodToDataType<T> :
  Z extends z.ZodDefault<infer T> ? ZodToDataType<T> :
  'string';

// Inférer le type depuis un schema Zod pour un path donné
type InferDataTypeFromSchema<S extends z.ZodType<unknown>, P extends Path<z.infer<S>>> =
  S extends z.ZodObject<infer Shape> ?
    P extends keyof Shape
      ? ZodToDataType<Shape[P]>
      : P extends `${infer K}.${infer Rest}`
        ? K extends keyof Shape
          ? Shape[K] extends z.ZodObject<any> // eslint-disable-line @typescript-eslint/no-explicit-any
            ? Rest extends Path<z.infer<Shape[K]>>
              ? InferDataTypeFromSchema<Shape[K], Rest>
              : 'string'
            : 'string'
          : 'string'
        : 'string'
    : 'string';

/**
 * Type pour une colonne du tableau
 */
export interface DataTableColumn<T, P extends Path<T> | undefined = undefined, S extends z.ZodType<T> | undefined = undefined> {
  /** Libellé affiché dans l'en-tête */
  label: string
  /** Description de la colonne (tooltip) */
  description?: string
  /** Chemin vers la propriété dans les données (ex: 'user.name') - Optionnel pour colonnes d'actions */
  path?: P
  /** Si la colonne peut être triée - Automatiquement false si path n'est pas défini */
  isSortable?: boolean
  /** Si la colonne peut être filtrée - Automatiquement false si path n'est pas défini */
  isFilterable?: boolean
  /** Contrôle de filtre personnalisé pour cette colonne */
  filterControl?: P extends Path<T>
    ? React.ComponentType<FilterControlProps<PathValue<T, P>>>
    : React.ComponentType<FilterControlProps<unknown>>
  /** Fonction de rendu personnalisée pour la cellule */
  render?: P extends Path<T>
    ? (value: PathValue<T, P>, row: T) => React.ReactNode
    : (value: unknown, row: T) => React.ReactNode
  /** Largeur de la colonne */
  width?: string
  /** Alignement du contenu */
  align?: 'left' | 'center' | 'right'
  /** Type de colonne pour clarifier l'usage */
  type?: S extends z.ZodType<T>
    ? P extends Path<T>
      ? InferDataTypeFromSchema<S, P>
      : 'none'
    : DataType
  /** Configuration responsive */
  responsive?: ColumnResponsive
}

/**
 * Type pour le tri
 */
export interface SortColumn<T = unknown, P extends Path<T> = Path<T>> {
  /** Chemin de la colonne à trier */
  path: P
  /** Direction du tri */
  direction: 'asc' | 'desc'
}

/**
 * Type pour le groupement
 */
export interface DataTableGrouping<T = unknown, P extends Path<T> = Path<T>> {
  /** Chemin de la colonne à grouper (ex: 'status', 'category') */
  path: P
  /** Fonction de rendu personnalisée pour l'en-tête de groupe */
  renderGroupHeader?: (groupValue: P extends Path<T> ? PathValue<T, P> : unknown, count: number, isExpanded: boolean) => React.ReactNode
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
 * Interface pour les messages du DataTable
 */
export interface DataTableMessages {
  /** Messages généraux */
  emptyMessage?: string
  loadingMessage?: string

  /** Messages d'erreur */
  validationError?: string
  loadingError?: string
  unknownError?: string

  /** Messages de pagination */
  loadingIndicator?: string
  loadMoreButton?: string
  displayInfo?: string // Template: "Affichage de {start} à {end} sur {total} éléments"
  elementsPerPage?: string
  totalElements?: string // Template: "{total} éléments au total"

  /** Messages d'accessibilité */
  sortColumnAriaLabel?: string // Template: "{column} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes"
  paginationAriaLabel?: string

  /** Messages de tri et filtrage */
  sortAscending?: string
  sortDescending?: string
  noSort?: string
  filterActive?: string
  filterInactive?: string

  /** Messages des popups de filtrage */
  filterPopupApply?: string
  filterPopupCancel?: string
  filterPopupClear?: string
  filterOperatorLabel?: string
  filterValueLabel?: string
  filterValue2Label?: string
  filterValuesLabel?: string
  filterValuePlaceholder?: string
  filterNumberPlaceholder?: string
  filterSelectPlaceholder?: string

  /** Opérateurs de filtrage */
  filterOperatorEquals?: string
  filterOperatorNotEquals?: string
  filterOperatorContains?: string
  filterOperatorStartsWith?: string
  filterOperatorEndsWith?: string
  filterOperatorGreaterThan?: string
  filterOperatorGreaterOrEqual?: string
  filterOperatorLessThan?: string
  filterOperatorLessOrEqual?: string
  filterOperatorBetween?: string
  filterOperatorIn?: string
  filterOperatorNotIn?: string
  filterOperatorIsNull?: string
  filterOperatorIsNotNull?: string

  /** Messages des filtres booléens */
  filterBooleanTrue?: string
  filterBooleanFalse?: string
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
  columns: DataTableColumn<T, Path<T> | undefined, z.ZodType<T>>[]
  /** Fonction pour récupérer les données avec tri, pagination et filtres */
  getData: (
    sortColumns: SortColumn<T>[],
    startRow: number,
    pageSize: number,
    grouping?: DataTableGrouping<T>,
    filters?: ColumnFilter<T>[]
  ) => Promise<DataTableResponse<T>> | DataTableResponse<T>
  /** Configuration des messages personnalisés */
  messages?: DataTableMessages
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
  /** Callback appelé quand une ligne est sélectionnée */
  onRowSelect?: (row: T) => void
  /** Ligne actuellement sélectionnée (pour surlignage) */
  selectedRow?: T
  /** Clé pour identifier une ligne sélectionnée (ex: 'id') */
  rowKey?: string
  /** Fonction de comparaison pour identifier une ligne sélectionnée */
  rowComparison?: (row1: T, row2: T) => boolean
  /** Configuration du groupement */
  grouping?: DataTableGrouping<T>
  /** Configuration d'icônes personnalisées pour le tri */
  sortIcons?: SortIcons
  /** Configuration d'icônes personnalisées pour les filtres */
  filterIcons?: FilterIcons
  /** Afficher un bouton "Charger plus" pour le mode InfiniteScroll (défaut: false) */
  showLoadMoreButton?: boolean
}

// Helper pour créer une colonne avec inférence de type
export function defineColumn<T, S extends z.ZodType<T> | undefined = undefined>(schema?: S) {
  return <P extends Path<T>>(
    path: P,
    definition: Omit<DataTableColumn<T, P, S>, 'path'> & {
      type?: S extends z.ZodType<T> ? InferDataTypeFromSchema<S, P> : DataType;
    }
  ): DataTableColumn<T, P, S> => ({
    path,
    ...definition,
    // Si le type n'est pas spécifié et qu'on a un schema, on l'infère
    ...(schema && !definition.type && {
      type: 'string' as DataType // Le type sera inféré par TypeScript
    })
  } as DataTableColumn<T, P, S>);
}

// Helper pour récupérer la valeur depuis un objet et une colonne
export function getValue<T, P extends Path<T>, S extends z.ZodType<T> | undefined = undefined>(
  obj: T,
  column: DataTableColumn<T, P, S>
): P extends Path<T> ? PathValue<T, P> : unknown {
  if (!column.path) {
    return undefined as P extends Path<T> ? PathValue<T, P> : unknown;
  }

  const keys = String(column.path).split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result == null) return undefined as P extends Path<T> ? PathValue<T, P> : unknown;
    result = (result as Record<string, unknown>)[key];
  }

  return result as P extends Path<T> ? PathValue<T, P> : unknown;
}

// Helper pour récupérer la valeur avec le path directement
export function getValueByPath<T, P extends Path<T>>(
  obj: T,
  path: P
): PathValue<T, P> {
  const keys = String(path).split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result == null) return undefined as PathValue<T, P>;
    result = (result as Record<string, unknown>)[key];
  }

  return result as PathValue<T, P>;
}

// Helper pour créer un filtre type-safe
export function defineFilter<T>() {
  return <P extends Path<T>>(
    path: P,
    filter: FilterValue<PathValue<T, P>>
  ): ColumnFilter<T, P> => ({
    path,
    filter
  });
}

// Helper pour créer plusieurs filtres avec contraintes de type
export function defineFilters<T>() {
  const filterCreator = defineFilter<T>();

  return {
    create: filterCreator,

    // Méthodes disponibles pour tous les types
    equals: <P extends Path<T>>(path: P, value: PathValue<T, P>) =>
      filterCreator(path, { operator: 'equals', value } as FilterValue<PathValue<T, P>>),
    notEquals: <P extends Path<T>>(path: P, value: PathValue<T, P>) =>
      filterCreator(path, { operator: 'not_equals', value } as FilterValue<PathValue<T, P>>),
    isNull: <P extends Path<T>>(path: P) =>
      filterCreator(path, { operator: 'is_null' } as FilterValue<PathValue<T, P>>),
    isNotNull: <P extends Path<T>>(path: P) =>
      filterCreator(path, { operator: 'is_not_null' } as FilterValue<PathValue<T, P>>),

    // Méthodes pour string uniquement
    string: {
      contains: <P extends Path<T>>(path: P, value: string) =>
        filterCreator(path, { operator: 'contains', value } as FilterValue<PathValue<T, P>>),
      startsWith: <P extends Path<T>>(path: P, value: string) =>
        filterCreator(path, { operator: 'starts_with', value } as FilterValue<PathValue<T, P>>),
      endsWith: <P extends Path<T>>(path: P, value: string) =>
        filterCreator(path, { operator: 'ends_with', value } as FilterValue<PathValue<T, P>>),
    },

    // Méthodes pour number et Date
    numeric: {
      greaterThan: <P extends Path<T>>(path: P, value: PathValue<T, P>) =>
        filterCreator(path, { operator: 'greater_than', value } as FilterValue<PathValue<T, P>>),
      greaterOrEqual: <P extends Path<T>>(path: P, value: PathValue<T, P>) =>
        filterCreator(path, { operator: 'greater_or_equal', value } as FilterValue<PathValue<T, P>>),
      lessThan: <P extends Path<T>>(path: P, value: PathValue<T, P>) =>
        filterCreator(path, { operator: 'less_than', value } as FilterValue<PathValue<T, P>>),
      lessOrEqual: <P extends Path<T>>(path: P, value: PathValue<T, P>) =>
        filterCreator(path, { operator: 'less_or_equal', value } as FilterValue<PathValue<T, P>>),
      between: <P extends Path<T>>(path: P, value1: PathValue<T, P>, value2: PathValue<T, P>) =>
        filterCreator(path, { operator: 'between', value: value1, value2 } as FilterValue<PathValue<T, P>>),
    },

    // Méthodes pour les listes
    list: {
      in: <P extends Path<T>>(path: P, values: PathValue<T, P>[]) =>
        filterCreator(path, { operator: 'in', values } as FilterValue<PathValue<T, P>>),
      notIn: <P extends Path<T>>(path: P, values: PathValue<T, P>[]) =>
        filterCreator(path, { operator: 'not_in', values } as FilterValue<PathValue<T, P>>),
    }
  };
}

// Helper pour créer un grouping type-safe
export function defineGrouping<T>() {
  return <P extends Path<T>>(
    path: P,
    options?: Omit<DataTableGrouping<T, P>, 'path'>
  ): DataTableGrouping<T, P> => ({
    path,
    ...options
  });
}

// Helper pour créer un tri type-safe
export function defineSort<T>() {
  return <P extends Path<T>>(
    path: P,
    direction: 'asc' | 'desc' = 'asc'
  ): SortColumn<T, P> => ({
    path,
    direction
  });
}

// Helper pour créer plusieurs tris
export function defineSorts<T>() {
  const sortCreator = defineSort<T>();
  return {
    create: sortCreator,
    asc: <P extends Path<T>>(path: P) => sortCreator(path, 'asc'),
    desc: <P extends Path<T>>(path: P) => sortCreator(path, 'desc'),
    multiple: <P extends Path<T>>(...sorts: Array<[P, 'asc' | 'desc']>) =>
      sorts.map(([path, direction]) => sortCreator(path, direction))
  };
}
