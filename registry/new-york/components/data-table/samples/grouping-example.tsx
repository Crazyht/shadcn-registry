import { DataTable, DataTableColumn, SortColumn, ColumnFilter } from '../data-table'
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
