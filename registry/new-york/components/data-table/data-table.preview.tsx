import { DataTable, SortColumn, PaginationMode, ColumnFilter, DataTableGrouping, DataTableResponse } from './data-table'
import { defineColumn } from './data-table-types'
import { z } from 'zod'
import { useState } from 'react'
import { Filter, FilterX } from 'lucide-react'

// Schéma Zod pour un utilisateur
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
  role: z.string(),
  joinedAt: z.string(),
})

type User = z.infer<typeof UserSchema>

// Générer plus de données pour tester la pagination
const generateUsers = (count: number): User[] => {
  const roles = ['Admin', 'User', 'Moderator', 'Editor']
  const statuses: ('active' | 'inactive')[] = ['active', 'inactive']
  const names = [
    'Alice Martin', 'Bob Dupont', 'Claire Bernard', 'David Moreau', 'Emma Durand',
    'François Leroy', 'Gabrielle Simon', 'Henri Blanc', 'Isabelle Roux', 'Julien Fabre',
    'Karine Dubois', 'Laurent Garcia', 'Marie Petit', 'Nicolas Thomas', 'Olivia Robert',
    'Pierre Martinez', 'Quentin Lopez', 'Rachel Moreno', 'Stéphane Gonzalez', 'Théa Rousseau'
  ]

  return Array.from({ length: count }, (_, i) => {
    const name = names[i % names.length]
    return {
      id: i + 1,
      name: `${name} ${i > 19 ? Math.floor(i / 20) + 1 : ''}`.trim(),
      email: `user${i + 1}@example.com`,
      status: statuses[i % 2],
      role: roles[i % roles.length],
      joinedAt: new Date(2024, (i % 12), (i % 28) + 1).toISOString().split('T')[0],
    }
  })
}

// Données d'exemple (100 utilisateurs pour tester la pagination)
const sampleUsers: User[] = generateUsers(100)

// Configuration des colonnes
const userColumn = defineColumn<User, typeof UserSchema>(UserSchema)
const columns = [
  userColumn('id', {
    label: 'ID',
    isSortable: true,
    width: '80px',
    align: 'center',
  }),
  userColumn('name', {
    label: 'Nom',
    description: 'Nom complet de l\'utilisateur',
    isSortable: true,
    isFilterable: true,
  }),
  userColumn('email', {
    label: 'Email',
    isSortable: true,
    isFilterable: true,
  }),
  userColumn('status', {
    label: 'Statut',
    isSortable: true,
    align: 'center',
    isFilterable: true,
    render: (value) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          value === 'active'
            ? 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300'
            : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
        }`}
      >
        {value === 'active' ? 'Actif' : 'Inactif'}
      </span>
    ),
  }),
  userColumn('role', {
    label: 'Rôle',
    isSortable: true,
    align: 'center',
    isFilterable: true,
  }),
]

export default function DataTableDemo() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>()
  const [currentMode, setCurrentMode] = useState<PaginationMode>('PaginationWithSize')

  // Fonction pour récupérer les données (simule un appel API avec tri et filtrage côté serveur)
  const getData = async (
    sortColumns: SortColumn<User>[],
    startRow: number,
    pageSize: number,
    grouping?: DataTableGrouping<User>,
    filters?: ColumnFilter<User>[]
  ): Promise<DataTableResponse<User>> => {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 300))

    // Dans un vrai projet, le tri et filtrage seraient gérés côté serveur
    console.log('Tri demandé:', sortColumns, 'Filtres:', filters, 'Grouping:', grouping, 'startRow:', startRow, 'pageSize:', pageSize)

    // Appliquer les filtres
    let filteredData = [...sampleUsers]

    if (filters && filters.length > 0) {
      filteredData = filteredData.filter(item => {
        return filters.every(filter => {
          const value = item[filter.path as keyof User]
          const filterValue = filter.filter

          if (!filterValue) {
            return true
          }

          // Gestion des différents opérateurs
          switch ((filterValue as Record<string, unknown>).operator) {
            case 'equals':
              return value === (filterValue as Record<string, unknown>).value

            case 'not_equals':
              return value !== (filterValue as Record<string, unknown>).value

            case 'contains':
              if (typeof value === 'string' && typeof (filterValue as Record<string, unknown>).value === 'string') {
                return value.toLowerCase().includes(((filterValue as Record<string, unknown>).value as string).toLowerCase())
              }
              return false

            case 'starts_with':
              if (typeof value === 'string' && typeof (filterValue as Record<string, unknown>).value === 'string') {
                return value.toLowerCase().startsWith(((filterValue as Record<string, unknown>).value as string).toLowerCase())
              }
              return false

            case 'ends_with':
              if (typeof value === 'string' && typeof (filterValue as Record<string, unknown>).value === 'string') {
                return value.toLowerCase().endsWith(((filterValue as Record<string, unknown>).value as string).toLowerCase())
              }
              return false

            case 'in':
              return Array.isArray((filterValue as Record<string, unknown>).values) &&
                     ((filterValue as Record<string, unknown>).values as unknown[]).includes(value)

            case 'not_in':
              return !(Array.isArray((filterValue as Record<string, unknown>).values) &&
                      ((filterValue as Record<string, unknown>).values as unknown[]).includes(value))

            default:
              return true
          }
        })
      })
    }

    // Appliquer le tri
    if (sortColumns.length > 0) {
      filteredData.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = a[sort.path as keyof User]
          const bValue = b[sort.path as keyof User]

          let comparison = 0

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue)
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue
          } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
            comparison = aValue === bValue ? 0 : aValue ? 1 : -1
          } else if (aValue == null && bValue != null) {
            comparison = -1
          } else if (aValue != null && bValue == null) {
            comparison = 1
          } else if (aValue != null && bValue != null) {
            const aStr = String(aValue)
            const bStr = String(bValue)
            comparison = aStr.localeCompare(bStr)
          }

          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    // Simulation de la pagination
    const endRow = Math.min(startRow + pageSize, filteredData.length)
    const pageData = filteredData.slice(startRow, endRow)

    return {
      data: pageData,
      totalCount: filteredData.length,
      lastRow: endRow - 1
    }
  }

  const modes: { value: PaginationMode; label: string; description: string }[] = [
    { value: 'None', label: 'Aucune pagination', description: 'Toutes les données affichées' },
    { value: 'InfiniteScroll', label: 'Scroll infini', description: 'Chargement automatique au scroll' },
    { value: 'Pagination', label: 'Pagination simple', description: 'Navigation par pages' },
    { value: 'PaginationWithSize', label: 'Pagination complète', description: 'Navigation + taille de page' },
  ]

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-6xl space-y-6">
        <div>
          <h3 className="text-lg font-semibold">DataTable avec Pagination</h3>
          <p className="text-sm text-muted-foreground">
            Testez les différents modes de pagination avec {sampleUsers.length} utilisateurs
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            💡 Ctrl/Shift + Clic pour tri multi-colonnes
          </p>
        </div>

        {/* Sélecteur de mode */}
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setCurrentMode(mode.value)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                currentMode === mode.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-accent border-input'
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{mode.label}</div>
                <div className="text-xs opacity-70">{mode.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* DataTable avec le mode sélectionné */}
        <div className="border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium">Mode actuel: {modes.find(m => m.value === currentMode)?.label}</h4>
            <p className="text-sm text-muted-foreground">
              {modes.find(m => m.value === currentMode)?.description}
            </p>
          </div>

          <DataTable
            key={currentMode} // Force re-render when mode changes
            schema={UserSchema}
            columns={columns}
            getData={getData}
            paginationMode={currentMode}
            pageSize={10}
            pageSizeOptions={[5, 10, 20, 50]}
            onRowSelect={setSelectedUser}
            selectedRow={selectedUser}
            messages={{
              emptyMessage: "Aucun utilisateur trouvé",
              loadingMessage: "Chargement des utilisateurs...",

              // Messages de pagination
              displayInfo: "Affichage de {start} à {end} sur {total} éléments",
              elementsPerPage: "Éléments par page",
              totalElements: "{total} éléments au total",
              loadMoreButton: "Charger plus",
              loadingIndicator: "Chargement...",

              // Messages de filtrage
              filterPopupApply: "Appliquer",
              filterPopupCancel: "Annuler",
              filterPopupClear: "Effacer",
              filterOperatorLabel: "Opérateur",
              filterValueLabel: "Valeur",
              filterValue2Label: "Valeur 2",
              filterValuesLabel: "Valeurs",
              filterValuePlaceholder: "Entrez une valeur...",
              filterNumberPlaceholder: "Entrez un nombre...",
              filterSelectPlaceholder: "Sélectionnez...",

              // Messages de tri
              sortAscending: "Tri croissant",
              sortDescending: "Tri décroissant",
              noSort: "Aucun tri",

              // États des filtres
              filterActive: "Filtre actif",
              filterInactive: "Filtre inactif",

              // Opérateurs de filtrage
              filterOperatorEquals: "Égal à",
              filterOperatorNotEquals: "Différent de",
              filterOperatorContains: "Contient",
              filterOperatorStartsWith: "Commence par",
              filterOperatorEndsWith: "Finit par",
              filterOperatorGreaterThan: "Plus grand que",
              filterOperatorGreaterOrEqual: "Plus grand ou égal",
              filterOperatorLessThan: "Plus petit que",
              filterOperatorLessOrEqual: "Plus petit ou égal",
              filterOperatorBetween: "Entre",
              filterOperatorIn: "Dans la liste",
              filterOperatorNotIn: "Pas dans la liste",
              filterOperatorIsNull: "Est vide",
              filterOperatorIsNotNull: "N'est pas vide",

              // Messages des filtres booléens
              filterBooleanTrue: "Vrai",
              filterBooleanFalse: "Faux",

              // Messages d'accessibilité
              sortColumnAriaLabel: "{column} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes",
              paginationAriaLabel: "Navigation de pagination",

              // Messages d'erreur
              validationError: "Erreur de validation des données",
              loadingError: "Erreur lors du chargement des données",
              unknownError: "Une erreur inconnue s'est produite"
            }}
            showLoadMoreButton={true}
            filterIcons={{
              default: Filter,
              active: FilterX,
              classNames: {
                default: "h-4 w-4 text-muted-foreground hover:text-primary transition-colors",
                active: "h-4 w-4 text-primary"
              }
            }}
          />
        </div>

        {selectedUser && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium">Utilisateur sélectionné :</h4>
            <p className="text-sm text-muted-foreground">
              {selectedUser.name} ({selectedUser.email}) - {selectedUser.role}
            </p>
          </div>
        )}

        {/* Instructions d'utilisation */}
        <div className="mt-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Instructions :</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>Aucune pagination</strong> : Toutes les données sont chargées en une fois</li>
            <li>• <strong>Scroll infini</strong> : Scroll vers le bas pour charger plus de données automatiquement</li>
            <li>• <strong>Pagination simple</strong> : Navigation par pages sans contrôle de taille</li>
            <li>• <strong>Pagination complète</strong> : Navigation par pages avec sélecteur de taille</li>
            <li>• Cliquez sur les en-têtes pour trier (Ctrl/Shift+clic pour tri multi-colonnes)</li>
            <li>• Cliquez sur les icônes 🔍 pour filtrer les colonnes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Preview pour DataTable
 * Fichier interne - Non inclus dans la registry
 */
export function DataTablePreview() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>()

  // Configuration des colonnes
  const previewUserColumn = defineColumn<User, typeof UserSchema>(UserSchema)
  const columns = [
    previewUserColumn('id', {
      label: 'ID',
      isSortable: true,
      width: '80px',
      align: 'center',
    }),
    previewUserColumn('name', {
      label: 'Nom',
      description: 'Nom complet de l\'utilisateur',
      isSortable: true,
    }),
    previewUserColumn('email', {
      label: 'Email',
      isSortable: true,
    }),
    previewUserColumn('status', {
      label: 'Statut',
      isSortable: true,
      align: 'center',
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            value === 'active'
              ? 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
          }`}
        >
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      ),
    }),
    previewUserColumn('role', {
      label: 'Rôle',
      isSortable: true,
      align: 'center',
    }),
  ]  // Fonction pour récupérer les données (simule un appel API avec tri côté serveur)
  const getData = async (sortColumns: SortColumn<User>[], startRow: number, pageSize: number) => {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 300))

    // Dans un vrai projet, le tri serait géré côté serveur
    // En production, vous enverriez sortColumns à votre API
    console.log('Tri demandé:', sortColumns, 'startRow:', startRow, 'pageSize:', pageSize)

    // Pour la démo, on applique le tri côté client pour voir l'effet
    const sortedData = [...sampleUsers]

    if (sortColumns.length > 0) {
      sortedData.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = a[sort.path as keyof User]
          const bValue = b[sort.path as keyof User]

          let comparison = 0

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue)
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue
          } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
            comparison = aValue === bValue ? 0 : aValue ? 1 : -1
          } else if (aValue == null && bValue != null) {
            comparison = -1
          } else if (aValue != null && bValue == null) {
            comparison = 1
          } else if (aValue != null && bValue != null) {
            const aStr = String(aValue)
            const bStr = String(bValue)
            comparison = aStr.localeCompare(bStr)
          }

          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    // Simulation de la pagination
    const endRow = Math.min(startRow + pageSize, sortedData.length)
    const pageData = sortedData.slice(startRow, endRow)

    return {
      data: pageData,
      totalCount: sortedData.length,
      lastRow: endRow - 1
    }
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Utilisateurs</h3>
          <p className="text-sm text-muted-foreground">
            Cliquez sur les en-têtes pour trier, cliquez sur une ligne pour la sélectionner
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            💡 Ctrl/Shift + Clic pour tri multi-colonnes
          </p>
        </div>

        <DataTable
          schema={UserSchema}
          columns={columns}
          getData={getData}
          onRowSelect={setSelectedUser}
          selectedRow={selectedUser}
          messages={{
            emptyMessage: "Aucun utilisateur trouvé",
            loadingMessage: "Chargement des utilisateurs...",

            // Messages de pagination
            displayInfo: "Affichage de {start} à {end} sur {total} éléments",
            elementsPerPage: "Éléments par page",
            totalElements: "{total} éléments au total",
            loadMoreButton: "Charger plus",
            loadingIndicator: "Chargement...",

            // Messages de filtrage
            filterPopupApply: "Appliquer",
            filterPopupCancel: "Annuler",
            filterPopupClear: "Effacer",
            filterOperatorLabel: "Opérateur",
            filterValueLabel: "Valeur",
            filterValue2Label: "Valeur 2",
            filterValuesLabel: "Valeurs",
            filterValuePlaceholder: "Entrez une valeur...",
            filterNumberPlaceholder: "Entrez un nombre...",
            filterSelectPlaceholder: "Sélectionnez...",

            // Messages de tri
            sortAscending: "Tri croissant",
            sortDescending: "Tri décroissant",
            noSort: "Aucun tri",

            // États des filtres
            filterActive: "Filtre actif",
            filterInactive: "Filtre inactif",

            // Opérateurs principaux
            filterOperatorEquals: "Égal à",
            filterOperatorNotEquals: "Différent de",
            filterOperatorContains: "Contient",
            filterOperatorStartsWith: "Commence par",
            filterOperatorEndsWith: "Finit par",
            filterOperatorGreaterThan: "Plus grand que",
            filterOperatorGreaterOrEqual: "Plus grand ou égal",
            filterOperatorLessThan: "Plus petit que",
            filterOperatorLessOrEqual: "Plus petit ou égal",
            filterOperatorBetween: "Entre",
            filterOperatorIn: "Dans la liste",
            filterOperatorNotIn: "Pas dans la liste",
            filterOperatorIsNull: "Est vide",
            filterOperatorIsNotNull: "N'est pas vide",

            // Messages des filtres booléens
            filterBooleanTrue: "Vrai",
            filterBooleanFalse: "Faux",

            // Messages d'accessibilité
            sortColumnAriaLabel: "{column} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes",
            paginationAriaLabel: "Navigation de pagination",

            // Messages d'erreur
            validationError: "Erreur de validation des données",
            loadingError: "Erreur lors du chargement des données",
            unknownError: "Une erreur inconnue s'est produite"
          }}
        />

        {selectedUser && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium">Utilisateur sélectionné :</h4>
            <p className="text-sm text-muted-foreground">
              {selectedUser.name} ({selectedUser.email})
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
