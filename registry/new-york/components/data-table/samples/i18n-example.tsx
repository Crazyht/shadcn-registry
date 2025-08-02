import { DataTable } from '../data-table'
import { z } from 'zod'
import { useState } from 'react'

// Schéma pour les exemples
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
})

type User = z.infer<typeof UserSchema>

// Données d'exemple (plus de données pour démontrer la pagination)
const sampleUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'pending' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'active' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', status: 'inactive' },
  { id: 7, name: 'Edward Norton', email: 'edward@example.com', status: 'active' },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', status: 'pending' },
  { id: 9, name: 'George Miller', email: 'george@example.com', status: 'active' },
  { id: 10, name: 'Helen Davis', email: 'helen@example.com', status: 'inactive' },
  { id: 11, name: 'Ian Fleming', email: 'ian@example.com', status: 'active' },
  { id: 12, name: 'Julia Roberts', email: 'julia@example.com', status: 'pending' },
]

/**
 * Exemple d'utilisation du DataTable avec i18n
 */
export function I18nExample() {
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en' | 'es'>('fr')
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    {
      label: currentLanguage === 'fr' ? 'Nom' : currentLanguage === 'en' ? 'Name' : 'Nombre',
      path: 'name',
      isSortable: true
    },
    {
      label: currentLanguage === 'fr' ? 'Email' : currentLanguage === 'en' ? 'Email' : 'Correo',
      path: 'email',
      isSortable: true
    },
    {
      label: currentLanguage === 'fr' ? 'Statut' : currentLanguage === 'en' ? 'Status' : 'Estado',
      path: 'status',
      isSortable: true,
      isFilterable: true
    },
  ]

  const getData = async () => {
    // Simuler un délai de chargement pour voir le message "loadingMessage"
    if (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    if (showEmptyState) {
      return {
        data: [],
        totalCount: 0,
      }
    }

    return {
      data: sampleUsers,
      totalCount: sampleUsers.length,
    }
  }

  // Sélection de la configuration messages selon la langue
  const getMessagesConfig = () => {
    switch (currentLanguage) {
      case 'en':
        return {
          emptyMessage: 'No data available',
          loadingMessage: 'Loading data...',
          displayInfo: 'Showing {start} to {end} of {total} items',
          elementsPerPage: 'Items per page:',
        }
      case 'es':
        return {
          emptyMessage: 'No hay datos disponibles',
          loadingMessage: 'Cargando datos...',
          displayInfo: 'Mostrando {start} a {end} de {total} elementos',
          elementsPerPage: 'Elementos por página:',
        }
      default:
        return undefined // Utilise les messages par défaut en français
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentLanguage('fr')}
            className={`px-3 py-1 rounded text-sm ${currentLanguage === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Français
          </button>
          <button
            onClick={() => setCurrentLanguage('en')}
            className={`px-3 py-1 rounded text-sm ${currentLanguage === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            English
          </button>
          <button
            onClick={() => setCurrentLanguage('es')}
            className={`px-3 py-1 rounded text-sm ${currentLanguage === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Español
          </button>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            className={`px-3 py-1 rounded text-sm ${showEmptyState ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
          >
            {currentLanguage === 'fr' ? 'État vide' : currentLanguage === 'en' ? 'Empty state' : 'Estado vacío'}
          </button>
          <button
            onClick={() => {
              setIsLoading(!isLoading)
              // Déclencher un rechargement pour voir le message de chargement
              setRefreshKey(prev => prev + 1)
            }}
            className={`px-3 py-1 rounded text-sm ${isLoading ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            {currentLanguage === 'fr' ? 'Chargement' : currentLanguage === 'en' ? 'Loading' : 'Cargando'}
          </button>
        </div>
      </div>

      <DataTable
        key={refreshKey}
        schema={UserSchema}
        columns={columns}
        getData={getData}
        messages={getMessagesConfig()}
        paginationMode="PaginationWithSize"
        defaultPageSize={5}
      />
    </div>
  )
}
