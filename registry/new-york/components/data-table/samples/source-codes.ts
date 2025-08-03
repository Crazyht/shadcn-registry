// Fonction utilitaire pour récupérer le code source des exemples
// En production, ces codes sources seraient récupérés via une API ou bundlés

export const sampleSourceCodes = {
  'basic-example': `import { DataTable, DataTableColumn } from '../data-table'
import { z } from 'zod'
import { useState } from 'react'

// Schéma d'exemple
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
  role: z.string(),
  joinedAt: z.string(),
})

type User = z.infer<typeof UserSchema>

export function BasicExample() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>()

  // Données d'exemple
  const sampleUsers: User[] = [
    { id: 1, name: 'Alice Martin', email: 'alice.martin@example.com', status: 'active', role: 'Admin', joinedAt: '2024-01-15' },
    { id: 2, name: 'Bob Dupont', email: 'bob.dupont@example.com', status: 'active', role: 'User', joinedAt: '2024-02-20' },
    // ... plus de données
  ]

  // Configuration des colonnes
  const columns: DataTableColumn<User>[] = [
    {
      label: 'ID',
      path: 'id',
      isSortable: true,
      width: '80px',
      align: 'center',
    },
    {
      label: 'Nom',
      path: 'name',
      isSortable: true,
    },
    {
      label: 'Statut',
      path: 'status',
      isSortable: true,
      render: (value) => (
        <span className={\`badge \${value === 'active' ? 'success' : 'error'}\`}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    // ... autres colonnes
  ]

  // Fonction getData
  const getData = async (sortColumns, startRow, pageSize) => {
    // Logique de récupération et tri des données
    let data = [...sampleUsers]

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        // Logique de tri
      })
    }

    const paginatedData = data.slice(startRow, startRow + pageSize)
    return {
      data: paginatedData,
      totalCount: data.length,
      lastRow: startRow + paginatedData.length - 1
    }
  }

  return (
    <DataTable
      schema={UserSchema}
      columns={columns}
      getData={getData}
      onRowSelect={setSelectedUser}
      selectedRow={selectedUser}
      paginationMode="PaginationWithSize"
      pageSize={10}
      pageSizeOptions={[5, 10, 15, 25]}
      messages={{
        emptyMessage: "Aucun utilisateur trouvé",
        loadingMessage: "Chargement des utilisateurs...",
        sortColumnAriaLabel: "{column} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes"
      }}
    />
  )
}`,

  'filtering-example': `import { DataTable, DataTableColumn, TextFilterControl, NumberFilterControl, SelectFilterControl } from '../data-table'
import { z } from 'zod'
import { useState } from 'react'
import { Filter, FilterX } from 'lucide-react'

const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  stock: z.number(),
  isAvailable: z.boolean(),
})

export function FilteringExample() {
  const [selectedProduct, setSelectedProduct] = useState()

  const columns = [
    {
      label: 'Produit',
      path: 'name',
      isSortable: true,
      isFilterable: true,
      filterControl: TextFilterControl
    },
    {
      label: 'Prix',
      path: 'price',
      isSortable: true,
      isFilterable: true,
      filterControl: NumberFilterControl,
      render: (value) => \`€\${value.toFixed(2)}\`
    },
    {
      label: 'Catégorie',
      path: 'category',
      isFilterable: true,
      filterControl: (props) => (
        <SelectFilterControl
          {...props}
          options={[
            { label: 'Électronique', value: 'Electronics' },
            { label: 'Accessoires', value: 'Accessories' }
          ]}
        />
      )
    }
  ]

  const getData = async (sortColumns, startRow, pageSize, grouping, filters) => {
    let data = [...products]

    // Appliquer les filtres
    if (filters?.length > 0) {
      data = data.filter(item => {
        return filters.every(filter => {
          const value = item[filter.path]
          const filterValue = filter.filter

          if (!filterValue) return true

          // Gestion des opérateurs
          switch (filterValue.operator) {
            case 'contains':
              return String(value).toLowerCase().includes(String(filterValue.value).toLowerCase())
            case 'equals':
              return value === filterValue.value
            case 'greater_than':
              return Number(value) > Number(filterValue.value)
            // ... autres opérateurs
            default:
              return true
          }
        })
      })
    }

    return { data: data.slice(startRow, startRow + pageSize), totalCount: data.length }
  }

  return (
    <DataTable
      schema={ProductSchema}
      columns={columns}
      getData={getData}
      filterIcons={{
        default: Filter,
        active: FilterX,
        classNames: {
          default: "h-4 w-4 text-muted-foreground",
          active: "h-4 w-4 text-primary"
        }
      }}
      messages={{
        emptyMessage: "Aucun produit trouvé",
        sortColumnAriaLabel: "{column} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes",
        filterActive: "Filtre actif",
        filterInactive: "Filtre inactif"
      }}
    />
  )
}`,

  'grouping-example': `import { DataTable, DataTableColumn } from '../data-table'
import { z } from 'zod'
import { useState } from 'react'

const EmployeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  status: z.enum(['active', 'inactive']),
})

export function GroupingExample() {
  const [accordionMode, setAccordionMode] = useState(false)

  const columns = [
    { label: 'ID', path: 'id', isSortable: true },
    { label: 'Nom', path: 'name', isSortable: true },
    { label: 'Email', path: 'email' },
    {
      label: 'Statut',
      path: 'status',
      render: (value) => (
        <span className={\`badge \${value === 'active' ? 'success' : 'error'}\`}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      )
    }
  ]

  const getData = async (sortColumns, startRow, pageSize) => {
    // Logique de récupération des données
    return { data: employees, totalCount: employees.length }
  }

  return (
    <div>
      {/* Toggle pour mode accordéon */}
      <div className="mb-4">
        <button onClick={() => setAccordionMode(!accordionMode)}>
          {accordionMode ? 'Mode Normal' : 'Mode Accordéon'}
        </button>
      </div>

      <DataTable
        schema={EmployeeSchema}
        columns={columns}
        getData={getData}
        grouping={{
          path: 'department',
          accordion: accordionMode,
          renderGroupHeader: (groupValue, count) => (
            <div className="flex items-center gap-2">
              <span>📁 {String(groupValue)}</span>
              <span>({count} employé{count > 1 ? 's' : ''})</span>
            </div>
          )
        }}
        paginationMode="None"
      />
    </div>
  )
}`,

  'custom-sort-icons-example': `import { DataTable, DataTableColumn } from '../data-table'
import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react'
import { z } from 'zod'

const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
})

export function CustomSortIconsExample() {
  const columns = [
    { label: 'Produit', path: 'name', isSortable: true },
    {
      label: 'Prix',
      path: 'price',
      isSortable: true,
      render: (value) => \`€\${value.toFixed(2)}\`
    },
    {
      label: 'Stock',
      path: 'stock',
      isSortable: true,
      render: (value) => (
        <span className={value === 0 ? 'text-red-500' : 'text-green-600'}>
          {value} unités
        </span>
      )
    }
  ]

  const getData = async (sortColumns, startRow, pageSize) => {
    // Logique de tri et pagination
    return { data: products, totalCount: products.length }
  }

  return (
    <DataTable
      schema={ProductSchema}
      columns={columns}
      getData={getData}
      sortIcons={{
        default: MoreHorizontal,
        asc: TrendingUp,
        desc: TrendingDown,
        classNames: {
          default: "h-4 w-4 text-gray-400",
          asc: "h-4 w-4 text-green-600",
          desc: "h-4 w-4 text-red-600"
        }
      }}
    />
  )
}`,

  'pagination-modes-example': `import { DataTable, DataTableColumn } from '../data-table'
import { z } from 'zod'
import { useState } from 'react'

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
})

export function PaginationModesExample() {
  const [currentMode, setCurrentMode] = useState('PaginationWithSize')

  const modes = [
    { value: 'None', label: 'Aucune pagination' },
    { value: 'InfiniteScroll', label: 'Scroll infini' },
    { value: 'Pagination', label: 'Pagination simple' },
    { value: 'PaginationWithSize', label: 'Pagination complète' },
  ]

  const columns = [
    { label: 'ID', path: 'id', isSortable: true },
    { label: 'Nom', path: 'name', isSortable: true },
    { label: 'Email', path: 'email', isSortable: true },
    {
      label: 'Statut',
      path: 'status',
      render: (value) => (
        <span className={\`badge \${value === 'active' ? 'success' : 'error'}\`}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      )
    }
  ]

  const getData = async (sortColumns, startRow, pageSize) => {
    // Simulation de données avec tri
    let data = [...users]

    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        // Logique de tri
      })
    }

    return {
      data: data.slice(startRow, startRow + pageSize),
      totalCount: data.length,
      lastRow: startRow + Math.min(pageSize, data.length - startRow) - 1
    }
  }

  return (
    <div>
      {/* Sélecteur de mode */}
      <div className="flex gap-2 mb-4">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setCurrentMode(mode.value)}
            className={\`px-3 py-1 rounded \${
              currentMode === mode.value ? 'bg-primary text-white' : 'bg-gray-200'
            }\`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <DataTable
        key={currentMode}
        schema={UserSchema}
        columns={columns}
        getData={getData}
        paginationMode={currentMode}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        showLoadMoreButton={true}
      />
    </div>
  )
}`,

  'responsive-example': `import { DataTable, DataTableColumn } from '../data-table'
import { z } from 'zod'

// Schéma pour les données d'exemple
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  department: z.string(),
  role: z.string(),
  status: z.enum(['active', 'inactive', 'pending']),
  salary: z.number(),
  lastLogin: z.string(),
})

type User = z.infer<typeof UserSchema>

export function ResponsiveDataTableExample() {
  // Configuration des colonnes avec gestion responsive
  const columns: DataTableColumn<User>[] = [
    {
      label: "ID",
      path: "id",
      isSortable: true,
      responsive: {
        medias: ['Desktop'], // Visible uniquement sur desktop
        widthMode: "content",
        width: "60px"
      }
    },
    {
      label: "Nom",
      path: "name",
      isSortable: true,
      responsive: {
        // Pas de medias défini = visible partout
        widthMode: "range",
        minWidth: "120px",
        maxWidth: "200px"
      }
    },
    {
      label: "Email",
      path: "email",
      isSortable: true,
      responsive: {
        medias: ['Tablet', 'Desktop'], // Masqué sur mobile
        widthMode: "fill",
        minWidth: "150px"
      }
    },
    {
      label: "Téléphone",
      path: "phone",
      responsive: {
        medias: ['Mobile'], // Visible uniquement sur mobile
        widthMode: "content",
        width: "120px"
      }
    },
    {
      label: "Département",
      path: "department",
      isSortable: true,
      responsive: {
        medias: [{ min: '900px' }], // Media query personnalisée
        widthMode: "content",
        width: "120px"
      }
    }
  ]

  // Données d'exemple
  const sampleUsers = [
    {
      id: 1, name: "Marie Dubois", email: "marie.dubois@example.com",
      phone: "+33 1 23 45 67 89", department: "IT", role: "Developer",
      status: "active" as const, salary: 55000, lastLogin: "2024-01-15T10:30:00Z"
    },
    // ... plus de données
  ]

  const getData = async () => ({
    data: sampleUsers,
    totalCount: sampleUsers.length
  })

  return (
    <DataTable
      schema={UserSchema}
      columns={columns}
      getData={getData}
      paginationMode="None"
      emptyMessage="Aucun utilisateur trouvé"
    />
  )
}`,

  'i18n-example': `import { DataTable } from '../data-table'
import { z } from 'zod'
import { useState } from 'react'

// Schéma pour les exemples
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
})

type User = z.infer<typeof UserSchema>

// Données d'exemple (plus de données pour démontrer la pagination)
const sampleUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'pending' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'active' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', status: 'inactive' },
  { id: 7, name: 'Edward Norton', email: 'edward@example.com', status: 'active' },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', status: 'pending' },
  { id: 9, name: 'George Miller', email: 'george@example.com', status: 'active' },
  { id: 10, name: 'Helen Davis', email: 'helen@example.com', status: 'inactive' },
  { id: 11, name: 'Ian Fleming', email: 'ian@example.com', status: 'active' },
  { id: 12, name: 'Julia Roberts', email: 'julia@example.com', status: 'pending' },
]

export function I18nExample() {
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en' | 'es'>('fr')
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    {
      label: currentLanguage === 'fr' ? 'Nom' : currentLanguage === 'en' ? 'Name' : 'Nombre',
      path: 'name',
      isSortable: true
    },
    {
      label: currentLanguage === 'fr' ? 'Email' : currentLanguage === 'en' ? 'Email' : 'Correo',
      path: 'email',
      isSortable: true
    },
    {
      label: currentLanguage === 'fr' ? 'Statut' : currentLanguage === 'en' ? 'Status' : 'Estado',
      path: 'status',
      isSortable: true,
      isFilterable: true
    },
  ]

  const getData = async () => {
    // Simuler un délai de chargement pour voir le message "loadingMessage"
    if (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    if (showEmptyState) {
      return {
        data: [],
        totalCount: 0,
      }
    }

    return {
      data: sampleUsers,
      totalCount: sampleUsers.length,
    }
  }

  // Exemple de configuration messages selon la langue
  // En pratique, vous utiliseriez votre librairie i18n (react-i18next, next-intl, etc.)
  const getMessagesConfig = () => {
    switch (currentLanguage) {
      case 'en':
        return {
          // Messages généraux
          emptyMessage: 'No data available',
          loadingMessage: 'Loading data...',
          displayInfo: 'Showing {start} to {end} of {total} items',
          elementsPerPage: 'Items per page:',
          totalElements: '{total} total items',
          loadMoreButton: 'Load more',
          loadingIndicator: 'Loading...',

          // Messages de filtrage
          filterPopupApply: 'Apply',
          filterPopupCancel: 'Cancel',
          filterPopupClear: 'Clear',
          filterOperatorLabel: 'Operator',
          filterValueLabel: 'Value',
          filterValue2Label: 'Value 2',
          filterValuesLabel: 'Values',
          filterValuePlaceholder: 'Enter a value...',
          filterNumberPlaceholder: 'Enter a number...',
          filterSelectPlaceholder: 'Select...',

          // Messages de tri
          sortAscending: 'Sort ascending',
          sortDescending: 'Sort descending',
          noSort: 'No sort',
          filterActive: 'Filter active',
          filterInactive: 'Filter inactive',

          // Opérateurs de filtrage
          filterOperatorEquals: 'Equals',
          filterOperatorNotEquals: 'Not equals',
          filterOperatorContains: 'Contains',
          filterOperatorStartsWith: 'Starts with',
          filterOperatorEndsWith: 'Ends with',
          filterOperatorGreaterThan: 'Greater than',
          filterOperatorGreaterOrEqual: 'Greater or equal',
          filterOperatorLessThan: 'Less than',
          filterOperatorLessOrEqual: 'Less or equal',
          filterOperatorBetween: 'Between',
          filterOperatorIn: 'In list',
          filterOperatorNotIn: 'Not in list',
          filterOperatorIsNull: 'Is empty',
          filterOperatorIsNotNull: 'Is not empty',

          // Messages des filtres booléens
          filterBooleanTrue: 'True',
          filterBooleanFalse: 'False',
        }
      case 'es':
        return {
          // Messages généraux
          emptyMessage: 'No hay datos disponibles',
          loadingMessage: 'Cargando datos...',
          displayInfo: 'Mostrando {start} a {end} de {total} elementos',
          elementsPerPage: 'Elementos por página:',
          totalElements: '{total} elementos en total',
          loadMoreButton: 'Cargar más',
          loadingIndicator: 'Cargando...',

          // Messages de filtrage
          filterPopupApply: 'Aplicar',
          filterPopupCancel: 'Cancelar',
          filterPopupClear: 'Limpiar',
          filterOperatorLabel: 'Operador',
          filterValueLabel: 'Valor',
          filterValue2Label: 'Valor 2',
          filterValuesLabel: 'Valores',
          filterValuePlaceholder: 'Ingrese un valor...',
          filterNumberPlaceholder: 'Ingrese un número...',
          filterSelectPlaceholder: 'Seleccionar...',

          // Messages de tri
          sortAscending: 'Orden ascendente',
          sortDescending: 'Orden descendente',
          noSort: 'Sin orden',
          filterActive: 'Filtro activo',
          filterInactive: 'Filtro inactivo',

          // Opérateurs de filtrage
          filterOperatorEquals: 'Igual a',
          filterOperatorNotEquals: 'Diferente de',
          filterOperatorContains: 'Contiene',
          filterOperatorStartsWith: 'Comienza con',
          filterOperatorEndsWith: 'Termina con',
          filterOperatorGreaterThan: 'Mayor que',
          filterOperatorGreaterOrEqual: 'Mayor o igual',
          filterOperatorLessThan: 'Menor que',
          filterOperatorLessOrEqual: 'Menor o igual',
          filterOperatorBetween: 'Entre',
          filterOperatorIn: 'En la lista',
          filterOperatorNotIn: 'No en la lista',
          filterOperatorIsNull: 'Está vacío',
          filterOperatorIsNotNull: 'No está vacío',

          // Messages des filtres booléens
          filterBooleanTrue: 'Verdadero',
          filterBooleanFalse: 'Falso',
        }
      default:
        return {
          // Messages en français (par défaut)
          emptyMessage: 'Aucune donnée disponible',
          loadingMessage: 'Chargement des données...',
          displayInfo: 'Affichage de {start} à {end} sur {total} éléments',
          elementsPerPage: 'Éléments par page :',
          totalElements: '{total} éléments au total',
          loadMoreButton: 'Charger plus',
          loadingIndicator: 'Chargement...',

          // Messages de filtrage
          filterPopupApply: 'Appliquer',
          filterPopupCancel: 'Annuler',
          filterPopupClear: 'Effacer',
          filterOperatorLabel: 'Opérateur',
          filterValueLabel: 'Valeur',
          filterValue2Label: 'Valeur 2',
          filterValuesLabel: 'Valeurs',
          filterValuePlaceholder: 'Entrez une valeur...',
          filterNumberPlaceholder: 'Entrez un nombre...',
          filterSelectPlaceholder: 'Sélectionnez...',

          // Messages de tri
          sortAscending: 'Tri croissant',
          sortDescending: 'Tri décroissant',
          noSort: 'Aucun tri',
          filterActive: 'Filtre actif',
          filterInactive: 'Filtre inactif',

          // Opérateurs de filtrage
          filterOperatorEquals: 'Égal à',
          filterOperatorNotEquals: 'Différent de',
          filterOperatorContains: 'Contient',
          filterOperatorStartsWith: 'Commence par',
          filterOperatorEndsWith: 'Finit par',
          filterOperatorGreaterThan: 'Plus grand que',
          filterOperatorGreaterOrEqual: 'Plus grand ou égal',
          filterOperatorLessThan: 'Plus petit que',
          filterOperatorLessOrEqual: 'Plus petit ou égal',
          filterOperatorBetween: 'Entre',
          filterOperatorIn: 'Dans la liste',
          filterOperatorNotIn: 'Pas dans la liste',
          filterOperatorIsNull: 'Est vide',
          filterOperatorIsNotNull: 'N\\'est pas vide',

          // Messages des filtres booléens
          filterBooleanTrue: 'Vrai',
          filterBooleanFalse: 'Faux',
        }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentLanguage('fr')}
            className={\`px-3 py-1 rounded text-sm \${currentLanguage === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
          >
            Français
          </button>
          <button
            onClick={() => setCurrentLanguage('en')}
            className={\`px-3 py-1 rounded text-sm \${currentLanguage === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
          >
            English
          </button>
          <button
            onClick={() => setCurrentLanguage('es')}
            className={\`px-3 py-1 rounded text-sm \${currentLanguage === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
          >
            Español
          </button>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            className={\`px-3 py-1 rounded text-sm \${showEmptyState ? 'bg-orange-500 text-white' : 'bg-gray-200'}\`}
          >
            {currentLanguage === 'fr' ? 'État vide' : currentLanguage === 'en' ? 'Empty state' : 'Estado vacío'}
          </button>
          <button
            onClick={() => {
              setIsLoading(!isLoading)
              // Déclencher un rechargement pour voir le message de chargement
              setRefreshKey(prev => prev + 1)
            }}
            className={\`px-3 py-1 rounded text-sm \${isLoading ? 'bg-green-500 text-white' : 'bg-gray-200'}\`}
          >
            {currentLanguage === 'fr' ? 'Chargement' : currentLanguage === 'en' ? 'Loading' : 'Cargando'}
          </button>
        </div>
      </div>

      <DataTable
        key={refreshKey}
        schema={UserSchema}
        columns={columns}
        getData={getData}
        messages={getMessagesConfig()}
        paginationMode="PaginationWithSize"
        defaultPageSize={5}
      />
    </div>
  )
}`
} as const

export type SampleSourceCode = keyof typeof sampleSourceCodes

export function getSampleSourceCode(sampleName: SampleSourceCode): string {
  return sampleSourceCodes[sampleName] || ''
}
