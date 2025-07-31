import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable, DataTableColumn } from '../data-table'
import '@testing-library/jest-dom'
import { TestSchema, TestData, testData, createMockResponse } from './shared/test-setup'

describe('DataTable - Column Filtering', () => {
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
      expect(getData).toHaveBeenCalledWith(
        [], // sortColumns
        0,  // startRow
        50, // pageSize
        undefined, // grouping
        [{ path: 'name', value: 'Alice' }] // filters
      )
    })
  })

  it('shows custom filter icons when provided', async () => {
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
