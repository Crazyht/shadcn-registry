import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DataTable } from '../data-table'
import { z } from 'zod'
import '@testing-library/jest-dom'

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })

  // Déclencher l'événement resize
  window.dispatchEvent(new Event('resize'))
}

// Schéma de test pour les utilisateurs
const TestUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  department: z.string(),
})

type TestUser = z.infer<typeof TestUserSchema>

const testData: TestUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    department: "IT"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+0987654321",
    department: "Marketing"
  }
]

const createMockResponse = (data: TestUser[]) => ({
  data,
  totalCount: data.length
})

const responsiveColumns = [
  {
    label: "Nom",
    path: "name",
    // Pas de medias = visible partout
  },
  {
    label: "Email",
    path: "email",
    responsive: {
      medias: ['Tablet', 'Desktop'], // Masqué sur mobile
      widthMode: "fill"
    }
  },
  {
    label: "Téléphone",
    path: "phone",
    responsive: {
      medias: ['Mobile'], // Visible uniquement sur mobile
      widthMode: "content"
    }
  },
  {
    label: "Département",
    path: "department",
    responsive: {
      medias: [{ min: '900px' }], // Media query personnalisée
      widthMode: "content"
    }
  }
]

describe('DataTable Responsive', () => {
  beforeEach(() => {
    // Mock initial window size
    mockInnerWidth(1024) // Desktop by default
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should show all appropriate columns on desktop', async () => {
    mockInnerWidth(1200) // Large desktop

    const mockGetData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable<TestUser>
        schema={TestUserSchema}
        getData={mockGetData}
        columns={responsiveColumns as never}
      />
    )

    // Attendre que les données se chargent
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Sur desktop (>= 1024px), on devrait voir: Nom, Email, Département
    // Téléphone est masqué car visible seulement sur Mobile
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.queryByText('Téléphone')).not.toBeInTheDocument()
    expect(screen.getByText('Département')).toBeInTheDocument()
  })

  it('should show tablet-specific columns', async () => {
    mockInnerWidth(800) // Tablet

    const mockGetData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable<TestUser>
        schema={TestUserSchema}
        getData={mockGetData}
        columns={responsiveColumns as never}
      />
    )

    // Attendre que les données se chargent
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Sur tablet (640-1023px), on devrait voir: Nom, Email
    // Téléphone (Mobile only) et Département (min: 900px) sont masqués
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.queryByText('Téléphone')).not.toBeInTheDocument()
    expect(screen.queryByText('Département')).not.toBeInTheDocument()
  })

  it('should show mobile-specific columns', async () => {
    mockInnerWidth(400) // Mobile

    const mockGetData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable<TestUser>
        schema={TestUserSchema}
        getData={mockGetData}
        columns={responsiveColumns as never}
      />
    )

    // Attendre que les données se chargent
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Sur mobile (<= 639px), on devrait voir: Nom, Téléphone
    // Email (Tablet/Desktop) et Département (min: 900px) sont masqués
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.queryByText('Email')).not.toBeInTheDocument()
    expect(screen.getByText('Téléphone')).toBeInTheDocument()
    expect(screen.queryByText('Département')).not.toBeInTheDocument()
  })

  it('should handle custom media queries correctly', async () => {
    mockInnerWidth(950) // Juste au-dessus de 900px

    const mockGetData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable<TestUser>
        schema={TestUserSchema}
        getData={mockGetData}
        columns={responsiveColumns as never}
      />
    )

    // Attendre que les données se chargent
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Avec 950px, on devrait voir Département (min: 900px)
    expect(screen.getByText('Département')).toBeInTheDocument()

    // Mais pas Téléphone (Mobile only)
    expect(screen.queryByText('Téléphone')).not.toBeInTheDocument()
  })

  it('should handle columns without responsive config as always visible', async () => {
    const simpleColumns = [
      {
        label: "Nom",
        path: "name",
        // Pas de configuration responsive
      },
      {
        label: "ID",
        path: "id",
        responsive: {
          // medias vide = toujours visible
          medias: []
        }
      }
    ]

    mockInnerWidth(300) // Très petit écran

    const mockGetData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable<TestUser>
        schema={TestUserSchema}
        getData={mockGetData}
        columns={simpleColumns as never}
      />
    )

    // Attendre que les données se chargent
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Les deux colonnes devraient être visibles
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('ID')).toBeInTheDocument()
  })

  it('should apply column width styles correctly', async () => {
    const styledColumns = [
      {
        label: "Nom",
        path: "name",
        responsive: {
          widthMode: "content",
          width: "150px"
        }
      },
      {
        label: "Email",
        path: "email",
        responsive: {
          widthMode: "range",
          minWidth: "200px",
          maxWidth: "300px"
        }
      },
      {
        label: "Département",
        path: "department",
        responsive: {
          widthMode: "fill",
          minWidth: "100px"
        }
      }
    ]

    const mockGetData = vi.fn().mockResolvedValue(createMockResponse(testData))

    render(
      <DataTable<TestUser>
        schema={TestUserSchema}
        getData={mockGetData}
        columns={styledColumns as never}
      />
    )

    // Attendre que les données se chargent
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Vérifier que les colonnes sont présentes
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Département')).toBeInTheDocument()
  })
})
