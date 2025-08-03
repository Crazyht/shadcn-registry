import { DataTable, SortColumn, DataTableGrouping, ColumnFilter,DataTableResponse } from '../data-table'
import { defineColumn } from '../data-table-types'
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
    { id: 3, name: 'Claire Bernard', email: 'claire.bernard@example.com', status: 'inactive', role: 'Moderator', joinedAt: '2024-01-10' },
    { id: 4, name: 'David Moreau', email: 'david.moreau@example.com', status: 'active', role: 'User', joinedAt: '2024-03-05' },
    { id: 5, name: 'Emma Durand', email: 'emma.durand@example.com', status: 'inactive', role: 'Admin', joinedAt: '2024-01-25' },
  ]

  const userColumn = defineColumn<User, typeof UserSchema>(UserSchema)
  // Configuration des colonnes
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
  }),
  userColumn('role', {
    label: 'Rôle',
    isSortable: true,
    align: 'center',
  }),
  userColumn('joinedAt', {
    label: 'Date d\'inscription',
    isSortable: true,
  }),
  ]

  // Fonction getData pour récupérer les données
  const getData = async (sortColumns: SortColumn<User>[], startRow: number, pageSize: number, _grouping?: DataTableGrouping<User>, _filters?: ColumnFilter<User>[]):Promise<DataTableResponse<User>> => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300))

    const data = [...sampleUsers]

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = (a as User)[sort.path as keyof User]
          const bValue = (b as User)[sort.path as keyof User]

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
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Utilisation de base :</p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Tri :</strong> Clic simple = tri unique | Ctrl/Shift + Clic = tri multi-colonnes</li>
          <li>• <strong>Sélection :</strong> Cliquez sur une ligne pour la sélectionner</li>
          <li>• <strong>Pagination :</strong> Navigation classique avec contrôles de taille</li>
        </ul>
      </div>

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
          emptyMessage: "Aucun utilisateur trouvé"
        }}
      />

      {selectedUser && (
        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <strong>Utilisateur sélectionné :</strong> {selectedUser.name} ({selectedUser.email}) - {selectedUser.role}
        </div>
      )}
    </div>
  )
}
