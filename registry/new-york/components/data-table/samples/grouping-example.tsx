import { DataTable, SortColumn, ColumnFilter, DataTableResponse, DataTableGrouping } from '../data-table'
import { defineColumn } from '../data-table-types'
import { z } from 'zod'
import { useState } from 'react'

// Schéma employé
const EmployeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  status: z.enum(['active', 'inactive']),
  joinedAt: z.string(),
})

type Employee = z.infer<typeof EmployeeSchema>

export function GroupingExample() {
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
  const employeeColumn = defineColumn<Employee, typeof EmployeeSchema>(EmployeeSchema)
  const employeeColumns = [
    employeeColumn('id', { label: 'ID', isSortable: true, width: '80px' }),
    employeeColumn('name', { label: 'Nom', isSortable: true }),
    employeeColumn('email', { label: 'Email', isSortable: false }),
    employeeColumn('status', {
      label: 'Statut',
      isSortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      )
    }),
    employeeColumn('joinedAt', { label: 'Date d\'embauche', isSortable: true }),
  ]

  // Fonction getData pour les employés avec support du grouping
  const getEmployeeData = async (
    sortColumns: SortColumn<Employee>[],
    startRow: number,
    pageSize: number,
    _grouping?: DataTableGrouping<Employee>,
    filters?: ColumnFilter<Employee>[]
  ): Promise<DataTableResponse<Employee>> => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100))

    let data = [...sampleEmployees]

    // Appliquer les filtres
    if (filters && filters.length > 0) {
      data = data.filter(item => {
        return filters.every(filter => {
          const value = item[filter.path as keyof Employee]
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

            case 'greater_than':
              return Number(value) > Number((filterValue as Record<string, unknown>).value)

            case 'greater_or_equal':
              return Number(value) >= Number((filterValue as Record<string, unknown>).value)

            case 'less_than':
              return Number(value) < Number((filterValue as Record<string, unknown>).value)

            case 'less_or_equal':
              return Number(value) <= Number((filterValue as Record<string, unknown>).value)

            case 'between': {
              const numValue = Number(value)
              const min = Number((filterValue as Record<string, unknown>).value)
              const max = Number((filterValue as Record<string, unknown>).value2)
              return numValue >= min && numValue <= max
            }

            case 'in':
              return Array.isArray((filterValue as Record<string, unknown>).values) &&
                     ((filterValue as Record<string, unknown>).values as unknown[]).includes(value)

            case 'not_in':
              return !(Array.isArray((filterValue as Record<string, unknown>).values) &&
                      ((filterValue as Record<string, unknown>).values as unknown[]).includes(value))

            case 'is_null':
              return value === null || value === undefined

            case 'is_not_null':
              return value !== null && value !== undefined

            default:
              return true
          }
        })
      })
    }

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = a[sort.path as keyof Employee]
          const bValue = b[sort.path as keyof Employee]

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
