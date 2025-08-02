import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable } from '../data-table'
import '@testing-library/jest-dom'
import { TestSchema, testColumns, testData, createMockResponse } from './shared/test-setup'

describe('DataTable - Sorting Functionality', () => {
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

    if (nameHeader) {
      fireEvent.click(nameHeader)
    }

    // Vérifier que getData a été appelé avec les paramètres de tri
    await waitFor(() => {
      expect(getData).toHaveBeenCalledWith([{ path: 'name', direction: 'asc' }], 0, 50, undefined, [])
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
    if (emailHeader) {
      fireEvent.click(emailHeader)
    }

    // Vérifier que getData n'a pas été appelé à nouveau
    expect(getData).not.toHaveBeenCalled()
  })

  describe('Custom Sort Icons', () => {
    const TestIcon = ({ className }: { className?: string }) => (
      <span className={className} data-testid="custom-icon">⭐</span>
    )

    const columnsForCustomIcons = [
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
        expect(screen.getByTestId('custom-icon')).toHaveClass('custom-asc')
      })

      // Cliquer à nouveau pour trier en mode décroissant
      fireEvent.click(screen.getByText('Name'))

      await waitFor(() => {
        expect(screen.getByTestId('custom-icon')).toHaveClass('custom-desc')
      })
    })

    it('cycles through sort states correctly', async () => {
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

      // Cliquer pour activer le tri croissant
      fireEvent.click(screen.getByText('Name'))

      await waitFor(() => {
        // Maintenant on devrait voir l'icône personnalisée
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
        expect(screen.getByTestId('custom-icon')).toHaveClass('custom-asc')
      })
    })
  })
})
