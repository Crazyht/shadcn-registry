import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable, DataTableColumn } from './data-table'
import { z } from 'zod'
import '@testing-library/jest-dom'

// Schéma de test
const TestSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
})

type TestData = z.infer<typeof TestSchema>

// Données de test
const testData: TestData[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', status: 'active' },
  { id: 2, name: 'Bob', email: 'bob@test.com', status: 'inactive' },
  { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'active' },
]

// Configuration des colonnes de test
const testColumns: DataTableColumn<TestData>[] = [
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
const createMockResponse = (data: TestData[], startRow = 0, pageSize = 50) => ({
  data: data.slice(startRow, startRow + pageSize),
  totalCount: data.length,
  lastRow: Math.min(startRow + pageSize - 1, data.length - 1)
})

describe('DataTable', () => {
  it('renders with default props', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
      />
    )

    // Attendre que les données se chargent
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    // Vérifier les en-têtes
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Statut')).toBeInTheDocument()

    // Vérifier les données
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    const getData = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(createMockResponse(testData)), 1000))
    )

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
        loadingMessage="Chargement des données..."
      />
    )

    expect(screen.getByText('Chargement des données...')).toBeInTheDocument()
  })

  it('displays empty message when no data', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse([]))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
        emptyMessage="Aucune donnée trouvée"
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Aucune donnée trouvée')).toBeInTheDocument()
    })
  })

  it('handles validation errors', async () => {
    const invalidData = [
      { id: 'invalid', name: 'Alice', email: 'invalid-email', status: 'unknown' }
    ]
    const getData = vi.fn().mockResolvedValue({
      data: invalidData,
      totalCount: 1,
      lastRow: 0
    })

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/Erreur de validation/)).toBeInTheDocument()
    })
  })

  it('handles sorting', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    // Cliquer sur l'en-tête "Nom" pour trier
    const nameHeader = screen.getByText('Nom').closest('th')
    expect(nameHeader).toBeInTheDocument()

    fireEvent.click(nameHeader!)

    // Vérifier que getData a été appelé avec les paramètres de tri
    await waitFor(() => {
      expect(getData).toHaveBeenCalledWith([{ path: 'name', direction: 'asc' }], 0, 50, undefined, [])
    })
  })

  it('handles row selection', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))
    const onRowSelect = vi.fn()

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
        onRowSelect={onRowSelect}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    // Cliquer sur la première ligne
    const firstRow = screen.getByText('Alice').closest('tr')
    fireEvent.click(firstRow!)

    expect(onRowSelect).toHaveBeenCalledWith(testData[0])
  })
  it('renders custom cell content', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
      />
    )

    await waitFor(() => {
      // Vérifier que le rendu personnalisé du statut fonctionne
      expect(screen.getAllByText('✓')).toHaveLength(2) // status 'active' pour Alice et Charlie
      expect(screen.getAllByText('✗')).toHaveLength(1) // status 'inactive' pour Bob
    })
  })

  it('applies column alignment', async () => {
    const columnsWithAlignment: DataTableColumn<TestData>[] = [
      { label: 'ID', path: 'id', align: 'center' },
      { label: 'Nom', path: 'name', align: 'left' },
      { label: 'Email', path: 'email', align: 'right' },
    ]

    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={columnsWithAlignment}
        getData={getData}
      />
    )

    await waitFor(() => {
      const headers = screen.getAllByRole('columnheader')
      expect(headers[0]).toHaveClass('text-center')
      expect(headers[2]).toHaveClass('text-right')
    })
  })

  it('ignores sorting on non-sortable columns', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    // Réinitialiser le mock
    getData.mockClear()

    // Cliquer sur l'en-tête "Email" (non triable)
    const emailHeader = screen.getByText('Email').closest('th')
    fireEvent.click(emailHeader!)

    // Vérifier que getData n'a pas été appelé à nouveau
    expect(getData).not.toHaveBeenCalled()
  })
  it('highlights selected row', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
        selectedRow={testData[0]}
        rowKey="id"
        onRowSelect={vi.fn()}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    // Vérifier que la ligne Alice est mise en surbrillance
    const selectedRow = screen.getByText('Alice').closest('tr')
    expect(selectedRow).toHaveClass('bg-muted')
  })

  it('handles nested object paths', async () => {
    const NestedSchema = z.object({
      id: z.number(),
      user: z.object({
        profile: z.object({
          name: z.string()
        })
      })
    })

    const nestedData = [
      { id: 1, user: { profile: { name: 'John Doe' } } }
    ]

    const nestedColumns: DataTableColumn<z.infer<typeof NestedSchema>>[] = [
      { label: 'ID', path: 'id' },
      { label: 'Nom', path: 'user.profile.name' },
    ]

    const getData = vi.fn().mockResolvedValue({
      data: nestedData,
      totalCount: nestedData.length,
      lastRow: 0
    })

    render(
      <DataTable
        schema={NestedSchema}
        columns={nestedColumns}
        getData={getData}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('handles getData function that returns Promise', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
      />
    )

    expect(getData).toHaveBeenCalledWith([], 0, 50, undefined, [])

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })
  })

  it('handles getData function that returns data directly', async () => {
    const getData = vi.fn().mockReturnValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns}
        getData={getData}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })
  })

  describe('Pagination Info Display', () => {
    it('shows pagination info by default', async () => {
      // Créer plus de données pour forcer la pagination
      const moreData = [...testData, ...testData] // 6 items total
      const getData = vi.fn().mockResolvedValue(createMockResponse(moreData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="Pagination"
          pageSize={3} // Forcer 2 pages
        />
      )

      await waitFor(() => {
        expect(screen.getAllByText('Alice')[0]).toBeInTheDocument()
      })

      // Vérifier que les informations de pagination sont affichées
      expect(screen.getByText('Affichage de 1 à 3 sur 6 éléments')).toBeInTheDocument()
    })

    it('hides pagination info when showPaginationInfo is false', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="Pagination"
          showPaginationInfo={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      expect(screen.queryByText((content) => {
        return content.includes('Affichage de') && content.includes('éléments')
      })).not.toBeInTheDocument()
    })

    it('shows correct pagination info text format', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="Pagination"
          pageSize={2}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Affichage de 1 à 2 sur 3 éléments')).toBeInTheDocument()
      })
    })
  })

  describe('Single Page Pagination', () => {
    it('hides pagination controls when only one page by default', async () => {
      const singlePageData = [testData[0]] // Only one item
      const getData = vi.fn().mockResolvedValue(createMockResponse(singlePageData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="Pagination"
          pageSize={10}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Pagination controls should not be visible
      expect(screen.queryByRole('navigation', { name: 'pagination' })).not.toBeInTheDocument()
    })

    it('shows pagination controls for single page when showSinglePagePagination is true', async () => {
      const singlePageData = [testData[0]] // Only one item
      const getData = vi.fn().mockResolvedValue(createMockResponse(singlePageData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="Pagination"
          pageSize={10}
          showSinglePagePagination={true}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Pagination controls should be visible even with one page
      expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument()
      // Vérifier qu'il y a un lien de pagination pour la page 1
      expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument()
    })

    it('always shows pagination for multiple pages regardless of showSinglePagePagination', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="Pagination"
          pageSize={2} // This will create multiple pages
          showSinglePagePagination={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Pagination controls should be visible for multiple pages
      expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument()
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument()
    })
  })

  describe('Combined Pagination Features', () => {
    it('works correctly with both showPaginationInfo=false and showSinglePagePagination=true', async () => {
      const singlePageData = [testData[0]]
      const getData = vi.fn().mockResolvedValue(createMockResponse(singlePageData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="Pagination"
          pageSize={10}
          showPaginationInfo={false}
          showSinglePagePagination={true}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Pagination info should be hidden
      expect(screen.queryByText((content) => {
        return content.includes('Affichage de') && content.includes('éléments')
      })).not.toBeInTheDocument()

      // But pagination controls should be visible
      expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument()
    })

    it('respects pagination features in PaginationWithSize mode', async () => {
      // Créer plus de données pour que la pagination soit nécessaire
      const moreData = [...testData, ...testData, ...testData] // 9 items total
      const getData = vi.fn().mockResolvedValue(createMockResponse(moreData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="PaginationWithSize"
          showPaginationInfo={false}
          pageSize={5}
        />
      )

      await waitFor(() => {
        // Utiliser getAllByText pour gérer les multiples Alice
        expect(screen.getAllByText('Alice')[0]).toBeInTheDocument()
      })

      // Pagination navigation should be visible in PaginationWithSize mode
      expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument()

      // Pagination info should be hidden
      expect(screen.queryByText((content) => {
        return content.includes('Affichage de') && content.includes('éléments')
      })).not.toBeInTheDocument()
    })

    it('does not show pagination controls in None mode regardless of settings', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="None"
          showSinglePagePagination={true}
          showPaginationInfo={true}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // No pagination should be shown in None mode
      expect(screen.queryByRole('navigation', { name: 'pagination' })).not.toBeInTheDocument()
      expect(screen.queryByText((content) => {
        return content.includes('Affichage de') && content.includes('éléments')
      })).not.toBeInTheDocument()
    })
  })

  // Tests pour le grouping
  describe('Grouping functionality', () => {
    const groupedTestData: TestData[] = [
      { id: 1, name: 'Alice', email: 'alice@test.com', status: 'active' },
      { id: 2, name: 'Bob', email: 'bob@test.com', status: 'inactive' },
      { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'active' },
      { id: 4, name: 'David', email: 'david@test.com', status: 'inactive' },
      { id: 5, name: 'Eve', email: 'eve@test.com', status: 'active' },
    ]

    it('groups data by specified column', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{ path: 'status' }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
        expect(screen.getByText(/inactive \(2 éléments\)/)).toBeInTheDocument()
      })

      // Vérifier que les données groupées sont visibles (expanded par défaut)
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
      expect(screen.getByText('Charlie')).toBeInTheDocument()
    })

    it('allows collapsing and expanding groups', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{ path: 'status' }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
      })

      // Cliquer sur l'en-tête du groupe active pour le replier
      fireEvent.click(screen.getByText(/active \(3 éléments\)/))

      // Alice ne devrait plus être visible dans ce groupe replié
      await waitFor(() => {
        expect(screen.queryByText('Alice')).not.toBeInTheDocument()
      })

      // Mais le groupe inactive devrait toujours être visible
      expect(screen.getByText('Bob')).toBeInTheDocument()

      // Cliquer à nouveau pour déplier
      fireEvent.click(screen.getByText(/active \(3 éléments\)/))

      // Alice devrait réapparaître
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })
    })

    it('supports custom group header rendering', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))
      const customRenderGroupHeader = vi.fn((groupValue, count) => (
        <div>Custom: {String(groupValue)} - {count} items</div>
      ))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{
            path: 'status',
            renderGroupHeader: customRenderGroupHeader
          }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Custom: active - 3 items')).toBeInTheDocument()
        expect(screen.getByText('Custom: inactive - 2 items')).toBeInTheDocument()
      })

      expect(customRenderGroupHeader).toHaveBeenCalledWith('active', 3, true)
      expect(customRenderGroupHeader).toHaveBeenCalledWith('inactive', 2, true)
    })

    it('respects defaultExpanded setting', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{
            path: 'status',
            defaultExpanded: false
          }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
      })

      // Les groupes devraient être repliés par défaut, donc Alice ne devrait pas être visible
      expect(screen.queryByText('Alice')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    })

    it('handles non-expandable groups', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{
            path: 'status',
            expandable: false
          }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
      })

      // Les données devraient être visibles (pas d'expansion/collapse)
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()

      // Cliquer sur l'en-tête ne devrait rien faire
      fireEvent.click(screen.getByText(/active \(3 éléments\)/))

      // Alice devrait toujours être visible
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    it('uses server-provided groups when available', async () => {
      const mockGroups = [
        {
          groupValue: 'active',
          count: 3,
          items: [
            { id: 1, name: 'Alice', email: 'alice@test.com', status: 'active' },
            { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'active' },
            { id: 5, name: 'Eve', email: 'eve@test.com', status: 'active' },
          ],
          isExpanded: true
        },
        {
          groupValue: 'inactive',
          count: 2,
          items: [
            { id: 2, name: 'Bob', email: 'bob@test.com', status: 'inactive' },
            { id: 4, name: 'David', email: 'david@test.com', status: 'inactive' },
          ],
          isExpanded: true
        }
      ]

      const getData = vi.fn().mockResolvedValue({
        data: groupedTestData,
        totalCount: 5,
        lastRow: 4,
        groups: mockGroups
      })

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{ path: 'status' }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
        expect(screen.getByText(/inactive \(2 éléments\)/)).toBeInTheDocument()
      })

      // Vérifier que les groupes du serveur sont utilisés
      expect(getData).toHaveBeenCalledWith([], 0, 50, { path: 'status' }, [])
    })

    it('handles special group values correctly', async () => {
      // Créer des données avec une valeur spéciale pour tester le grouping
      const dataWithSpecialValues: TestData[] = [
        { id: 1, name: 'Alice', email: 'alice@test.com', status: 'active' },
        { id: 2, name: 'Bob', email: 'bob@test.com', status: 'inactive' },
        { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'active' },
      ]

      // Mock getData pour retourner des groupes avec une valeur null simulée
      const mockGroups = [
        {
          groupValue: 'active',
          count: 2,
          items: [
            { id: 1, name: 'Alice', email: 'alice@test.com', status: 'active' },
            { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'active' },
          ],
          isExpanded: true
        },
        {
          groupValue: null, // Simuler une valeur null
          count: 1,
          items: [
            { id: 2, name: 'Bob', email: 'bob@test.com', status: 'inactive' },
          ],
          isExpanded: true
        }
      ]

      const getData = vi.fn().mockResolvedValue({
        data: dataWithSpecialValues,
        totalCount: 3,
        lastRow: 2,
        groups: mockGroups
      })

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{ path: 'status' }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/Non défini \(1 élément\)/)).toBeInTheDocument()
        expect(screen.getByText(/active \(2 éléments\)/)).toBeInTheDocument()
      })
    })

    it('works with row selection in grouped mode', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))
      const onRowSelect = vi.fn()

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{ path: 'status' }}
          onRowSelect={onRowSelect}
          rowKey="id"
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Cliquer on une ligne dans un groupe
      fireEvent.click(screen.getByText('Alice'))

      expect(onRowSelect).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Alice', id: 1 })
      )
    })

    it('passes grouping parameter to getData function', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))
      const groupingConfig = { path: 'status', defaultExpanded: false }

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={groupingConfig}
        />
      )

      await waitFor(() => {
        expect(getData).toHaveBeenCalledWith([], 0, 50, groupingConfig, [])
      })
    })

    // Tests pour le mode accordéon
    describe('Accordion mode', () => {
    it('allows only one group to be open at a time in accordion mode', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{
            path: 'status',
            accordion: true,
            defaultExpanded: true // Premier groupe ouvert par défaut
          }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
        expect(screen.getByText(/inactive \(2 éléments\)/)).toBeInTheDocument()
      })

      // Vérifier que seul le premier groupe (active) est ouvert par défaut
      expect(screen.getByText('Alice')).toBeInTheDocument() // Dans le groupe active
      expect(screen.queryByText('Bob')).not.toBeInTheDocument() // Dans le groupe inactive, fermé

      // Cliquer sur le groupe inactive pour l'ouvrir
      fireEvent.click(screen.getByText(/inactive \(2 éléments\)/))

      await waitFor(() => {
        // Le groupe inactive devrait maintenant être ouvert
        expect(screen.getByText('Bob')).toBeInTheDocument()
        // Le groupe active devrait être fermé automatiquement
        expect(screen.queryByText('Alice')).not.toBeInTheDocument()
      })
    })

    it('works correctly with defaultExpanded false in accordion mode', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{
            path: 'status',
            accordion: true,
            defaultExpanded: false // Tous fermés par défaut
          }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
        expect(screen.getByText(/inactive \(2 éléments\)/)).toBeInTheDocument()
      })

      // Tous les groupes devraient être fermés
      expect(screen.queryByText('Alice')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob')).not.toBeInTheDocument()

      // Ouvrir le premier groupe
      fireEvent.click(screen.getByText(/active \(3 éléments\)/))

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Ouvrir le deuxième groupe - le premier devrait se fermer
      fireEvent.click(screen.getByText(/inactive \(2 éléments\)/))

      await waitFor(() => {
        expect(screen.getByText('Bob')).toBeInTheDocument()
        expect(screen.queryByText('Alice')).not.toBeInTheDocument()
      })
    })

    it('behaves normally when accordion is false', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(groupedTestData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{
            path: 'status',
            accordion: false // Mode normal
          }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
        expect(screen.getByText(/inactive \(2 éléments\)/)).toBeInTheDocument()
      })

      // Tous les groupes devraient être ouverts par défaut
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()

      // Fermer le premier groupe
      fireEvent.click(screen.getByText(/active \(3 éléments\)/))

      await waitFor(() => {
        expect(screen.queryByText('Alice')).not.toBeInTheDocument()
      })

      // Le deuxième groupe devrait rester ouvert (mode normal)
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })

    it('handles accordion mode with client-side grouping', async () => {
      const getData = vi.fn().mockResolvedValue({
        data: groupedTestData,
        totalCount: 5,
        lastRow: 4
        // Pas de groups - forcer le grouping côté client
      })

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          grouping={{
            path: 'status',
            accordion: true
          }}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/active \(3 éléments\)/)).toBeInTheDocument()
        expect(screen.getByText(/inactive \(2 éléments\)/)).toBeInTheDocument()
      })

      // Vérifier le comportement accordéon avec grouping côté client
      // Premier groupe ouvert par défaut
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.queryByText('Bob')).not.toBeInTheDocument()

      // Ouvrir le deuxième groupe
      fireEvent.click(screen.getByText(/inactive \(2 éléments\)/))

      await waitFor(() => {
        expect(screen.getByText('Bob')).toBeInTheDocument()
        expect(screen.queryByText('Alice')).not.toBeInTheDocument()
      })
    })
    })

    // Tests pour les icônes de tri personnalisées
    describe('Custom Sort Icons', () => {
      const TestIcon = ({ className }: { className?: string }) => (
        <span className={className} data-testid="custom-icon">⭐</span>
      )

      const columnsForCustomIcons: DataTableColumn<TestData>[] = [
        {
          label: 'Name',
          path: 'name',
          isSortable: true
        }
      ]

      it('uses custom icons when provided at DataTable level', async () => {
        const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

        render(
          <DataTable
            schema={TestSchema}
            columns={columnsForCustomIcons}
            getData={getData}
            sortIcons={{
              default: TestIcon,
              asc: TestIcon,
              desc: TestIcon,
              classNames: {
                default: 'custom-default',
                asc: 'custom-asc',
                desc: 'custom-desc'
              }
            }}
          />
        )

        await waitFor(() => {
          expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
        })

        // Vérifier que l'icône par défaut a les bonnes classes
        const icon = screen.getByTestId('custom-icon')
        expect(icon).toHaveClass('custom-default')
      })

      it('applies custom classes for sort states', async () => {
        const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

        render(
          <DataTable
            schema={TestSchema}
            columns={columnsForCustomIcons}
            getData={getData}
            sortIcons={{
              default: TestIcon,
              asc: TestIcon,
              desc: TestIcon,
              classNames: {
                default: 'custom-default',
                asc: 'custom-asc',
                desc: 'custom-desc'
              }
            }}
          />
        )

        await waitFor(() => {
          expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
        })

        // Cliquer pour trier en mode croissant
        fireEvent.click(screen.getByText('Name'))

        await waitFor(() => {
          const icon = screen.getByTestId('custom-icon')
          expect(icon).toHaveClass('custom-asc')
        })

        // Cliquer à nouveau pour trier en mode décroissant
        fireEvent.click(screen.getByText('Name'))

        await waitFor(() => {
          const icon = screen.getByTestId('custom-icon')
          expect(icon).toHaveClass('custom-desc')
        })
      })

      it('falls back to default icons when custom icons are not provided', async () => {
        const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

        render(
          <DataTable
            schema={TestSchema}
            columns={columnsForCustomIcons}
            getData={getData}
            sortIcons={{
              asc: TestIcon, // Seulement asc défini
              classNames: {
                asc: 'custom-asc'
              }
            }}
          />
        )

        await waitFor(() => {
          // L'icône par défaut devrait être le ChevronsUpDown standard
          expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument()
        })

        // Cliquer pour activer le tri croissant
        fireEvent.click(screen.getByText('Name'))

        await waitFor(() => {
          // Maintenant on devrait voir l'icône personnalisée
          expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
          expect(screen.getByTestId('custom-icon')).toHaveClass('custom-asc')
        })
      })
    })

    // Tests pour les fonctionnalités de filtrage
    describe('Column Filtering', () => {
      const testData: TestData[] = [
        { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
        { id: 2, name: 'Bob', email: 'bob@example.com', status: 'inactive' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com', status: 'active' }
      ]

      const filterableColumns: DataTableColumn<TestData>[] = [
        {
          label: 'Name',
          path: 'name',
          isFilterable: true
        },
        {
          label: 'Status',
          path: 'status',
          isFilterable: true
        }
      ]

      it('shows filter icons for filterable columns', async () => {
        const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

        render(
          <DataTable
            schema={TestSchema}
            columns={filterableColumns}
            getData={getData}
          />
        )

        await waitFor(() => {
          // Vérifier que les icônes de filtre sont présentes
          expect(screen.getAllByRole('button')).toHaveLength(2) // 2 colonnes filtrables
        })
      })

      it('calls getData with filters when filter is applied', async () => {
        const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

        render(
          <DataTable
            schema={TestSchema}
            columns={filterableColumns}
            getData={getData}
          />
        )

        await waitFor(() => {
          expect(screen.getByText('Name')).toBeInTheDocument()
        })

        // Cliquer sur l'icône de filtre de la colonne Name
        const filterButtons = screen.getAllByRole('button')
        fireEvent.click(filterButtons[0])

        // Attendre que la popover s'ouvre et saisir du texte
        await waitFor(() => {
          const input = screen.getByPlaceholderText(/saisir/i)
          expect(input).toBeInTheDocument()

          fireEvent.change(input, { target: { value: 'Alice' } })
        })

        // Cliquer sur le bouton Filtrer
        const filterButton = screen.getByText('Filtrer')
        fireEvent.click(filterButton)

        await waitFor(() => {
          // Vérifier que getData a été appelé avec les filtres
          expect(getData).toHaveBeenCalledWith(
            [], // sortColumns
            0,  // startRow
            50, // pageSize
            undefined, // grouping
            [{ path: 'name', value: 'Alice' }] // filters
          )
        })
      })

      it('shows active filter icon when filter is applied', async () => {
        const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

        render(
          <DataTable
            schema={TestSchema}
            columns={filterableColumns}
            getData={getData}
            filterIcons={{
              active: ({ className }) => <span className={className} data-testid="active-filter">X</span>
            }}
          />
        )

        await waitFor(() => {
          expect(screen.getByText('Name')).toBeInTheDocument()
        })

        // Appliquer un filtre
        const filterButtons = screen.getAllByRole('button')
        fireEvent.click(filterButtons[0])

        await waitFor(() => {
          const input = screen.getByPlaceholderText(/saisir/i)
          fireEvent.change(input, { target: { value: 'Alice' } })
        })

        fireEvent.click(screen.getByText('Filtrer'))

        await waitFor(() => {
          // Vérifier que l'icône active est affichée
          expect(screen.getByTestId('active-filter')).toBeInTheDocument()
        })
      })

      it('clears filter when clear button is clicked', async () => {
        const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

        render(
          <DataTable
            schema={TestSchema}
            columns={filterableColumns}
            getData={getData}
          />
        )

        await waitFor(() => {
          expect(screen.getByText('Name')).toBeInTheDocument()
        })

        // Appliquer un filtre
        const filterButtons = screen.getAllByRole('button')
        fireEvent.click(filterButtons[0])

        await waitFor(() => {
          const input = screen.getByPlaceholderText(/saisir/i)
          fireEvent.change(input, { target: { value: 'Alice' } })
        })

        fireEvent.click(screen.getByText('Filtrer'))

        // Attendre que les données se rechargent après application du filtre
        await waitFor(() => {
          expect(screen.getByText('Alice')).toBeInTheDocument()
        })

        // Réouvrir la popover et cliquer sur Effacer
        const updatedFilterButtons = screen.getAllByRole('button')
        fireEvent.click(updatedFilterButtons[0])

        await waitFor(() => {
          const clearButton = screen.getByRole('button', { name: /effacer/i })
          fireEvent.click(clearButton)
        })

      await waitFor(() => {
        // Vérifier que getData a été appelé sans filtres
        expect(getData).toHaveBeenLastCalledWith(
          [], // sortColumns
          0,  // startRow
          50, // pageSize
          undefined, // grouping
          [] // filters vides
        )
      })
    })
  })
  })
})
