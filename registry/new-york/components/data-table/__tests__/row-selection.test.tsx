import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable } from '../data-table'
import '@testing-library/jest-dom'
import { TestSchema, testColumns, testData, createMockResponse } from './shared/test-setup'
import { defaultTestMessages } from './shared/test-messages'

describe('DataTable - Row Selection', () => {
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
    if (firstRow) {
      fireEvent.click(firstRow)
    }

    expect(onRowSelect).toHaveBeenCalledWith(testData[0])
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
})
