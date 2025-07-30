import { useState, useEffect, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'

/**
 * Props pour le composant NumericInput
 */
export interface NumericInputProps {
  /** Valeur actuelle */
  value?: number
  /** Valeur par défaut */
  defaultValue?: number
  /** Valeur minimum */
  min?: number
  /** Valeur maximum */
  max?: number
  /** Pas d'incrémentation */
  step?: number
  /** Nombre de décimales */
  decimals?: number
  /** Placeholder */
  placeholder?: string
  /** Désactivé */
  disabled?: boolean
  /** Lecture seule */
  readOnly?: boolean
  /** Afficher les boutons +/- */
  showControls?: boolean
  /** Préfixe (ex: '$') */
  prefix?: string
  /** Suffixe (ex: '%') */
  suffix?: string
  /** Classes CSS additionnelles */
  className?: string
  /** Callback de changement de valeur */
  onValueChange?: (value: number | undefined) => void
  /** Callback d'événement de changement */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Callback de focus */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Callback de blur */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

/**
 * Composant d'input numérique avec contrôles +/- et validation
 * @component
 * @example
 * ```tsx
 * <NumericInput
 *   value={25}
 *   min={0}
 *   max={100}
 *   step={5}
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      value,
      defaultValue,
      min = -Infinity,
      max = Infinity,
      step = 1,
      decimals = 0,
      placeholder,
      disabled = false,
      readOnly = false,
      showControls = true,
      prefix,
      suffix,
      className,
      onValueChange,
      onChange,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<number | undefined>(
      value ?? defaultValue
    )
    const [inputValue, setInputValue] = useState('')

    // Format number with decimals
    const formatNumber = (num: number | undefined): string => {
      if (num === undefined || isNaN(num)) return ''
      return num.toFixed(decimals)
    }

    // Parse string to number
    const parseNumber = (str: string): number | undefined => {
      if (str === '') return undefined
      const num = parseFloat(str)
      return isNaN(num) ? undefined : num
    }

    // Apply decimal precision to a number
    const applyDecimals = (num: number): number => {
      return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
    }

    // Clamp value between min and max
    const clampValue = (num: number): number => {
      return Math.max(min, Math.min(max, num))
    }

    // Update internal value when value prop changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
        setInputValue(formatNumber(value))
      }
    }, [value, decimals])

    // Initialize input value
    useEffect(() => {
      setInputValue(formatNumber(internalValue))
    }, [internalValue, decimals])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      setInputValue(newValue)

      const parsedValue = parseNumber(newValue)
      if (parsedValue !== undefined) {
        // Only apply constraints, not decimal rounding during input
        const clampedValue = clampValue(parsedValue)
        setInternalValue(clampedValue)
        onValueChange?.(clampedValue)
      } else {
        setInternalValue(undefined)
        onValueChange?.(undefined)
      }

      onChange?.(event)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      // Apply decimal rounding and formatting on blur
      if (internalValue !== undefined) {
        const roundedValue = applyDecimals(internalValue)
        const clampedValue = clampValue(roundedValue)
        setInternalValue(clampedValue)
        setInputValue(formatNumber(clampedValue))
        onValueChange?.(clampedValue)
      }
      onBlur?.(event)
    }

    const handleIncrement = () => {
      if (disabled || readOnly) return

      const currentValue = internalValue ?? 0
      const rawNewValue = currentValue + step
      const roundedValue = applyDecimals(rawNewValue)
      const newValue = clampValue(roundedValue)

      setInternalValue(newValue)
      setInputValue(formatNumber(newValue))
      onValueChange?.(newValue)
    }

    const handleDecrement = () => {
      if (disabled || readOnly) return

      const currentValue = internalValue ?? 0
      const rawNewValue = currentValue - step
      const roundedValue = applyDecimals(rawNewValue)
      const newValue = clampValue(roundedValue)

      setInternalValue(newValue)
      setInputValue(formatNumber(newValue))
      onValueChange?.(newValue)
    }

    const canIncrement = !disabled && !readOnly && (internalValue ?? 0) < max
    const canDecrement = !disabled && !readOnly && (internalValue ?? 0) > min

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (canIncrement) {
          handleIncrement()
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (canDecrement) {
          handleDecrement()
        }
      }
    }

    return (
      <div className={cn('relative flex items-center', className)}>
        {prefix && (
          <span className="absolute left-3 text-muted-foreground pointer-events-none z-10">
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            prefix && 'pl-8',
            suffix && !showControls && 'pr-8',
            suffix && showControls && 'pr-12',
            !suffix && showControls && 'pr-8'
          )}
        />

        {suffix && (
          <span className={cn(
            "absolute text-muted-foreground pointer-events-none z-10",
            showControls ? "right-8" : "right-3"
          )}>
            {suffix}
          </span>
        )}

        {showControls && (
          <div className="absolute right-1 flex flex-col">
            <button
              type="button"
              onClick={handleIncrement}
              disabled={!canIncrement}
              aria-label="Plus"
              className={cn(
                'flex h-4 w-6 items-center justify-center rounded-sm border border-input bg-background text-xs',
                'hover:bg-accent hover:text-accent-foreground',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              )}
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={!canDecrement}
              aria-label="Minus"
              className={cn(
                'flex h-4 w-6 items-center justify-center rounded-sm border border-input bg-background text-xs mt-0.5',
                'hover:bg-accent hover:text-accent-foreground',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              )}
            >
              <Minus className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    )
  }
)

NumericInput.displayName = 'NumericInput'
