import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DataTable } from '../data-table'
import '@testing-library/jest-dom'
import { TestSchema, testColumns, testData, createMockResponse } from './shared/test-setup'

describe('DataTable - Pagination Functionality', () => {
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
})
