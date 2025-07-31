// Test HMR - Updated at 14:45:30
import { DataTable, DataTableColumn, SortColumn, TextFilterControl, NumberFilterControl, SelectFilterControl, DataTableGrouping, ColumnFilter } from './data-table'
import { z } from 'zod'
import { useState } from 'react'
import { TrendingUp, TrendingDown, MoreHorizontal, Filter, FilterX } from 'lucide-react'

// Schémas d'exemple
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
  role: z.string(),
  joinedAt: z.string(),
})

const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  stock: z.number(),
  isAvailable: z.boolean(),
})

const EmployeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  status: z.enum(['active', 'inactive']),
  joinedAt: z.string(),
})

type User = z.infer<typeof UserSchema>
type Product = z.infer<typeof ProductSchema>
type Employee = z.infer<typeof EmployeeSchema>

/**
 * Documentation pour DataTable
 * Fichier interne - Non inclus dans la registry
 */
export function DataTableDocumentation() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>()
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>()

  // Fonction pour générer des utilisateurs d'exemple
  const generateUsers = (count: number): User[] => {
    const firstNames = [
      'Alice', 'Bob', 'Claire', 'David', 'Emma', 'François', 'Gabrielle', 'Henri',
      'Isabelle', 'Julien', 'Karine', 'Laurent', 'Marie', 'Nicolas', 'Olivia',
      'Pierre', 'Quentin', 'Rachel', 'Stéphane', 'Théa', 'Ulysse', 'Valérie',
      'William', 'Xavier', 'Yasmine', 'Zoé', 'Antoine', 'Béatrice', 'Céline',
      'Damien', 'Élise', 'Fabien', 'Géraldine', 'Hugo', 'Inès', 'Jérôme'
    ]

    const lastNames = [
      'Martin', 'Dupont', 'Bernard', 'Moreau', 'Durand', 'Leroy', 'Simon',
      'Blanc', 'Roux', 'Fabre', 'Dubois', 'Garcia', 'Petit', 'Thomas',
      'Robert', 'Martinez', 'Lopez', 'Gonzalez', 'Rousseau', 'Girard',
      'Lambert', 'Fontaine', 'Roy', 'Vincent', 'Marchand', 'Michel',
      'Muller', 'David', 'Bertrand', 'Andre', 'Mercier', 'Boyer'
    ]

    const roles = ['Admin', 'User', 'Moderator', 'Editor', 'Viewer', 'Manager']
    const statuses: ('active' | 'inactive')[] = ['active', 'inactive']

    return Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[i % firstNames.length]
      const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
      const suffix = i >= firstNames.length * lastNames.length ? Math.floor(i / (firstNames.length * lastNames.length)) + 1 : ''

      // Fonction pour nettoyer et normaliser les caractères accentués
      const normalizeString = (str: string): string => {
        return str
          .toLowerCase()
          .normalize('NFD') // Décompose les caractères accentués
          .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
          .replace(/[^a-z]/g, '') // Supprime tous les caractères non alphabétiques
      }

      // Nettoyer les noms pour créer des emails valides
      const cleanFirstName = normalizeString(firstName)
      const cleanLastName = normalizeString(lastName)
      const emailSuffix = suffix ? suffix.toString() : ''

      return {
        id: i + 1,
        name: `${firstName} ${lastName}${suffix ? ` ${suffix}` : ''}`,
        email: `${cleanFirstName}.${cleanLastName}${emailSuffix}@example.com`,
        status: statuses[i % 2],
        role: roles[i % roles.length],
        joinedAt: new Date(2023 + (i % 2), (i % 12), (i % 28) + 1).toISOString().split('T')[0],
      }
    })
  }

  // Fonction pour générer des produits d'exemple
  const generateProducts = (count: number): Product[] => {
    const categories = ['Electronics', 'Accessories', 'Software', 'Hardware', 'Mobile', 'Gaming']
    const productTypes = {
      Electronics: ['Laptop', 'Desktop', 'Monitor', 'Tablet', 'SmartWatch', 'Camera'],
      Accessories: ['Mouse', 'Keyboard', 'Headset', 'Speaker', 'Cable', 'Stand'],
      Software: ['Antivirus', 'Office Suite', 'Photo Editor', 'Video Editor', 'Game', 'Utility'],
      Hardware: ['SSD', 'RAM', 'CPU', 'GPU', 'Motherboard', 'Power Supply'],
      Mobile: ['Smartphone', 'Case', 'Screen Protector', 'Charger', 'Power Bank', 'Earbuds'],
      Gaming: ['Console', 'Controller', 'Game', 'Gaming Chair', 'Gaming Mouse', 'Gaming Keyboard']
    }
    const brands = ['Pro', 'Max', 'Elite', 'Premium', 'Standard', 'Basic', 'Advanced', 'Ultra']

    return Array.from({ length: count }, (_, i) => {
      const category = categories[i % categories.length] as keyof typeof productTypes
      const productType = productTypes[category][Math.floor(i / categories.length) % productTypes[category].length]
      const brand = brands[i % brands.length]
      const price = Math.round((Math.random() * 2000 + 10) * 100) / 100
      const stock = Math.floor(Math.random() * 100)

      return {
        id: i + 1,
        name: `${productType} ${brand} ${i + 1}`,
        price,
        category,
        stock,
        isAvailable: stock > 0 && Math.random() > 0.1,
      }
    })
  }

  // Fonction pour générer des employés d'exemple
  const generateEmployees = (count: number): Employee[] => {
    const departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'IT']
    const statuses: ('active' | 'inactive')[] = ['active', 'inactive']

    return Array.from({ length: count }, (_, i) => {
      const department = departments[i % departments.length]
      const status = statuses[i % 2]

      return {
        id: i + 1,
        name: `Employé ${i + 1}`,
        email: `employee${i + 1}@example.com`,
        department,
        status,
        joinedAt: new Date(2023, (i % 12), (i % 28) + 1).toISOString().split('T')[0],
      }
    })
  }

  // Données d'exemple pour les utilisateurs (50 utilisateurs pour tester la pagination)
  const sampleUsers: User[] = generateUsers(50)

  // Données d'exemple pour les produits (30 produits)
  const sampleProducts: Product[] = generateProducts(30)

  // Données d'exemple pour les employés (20 employés)
  const sampleEmployees: Employee[] = generateEmployees(20)

  // Configuration des colonnes pour les utilisateurs
  const userColumns: DataTableColumn<User>[] = [
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
      description: 'Nom complet de l\'utilisateur',
      isSortable: true,
      isFilterable: true,
      filterControl: TextFilterControl,
    },
    {
      label: 'Email',
      path: 'email',
      isSortable: true,
      isFilterable: true,
      filterControl: TextFilterControl,
    },
    {
      label: 'Statut',
      path: 'status',
      isSortable: true,
      align: 'center',
      isFilterable: true,
      filterControl: (props) => (
        <SelectFilterControl
          {...props}
          options={[
            { label: 'Tous', value: '__all__' },
            { label: 'Actif', value: 'active' },
            { label: 'Inactif', value: 'inactive' }
          ]}
        />
      ),
      render: (value: unknown) => (
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
    },
    {
      label: 'Actions',
      type: 'action',
      align: 'center',
      width: '120px',
      render: (_, row: User) => (
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            onClick={(e) => {
              e.stopPropagation()
              alert(`Éditer ${row.name}`)
            }}
          >
            Éditer
          </button>
          <button
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            onClick={(e) => {
              e.stopPropagation()
              alert(`Supprimer ${row.name}`)
            }}
          >
            Suppr
          </button>
        </div>
      ),
    },
  ]

  // Configuration des colonnes pour les produits
  const productColumns: DataTableColumn<Product>[] = [
    {
      label: 'Produit',
      path: 'name',
      isSortable: true,
      isFilterable: true,
      filterControl: TextFilterControl,
    },
    {
      label: 'Prix',
      path: 'price',
      isSortable: true,
      isFilterable: true,
      filterControl: NumberFilterControl,
      align: 'right',
      render: (value: unknown) => `€${(value as number).toFixed(2)}`,
    },
    {
      label: 'Stock',
      path: 'stock',
      isSortable: true,
      align: 'center',
      isFilterable: true,
      filterControl: NumberFilterControl,
      render: (value: unknown) => (
        <span className={(value as number) === 0 ? 'text-red-500' : 'text-green-500'}>
          {value as number} unités
        </span>
      ),
    },
    {
      label: 'Disponible',
      path: 'isAvailable',
      align: 'center',
      render: (value: unknown) => (
        <span className={`text-xs ${(value as boolean) ? 'text-green-500' : 'text-red-500'}`}>
          {(value as boolean) ? '✓' : '✗'}
        </span>
      ),
    },
    {
      label: 'Valeur Stock',
      type: 'computed',
      align: 'right',
      render: (_, row: Product) => {
        const totalValue = row.price * row.stock
        return (
          <span className="font-medium">
            €{totalValue.toFixed(2)}
          </span>
        )
      },
    },
  ]

  // Configuration des colonnes pour les employés
  const employeeColumns: DataTableColumn<Employee>[] = [
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
      description: 'Nom complet de l\'employé',
      isSortable: true,
      isFilterable: true,
      filterControl: TextFilterControl,
    },
    {
      label: 'Email',
      path: 'email',
      isSortable: true,
      isFilterable: true,
      filterControl: TextFilterControl,
    },
    {
      label: 'Département',
      path: 'department',
      isSortable: true,
      isFilterable: true,
      filterControl: (props) => (
        <SelectFilterControl
          {...props}
          options={[
            { label: 'Tous', value: '__all__' },
            { label: 'HR', value: 'HR' },
            { label: 'Engineering', value: 'Engineering' },
            { label: 'Sales', value: 'Sales' },
            { label: 'Marketing', value: 'Marketing' },
            { label: 'Finance', value: 'Finance' },
            { label: 'IT', value: 'IT' }
          ]}
        />
      ),
    },
    {
      label: 'Statut',
      path: 'status',
      isSortable: true,
      align: 'center',
      isFilterable: true,
      filterControl: (props) => (
        <SelectFilterControl
          {...props}
          options={[
            { label: 'Tous', value: '__all__' },
            { label: 'Actif', value: 'active' },
            { label: 'Inactif', value: 'inactive' }
          ]}
        />
      ),
      render: (value: unknown) => (
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
    },
    {
      label: 'Actions',
      type: 'action',
      align: 'center',
      width: '120px',
      render: (_, row: Employee) => (
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            onClick={(e) => {
              e.stopPropagation()
              alert(`Éditer ${row.name}`)
            }}
          >
            Éditer
          </button>
          <button
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            onClick={(e) => {
              e.stopPropagation()
              alert(`Supprimer ${row.name}`)
            }}
          >
            Suppr
          </button>
        </div>
      ),
    },
  ]

  // Fonction pour récupérer les données utilisateurs
  // Dans un vrai projet, le tri serait géré côté serveur
  const getUserData = async (sortColumns: SortColumn[], startRow: number, pageSize: number, _grouping?: DataTableGrouping, filters?: ColumnFilter[]) => {
    await new Promise(resolve => setTimeout(resolve, 200))

    // Simulation d'une API qui gère le tri côté serveur
    // En production, vous enverriez sortColumns à votre API
    console.log('Tri demandé:', sortColumns, 'Filtres:', filters, 'startRow:', startRow, 'pageSize:', pageSize)

    // Pour la démo, on applique le tri et filtrage côté client pour voir l'effet
    let filteredUsers = [...sampleUsers]

    // Appliquer les filtres
    if (filters && filters.length > 0) {
      filteredUsers = filteredUsers.filter(item => {
        return filters.every(filter => {
          const value = getValueByPath(item, filter.path)
          const filterValue = filter.value

          if (filterValue === null || filterValue === undefined || filterValue === '__all__') {
            return true
          }

          if (typeof filterValue === 'object' && filterValue !== null && 'operator' in filterValue) {
            const numericFilter = filterValue as { operator: string; value: number }
            const numValue = Number(value)

            if (isNaN(numValue)) return false

            switch (numericFilter.operator) {
              case '=': return numValue === numericFilter.value
              case '!=': return numValue !== numericFilter.value
              case '<': return numValue < numericFilter.value
              case '<=': return numValue <= numericFilter.value
              case '>': return numValue > numericFilter.value
              case '>=': return numValue >= numericFilter.value
              default: return true
            }
          }

          if (typeof value === 'string' && typeof filterValue === 'string') {
            return value.toLowerCase().includes(filterValue.toLowerCase())
          }

          return String(value).toLowerCase() === String(filterValue).toLowerCase()
        })
      })
    }

    const sortedUsers = filteredUsers

    if (sortColumns.length > 0) {
      sortedUsers.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = getValueByPath(a, sort.path)
          const bValue = getValueByPath(b, sort.path)

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
    const endRow = Math.min(startRow + pageSize, sortedUsers.length)
    const pageData = sortedUsers.slice(startRow, endRow)

    return {
      data: pageData,
      totalCount: sortedUsers.length,
      lastRow: endRow - 1
    }
  }

  // Fonction pour récupérer les données produits
  // Dans un vrai projet, le tri serait géré côté serveur
  const getProductData = async (sortColumns: SortColumn[], startRow: number, pageSize: number, _grouping?: DataTableGrouping, filters?: ColumnFilter[]) => {
    await new Promise(resolve => setTimeout(resolve, 200))

    // Simulation d'une API qui gère le tri côté serveur
    // En production, vous enverriez sortColumns à votre API
    console.log('Tri demandé:', sortColumns, 'Filtres:', filters, 'startRow:', startRow, 'pageSize:', pageSize)

    // Pour la démo, on applique le tri et filtrage côté client pour voir l'effet
    let filteredProducts = [...sampleProducts]

    // Appliquer les filtres
    if (filters && filters.length > 0) {
      filteredProducts = filteredProducts.filter(item => {
        return filters.every(filter => {
          const value = getValueByPath(item, filter.path)
          const filterValue = filter.value

          if (filterValue === null || filterValue === undefined || filterValue === '__all__') {
            return true
          }

          if (typeof filterValue === 'object' && filterValue !== null && 'operator' in filterValue) {
            const numericFilter = filterValue as { operator: string; value: number }
            const numValue = Number(value)

            if (isNaN(numValue)) return false

            switch (numericFilter.operator) {
              case '=': return numValue === numericFilter.value
              case '!=': return numValue !== numericFilter.value
              case '<': return numValue < numericFilter.value
              case '<=': return numValue <= numericFilter.value
              case '>': return numValue > numericFilter.value
              case '>=': return numValue >= numericFilter.value
              default: return true
            }
          }

          if (typeof value === 'string' && typeof filterValue === 'string') {
            return value.toLowerCase().includes(filterValue.toLowerCase())
          }

          return String(value).toLowerCase() === String(filterValue).toLowerCase()
        })
      })
    }

    const sortedProducts = filteredProducts

    if (sortColumns.length > 0) {
      sortedProducts.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = getValueByPath(a, sort.path)
          const bValue = getValueByPath(b, sort.path)

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
    const endRow = Math.min(startRow + pageSize, sortedProducts.length)
    const pageData = sortedProducts.slice(startRow, endRow)

    return {
      data: pageData,
      totalCount: sortedProducts.length,
      lastRow: endRow - 1
    }
  }

  // Fonction pour récupérer les données employés
  // Dans un vrai projet, le tri serait géré côté serveur
  const getEmployeeData = async (sortColumns: SortColumn[], startRow: number, pageSize: number, _grouping?: DataTableGrouping, filters?: ColumnFilter[]) => {
    await new Promise(resolve => setTimeout(resolve, 200))

    // Simulation d'une API qui gère le tri côté serveur
    // En production, vous enverriez sortColumns à votre API
    console.log('Tri demandé:', sortColumns, 'Filtres:', filters, 'startRow:', startRow, 'pageSize:', pageSize)

    // Pour la démo, on applique le tri et filtrage côté client pour voir l'effet
    let filteredEmployees = [...sampleEmployees]

    // Appliquer les filtres
    if (filters && filters.length > 0) {
      filteredEmployees = filteredEmployees.filter(item => {
        return filters.every(filter => {
          const value = getValueByPath(item, filter.path)
          const filterValue = filter.value

          if (filterValue === null || filterValue === undefined || filterValue === '__all__') {
            return true
          }

          if (typeof filterValue === 'object' && filterValue !== null && 'operator' in filterValue) {
            const numericFilter = filterValue as { operator: string; value: number }
            const numValue = Number(value)

            if (isNaN(numValue)) return false

            switch (numericFilter.operator) {
              case '=': return numValue === numericFilter.value
              case '!=': return numValue !== numericFilter.value
              case '<': return numValue < numericFilter.value
              case '<=': return numValue <= numericFilter.value
              case '>': return numValue > numericFilter.value
              case '>=': return numValue >= numericFilter.value
              default: return true
            }
          }

          if (typeof value === 'string' && typeof filterValue === 'string') {
            return value.toLowerCase().includes(filterValue.toLowerCase())
          }

          return String(value).toLowerCase() === String(filterValue).toLowerCase()
        })
      })
    }

    const sortedEmployees = filteredEmployees

    if (sortColumns.length > 0) {
      sortedEmployees.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = getValueByPath(a, sort.path)
          const bValue = getValueByPath(b, sort.path)

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
    const endRow = Math.min(startRow + pageSize, sortedEmployees.length)
    const pageData = sortedEmployees.slice(startRow, endRow)

    return {
      data: pageData,
      totalCount: sortedEmployees.length,
      lastRow: endRow - 1
    }
  }

  // Fonction utilitaire pour obtenir une valeur par son chemin
  function getValueByPath<T extends Record<string, unknown>>(obj: T, path: string): unknown {
    return path.split('.').reduce((current: unknown, key: string) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key]
      }
      return undefined
    }, obj)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Data Table</h1>
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            Table Component
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un composant de tableau de données avancé avec validation Zod, tri multi-colonnes,
          rendu personnalisé et gestion de la sélection. Idéal pour afficher et manipuler des datasets complexes.
        </p>
      </div>

      {/* Interactive Demo */}
      <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🎮 Démo Interactive
            </h3>
            <p className="text-sm text-muted-foreground">
              Testez le tri, la sélection et la validation des données
            </p>
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border-l-4 border-blue-500">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Astuce de tri :</strong> Clic simple = tri unique | Ctrl/Shift + Clic = tri multi-colonnes
              </p>
            </div>
            <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border-l-4 border-amber-500">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>⚠️ Note :</strong> Cette démo applique le tri côté client pour montrer l'effet. En production,
                le tri doit être géré par votre API/serveur.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Tableau des utilisateurs */}
            <div className="space-y-4">
              <h4 className="font-medium">Gestion des utilisateurs (50 utilisateurs)</h4>
              <DataTable
                schema={UserSchema}
                columns={userColumns}
                getData={getUserData}
                onRowSelect={setSelectedUser}
                selectedRow={selectedUser}
                emptyMessage="Aucun utilisateur trouvé"
                paginationMode="PaginationWithSize"
                pageSize={10}
                pageSizeOptions={[5, 10, 15, 25]}
                filterIcons={{
                  default: Filter,
                  active: FilterX,
                  classNames: {
                    default: "h-4 w-4 text-muted-foreground hover:text-primary transition-colors",
                    active: "h-4 w-4 text-primary"
                  }
                }}
              />
              {selectedUser && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <strong>Sélectionné :</strong> {selectedUser.name} ({selectedUser.email})
                </div>
              )}
            </div>

            {/* Tableau des produits */}
            <div className="space-y-4">
              <h4 className="font-medium">Catalogue produits (30 produits)</h4>
              <DataTable
                schema={ProductSchema}
                columns={productColumns}
                getData={getProductData}
                onRowSelect={setSelectedProduct}
                selectedRow={selectedProduct}
                emptyMessage="Aucun produit trouvé"
                paginationMode="PaginationWithSize"
                pageSize={8}
                pageSizeOptions={[5, 8, 12, 20]}
                filterIcons={{
                  default: Filter,
                  active: FilterX,
                  classNames: {
                    default: "h-4 w-4 text-muted-foreground hover:text-primary transition-colors",
                    active: "h-4 w-4 text-primary"
                  }
                }}
              />
              {selectedProduct && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <strong>Sélectionné :</strong> {selectedProduct.name} - €{selectedProduct.price.toFixed(2)}
                </div>
              )}
            </div>

            {/* Tableau des employés */}
            <div className="space-y-4">
              <h4 className="font-medium">Liste des employés (20 employés)</h4>
              <DataTable
                schema={EmployeeSchema}
                columns={employeeColumns}
                getData={getEmployeeData}
                onRowSelect={setSelectedEmployee}
                selectedRow={selectedEmployee}
                emptyMessage="Aucun employé trouvé"
                paginationMode="PaginationWithSize"
                pageSize={8}
                pageSizeOptions={[5, 8, 12, 20]}
                filterIcons={{
                  default: Filter,
                  active: FilterX,
                  classNames: {
                    default: "h-4 w-4 text-muted-foreground hover:text-primary transition-colors",
                    active: "h-4 w-4 text-primary"
                  }
                }}
              />
              {selectedEmployee && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <strong>Sélectionné :</strong> {selectedEmployee.name} ({selectedEmployee.email}) - {selectedEmployee.department}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <div className="rounded-lg bg-muted p-4">
          <code className="text-sm">npm install clsx tailwind-merge lucide-react zod</code>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Exemples d'utilisation</h2>

        {/* Basic Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Utilisation de base</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-x-auto"><code>{`import { DataTable, DataTableColumn } from './data-table'
import { z } from 'zod'

// Définir le schéma Zod
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
})

type User = z.infer<typeof UserSchema>

// Configuration des colonnes
const columns: DataTableColumn<User>[] = [
  { label: 'ID', path: 'id', isSortable: true },
  { label: 'Nom', path: 'name', isSortable: true },
  { label: 'Email', path: 'email', isSortable: true },
]

// Fonction pour récupérer les données
const getData = async (sortColumns, startRow, pageSize) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ sort: sortColumns, startRow, pageSize })
  })
  const result = await response.json()
  return {
    data: result.data,
    totalCount: result.totalCount,
    lastRow: startRow + result.data.length - 1
  }
}

// Utilisation
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
/>`}</code></pre>
          </div>
        </div>

        {/* Pagination Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Utilisation avec pagination</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-x-auto"><code>{`// Pagination complète avec contrôle de taille (recommandé)
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="PaginationWithSize"
  pageSize={25}
  pageSizeOptions={[10, 25, 50, 100]}
/>

// Pagination simple sans contrôle de taille
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="Pagination"
  pageSize={20}
/>

// Sans pagination (charge toutes les données)
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="None"
/>

// Scroll infini
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="InfiniteScroll"
  pageSize={20}
  showLoadMoreButton={true}
/>

// Options de personnalisation de la pagination
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="PaginationWithSize"
  showPaginationInfo={false}        // Masquer "Affichage de X à Y"
  showSinglePagePagination={true}   // Toujours afficher la pagination
  pageSize={25}
/>

// Exemple de réponse serveur attendue
{
  "data": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ],
  "totalCount": 150,
  "lastRow": 49
}`}</code></pre>
          </div>
        </div>

        {/* Advanced Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Colonnes avec rendu personnalisé</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-x-auto"><code>{`const columns: DataTableColumn<Product>[] = [
  {
    label: 'Prix',
    path: 'price',
    isSortable: true,
    align: 'right',
    render: (value: number) => \`€\${value.toFixed(2)}\`,
  },
  {
    label: 'Statut',
    path: 'status',
    render: (value: string) => (
      <span className={\`badge \${value === 'active' ? 'success' : 'error'}\`}>
        {value}
      </span>
    ),
  },
]`}</code></pre>
          </div>
        </div>

        {/* Columns without path */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Colonnes d'actions et calculées</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-x-auto"><code>{`const columns: DataTableColumn<User>[] = [
  // Colonne normale avec données
  {
    label: 'Nom',
    path: 'name',
    isSortable: true
  },

  // Colonne calculée (sans path, pas triable)
  {
    label: 'Initiales',
    type: 'computed',
    render: (_, row: User) => {
      const initials = row.name.split(' ')
        .map(n => n[0])
        .join('')
      return <span className="font-mono">{initials}</span>
    },
  },

  // Colonne d'actions (sans path, pas triable)
  {
    label: 'Actions',
    type: 'action',
    align: 'center',
    render: (_, row: User) => (
      <div className="flex gap-2">
        <button onClick={() => edit(row)}>Éditer</button>
        <button onClick={() => delete(row)}>Supprimer</button>
      </div>
    ),
  },
]`}</code></pre>
          </div>
        </div>
      </div>

      {/* API Reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Référence API</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">DataTable Props</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Prop</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">schema</td>
                    <td className="p-4 text-sm"><code>z.ZodSchema&lt;T&gt;</code></td>
                    <td className="p-4 text-sm">Schéma Zod pour valider les données</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">columns</td>
                    <td className="p-4 text-sm"><code>DataTableColumn&lt;T&gt;[]</code></td>
                    <td className="p-4 text-sm">Configuration des colonnes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">getData</td>
                    <td className="p-4 text-sm"><code>(sortColumns: SortColumn[], startRow: number, pageSize: number, grouping?: DataTableGrouping, filters?: ColumnFilter[]) =&gt; Promise&lt;DataTableResponse&lt;T&gt;&gt; | DataTableResponse&lt;T&gt;</code></td>
                    <td className="p-4 text-sm">Fonction pour récupérer les données avec tri, pagination, groupement et filtrage</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">pageSize</td>
                    <td className="p-4 text-sm"><code>number</code></td>
                    <td className="p-4 text-sm">Taille de page pour la pagination (défaut: 50)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">paginationMode</td>
                    <td className="p-4 text-sm"><code>'None' | 'InfiniteScroll' | 'Pagination' | 'PaginationWithSize'</code></td>
                    <td className="p-4 text-sm">Mode de pagination (défaut: 'PaginationWithSize')</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">showPaginationInfo</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Afficher les informations de pagination comme "Affichage de 1 à 10 sur 50 éléments" (défaut: true)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">showSinglePagePagination</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Afficher la pagination même s'il n'y a qu'une seule page (défaut: false)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">showLoadMoreButton</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Afficher un bouton "Charger plus" en fallback pour infinite scroll (défaut: true)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">pageSizeOptions</td>
                    <td className="p-4 text-sm"><code>number[]</code></td>
                    <td className="p-4 text-sm">Options de taille de page pour PaginationWithSize (défaut: [10, 25, 50, 100])</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">filterIcons</td>
                    <td className="p-4 text-sm"><code>FilterIcons</code></td>
                    <td className="p-4 text-sm">Configuration des icônes de filtrage personnalisées (optionnel)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">sortIcons</td>
                    <td className="p-4 text-sm"><code>SortIcons</code></td>
                    <td className="p-4 text-sm">Configuration des icônes de tri personnalisées (optionnel)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">onRowSelect</td>
                    <td className="p-4 text-sm"><code>(row: T) =&gt; void</code></td>
                    <td className="p-4 text-sm">Callback de sélection de ligne</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">selectedRow</td>
                    <td className="p-4 text-sm"><code>T</code></td>
                    <td className="p-4 text-sm">Ligne actuellement sélectionnée</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">grouping</td>
                    <td className="p-4 text-sm"><code>DataTableGrouping</code></td>
                    <td className="p-4 text-sm">Configuration du groupement de données (optionnel)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">DataTableResponse Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">data</td>
                    <td className="p-4 text-sm"><code>T[]</code></td>
                    <td className="p-4 text-sm">Les données de la page actuelle</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">totalCount</td>
                    <td className="p-4 text-sm"><code>number</code></td>
                    <td className="p-4 text-sm">Nombre total d'éléments dans le dataset</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">lastRow</td>
                    <td className="p-4 text-sm"><code>number</code></td>
                    <td className="p-4 text-sm">Index de la dernière ligne retournée</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">groups</td>
                    <td className="p-4 text-sm"><code>DataGroup&lt;T&gt;[]?</code></td>
                    <td className="p-4 text-sm">Groupes pré-calculés par le serveur (optionnel)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">DataTableColumn Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">label</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Libellé affiché dans l'en-tête</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">path</td>
                    <td className="p-4 text-sm"><code>string?</code></td>
                    <td className="p-4 text-sm">Chemin vers la propriété (optionnel pour colonnes d'actions)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">isSortable</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Si la colonne peut être triée (auto false si pas de path)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">render</td>
                    <td className="p-4 text-sm"><code>(value: unknown, row: T) =&gt; ReactNode</code></td>
                    <td className="p-4 text-sm">Fonction de rendu personnalisée</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">type</td>
                    <td className="p-4 text-sm"><code>'data' | 'action' | 'computed'</code></td>
                    <td className="p-4 text-sm">Type de colonne pour clarifier l'usage</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">align</td>
                    <td className="p-4 text-sm"><code>'left' | 'center' | 'right'</code></td>
                    <td className="p-4 text-sm">Alignement du contenu</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">isFilterable</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Si la colonne peut être filtrée (défaut: false)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">filterControl</td>
                    <td className="p-4 text-sm"><code>React.ComponentType&lt;FilterControlProps&gt;</code></td>
                    <td className="p-4 text-sm">Composant de contrôle de filtre personnalisé</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">width</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Largeur de la colonne (optionnel)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">DataTableGrouping Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">path</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Chemin de la colonne à grouper (ex: 'status', 'department')</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">renderGroupHeader</td>
                    <td className="p-4 text-sm"><code>(groupValue: unknown, count: number, isExpanded: boolean) =&gt; ReactNode</code></td>
                    <td className="p-4 text-sm">Fonction de rendu personnalisée pour l'en-tête de groupe</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">expandable</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Si le groupe est expandable/collapsible (défaut: true)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">defaultExpanded</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">État initial des groupes (défaut: true = tous expandés)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">accordion</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Mode accordéon - un seul groupe ouvert à la fois (défaut: false)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">DataGroup Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">groupValue</td>
                    <td className="p-4 text-sm"><code>unknown</code></td>
                    <td className="p-4 text-sm">Valeur de groupement (ex: "Engineering", "Active")</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">count</td>
                    <td className="p-4 text-sm"><code>number</code></td>
                    <td className="p-4 text-sm">Nombre d'éléments dans le groupe</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">items</td>
                    <td className="p-4 text-sm"><code>T[]</code></td>
                    <td className="p-4 text-sm">Les données du groupe</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">isExpanded</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Si le groupe est actuellement expandé</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">SortIcons Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">default</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée quand aucun tri n'est appliqué</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">asc</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée pour le tri croissant</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">desc</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée pour le tri décroissant</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">classNames</td>
                    <td className="p-4 text-sm"><code>object?</code></td>
                    <td className="p-4 text-sm">Classes CSS personnalisées pour chaque état de tri</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">FilterIcons Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">default</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée pour ouvrir le filtre (défaut: Filter)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">active</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée quand un filtre est actif (défaut: FilterX)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">classNames</td>
                    <td className="p-4 text-sm"><code>object?</code></td>
                    <td className="p-4 text-sm">Classes CSS personnalisées pour les états default et active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">ColumnFilter Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">path</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Chemin de la colonne filtrée (ex: 'name', 'user.email')</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">value</td>
                    <td className="p-4 text-sm"><code>unknown</code></td>
                    <td className="p-4 text-sm">Valeur du filtre (string, object avec opérateur, etc.)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">FilterControlProps Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">value</td>
                    <td className="p-4 text-sm"><code>unknown</code></td>
                    <td className="p-4 text-sm">Valeur actuelle du filtre</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">onChange</td>
                    <td className="p-4 text-sm"><code>(value: unknown) =&gt; void</code></td>
                    <td className="p-4 text-sm">Callback appelé quand la valeur change</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">onClose</td>
                    <td className="p-4 text-sm"><code>() =&gt; void</code></td>
                    <td className="p-4 text-sm">Callback pour fermer la popover</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contrôles de filtre prédéfinis</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Contrôle</th>
                    <th className="text-left p-4 font-medium">Usage</th>
                    <th className="text-left p-4 font-medium">Valeur retournée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">TextFilterControl</td>
                    <td className="p-4 text-sm">Recherche textuelle simple</td>
                    <td className="p-4 text-sm"><code>string</code> - Texte de recherche</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">NumberFilterControl</td>
                    <td className="p-4 text-sm">Filtrage numérique avec opérateurs</td>
                    <td className="p-4 text-sm"><code>{`{ operator: string, value: string }`}</code></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">SelectFilterControl</td>
                    <td className="p-4 text-sm">Sélection dans une liste d'options</td>
                    <td className="p-4 text-sm"><code>string</code> - Valeur sélectionnée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sorting Behavior */}
          <div>
            <h3 className="text-lg font-medium mb-4">Comportement du tri</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Action</th>
                    <th className="text-left p-4 font-medium">Comportement</th>
                    <th className="text-left p-4 font-medium">Indicateur visuel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">Clic simple</td>
                    <td className="p-4 text-sm">Tri unique - remplace les autres tris</td>
                    <td className="p-4 text-sm">Flèche haut/bas sans numéro</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">Ctrl + Clic</td>
                    <td className="p-4 text-sm">Ajoute un tri multi-colonnes</td>
                    <td className="p-4 text-sm">Flèche + numéro d'ordre</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">Shift + Clic</td>
                    <td className="p-4 text-sm">Ajoute un tri multi-colonnes</td>
                    <td className="p-4 text-sm">Flèche + numéro d'ordre</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">3 clics consécutifs</td>
                    <td className="p-4 text-sm">Asc → Desc → Aucun tri</td>
                    <td className="p-4 text-sm">↑ → ↓ → ⇅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Demos */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Démos des modes de pagination</h2>
          <p className="text-muted-foreground mb-6">
            Explorez les différents modes de pagination et leurs options de personnalisation.
          </p>
        </div>

        {/* Mode None */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">Mode "None" - Toutes les données</h3>
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              Pas de pagination
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Affiche toutes les données d'un coup. Idéal pour les petits datasets ou l'export complet.
          </p>
          <DataTable
            schema={UserSchema}
            columns={userColumns.slice(0, 4)} // Réduire les colonnes pour la démo
            getData={async (sortColumns, startRow, pageSize) => {
              const data = await getUserData(sortColumns, startRow, pageSize)
              // Simuler un petit dataset pour la démo - prendre les 15 premiers
              const smallData = data.data.slice(0, 15)
              return {
                data: smallData,
                totalCount: 15, // Montrer seulement 15 pour le mode None
                lastRow: smallData.length - 1
              }
            }}
            paginationMode="None"
          />
        </div>

        {/* Mode InfiniteScroll */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">Mode "InfiniteScroll" - Scroll infini</h3>
            <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-800 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              Chargement automatique
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Charge automatiquement plus de données quand vous scrollez vers le bas. Parfait pour les listes longues.
          </p>
          <DataTable
            schema={UserSchema}
            columns={userColumns.slice(0, 4)}
            getData={async (_sortColumns, startRow, pageSize) => {
              // Simuler un grand dataset avec chargement progressif
              const allData = Array.from({ length: 100 }, (_, i) => ({
                id: i + 1,
                name: `Utilisateur ${i + 1}`,
                email: `user${i + 1}@example.com`,
                status: (i % 2 === 0 ? 'active' : 'inactive') as 'active' | 'inactive',
                role: ['Admin', 'User', 'Moderator'][i % 3],
                joinedAt: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
              }))

              const endRow = Math.min(startRow + pageSize, allData.length)
              const pageData = allData.slice(startRow, endRow)

              return new Promise(resolve => {
                setTimeout(() => {
                  resolve({
                    data: pageData,
                    totalCount: allData.length,
                    lastRow: endRow - 1
                  })
                }, 500) // Simuler la latence réseau
              })
            }}
            paginationMode="InfiniteScroll"
            pageSize={8}
            showLoadMoreButton={true}
          />
        </div>

        {/* Mode Pagination */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">Mode "Pagination" - Navigation classique</h3>
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-800 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300">
              Simple
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Pagination traditionnelle avec navigation par pages. Interface épurée sans contrôle de taille.
          </p>
          <DataTable
            schema={UserSchema}
            columns={userColumns.slice(0, 4)}
            getData={getUserData}
            paginationMode="Pagination"
            pageSize={8}
          />
        </div>

        {/* Mode PaginationWithSize */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">Mode "PaginationWithSize" - Pagination complète</h3>
            <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-800 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
              Recommandé
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Pagination complète avec sélecteur de taille de page. Le mode le plus polyvalent.
          </p>
          <DataTable
            schema={UserSchema}
            columns={userColumns}
            getData={getUserData}
            paginationMode="PaginationWithSize"
            pageSize={10}
            pageSizeOptions={[5, 10, 15, 25]}
          />
        </div>

        {/* Nouvelles options de pagination */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Options de personnalisation de la pagination</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Contrôlez finement l'affichage de la pagination avec les nouvelles options.
            </p>
          </div>

          {/* showPaginationInfo = false */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h4 className="font-medium">Masquer les informations de pagination</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded">showPaginationInfo={false}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Cache le texte "Affichage de X à Y sur Z éléments" tout en gardant les contrôles de pagination.
            </p>
            <DataTable
              schema={UserSchema}
              columns={userColumns.slice(0, 3)}
              getData={getUserData}
              paginationMode="PaginationWithSize"
              pageSize={8}
              showPaginationInfo={false}
              pageSizeOptions={[5, 8, 12, 20]}
            />
          </div>

          {/* showSinglePagePagination = true */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h4 className="font-medium">Afficher la pagination sur une seule page</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded">showSinglePagePagination={true}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Force l'affichage de la pagination même quand il n'y a qu'une seule page de données.
            </p>            <DataTable
              schema={UserSchema}
              columns={userColumns.slice(0, 3)}
              getData={async (_sortColumns, _startRow, _pageSize) => {
                // Retourner seulement 4 éléments pour avoir une seule page
                const smallData = sampleUsers.slice(0, 4)
                return {
                  data: smallData,
                  totalCount: smallData.length,
                  lastRow: smallData.length - 1
                }
              }}
              paginationMode="Pagination"
              pageSize={10}
              showSinglePagePagination={true}
            />
          </div>

          {/* Combinaison des deux options */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h4 className="font-medium">Combinaison des options</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded">showPaginationInfo={false} + showSinglePagePagination={true}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Affiche uniquement les contrôles de pagination, sans texte informatif, même sur une seule page.
            </p>
            <DataTable
              schema={UserSchema}
              columns={userColumns.slice(0, 3)}
              getData={async (_sortColumns, _startRow, _pageSize) => {
                const smallData = sampleUsers.slice(0, 4)
                return {
                  data: smallData,
                  totalCount: smallData.length,
                  lastRow: smallData.length - 1
                }
              }}
              paginationMode="PaginationWithSize"
              pageSize={10}
              showPaginationInfo={false}
              showSinglePagePagination={true}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      </div>

      {/* Pagination Modes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Modes de Pagination</h2>
        <p className="text-muted-foreground">
          DataTable supporte 4 modes de pagination différents pour s'adapter à vos besoins :
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">None</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Aucune pagination automatique. Toutes les données sont affichées en une fois.
              </p>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">
                  {`<DataTable
  paginationMode="None"
  getData={getData}
  // ...autres props
/>`}
                </code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">InfiniteScroll</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Scroll infini avec chargement automatique. Idéal pour les flux de données ou les grandes listes.
              </p>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">
                  {`<DataTable
  paginationMode="InfiniteScroll"
  showLoadMoreButton={true}
  getData={getData}
  // ...autres props
/>`}
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Pagination</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pagination classique avec navigation par pages. Interface simple et épurée.
              </p>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">
                  {`<DataTable
  paginationMode="Pagination"
  pageSize={20}
  getData={getData}
  // ...autres props
/>`}
                </code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">PaginationWithSize</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pagination complète avec contrôle de la taille de page. Recommandé pour la plupart des cas.
              </p>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">
                  {`<DataTable
  paginationMode="PaginationWithSize"
  pageSize={25}
  pageSizeOptions={[10, 25, 50, 100]}
  getData={getData}
  // ...autres props
/>`}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Conseil</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            La fonction <code>getData</code> reçoit les paramètres <code>startRow</code> et <code>pageSize</code> pour tous les modes.
            En mode <code>None</code>, <code>pageSize</code> sera très élevé pour récupérer toutes les données.
            En mode <code>InfiniteScroll</code>, <code>startRow</code> augmente à chaque chargement.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Fonctionnalités</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Validation Zod</h4>
              <p className="text-sm text-muted-foreground">Validation automatique des données avec messages d'erreur</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Tri intelligent</h4>
              <p className="text-sm text-muted-foreground">Tri simple (clic) ou multi-colonnes (Ctrl/Shift + clic) avec indicateurs visuels</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Rendu personnalisé</h4>
              <p className="text-sm text-muted-foreground">Fonctions de rendu pour personnaliser l'affichage des cellules</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Pagination flexible</h4>
              <p className="text-sm text-muted-foreground">4 modes de pagination : Aucune, Scroll infini, Simple, ou Complète avec shadcn/ui</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Sélection de lignes</h4>
              <p className="text-sm text-muted-foreground">Gestion de la sélection avec callbacks</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Groupement de données</h4>
              <p className="text-sm text-muted-foreground">Groupement par colonne avec expansion/collapse et rendu personnalisé</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Icônes de tri personnalisées</h4>
              <p className="text-sm text-muted-foreground">Configuration d'icônes et de styles personnalisés pour le tri des colonnes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Column Filtering */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filtrage des colonnes</h3>
        <p className="text-sm text-muted-foreground">
          Ajoutez des fonctionnalités de filtrage interactives avec des popovers personnalisables et des contrôles de filtre adaptés à chaque type de données.
        </p>

        {/* Filtering Example */}
        <div className="space-y-4">
          <h4 className="font-medium">Exemple avec filtres personnalisés</h4>
          <FilteringExample />
        </div>

        <div className="rounded-lg bg-muted p-4">
          <pre className="text-sm overflow-x-auto"><code>{`// Configuration des colonnes avec filtres
const columns: DataTableColumn<Product>[] = [
  {
    label: 'Nom',
    path: 'name',
    isSortable: true,
    isFilterable: true,           // Activer le filtrage
    filterControl: TextFilterControl  // Contrôle de filtre personnalisé
  },
  {
    label: 'Prix',
    path: 'price',
    isSortable: true,
    isFilterable: true,
    filterControl: NumberFilterControl
  },
  {
    label: 'Catégorie',
    path: 'category',
    isSortable: true,
    isFilterable: true,
    filterControl: (props) => (
      <SelectFilterControl
        {...props}
        options={[
          { label: 'Électronique', value: 'electronics' },
          { label: 'Accessoires', value: 'accessories' }
        ]}
      />
    )
  }
]

// Utilisation avec icônes personnalisées
<DataTable
  schema={ProductSchema}
  columns={columns}
  getData={getData}
  filterIcons={{
    default: Filter,              // Icône par défaut
    active: FilterX,              // Icône quand filtre actif
    classNames: {
      default: "h-4 w-4 text-muted-foreground hover:text-primary",
      active: "h-4 w-4 text-primary"
    }
  }}
/>

// Fonction getData mise à jour pour gérer les filtres
async function getData(
  sortColumns: SortColumn[],
  startRow: number,
  pageSize: number,
  grouping?: DataTableGrouping,
  filters?: ColumnFilter[]        // Nouveau paramètre
) {
  // Logique de filtrage côté serveur ou client
  let filteredData = data

  if (filters && filters.length > 0) {
    filteredData = data.filter(item => {
      return filters.every(filter => {
        const value = getValueByPath(item, filter.path)
        // Logique de filtrage selon le type
        if (typeof filter.value === 'string') {
          return String(value).toLowerCase().includes(filter.value.toLowerCase())
        }
        // Autres logiques selon le type de filtre...
        return true
      })
    })
  }

  return { data: filteredData, totalCount: filteredData.length }
}`}</code></pre>
        </div>
      </div>

      {/* Custom Sort Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Icônes de tri personnalisées</h3>
        <p className="text-sm text-muted-foreground">
          Personnalisez les icônes et styles de tri pour chaque colonne avec des icônes Lucide personnalisées et des classes CSS.
        </p>

        {/* Custom Icons Example */}
        <div className="space-y-4">
          <h4 className="font-medium">Exemple avec icônes et couleurs personnalisées</h4>
          <CustomSortIconsExample />
        </div>

        <div className="rounded-lg bg-muted p-4">
          <pre className="text-sm overflow-x-auto"><code>{`// Configuration d'icônes personnalisées au niveau du DataTable
<DataTable
  schema={ProductSchema}
  columns={columns}
  getData={getData}
  sortIcons={{
    default: MoreHorizontal,           // Icône quand aucun tri
    asc: TrendingUp,                   // Icône pour tri croissant
    desc: TrendingDown,                // Icône pour tri décroissant
    classNames: {
      default: "h-4 w-4 text-gray-400",
      asc: "h-4 w-4 text-green-600",   // Vert pour croissant
      desc: "h-4 w-4 text-red-600"     // Rouge pour décroissant
    }
  }}
/>`}</code></pre>
        </div>
      </div>

      {/* Grouping Usage */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Groupement de données</h3>
        <p className="text-sm text-muted-foreground">
          Le DataTable supporte le groupement des données par une colonne spécifique avec expansion/collapse.
        </p>

        {/* Grouping Example */}
        <div className="space-y-4">
          <h4 className="font-medium">Exemple avec employés groupés par département</h4>
          <GroupingExample />
        </div>

        <div className="rounded-lg bg-muted p-4">
          <pre className="text-sm overflow-x-auto"><code>{`// Configuration basique du grouping
<DataTable
  schema={EmployeeSchema}
  columns={columns}
  getData={getData}
  grouping={{
    path: 'department' // Grouper par département
  }}
/>

// Configuration avancée du grouping
<DataTable
  schema={EmployeeSchema}
  columns={columns}
  getData={getData}
  grouping={{
    path: 'department',
    expandable: true,              // Permet expansion/collapse (défaut: true)
    defaultExpanded: false,        // Groupes repliés par défaut (défaut: true)
    renderGroupHeader: (groupValue, count, isExpanded) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold">{String(groupValue)}</span>
        <span className="text-muted-foreground">
          ({count} employé{count > 1 ? 's' : ''})
        </span>
      </div>
    )
  }}
/>

// La fonction getData reçoit maintenant le paramètre grouping
const getData = async (sortColumns, startRow, pageSize, grouping) => {
  const response = await fetch('/api/employees', {
    method: 'POST',
    body: JSON.stringify({
      sort: sortColumns,
      startRow,
      pageSize,
      grouping // Informations de groupement
    })
  })

  const result = await response.json()

  // Retour avec groupes (optionnel - peut être géré côté client)
  return {
    data: result.data,
    totalCount: result.totalCount,
    lastRow: startRow + result.data.length - 1,
    groups: result.groups // Optionnel: groupes pré-calculés par le serveur
  }
}

// Structure des groupes si fournie par le serveur
interface DataGroup<T> {
  groupValue: unknown      // Valeur de groupement (ex: "Engineering")
  count: number           // Nombre d'éléments dans le groupe
  items: T[]             // Les données du groupe
  isExpanded: boolean    // État d'expansion initial
}`}</code></pre>
        </div>
      </div>
    </div>
  )
}

// Composant d'exemple pour le grouping
function GroupingExample() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>()
  const [accordionMode, setAccordionMode] = useState(false)

  // Données d'exemple d'employés
  const sampleEmployees: Employee[] = [
    { id: 1, name: 'Alice Martin', email: 'alice.martin@company.com', department: 'Engineering', status: 'active', joinedAt: '2023-01-15' },
    { id: 2, name: 'Bob Dupont', email: 'bob.dupont@company.com', department: 'Engineering', status: 'active', joinedAt: '2023-02-20' },
    { id: 3, name: 'Claire Bernard', email: 'claire.bernard@company.com', department: 'HR', status: 'active', joinedAt: '2023-01-10' },
    { id: 4, name: 'David Moreau', email: 'david.moreau@company.com', department: 'Sales', status: 'active', joinedAt: '2023-03-05' },
    { id: 5, name: 'Emma Durand', email: 'emma.durand@company.com', department: 'Engineering', status: 'inactive', joinedAt: '2023-01-25' },
    { id: 6, name: 'François Leroy', email: 'francois.leroy@company.com', department: 'Sales', status: 'active', joinedAt: '2023-02-15' },
    { id: 7, name: 'Gabrielle Simon', email: 'gabrielle.simon@company.com', department: 'HR', status: 'active', joinedAt: '2023-01-30' },
    { id: 8, name: 'Henri Blanc', email: 'henri.blanc@company.com', department: 'Marketing', status: 'active', joinedAt: '2023-03-10' },
  ]

  // Configuration des colonnes pour les employés
  const employeeColumns: DataTableColumn<Employee>[] = [
    { label: 'ID', path: 'id', isSortable: true, width: '80px' },
    { label: 'Nom', path: 'name', isSortable: true },
    { label: 'Email', path: 'email', isSortable: false },
    {
      label: 'Statut',
      path: 'status',
      isSortable: true,
      render: (value: unknown) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    { label: 'Date d\'embauche', path: 'joinedAt', isSortable: true },
  ]

  // Fonction getData pour les employés avec support du grouping
  const getEmployeeData = async (
    sortColumns: SortColumn[],
    startRow: number,
    pageSize: number,
    _grouping?: { path: string; renderGroupHeader?: (groupValue: unknown, count: number, isExpanded: boolean) => React.ReactNode; expandable?: boolean; defaultExpanded?: boolean; accordion?: boolean },
    filters?: ColumnFilter[]
  ) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100))

    let data = [...sampleEmployees]

    // Appliquer les filtres
    if (filters && filters.length > 0) {
      data = data.filter(item => {
        return filters.every(filter => {
          // Fonction utilitaire pour obtenir une valeur par son chemin
          const getValueByPath = (obj: Record<string, unknown>, path: string): unknown => {
            return path.split('.').reduce((current: unknown, key: string) => {
              if (current && typeof current === 'object' && key in current) {
                return (current as Record<string, unknown>)[key]
              }
              return undefined
            }, obj as unknown)
          }

          const value = getValueByPath(item, filter.path)
          const filterValue = filter.value

          if (filterValue === null || filterValue === undefined || filterValue === '__all__') {
            return true
          }

          if (typeof filterValue === 'object' && filterValue !== null && 'operator' in filterValue) {
            const numericFilter = filterValue as { operator: string; value: number }
            const numValue = Number(value)

            if (isNaN(numValue)) return false

            switch (numericFilter.operator) {
              case '=': return numValue === numericFilter.value
              case '!=': return numValue !== numericFilter.value
              case '<': return numValue < numericFilter.value
              case '<=': return numValue <= numericFilter.value
              case '>': return numValue > numericFilter.value
              case '>=': return numValue >= numericFilter.value
              default: return true
            }
          }

          if (typeof value === 'string' && typeof filterValue === 'string') {
            return value.toLowerCase().includes(filterValue.toLowerCase())
          }

          return String(value).toLowerCase() === String(filterValue).toLowerCase()
        })
      })
    }

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        for (const sort of sortColumns) {
          // Fonction utilitaire locale pour obtenir une valeur par son chemin
          const getValueByPathLocal = (obj: Record<string, unknown>, path: string): unknown => {
            return path.split('.').reduce((current: unknown, key: string) => {
              if (current && typeof current === 'object' && key in current) {
                return (current as Record<string, unknown>)[key]
              }
              return undefined
            }, obj as unknown)
          }

          const aValue = getValueByPathLocal(a as Record<string, unknown>, sort.path)
          const bValue = getValueByPathLocal(b as Record<string, unknown>, sort.path)

          const aStr = String(aValue ?? '')
          const bStr = String(bValue ?? '')

          if (aStr < bStr) return sort.direction === 'asc' ? -1 : 1
          if (aStr > bStr) return sort.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    // Appliquer la pagination
    const paginatedData = data.slice(startRow, startRow + pageSize)

    return {
      data: paginatedData,
      totalCount: data.length,
      lastRow: startRow + paginatedData.length - 1
    }
  }

  return (
    <div className="space-y-4">
      {/* Toggle pour le mode accordéon */}
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
        <span className="text-sm font-medium">Mode de groupement :</span>
        <button
          onClick={() => setAccordionMode(false)}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            !accordionMode
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Normal (multiple ouverts)
        </button>
        <button
          onClick={() => setAccordionMode(true)}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            accordionMode
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Accordéon (un seul ouvert)
        </button>
      </div>

      <DataTable
        key={accordionMode ? 'accordion' : 'normal'} // Force re-render when mode changes
        schema={EmployeeSchema}
        columns={employeeColumns}
        getData={getEmployeeData}
        onRowSelect={setSelectedEmployee}
        selectedRow={selectedEmployee}
        grouping={{
          path: 'department',
          accordion: accordionMode,
          renderGroupHeader: (groupValue, count, _isExpanded) => (
            <div className="flex items-center gap-2 font-medium">
              <span className="text-blue-600 dark:text-blue-400">
                📁 {String(groupValue)}
              </span>
              <span className="text-muted-foreground">
                ({count} employé{count > 1 ? 's' : ''})
              </span>
              {accordionMode && (
                <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded">
                  Mode accordéon
                </span>
              )}
            </div>
          )
        }}
        pageSize={20}
        paginationMode="None"
      />
      {selectedEmployee && (
        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <strong>Sélectionné :</strong> {selectedEmployee.name} - {selectedEmployee.department} ({selectedEmployee.email})
        </div>
      )}
    </div>
  )
}

// Composant d'exemple pour le filtrage des colonnes
function FilteringExample() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  // Données d'exemple de produits avec plus de variété
  const sampleProducts: Product[] = [
    { id: 1, name: 'MacBook Pro 16"', price: 2499.99, category: 'Electronics', stock: 12, isAvailable: true },
    { id: 2, name: 'Souris Magic Mouse', price: 79.99, category: 'Accessories', stock: 45, isAvailable: true },
    { id: 3, name: 'Clavier mécanique RGB', price: 149.99, category: 'Gaming', stock: 0, isAvailable: false },
    { id: 4, name: 'Écran 4K 27"', price: 599.99, category: 'Electronics', stock: 8, isAvailable: true },
    { id: 5, name: 'Câble USB-C vers HDMI', price: 29.99, category: 'Accessories', stock: 150, isAvailable: true },
    { id: 6, name: 'Casque gaming premium', price: 199.99, category: 'Gaming', stock: 23, isAvailable: true },
    { id: 7, name: 'Tablette iPad Pro', price: 1099.99, category: 'Electronics', stock: 15, isAvailable: true },
    { id: 8, name: 'Support pour laptop', price: 49.99, category: 'Accessories', stock: 67, isAvailable: true },
    { id: 9, name: 'Manette gaming pro', price: 89.99, category: 'Gaming', stock: 34, isAvailable: true },
    { id: 10, name: 'Disque SSD externe', price: 299.99, category: 'Electronics', stock: 19, isAvailable: true },
  ]

  // Configuration des colonnes avec filtres personnalisés
  const productColumns: DataTableColumn<Product>[] = [
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
      align: 'right',
      render: (value: unknown) => (
        <span className="font-semibold">€{(value as number).toFixed(2)}</span>
      )
    },
    {
      label: 'Catégorie',
      path: 'category',
      isSortable: true,
      isFilterable: true,
      filterControl: (props) => (
        <SelectFilterControl
          {...props}
          options={[
            { label: 'Électronique', value: 'Electronics' },
            { label: 'Accessoires', value: 'Accessories' },
            { label: 'Gaming', value: 'Gaming' }
          ]}
        />
      )
    },
    {
      label: 'Stock',
      path: 'stock',
      isSortable: true,
      isFilterable: true,
      filterControl: NumberFilterControl,
      align: 'center',
      render: (value: unknown) => (
        <span className={(value as number) === 0 ? 'text-red-500 font-medium' : 'text-green-600'}>
          {value as number} unités
        </span>
      )
    },
    {
      label: 'Disponible',
      path: 'isAvailable',
      isSortable: true,
      isFilterable: true,
      align: 'center',
      filterControl: (props) => (
        <SelectFilterControl
          {...props}
          options={[
            { label: 'Disponible', value: 'true' },
            { label: 'Indisponible', value: 'false' }
          ]}
        />
      ),
      render: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value ? '✓ Disponible' : '✗ Indisponible'}
        </span>
      )
    }
  ]

  // Fonction utilitaire pour obtenir une valeur par son chemin
  const getValueByPath = (obj: Product, path: string): unknown => {
    return path.split('.').reduce((current: Record<string, unknown>, key: string) => current?.[key] as Record<string, unknown>, obj as Record<string, unknown>)
  }

  // Fonction getData avec gestion des filtres
  const getProductData = async (
    sortColumns: SortColumn[],
    startRow: number,
    pageSize: number,
    _grouping?: DataTableGrouping,
    filters?: { path: string; value: unknown }[]
  ) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100))

    let data = [...sampleProducts]

    // Appliquer les filtres
    if (filters && filters.length > 0) {
      data = data.filter(item => {
        return filters.every(filter => {
          const value = getValueByPath(item, filter.path)

          if (filter.path === 'name' && typeof filter.value === 'string') {
            return String(value).toLowerCase().includes(filter.value.toLowerCase())
          }

          if (filter.path === 'price' && filter.value && typeof filter.value === 'object') {
            const { operator, value: filterValue } = filter.value as { operator: string; value: string }
            const numValue = parseFloat(filterValue)
            const itemValue = value as number

            switch (operator) {
              case '=': return itemValue === numValue
              case '!=': return itemValue !== numValue
              case '<': return itemValue < numValue
              case '<=': return itemValue <= numValue
              case '>': return itemValue > numValue
              case '>=': return itemValue >= numValue
              default: return true
            }
          }

          if (filter.path === 'category') {
            return filter.value === '' || value === filter.value
          }

          if (filter.path === 'stock' && filter.value && typeof filter.value === 'object') {
            const { operator, value: filterValue } = filter.value as { operator: string; value: string }
            const numValue = parseFloat(filterValue)
            const itemValue = value as unknown as number

            switch (operator) {
              case '=': return itemValue === numValue
              case '!=': return itemValue !== numValue
              case '<': return itemValue < numValue
              case '<=': return itemValue <= numValue
              case '>': return itemValue > numValue
              case '>=': return itemValue >= numValue
              default: return true
            }
          }

          if (filter.path === 'isAvailable') {
            return filter.value === '' || String(value) === filter.value
          }

          return true
        })
      })
    }

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = sort.path.split('.').reduce((obj: unknown, key: string) => (obj as Record<string, unknown>)?.[key], a)
          const bValue = sort.path.split('.').reduce((obj: unknown, key: string) => (obj as Record<string, unknown>)?.[key], b)

          let comparison = 0

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue)
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue
          } else {
            const aStr = String(aValue ?? '')
            const bStr = String(bValue ?? '')
            comparison = aStr.localeCompare(bStr)
          }

          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    // Appliquer la pagination
    const paginatedData = data.slice(startRow, startRow + pageSize)

    return {
      data: paginatedData,
      totalCount: data.length,
      lastRow: startRow + paginatedData.length - 1
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Démonstration du filtrage :</p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Filtre texte :</strong> Recherche dans le nom du produit</li>
          <li>• <strong>Filtre nombre :</strong> Opérateurs sur prix et stock (=, ≠, &lt;, ≤, &gt;, ≥)</li>
          <li>• <strong>Filtre sélection :</strong> Choix dans une liste (catégorie, disponibilité)</li>
          <li>• <strong>Icônes :</strong> 🔍 par défaut, ❌ quand filtre actif</li>
        </ul>
      </div>

      <DataTable
        schema={ProductSchema}
        columns={productColumns}
        getData={getProductData}
        onRowSelect={setSelectedProduct}
        selectedRow={selectedProduct}
        pageSize={8}
        paginationMode="Pagination"
        filterIcons={{
          default: Filter,
          active: FilterX,
          classNames: {
            default: "h-4 w-4 text-muted-foreground hover:text-primary transition-colors",
            active: "h-4 w-4 text-primary"
          }
        }}
        sortIcons={{
          default: MoreHorizontal,
          asc: TrendingUp,
          desc: TrendingDown,
          classNames: {
            default: "h-4 w-4 text-muted-foreground",
            asc: "h-4 w-4 text-green-600",
            desc: "h-4 w-4 text-red-600"
          }
        }}
      />

      {selectedProduct && (
        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <strong>Sélectionné :</strong> {selectedProduct.name} - €{selectedProduct.price} ({selectedProduct.stock} en stock)
        </div>
      )}
    </div>
  )
}

// Composant d'exemple pour les icônes de tri personnalisées
function CustomSortIconsExample() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  // Données d'exemple de produits avec prix variés
  const sampleProducts: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 25, isAvailable: true },
    { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories', stock: 150, isAvailable: true },
    { id: 3, name: 'Gaming Keyboard', price: 89.99, category: 'Gaming', stock: 0, isAvailable: false },
    { id: 4, name: 'USB-C Cable', price: 19.99, category: 'Accessories', stock: 200, isAvailable: true },
    { id: 5, name: 'Smartphone', price: 899.99, category: 'Electronics', stock: 45, isAvailable: true },
    { id: 6, name: 'Tablet Stand', price: 39.99, category: 'Accessories', stock: 75, isAvailable: true },
  ]

  // Configuration des colonnes avec icônes personnalisées
  const productColumns: DataTableColumn<Product>[] = [
    {
      label: 'Produit',
      path: 'name',
      isSortable: true,
    },
    {
      label: 'Prix',
      path: 'price',
      isSortable: true,
      align: 'right',
      render: (value: unknown) => (
        <span className="font-semibold">€{(value as number).toFixed(2)}</span>
      )
    },
    {
      label: 'Stock',
      path: 'stock',
      isSortable: true,
      align: 'center',
      render: (value: unknown) => (
        <span className={(value as number) === 0 ? 'text-red-500 font-medium' : 'text-green-600'}>
          {value as number} unités
        </span>
      )
    },
    {
      label: 'Catégorie',
      path: 'category',
      isSortable: true,
    }
  ]

  // Fonction getData pour les produits
  const getProductData = async (
    sortColumns: SortColumn[],
    startRow: number,
    pageSize: number
  ) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100))

    const data = [...sampleProducts]

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        for (const sort of sortColumns) {
          // Fonction utilitaire pour obtenir une valeur par son chemin
          const getValueByPath = (obj: Record<string, unknown>, path: string): unknown => {
            return path.split('.').reduce((current: unknown, key: string) => {
              if (current && typeof current === 'object' && key in current) {
                return (current as Record<string, unknown>)[key]
              }
              return undefined
            }, obj)
          }

          const aValue = getValueByPath(a as Record<string, unknown>, sort.path)
          const bValue = getValueByPath(b as Record<string, unknown>, sort.path)

          let comparison = 0

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue)
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue
          } else {
            const aStr = String(aValue ?? '')
            const bStr = String(bValue ?? '')
            comparison = aStr.localeCompare(bStr)
          }

          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    // Appliquer la pagination
    const paginatedData = data.slice(startRow, startRow + pageSize)

    return {
      data: paginatedData,
      totalCount: data.length,
      lastRow: startRow + paginatedData.length - 1
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Démonstration des icônes personnalisées :</p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Toutes les colonnes :</strong> Icônes TrendingUp/TrendingDown en vert/rouge</li>
          <li>• <strong>Configuration globale :</strong> Une seule configuration pour tout le tableau</li>
        </ul>
      </div>

      <DataTable
        schema={ProductSchema}
        columns={productColumns}
        getData={getProductData}
        onRowSelect={setSelectedProduct}
        selectedRow={selectedProduct}
        pageSize={6}
        paginationMode="None"
        sortIcons={{
          default: MoreHorizontal,
          asc: TrendingUp,
          desc: TrendingDown,
          classNames: {
            default: "h-4 w-4 text-gray-400",
            asc: "h-4 w-4 text-green-600 font-bold",
            desc: "h-4 w-4 text-red-600 font-bold"
          }
        }}
      />

      {selectedProduct && (
        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <strong>Sélectionné :</strong> {selectedProduct.name} - €{selectedProduct.price} ({selectedProduct.stock} en stock)
        </div>
      )}
    </div>
  )
}
