import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DataTable } from '../data-table'
import '@testing-library/jest-dom'
import { z } from 'zod'
import { TestSchema, testColumns, testData, createMockResponse } from './shared/test-setup'
import { defaultTestMessages } from './shared/test-messages'

describe('DataTable - Basic Functionality', () => {
  it('renders with default props', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns as never}
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
        columns={testColumns as never}
        getData={getData}
        messages={{
          loadingMessage: "Chargement des données..."
        }}
      />
    )

    expect(screen.getByText('Chargement des données...')).toBeInTheDocument()
  })

  it('displays empty message when no data', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse([]))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns as never}
        getData={getData}
        messages={{
          emptyMessage: "Aucune donnée trouvée"
        }}
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
        columns={testColumns as never}
        getData={getData}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/Erreur de validation/)).toBeInTheDocument()
    })
  })

  it('handles getData function that returns Promise', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns as never}
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
        columns={testColumns as never}
        getData={getData}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })
  })

  it('renders custom cell content', async () => {
    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={testColumns as never}
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
    const columnsWithAlignment = [
      { label: 'ID', path: 'id', align: 'center' as const },
      { label: 'Nom', path: 'name', align: 'left' as const },
      { label: 'Email', path: 'email', align: 'right' as const },
    ]

    const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable
        schema={TestSchema}
        columns={columnsWithAlignment as never}
        getData={getData}
      />
    )

    await waitFor(() => {
      const headers = screen.getAllByRole('columnheader')
      expect(headers[0]).toHaveClass('text-center')
      expect(headers[2]).toHaveClass('text-right')
    })
  })

  it('handles nested object paths', async () => {
    const NestedSchema = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
      status: z.enum(['active', 'inactive']),
      user: z.object({
        profile: z.object({
          name: z.string()
        })
      })
    })

    type NestedData = z.infer<typeof NestedSchema>

    const nestedData: NestedData[] = [
      {
        id: 1,
        name: 'Alice',
        email: 'alice@test.com',
        status: 'active',
        user: { profile: { name: 'John Doe' } }
      }
    ]

    const nestedColumns = [
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
        columns={nestedColumns as never}
        getData={getData}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})
