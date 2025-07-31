import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable } from '../data-table'
import '@testing-library/jest-dom'
import { TestSchema, testColumns, groupedTestData, createMockResponse } from './shared/test-setup'

describe('DataTable - Grouping Functionality', () => {
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
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('handles special group values correctly', async () => {
    // Créer des données avec une valeur spéciale pour tester le grouping
    const dataWithSpecialValues = [
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
})
