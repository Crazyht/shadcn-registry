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
import { DataTableColumn, FilterControlProps, FilterValue, FilterOperator } from './data-table-types'

/**
 * Composant FilterPopover pour gérer les filtres de colonnes
 */
interface FilterPopoverProps<T> {
  column: DataTableColumn<T>
  filterValue: FilterValue | undefined
  onFilterChange: (value: FilterValue | undefined) => void
  onClearFilter: () => void
  icon: React.ReactNode
}

export function FilterPopover<T>({ column, filterValue, onFilterChange, onClearFilter, icon }: FilterPopoverProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState<FilterValue | undefined>(filterValue)

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

    // Contrôle par défaut : filtre texte avec 'contains'
    return (
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Filtrer par {column.label.toLowerCase()}</label>
          <Input
            type="text"
            value={tempValue?.value as string || ''}
            onChange={(e) => setTempValue(e.target.value ? {
              operator: 'contains' as const,
              value: e.target.value
            } : undefined)}
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
 * Contrôles de filtre prédéfinis avec structure uniforme
 */

// Filtre texte avec choix d'opérateur
export function TextFilterControl({ value, onChange }: FilterControlProps) {
  const [operator, setOperator] = useState<FilterOperator>(value?.operator || 'contains')
  const [textValue, setTextValue] = useState(value?.value as string || '')

  useEffect(() => {
    if (value) {
      setOperator(value.operator)
      setTextValue(value.value as string || '')
    } else {
      setOperator('contains')
      setTextValue('')
    }
  }, [value])

  const handleChange = (newOperator: FilterOperator, newValue: string) => {
    setOperator(newOperator)
    setTextValue(newValue)
    if (newValue.trim()) {
      onChange({
        operator: newOperator,
        value: newValue.trim()
      })
    } else {
      onChange(undefined)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Rechercher</label>
        <div className="flex gap-2 mt-1">
          <Select value={operator} onValueChange={(op) => handleChange(op as FilterOperator, textValue)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contains">Contient</SelectItem>
              <SelectItem value="starts_with">Commence par</SelectItem>
              <SelectItem value="ends_with">Finit par</SelectItem>
              <SelectItem value="equals">Égal à</SelectItem>
              <SelectItem value="not_equals">Différent de</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            value={textValue}
            onChange={(e) => handleChange(operator, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex-1"
            placeholder="Valeur à rechercher..."
          />
        </div>
      </div>
    </div>
  )
}

// Filtre nombre avec opérateurs
export function NumberFilterControl({ value, onChange }: FilterControlProps) {
  const [operator, setOperator] = useState<FilterOperator>(value?.operator || 'equals')
  const [numberValue, setNumberValue] = useState(value?.value as string || '')
  const [numberValue2, setNumberValue2] = useState(value?.value2 as string || '')

  useEffect(() => {
    if (value) {
      setOperator(value.operator)
      setNumberValue(String(value.value || ''))
      setNumberValue2(String(value.value2 || ''))
    } else {
      setOperator('equals')
      setNumberValue('')
      setNumberValue2('')
    }
  }, [value])

  const handleChange = (newOperator: FilterOperator, newValue: string, newValue2?: string) => {
    setOperator(newOperator)
    setNumberValue(newValue)
    if (newValue2 !== undefined) {
      setNumberValue2(newValue2)
    }

    if (newValue.trim()) {
      const filterValue: FilterValue = {
        operator: newOperator,
        value: parseFloat(newValue)
      }

      if (newOperator === 'between' && newValue2?.trim()) {
        filterValue.value2 = parseFloat(newValue2)
      }

      onChange(filterValue)
    } else {
      onChange(undefined)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Filtrer par nombre</label>
        <div className="flex gap-2 mt-1">
          <Select value={operator} onValueChange={(op) => handleChange(op as FilterOperator, numberValue, numberValue2)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">=</SelectItem>
              <SelectItem value="not_equals">≠</SelectItem>
              <SelectItem value="greater_than">&gt;</SelectItem>
              <SelectItem value="greater_or_equal">≥</SelectItem>
              <SelectItem value="less_than">&lt;</SelectItem>
              <SelectItem value="less_or_equal">≤</SelectItem>
              <SelectItem value="between">Entre</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="number"
            value={numberValue}
            onChange={(e) => handleChange(operator, e.target.value, numberValue2)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Valeur..."
          />
          {operator === 'between' && (
            <>
              <span className="flex items-center text-sm text-muted-foreground">et</span>
              <input
                type="number"
                value={numberValue2}
                onChange={(e) => handleChange(operator, numberValue, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Valeur 2..."
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Filtre select avec options
export function SelectFilterControl({ value, onChange, options }: FilterControlProps & { options: { label: string; value: string }[] }) {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    value?.operator === 'in' && value.values ? value.values as string[] :
    value?.value ? [value.value as string] : []
  )
  const [operator, setOperator] = useState<FilterOperator>(value?.operator || 'equals')
  const [isMultiSelect, setIsMultiSelect] = useState(value?.operator === 'in' || value?.operator === 'not_in')

  useEffect(() => {
    if (value) {
      setOperator(value.operator)
      if (value.operator === 'in' || value.operator === 'not_in') {
        setSelectedValues(value.values as string[] || [])
        setIsMultiSelect(true)
      } else {
        setSelectedValues(value.value ? [value.value as string] : [])
        setIsMultiSelect(false)
      }
    } else {
      setOperator('equals')
      setSelectedValues([])
      setIsMultiSelect(false)
    }
  }, [value])

  const handleOperatorChange = (newOperator: string) => {
    const typedOperator = newOperator as FilterOperator
    setOperator(typedOperator)
    const newIsMulti = typedOperator === 'in' || typedOperator === 'not_in'
    setIsMultiSelect(newIsMulti)

    if (selectedValues.length > 0) {
      if (newIsMulti) {
        onChange({ operator: typedOperator, values: selectedValues })
      } else {
        onChange({ operator: typedOperator, value: selectedValues[0] })
      }
    } else {
      onChange(undefined)
    }
  }

  const handleValueChange = (newValue: string) => {
    if (isMultiSelect) {
      const newValues = selectedValues.includes(newValue)
        ? selectedValues.filter(v => v !== newValue)
        : [...selectedValues, newValue]

      setSelectedValues(newValues)

      if (newValues.length > 0) {
        onChange({ operator, values: newValues })
      } else {
        onChange(undefined)
      }
    } else {
      const newValues = newValue ? [newValue] : []
      setSelectedValues(newValues)

      if (newValue) {
        onChange({ operator, value: newValue })
      } else {
        onChange(undefined)
      }
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Opérateur</label>
        <Select value={operator} onValueChange={handleOperatorChange}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Égal à</SelectItem>
            <SelectItem value="not_equals">Différent de</SelectItem>
            <SelectItem value="in">Dans la liste</SelectItem>
            <SelectItem value="not_in">Pas dans la liste</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">
          {isMultiSelect ? 'Sélectionner plusieurs options' : 'Sélectionner une option'}
        </label>
        <div className="mt-1 space-y-2">
          {options?.map(option => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type={isMultiSelect ? "checkbox" : "radio"}
                name="filter-options"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleValueChange(option.value)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
