// Utilitaires partagés pour les tests DataTable
import { z } from 'zod'
import { DataTableColumn } from '../../data-table'

// Schéma de test
export const TestSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
})

export type TestData = z.infer<typeof TestSchema>

// Données de test
export const testData: TestData[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', status: 'active' },
  { id: 2, name: 'Bob', email: 'bob@test.com', status: 'inactive' },
  { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'active' },
]

// Configuration des colonnes de test
export const testColumns: DataTableColumn<TestData>[] = [
  { label: 'ID', path: 'id', isSortable: true },
  { label: 'Nom', path: 'name', isSortable: true },
  { label: 'Email', path: 'email', isSortable: false },
  {
    label: 'Statut',
    path: 'status',
    isSortable: true,
    render: (value: unknown) => value === 'active' ? '✓' : '✗'
  },
]

// Fonction d'assistance pour créer une réponse mock avec pagination
export const createMockResponse = (data: TestData[], startRow = 0, pageSize = 50) => ({
  data: data.slice(startRow, startRow + pageSize),
  totalCount: data.length,
  lastRow: Math.min(startRow + pageSize - 1, data.length - 1)
})

// Données pour les tests de groupement
export const groupedTestData: TestData[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', status: 'active' },
  { id: 2, name: 'Bob', email: 'bob@test.com', status: 'inactive' },
  { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'active' },
  { id: 4, name: 'David', email: 'david@test.com', status: 'inactive' },
  { id: 5, name: 'Eve', email: 'eve@test.com', status: 'active' },
]
