import { DataTable } from '../data-table'
import { defineColumn } from '../data-table-types'
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

  const userColumn = defineColumn<User, typeof UserSchema>(UserSchema)
  const columns = [
    userColumn('name', {
      label: currentLanguage === 'fr' ? 'Nom' : currentLanguage === 'en' ? 'Name' : 'Nombre',
      isSortable: true
    }),
    userColumn('email', {
      label: currentLanguage === 'fr' ? 'Email' : currentLanguage === 'en' ? 'Email' : 'Correo',
      isSortable: true
    }),
    userColumn('status', {
      label: currentLanguage === 'fr' ? 'Statut' : currentLanguage === 'en' ? 'Status' : 'Estado',
      isSortable: true,
      isFilterable: true
    }),
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
          // Messages généraux
          emptyMessage: 'No data available',
          loadingMessage: 'Loading data...',
          displayInfo: 'Showing {start} to {end} of {total} items',
          elementsPerPage: 'Items per page:',
          totalElements: '{total} total items',
          loadMoreButton: 'Load more',
          loadingIndicator: 'Loading...',

          // Messages de filtrage
          filterPopupApply: 'Apply',
          filterPopupCancel: 'Cancel',
          filterPopupClear: 'Clear',
          filterOperatorLabel: 'Operator',
          filterValueLabel: 'Value',
          filterValue2Label: 'Value 2',
          filterValuesLabel: 'Values',
          filterValuePlaceholder: 'Enter a value...',
          filterNumberPlaceholder: 'Enter a number...',
          filterSelectPlaceholder: 'Select...',

          // Messages de tri
          sortAscending: 'Sort ascending',
          sortDescending: 'Sort descending',
          noSort: 'No sort',
          filterActive: 'Filter active',
          filterInactive: 'Filter inactive',

          // Opérateurs de filtrage
          filterOperatorEquals: 'Equals',
          filterOperatorNotEquals: 'Not equals',
          filterOperatorContains: 'Contains',
          filterOperatorStartsWith: 'Starts with',
          filterOperatorEndsWith: 'Ends with',
          filterOperatorGreaterThan: 'Greater than',
          filterOperatorGreaterOrEqual: 'Greater or equal',
          filterOperatorLessThan: 'Less than',
          filterOperatorLessOrEqual: 'Less or equal',
          filterOperatorBetween: 'Between',
          filterOperatorIn: 'In list',
          filterOperatorNotIn: 'Not in list',
          filterOperatorIsNull: 'Is empty',
          filterOperatorIsNotNull: 'Is not empty',

          // Messages des filtres booléens
          filterBooleanTrue: 'True',
          filterBooleanFalse: 'False',

          // Messages d'accessibilité
          sortColumnAriaLabel: '{column} - Click to sort, Ctrl/Shift+Click for multi-column sort',
          paginationAriaLabel: 'Pagination navigation',

          // Messages d'erreur
          validationError: 'Data validation error',
          loadingError: 'Error loading data',
          unknownError: 'An unknown error occurred'
        }
      case 'es':
        return {
          // Messages généraux
          emptyMessage: 'No hay datos disponibles',
          loadingMessage: 'Cargando datos...',
          displayInfo: 'Mostrando {start} a {end} de {total} elementos',
          elementsPerPage: 'Elementos por página:',
          totalElements: '{total} elementos en total',
          loadMoreButton: 'Cargar más',
          loadingIndicator: 'Cargando...',

          // Messages de filtrage
          filterPopupApply: 'Aplicar',
          filterPopupCancel: 'Cancelar',
          filterPopupClear: 'Limpiar',
          filterOperatorLabel: 'Operador',
          filterValueLabel: 'Valor',
          filterValue2Label: 'Valor 2',
          filterValuesLabel: 'Valores',
          filterValuePlaceholder: 'Ingrese un valor...',
          filterNumberPlaceholder: 'Ingrese un número...',
          filterSelectPlaceholder: 'Seleccionar...',

          // Messages de tri
          sortAscending: 'Orden ascendente',
          sortDescending: 'Orden descendente',
          noSort: 'Sin orden',
          filterActive: 'Filtro activo',
          filterInactive: 'Filtro inactivo',

          // Opérateurs de filtrage
          filterOperatorEquals: 'Igual a',
          filterOperatorNotEquals: 'Diferente de',
          filterOperatorContains: 'Contiene',
          filterOperatorStartsWith: 'Comienza con',
          filterOperatorEndsWith: 'Termina con',
          filterOperatorGreaterThan: 'Mayor que',
          filterOperatorGreaterOrEqual: 'Mayor o igual',
          filterOperatorLessThan: 'Menor que',
          filterOperatorLessOrEqual: 'Menor o igual',
          filterOperatorBetween: 'Entre',
          filterOperatorIn: 'En la lista',
          filterOperatorNotIn: 'No en la lista',
          filterOperatorIsNull: 'Está vacío',
          filterOperatorIsNotNull: 'No está vacío',

          // Messages des filtres booléens
          filterBooleanTrue: 'Verdadero',
          filterBooleanFalse: 'Falso',

          // Messages d'accessibilité
          sortColumnAriaLabel: '{column} - Clic para ordenar, Ctrl/Shift+Clic para orden multi-columna',
          paginationAriaLabel: 'Navegación de paginación',

          // Messages d'erreur
          validationError: 'Error de validación de datos',
          loadingError: 'Error al cargar los datos',
          unknownError: 'Ocurrió un error desconocido'
        }
      default:
        return {
          // Messages généraux en français
          emptyMessage: 'Aucune donnée disponible',
          loadingMessage: 'Chargement des données...',
          displayInfo: 'Affichage de {start} à {end} sur {total} éléments',
          elementsPerPage: 'Éléments par page :',
          totalElements: '{total} éléments au total',
          loadMoreButton: 'Charger plus',
          loadingIndicator: 'Chargement...',

          // Messages de filtrage
          filterPopupApply: 'Appliquer',
          filterPopupCancel: 'Annuler',
          filterPopupClear: 'Effacer',
          filterOperatorLabel: 'Opérateur',
          filterValueLabel: 'Valeur',
          filterValue2Label: 'Valeur 2',
          filterValuesLabel: 'Valeurs',
          filterValuePlaceholder: 'Entrez une valeur...',
          filterNumberPlaceholder: 'Entrez un nombre...',
          filterSelectPlaceholder: 'Sélectionnez...',

          // Messages de tri
          sortAscending: 'Tri croissant',
          sortDescending: 'Tri décroissant',
          noSort: 'Aucun tri',
          filterActive: 'Filtre actif',
          filterInactive: 'Filtre inactif',

          // Opérateurs de filtrage
          filterOperatorEquals: 'Égal à',
          filterOperatorNotEquals: 'Différent de',
          filterOperatorContains: 'Contient',
          filterOperatorStartsWith: 'Commence par',
          filterOperatorEndsWith: 'Finit par',
          filterOperatorGreaterThan: 'Plus grand que',
          filterOperatorGreaterOrEqual: 'Plus grand ou égal',
          filterOperatorLessThan: 'Plus petit que',
          filterOperatorLessOrEqual: 'Plus petit ou égal',
          filterOperatorBetween: 'Entre',
          filterOperatorIn: 'Dans la liste',
          filterOperatorNotIn: 'Pas dans la liste',
          filterOperatorIsNull: 'Est vide',
          filterOperatorIsNotNull: 'N\'est pas vide',

          // Messages des filtres booléens
          filterBooleanTrue: 'Vrai',
          filterBooleanFalse: 'Faux',

          // Messages d'accessibilité
          sortColumnAriaLabel: '{column} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes',
          paginationAriaLabel: 'Navigation de pagination',

          // Messages d'erreur
          validationError: 'Erreur de validation des données',
          loadingError: 'Erreur lors du chargement des données',
          unknownError: 'Une erreur inconnue s\'est produite'
        }
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
