import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { DataTableColumn, FilterControlProps } from './data-table-types'

/**
 * Composant FilterPopover pour gérer les filtres de colonnes
 */
interface FilterPopoverProps<T> {
  column: DataTableColumn<T>
  filterValue: unknown
  onFilterChange: (value: unknown) => void
  onClearFilter: () => void
  icon: React.ReactNode
}

export function FilterPopover<T>({ column, filterValue, onFilterChange, onClearFilter, icon }: FilterPopoverProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState(filterValue)

  // Synchroniser la valeur temporaire avec la valeur du filtre
  useEffect(() => {
    setTempValue(filterValue)
  }, [filterValue])

  const handleApplyFilter = () => {
    onFilterChange(tempValue)
    setIsOpen(false)
  }

  const handleClearFilter = () => {
    setTempValue(undefined)
    onClearFilter()
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempValue(filterValue)
    setIsOpen(false)
  }

  const renderFilterControl = () => {
    if (column.filterControl) {
      const FilterControl = column.filterControl
      return (
        <FilterControl
          value={tempValue}
          onChange={setTempValue}
          onClose={() => setIsOpen(false)}
        />
      )
    }

    // Contrôle par défaut : input texte
    return (
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Filtrer par {column.label.toLowerCase()}</label>
          <Input
            type="text"
            value={tempValue as string || ''}
            onChange={(e) => setTempValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full mt-1"
            placeholder={`Saisir ${column.label.toLowerCase()}...`}
          />
        </div>
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
        >
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4">
          <div className="font-medium text-sm">Filtrer la colonne "{column.label}"</div>

          {renderFilterControl()}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilter}
              className="text-xs"
            >
              Effacer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-xs"
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleApplyFilter}
              className="text-xs"
            >
              Filtrer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Contrôles de filtre prédéfinis
 */

// Filtre texte simple
export function TextFilterControl({ value, onChange }: FilterControlProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Rechercher</label>
        <Input
          type="text"
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full mt-1"
          placeholder="Saisir le texte à rechercher..."
        />
      </div>
    </div>
  )
}

// Filtre nombre avec opérateurs
export function NumberFilterControl({ value, onChange }: FilterControlProps) {
  const [operator, setOperator] = useState('=')
  const [numberValue, setNumberValue] = useState('')

  useEffect(() => {
    if (value && typeof value === 'object' && 'operator' in value && 'value' in value) {
      const filter = value as { operator: string; value: string }
      setOperator(filter.operator)
      setNumberValue(filter.value)
    }
  }, [value])

  const handleChange = (newOperator: string, newValue: string) => {
    setOperator(newOperator)
    setNumberValue(newValue)
    if (newValue) {
      onChange({ operator: newOperator, value: newValue })
    } else {
      onChange(null)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Filtrer par nombre</label>
        <div className="flex gap-2 mt-1">
          <Select value={operator} onValueChange={(op) => handleChange(op, numberValue)}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="=">=</SelectItem>
              <SelectItem value="!=">≠</SelectItem>
              <SelectItem value="<">&lt;</SelectItem>
              <SelectItem value="<=">&le;</SelectItem>
              <SelectItem value=">">&gt;</SelectItem>
              <SelectItem value=">=">&ge;</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="number"
            value={numberValue}
            onChange={(e) => handleChange(operator, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Valeur..."
          />
        </div>
      </div>
    </div>
  )
}

// Filtre select avec options
export function SelectFilterControl({ value, onChange, options }: FilterControlProps & { options: { label: string; value: string }[] }) {
  const handleValueChange = (newValue: string) => {
    if (newValue === '__all__') {
      onChange('') // Convertir la valeur spéciale en chaîne vide pour le filtre
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Sélectionner une option</label>
        <Select value={value as string || '__all__'} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Choisir une option..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes les options</SelectItem>
            {options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
