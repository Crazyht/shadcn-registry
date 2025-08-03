import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable } from '../data-table'
import '@testing-library/jest-dom'
import { TestSchema, testColumns, testData, createMockResponse } from './shared/test-setup'
import { defaultTestMessages } from './shared/test-messages'

describe('DataTable - Infinite Scroll & Load More', () => {
  describe('loadingMessage', () => {
    it('displays default loading message when loadingMessage prop is not provided', () => {
      const getData = vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(createMockResponse(testData)), 1000))
      )

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
        />
      )

      expect(screen.getByText('Chargement des données...')).toBeInTheDocument()
    })

    it('displays custom loading message when loadingMessage prop is provided', () => {
      const getData = vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(createMockResponse(testData)), 1000))
      )

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          messages={{
            loadingMessage: "Loading users..."
          }}
        />
      )

      expect(screen.getByText('Loading users...')).toBeInTheDocument()
    })
  })

  describe('showLoadMoreButton', () => {
    it('does not show load more button by default in InfiniteScroll mode', async () => {
      const moreData = [...testData, ...testData] // 6 items total
      const getData = vi.fn().mockResolvedValue({
        data: moreData.slice(0, 3), // Return first 3 items
        totalCount: 6,
        lastRow: 2
      })

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="InfiniteScroll"
          pageSize={3}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Should not show load more button by default (showLoadMoreButton defaults to false)
      expect(screen.queryByText('Charger plus')).not.toBeInTheDocument()
    })

    it('shows load more button when showLoadMoreButton is true in InfiniteScroll mode', async () => {
      const moreData = [...testData, ...testData] // 6 items total
      const getData = vi.fn().mockResolvedValue({
        data: moreData.slice(0, 3), // Return first 3 items
        totalCount: 6,
        lastRow: 2
      })

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="InfiniteScroll"
          pageSize={3}
          showLoadMoreButton={true}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Should show load more button when enabled
      expect(screen.getByText('Charger plus')).toBeInTheDocument()
    })

    it('does not show load more button in other pagination modes even when showLoadMoreButton is true', async () => {
      const getData = vi.fn().mockResolvedValue(createMockResponse(testData))

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="Pagination"
          showLoadMoreButton={true}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Should not show load more button in non-InfiniteScroll modes
      expect(screen.queryByText('Charger plus')).not.toBeInTheDocument()
    })

    it('load more button loads additional data when clicked', async () => {
      const firstBatch = testData.slice(0, 2) // First 2 items: Alice, Bob

      const getData = vi.fn()
        .mockResolvedValueOnce({
          data: firstBatch,
          totalCount: 3, // 3 total items
          lastRow: 1
        })
        .mockResolvedValueOnce({
          data: [testData[2]], // Charlie
          totalCount: 3,
          lastRow: 2
        })

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="InfiniteScroll"
          pageSize={2}
          showLoadMoreButton={true}
        />
      )

      // Wait for initial data to load
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Initially should only show first batch
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
      expect(screen.queryByText('Charlie')).not.toBeInTheDocument()

      // Verify load more button is present
      expect(screen.getByText('Charger plus')).toBeInTheDocument()

      // Click load more button
      const loadMoreButton = screen.getByText('Charger plus')
      fireEvent.click(loadMoreButton)

      // Wait for additional data to load
      await waitFor(() => {
        expect(screen.getByText('Charlie')).toBeInTheDocument()
      })

      // Should now show all data
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
      expect(screen.getByText('Charlie')).toBeInTheDocument()

      // getData should have been called twice
      expect(getData).toHaveBeenCalledTimes(2)

      // Verify the calls were made with correct parameters
      expect(getData).toHaveBeenNthCalledWith(1, [], 0, 2, undefined, [])
      expect(getData).toHaveBeenNthCalledWith(2, [], 2, 2, undefined, [])
    })

    it('hides load more button when all data is loaded', async () => {
      const getData = vi.fn().mockResolvedValue({
        data: testData.slice(0, 2), // Only 2 items available
        totalCount: 2, // Total is 2, so no more data
        lastRow: 1
      })

      render(
        <DataTable
          schema={TestSchema}
          columns={testColumns}
          getData={getData}
          paginationMode="InfiniteScroll"
          pageSize={2}
          showLoadMoreButton={true}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
      })

      // Should not show load more button when all data is loaded
      expect(screen.queryByText('Charger plus')).not.toBeInTheDocument()
    })
  })
})
