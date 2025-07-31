import { DataTable, DataTableColumn, TextFilterControl, NumberFilterControl, SelectFilterControl, SortColumn, ColumnFilter } from '../data-table'
import { z } from 'zod'
import { useState } from 'react'
import { Filter, FilterX, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react'

// Schéma produit
const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  stock: z.number(),
  isAvailable: z.boolean(),
})

type Product = z.infer<typeof ProductSchema>

export function FilteringExample() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  // Données d'exemple de produits
  const sampleProducts: Product[] = [
    { id: 1, name: 'Laptop Gaming Pro', price: 1299.99, category: 'Electronics', stock: 25, isAvailable: true },
    { id: 2, name: 'Souris sans fil ergonomique', price: 29.99, category: 'Accessories', stock: 150, isAvailable: true },
    { id: 3, name: 'Clavier mécanique RGB', price: 89.99, category: 'Gaming', stock: 0, isAvailable: false },
    { id: 4, name: 'Écran 4K 27 pouces', price: 499.99, category: 'Electronics', stock: 12, isAvailable: true },
    { id: 5, name: 'Câble USB-C vers HDMI', price: 29.99, category: 'Accessories', stock: 150, isAvailable: true },
    { id: 6, name: 'Casque gaming premium', price: 199.99, category: 'Gaming', stock: 23, isAvailable: true },
    { id: 7, name: 'Tablette iPad Pro', price: 1099.99, category: 'Electronics', stock: 15, isAvailable: true },
    { id: 8, name: 'Support pour laptop', price: 49.99, category: 'Accessories', stock: 67, isAvailable: true },
    { id: 9, name: 'Manette gaming pro', price: 89.99, category: 'Gaming', stock: 34, isAvailable: true },
    { id: 10, name: 'Disque SSD externe', price: 299.99, category: 'Electronics', stock: 19, isAvailable: true },
  ]

  // Configuration des colonnes avec filtres personnalisés
  const productColumns: DataTableColumn<Product>[] = [
    {
      label: 'Produit',
      path: 'name',
      isSortable: true,
      isFilterable: true,
      filterControl: TextFilterControl
    },
    {
      label: 'Prix',
      path: 'price',
      isSortable: true,
      isFilterable: true,
      filterControl: NumberFilterControl,
      align: 'right',
      render: (value: unknown) => (
        <span className="font-semibold">€{(value as number).toFixed(2)}</span>
      )
    },
    {
      label: 'Catégorie',
      path: 'category',
      isSortable: true,
      isFilterable: true,
      filterControl: (props) => (
        <SelectFilterControl
          {...props}
          options={[
            { label: 'Électronique', value: 'Electronics' },
            { label: 'Accessoires', value: 'Accessories' },
            { label: 'Gaming', value: 'Gaming' }
          ]}
        />
      )
    },
    {
      label: 'Stock',
      path: 'stock',
      isSortable: true,
      isFilterable: true,
      filterControl: NumberFilterControl,
      align: 'center',
      render: (value: unknown) => (
        <span className={(value as number) === 0 ? 'text-red-500 font-medium' : 'text-green-600'}>
          {value as number} unités
        </span>
      )
    },
    {
      label: 'Disponible',
      path: 'isAvailable',
      isSortable: true,
      isFilterable: true,
      align: 'center',
      filterControl: (props) => (
        <SelectFilterControl
          {...props}
          options={[
            { label: 'Disponible', value: 'true' },
            { label: 'Indisponible', value: 'false' }
          ]}
        />
      ),
      render: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value ? '✓ Disponible' : '✗ Indisponible'}
        </span>
      )
    }
  ]

  // Fonction getData avec support des filtres
  const getProductData = async (
    sortColumns: SortColumn[],
    startRow: number,
    pageSize: number,
    _grouping?: any,
    filters?: ColumnFilter[]
  ) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100))

    let data = [...sampleProducts]

    // Appliquer les filtres
    if (filters && filters.length > 0) {
      data = data.filter(item => {
        return filters.every(filter => {
          // Fonction utilitaire pour obtenir une valeur par son chemin
          const getValueByPath = (obj: Record<string, unknown>, path: string): unknown => {
            return path.split('.').reduce((current: unknown, key: string) => {
              if (current && typeof current === 'object' && key in current) {
                return (current as Record<string, unknown>)[key]
              }
              return undefined
            }, obj as unknown)
          }

          const value = getValueByPath(item, filter.path)
          const filterValue = filter.value

          if (filterValue === null || filterValue === undefined || filterValue === '__all__') {
            return true
          }

          if (typeof filterValue === 'object' && filterValue !== null && 'operator' in filterValue) {
            const numericFilter = filterValue as { operator: string; value: number }
            const numValue = Number(value)

            if (isNaN(numValue)) return false

            switch (numericFilter.operator) {
              case '=': return numValue === numericFilter.value
              case '!=': return numValue !== numericFilter.value
              case '<': return numValue < numericFilter.value
              case '<=': return numValue <= numericFilter.value
              case '>': return numValue > numericFilter.value
              case '>=': return numValue >= numericFilter.value
              default: return true
            }
          }

          if (typeof value === 'string' && typeof filterValue === 'string') {
            return value.toLowerCase().includes(filterValue.toLowerCase())
          }

          return String(value).toLowerCase() === String(filterValue).toLowerCase()
        })
      })
    }

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = sort.path.split('.').reduce((obj: unknown, key: string) => (obj as Record<string, unknown>)?.[key], a)
          const bValue = sort.path.split('.').reduce((obj: unknown, key: string) => (obj as Record<string, unknown>)?.[key], b)

          let comparison = 0

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue)
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue
          } else {
            const aStr = String(aValue ?? '')
            const bStr = String(bValue ?? '')
            comparison = aStr.localeCompare(bStr)
          }

          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    // Appliquer la pagination
    const paginatedData = data.slice(startRow, startRow + pageSize)

    return {
      data: paginatedData,
      totalCount: data.length,
      lastRow: startRow + paginatedData.length - 1
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Démonstration du filtrage :</p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Filtre texte :</strong> Recherche dans le nom du produit</li>
          <li>• <strong>Filtre nombre :</strong> Opérateurs sur prix et stock (=, ≠, &lt;, ≤, &gt;, ≥)</li>
          <li>• <strong>Filtre sélection :</strong> Choix dans une liste (catégorie, disponibilité)</li>
          <li>• <strong>Icônes :</strong> 🔍 par défaut, ❌ quand filtre actif</li>
        </ul>
      </div>

      <DataTable
        schema={ProductSchema}
        columns={productColumns}
        getData={getProductData}
        onRowSelect={setSelectedProduct}
        selectedRow={selectedProduct}
        pageSize={8}
        paginationMode="Pagination"
        filterIcons={{
          default: Filter,
          active: FilterX,
          classNames: {
            default: "h-4 w-4 text-muted-foreground hover:text-primary transition-colors",
            active: "h-4 w-4 text-primary"
          }
        }}
        sortIcons={{
          default: MoreHorizontal,
          asc: TrendingUp,
          desc: TrendingDown,
          classNames: {
            default: "h-4 w-4 text-muted-foreground",
            asc: "h-4 w-4 text-green-600",
            desc: "h-4 w-4 text-red-600"
          }
        }}
      />

      {selectedProduct && (
        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <strong>Sélectionné :</strong> {selectedProduct.name} - €{selectedProduct.price} ({selectedProduct.stock} en stock)
        </div>
      )}
    </div>
  )
}
