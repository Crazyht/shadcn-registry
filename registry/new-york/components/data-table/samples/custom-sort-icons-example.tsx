import { DataTable, SortColumn } from '../data-table'
import { defineColumn } from '../data-table-types'
import { z } from 'zod'
import { useState } from 'react'
import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react'

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

export function CustomSortIconsExample() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  // Données d'exemple de produits avec prix variés
  const sampleProducts: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 25, isAvailable: true },
    { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories', stock: 150, isAvailable: true },
    { id: 3, name: 'Gaming Keyboard', price: 89.99, category: 'Gaming', stock: 0, isAvailable: false },
    { id: 4, name: 'USB-C Cable', price: 19.99, category: 'Accessories', stock: 200, isAvailable: true },
    { id: 5, name: 'Smartphone', price: 899.99, category: 'Electronics', stock: 45, isAvailable: true },
    { id: 6, name: 'Tablet Stand', price: 39.99, category: 'Accessories', stock: 75, isAvailable: true },
  ]

  // Configuration des colonnes avec icônes personnalisées
  const productColumn = defineColumn<Product, typeof ProductSchema>(ProductSchema)
  const productColumns = [
    productColumn('name', {
      label: 'Produit',
      isSortable: true,
    }),
    productColumn('price', {
      label: 'Prix',
      isSortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold">€{value.toFixed(2)}</span>
      )
    }),
    productColumn('stock', {
      label: 'Stock',
      isSortable: true,
      align: 'center',
      render: (value) => (
        <span className={value === 0 ? 'text-red-500 font-medium' : 'text-green-600'}>
          {value} unités
        </span>
      )
    }),
    productColumn('category', {
      label: 'Catégorie',
      isSortable: true,
    })
  ]

  // Fonction getData pour les produits
  const getProductData = async (
    sortColumns: SortColumn<Product>[],
    startRow: number,
    pageSize: number
  ) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100))

    const data = [...sampleProducts]

    // Appliquer le tri
    if (sortColumns.length > 0) {
      data.sort((a, b) => {
        for (const sort of sortColumns) {
          const aValue = a[sort.path as keyof Product]
          const bValue = b[sort.path as keyof Product]

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
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Démonstration des icônes personnalisées :</p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Toutes les colonnes :</strong> Icônes TrendingUp/TrendingDown en vert/rouge</li>
          <li>• <strong>Configuration globale :</strong> Une seule configuration pour tout le tableau</li>
        </ul>
      </div>

      <DataTable
        schema={ProductSchema}
        columns={productColumns}
        getData={getProductData}
        onRowSelect={setSelectedProduct}
        selectedRow={selectedProduct}
        pageSize={6}
        paginationMode="None"
        sortIcons={{
          default: MoreHorizontal,
          asc: TrendingUp,
          desc: TrendingDown,
          classNames: {
            default: "h-4 w-4 text-gray-400",
            asc: "h-4 w-4 text-green-600 font-bold",
            desc: "h-4 w-4 text-red-600 font-bold"
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
