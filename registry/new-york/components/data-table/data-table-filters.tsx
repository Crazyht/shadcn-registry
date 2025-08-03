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
import { DataTableColumn, FilterOperator, FilterValue, Path, DataTableMessages } from './data-table-types'

/**
 * Composant FilterPopover pour gérer les filtres de colonnes
 */
interface FilterPopoverProps<T> {
  column: DataTableColumn<T, Path<T> | undefined>
  filterValue: FilterValue<T> | undefined
  onFilterChange: (value: FilterValue<T> | undefined) => void
  onClearFilter: () => void
  icon: React.ReactNode
  messages?: DataTableMessages
}

export function FilterPopover<T>({ column, filterValue, onFilterChange, onClearFilter, icon, messages }: FilterPopoverProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState<FilterValue<T> | undefined>(filterValue)

  // Fonction utilitaire pour récupérer les messages avec fallback
  const getMessage = (key: keyof DataTableMessages, defaultValue: string): string => {
    return messages?.[key] || defaultValue
  }

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <DefaultFilterControl
          column={column}
          value={tempValue}
          onChange={setTempValue}
          messages={messages}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            {getMessage('filterPopupCancel', 'Annuler')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearFilter}>
            {getMessage('filterPopupClear', 'Effacer')}
          </Button>
          <Button size="sm" onClick={handleApplyFilter}>
            {getMessage('filterPopupApply', 'Appliquer')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Contrôle de filtre par défaut
 */
interface DefaultFilterControlProps<T> {
  column: DataTableColumn<T, Path<T> | undefined>
  value: FilterValue<T> | undefined
  onChange: (value: FilterValue<T> | undefined) => void
  messages?: DataTableMessages
}

function DefaultFilterControl<T>({ column, value, onChange, messages }: DefaultFilterControlProps<T>) {
  if (column.type === 'string' || column.type === 'email' || column.type === 'url') {
    return <TextFilterControl
      value={value as FilterValue<string> | undefined}
      onChange={onChange as (value: FilterValue<string> | undefined) => void}
      messages={messages}
    />
  }

  if (column.type === 'int' || column.type === 'decimal') {
    return <NumberFilterControl
      value={value as FilterValue<number> | undefined}
      onChange={onChange as (value: FilterValue<number> | undefined) => void}
      messages={messages}
    />
  }

  if (column.type === 'boolean') {
    return <SelectFilterControl
      value={value as FilterValue<string> | undefined}
      onChange={onChange as (value: FilterValue<string> | undefined) => void}
      options={[
        { value: 'true', label: messages?.filterBooleanTrue || 'Vrai' },
        { value: 'false', label: messages?.filterBooleanFalse || 'Faux' }
      ]}
      messages={messages}
    />
  }

  // Type par défaut : texte
  return <TextFilterControl
    value={value as FilterValue<string> | undefined}
    onChange={onChange as (value: FilterValue<string> | undefined) => void}
    messages={messages}
  />
}

/**
 * Contrôle de filtre pour le texte
 */
export function TextFilterControl({ value, onChange, messages }: {
  value: FilterValue<string> | undefined
  onChange: (value: FilterValue<string> | undefined) => void
  messages?: DataTableMessages
}) {
  const [operator, setOperator] = useState<FilterOperator>(value?.operator || 'contains')
  const [textValue, setTextValue] = useState(() => {
    if (value && 'value' in value) {
      return value.value as string || ''
    }
    return ''
  })

  // Fonction utilitaire pour récupérer les messages avec fallback
  const getMessage = (key: keyof DataTableMessages, defaultValue: string): string => {
    return messages?.[key] || defaultValue
  }

  useEffect(() => {
    if (value) {
      setOperator(value.operator)
      if ('value' in value) {
        setTextValue(value.value as string || '')
      } else {
        setTextValue('')
      }
    }
  }, [value])

  const handleUpdate = (newOperator: FilterOperator, newValue: string) => {
    if (newOperator === 'is_null' || newOperator === 'is_not_null') {
      onChange({ operator: newOperator } as FilterValue<string>)
    } else if (!newValue.trim()) {
      onChange(undefined)
    } else {
      onChange({
        operator: newOperator,
        value: newValue.trim()
      } as FilterValue<string>)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">{getMessage('filterOperatorLabel', 'Opérateur')}</label>
        <Select value={operator} onValueChange={(newOp) => {
          setOperator(newOp as FilterOperator)
          handleUpdate(newOp as FilterOperator, textValue)
        }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contains">{getMessage('filterOperatorContains', 'Contient')}</SelectItem>
            <SelectItem value="equals">{getMessage('filterOperatorEquals', 'Égal à')}</SelectItem>
            <SelectItem value="not_equals">{getMessage('filterOperatorNotEquals', 'Différent de')}</SelectItem>
            <SelectItem value="starts_with">{getMessage('filterOperatorStartsWith', 'Commence par')}</SelectItem>
            <SelectItem value="ends_with">{getMessage('filterOperatorEndsWith', 'Finit par')}</SelectItem>
            <SelectItem value="is_null">{getMessage('filterOperatorIsNull', 'Est vide')}</SelectItem>
            <SelectItem value="is_not_null">{getMessage('filterOperatorIsNotNull', 'N\'est pas vide')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {operator !== 'is_null' && operator !== 'is_not_null' && (
        <div>
          <label className="text-sm font-medium">{getMessage('filterValueLabel', 'Valeur')}</label>
          <Input
            value={textValue}
            onChange={(e) => {
              const newValue = e.target.value
              setTextValue(newValue)
              handleUpdate(operator, newValue)
            }}
            placeholder={getMessage('filterValuePlaceholder', 'Entrez une valeur...')}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Contrôle de filtre pour les nombres
 */
export function NumberFilterControl({ value, onChange, messages }: {
  value: FilterValue<number> | undefined
  onChange: (value: FilterValue<number> | undefined) => void
  messages?: DataTableMessages
}) {
  const [operator, setOperator] = useState<FilterOperator>(value?.operator || 'equals')
  const [numberValue, setNumberValue] = useState(() => {
    if (value && 'value' in value) {
      return String(value.value || '')
    }
    return ''
  })
  const [numberValue2, setNumberValue2] = useState(() => {
    if (value && 'value2' in value) {
      return String(value.value2 || '')
    }
    return ''
  })

  // Fonction utilitaire pour récupérer les messages avec fallback
  const getMessage = (key: keyof DataTableMessages, defaultValue: string): string => {
    return messages?.[key] || defaultValue
  }

  useEffect(() => {
    if (value) {
      setOperator(value.operator)
      if ('value' in value) {
        setNumberValue(String(value.value || ''))
      } else {
        setNumberValue('')
      }
      if ('value2' in value) {
        setNumberValue2(String(value.value2 || ''))
      } else {
        setNumberValue2('')
      }
    }
  }, [value])

  const handleUpdate = (newOperator: FilterOperator, newValue: string, newValue2?: string) => {
    if (newOperator === 'is_null' || newOperator === 'is_not_null') {
      onChange({ operator: newOperator })
      return
    }

    const num = parseFloat(newValue)
    if (isNaN(num)) {
      onChange(undefined)
      return
    }

    if (newOperator === 'between') {
      const num2 = parseFloat(newValue2 || '')
      if (isNaN(num2)) {
        onChange(undefined)
        return
      }
      onChange({ operator: newOperator, value: num, value2: num2 } as FilterValue<number>)
    } else {
      onChange({ operator: newOperator, value: num } as FilterValue<number>)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">{getMessage('filterOperatorLabel', 'Opérateur')}</label>
        <Select value={operator} onValueChange={(newOp) => {
          setOperator(newOp as FilterOperator)
          handleUpdate(newOp as FilterOperator, numberValue, numberValue2)
        }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">{getMessage('filterOperatorEquals', 'Égal à')}</SelectItem>
            <SelectItem value="not_equals">{getMessage('filterOperatorNotEquals', 'Différent de')}</SelectItem>
            <SelectItem value="greater_than">{getMessage('filterOperatorGreaterThan', 'Plus grand que')}</SelectItem>
            <SelectItem value="greater_or_equal">{getMessage('filterOperatorGreaterOrEqual', 'Plus grand ou égal')}</SelectItem>
            <SelectItem value="less_than">{getMessage('filterOperatorLessThan', 'Plus petit que')}</SelectItem>
            <SelectItem value="less_or_equal">{getMessage('filterOperatorLessOrEqual', 'Plus petit ou égal')}</SelectItem>
            <SelectItem value="between">{getMessage('filterOperatorBetween', 'Entre')}</SelectItem>
            <SelectItem value="is_null">{getMessage('filterOperatorIsNull', 'Est vide')}</SelectItem>
            <SelectItem value="is_not_null">{getMessage('filterOperatorIsNotNull', 'N\'est pas vide')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {operator !== 'is_null' && operator !== 'is_not_null' && (
        <>
          <div>
            <label className="text-sm font-medium">{getMessage('filterValueLabel', 'Valeur')}</label>
            <Input
              type="number"
              value={numberValue}
              onChange={(e) => {
                const newValue = e.target.value
                setNumberValue(newValue)
                handleUpdate(operator, newValue, numberValue2)
              }}
              placeholder={getMessage('filterNumberPlaceholder', 'Entrez un nombre...')}
            />
          </div>

          {operator === 'between' && (
            <div>
              <label className="text-sm font-medium">{getMessage('filterValue2Label', 'Valeur 2')}</label>
              <Input
                type="number"
                value={numberValue2}
                onChange={(e) => {
                  const newValue2 = e.target.value
                  setNumberValue2(newValue2)
                  handleUpdate(operator, numberValue, newValue2)
                }}
                placeholder={getMessage('filterNumberPlaceholder', 'Entrez un nombre...')}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Contrôle de filtre pour les listes/sélections
 */
export function SelectFilterControl({
  value,
  onChange,
  options,
  messages
}: {
  value: FilterValue<string> | undefined
  onChange: (value: FilterValue<string> | undefined) => void
  options: Array<{ value: string; label: string }>
  messages?: DataTableMessages
}) {
  const [operator, setOperator] = useState<FilterOperator>(value?.operator || 'equals')
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    if (!value) return []

    if ('values' in value && value.values) {
      return value.values as string[]
    }

    if ('value' in value && value.value) {
      return [value.value as string]
    }

    return []
  })

  // Fonction utilitaire pour récupérer les messages avec fallback
  const getMessage = (key: keyof DataTableMessages, defaultValue: string): string => {
    return messages?.[key] || defaultValue
  }

  useEffect(() => {
    if (value) {
      setOperator(value.operator)
      if (value.operator === 'in' || value.operator === 'not_in') {
        if ('values' in value && value.values) {
          setSelectedValues(value.values as string[])
        } else {
          setSelectedValues([])
        }
      } else if ('value' in value && value.value) {
        setSelectedValues([value.value as string])
      } else {
        setSelectedValues([])
      }
    }
  }, [value])

  const handleUpdate = (newOperator: FilterOperator, newValues: string[]) => {
    if (newOperator === 'is_null' || newOperator === 'is_not_null') {
      onChange({ operator: newOperator })
      return
    }

    if (newValues.length === 0) {
      onChange(undefined)
      return
    }

    if (newOperator === 'in' || newOperator === 'not_in') {
      onChange({ operator: newOperator, values: newValues } as FilterValue<string>)
    } else {
      onChange({ operator: newOperator, value: newValues[0] } as FilterValue<string>)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">{getMessage('filterOperatorLabel', 'Opérateur')}</label>
        <Select value={operator} onValueChange={(newOp) => {
          setOperator(newOp as FilterOperator)
          handleUpdate(newOp as FilterOperator, selectedValues)
        }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">{getMessage('filterOperatorEquals', 'Égal à')}</SelectItem>
            <SelectItem value="not_equals">{getMessage('filterOperatorNotEquals', 'Différent de')}</SelectItem>
            <SelectItem value="in">{getMessage('filterOperatorIn', 'Dans la liste')}</SelectItem>
            <SelectItem value="not_in">{getMessage('filterOperatorNotIn', 'Pas dans la liste')}</SelectItem>
            <SelectItem value="is_null">{getMessage('filterOperatorIsNull', 'Est vide')}</SelectItem>
            <SelectItem value="is_not_null">{getMessage('filterOperatorIsNotNull', 'N\'est pas vide')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {operator !== 'is_null' && operator !== 'is_not_null' && (
        <div>
          <label className="text-sm font-medium">
            {operator === 'in' || operator === 'not_in'
              ? getMessage('filterValuesLabel', 'Valeurs')
              : getMessage('filterValueLabel', 'Valeur')
            }
          </label>
          <Select
            value={selectedValues[0] || ''}
            onValueChange={(newValue) => {
              const newValues = operator === 'in' || operator === 'not_in'
                ? [...selectedValues, newValue]
                : [newValue]
              setSelectedValues(newValues)
              handleUpdate(operator, newValues)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={getMessage('filterSelectPlaceholder', 'Sélectionnez une valeur...')} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
