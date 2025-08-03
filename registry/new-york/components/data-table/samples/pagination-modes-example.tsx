import { DataTable, SortColumn, PaginationMode } from '../data-table'
import { defineColumn } from '../data-table-types'
import { z } from 'zod'
import { useState } from 'react'

// Schéma utilisateur
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
  role: z.string(),
  joinedAt: z.string(),
})

type User = z.infer<typeof UserSchema>

export function PaginationModesExample() {
  const [currentMode, setCurrentMode] = useState<PaginationMode>('PaginationWithSize')

  // Génération d'utilisateurs d'exemple
  const generateUsers = (count: number): User[] => {
    const firstNames = ['Alice', 'Bob', 'Claire', 'David', 'Emma', 'François', 'Gabrielle', 'Henri', 'Isabelle', 'Jacques']
    const lastNames = ['Martin', 'Dupont', 'Bernard', 'Moreau', 'Durand', 'Leroy', 'Simon', 'Michel', 'Garcia', 'Roux']
    const roles = ['Admin', 'User', 'Moderator', 'Guest']
    const statuses: ('active' | 'inactive')[] = ['active', 'inactive']

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      email: `user${i + 1}@example.com`,
      status: statuses[i % 2],
      role: roles[i % roles.length],
      joinedAt: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    }))
  }

  const sampleUsers = generateUsers(50)

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
      isSortable: true,
    }),
    userColumn('email', {
      label: 'Email',
      isSortable: true,
    }),
    userColumn('status', {
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
    userColumn('role', {
      label: 'Rôle',
      isSortable: true,
      align: 'center',
    }),
  ]

  // Fonction getData commune
  const getData = async (sortColumns: SortColumn<User>[], startRow: number, pageSize: number) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300))

    const data = [...sampleUsers]

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = a[sort.path as keyof User]
          const bValue = b[sort.path as keyof User]

          let comparison = 0
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue)
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue
          }

          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    // Pour InfiniteScroll, on retourne en mode append
    if (currentMode === 'InfiniteScroll') {
      const pageData = data.slice(startRow, startRow + pageSize)
      return {
        data: pageData,
        totalCount: data.length,
        lastRow: Math.min(startRow + pageSize - 1, data.length - 1)
      }
    }

    // Pour les autres modes
    const pageData = data.slice(startRow, startRow + pageSize)
    return {
      data: pageData,
      totalCount: data.length,
      lastRow: startRow + pageData.length - 1
    }
  }

  const modes = [
    { value: 'None', label: 'Aucune pagination', description: 'Toutes les données' },
    { value: 'InfiniteScroll', label: 'Scroll infini', description: 'Chargement automatique' },
    { value: 'Pagination', label: 'Pagination simple', description: 'Navigation basique' },
    { value: 'PaginationWithSize', label: 'Pagination complète', description: 'Navigation + taille de page' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Modes de Pagination</h3>
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
            onClick={() => setCurrentMode(mode.value as PaginationMode)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              currentMode === mode.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-border'
            }`}
          >
            <div className="font-medium">{mode.label}</div>
            <div className="text-xs opacity-80">{mode.description}</div>
          </button>
        ))}
      </div>

      {/* Description du mode actuel */}
      <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Mode actuel : <strong>{modes.find(m => m.value === currentMode)?.label}</strong>
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
          {currentMode === 'None' && 'Affiche toutes les données en une fois sans pagination.'}
          {currentMode === 'InfiniteScroll' && 'Charge plus de données automatiquement en scrollant vers le bas.'}
          {currentMode === 'Pagination' && 'Navigation par pages avec contrôles précédent/suivant.'}
          {currentMode === 'PaginationWithSize' && 'Navigation complète avec sélecteur de taille de page.'}
        </p>
      </div>

      <div className="border rounded-lg">
        <DataTable
          key={currentMode} // Force re-render when mode changes
          schema={UserSchema}
          columns={columns}
          getData={getData}
          paginationMode={currentMode}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          messages={{
            emptyMessage: "Aucun utilisateur trouvé",
            loadingMessage: "Chargement des utilisateurs..."
          }}
          showLoadMoreButton={true}
        />
      </div>
    </div>
  )
}
