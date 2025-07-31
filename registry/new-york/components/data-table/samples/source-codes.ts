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
          // Logique de filtrage selon le type
          const value = item[filter.path]
          if (typeof filter.value === 'string') {
            return String(value).toLowerCase().includes(filter.value.toLowerCase())
          }
          return true
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
}`
} as const

export type SampleSourceCode = keyof typeof sampleSourceCodes

export function getSampleSourceCode(sampleName: SampleSourceCode): string {
  return sampleSourceCodes[sampleName] || ''
}
