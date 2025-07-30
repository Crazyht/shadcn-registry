import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { NumericInput } from './numeric-input'

describe('NumericInput', () => {
  it('renders with default props', () => {
    render(<NumericInput />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('displays initial value', () => {
    render(<NumericInput value={42} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('42')
  })

  it('displays default value when no value prop', () => {
    render(<NumericInput defaultValue={10} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('10')
  })

  it('calls onValueChange when value changes', () => {
    const onValueChange = vi.fn()
    render(<NumericInput onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '25' } })

    expect(onValueChange).toHaveBeenCalledWith(25)
  })

  it('increments value with plus button', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={10} step={5} onValueChange={onValueChange} />)

    const plusButton = screen.getByRole('button', { name: /plus/i })
    fireEvent.click(plusButton)

    expect(onValueChange).toHaveBeenCalledWith(15)
  })

  it('decrements value with minus button', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={10} step={3} onValueChange={onValueChange} />)

    const minusButton = screen.getByRole('button', { name: /minus/i })
    fireEvent.click(minusButton)

    expect(onValueChange).toHaveBeenCalledWith(7)
  })

  it('respects min constraint', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={5} min={0} max={100} onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '-10' } })

    expect(onValueChange).toHaveBeenCalledWith(0)
  })

  it('respects max constraint', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={90} min={0} max={100} onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '150' } })

    expect(onValueChange).toHaveBeenCalledWith(100)
  })

  it('disables buttons at boundaries', () => {
    render(<NumericInput value={0} min={0} max={10} />)

    const minusButton = screen.getByRole('button', { name: /minus/i })
    const plusButton = screen.getByRole('button', { name: /plus/i })

    expect(minusButton).toBeDisabled()
    expect(plusButton).not.toBeDisabled()
  })

  it('displays prefix and suffix', () => {
    render(<NumericInput value={100} prefix="$" suffix="%" />)

    expect(screen.getByText('$')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('formats decimals correctly', () => {
    render(<NumericInput value={10.567} decimals={2} />)
    const input = screen.getByRole('textbox')

    act(() => {
      fireEvent.blur(input)
    })

    expect(input).toHaveValue('10.57')
  })

  it('hides controls when showControls is false', () => {
    render(<NumericInput showControls={false} />)

    expect(screen.queryByRole('button', { name: /plus/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /minus/i })).not.toBeInTheDocument()
  })

  it('disables input when disabled prop is true', () => {
    render(<NumericInput disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('accepts ref prop', () => {
    const ref = vi.fn()
    render(<NumericInput ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('handles empty input gracefully', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={10} onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })

    expect(onValueChange).toHaveBeenCalledWith(undefined)
  })

  it('applies custom className', () => {
    render(<NumericInput className="custom-class" />)
    const container = screen.getByRole('textbox').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('positions suffix correctly when controls are shown', () => {
    render(<NumericInput value={100} suffix="%" showControls />)

    const suffixElement = screen.getByText('%')
    const plusButton = screen.getByRole('button', { name: /plus/i })

    // Both elements should be present and accessible
    expect(suffixElement).toBeDefined()
    expect(plusButton).toBeDefined()
  })

  it('positions suffix correctly when controls are hidden', () => {
    render(<NumericInput value={100} suffix="%" showControls={false} />)

    const suffixElement = screen.getByText('%')

    expect(suffixElement).toBeDefined()
    expect(screen.queryByRole('button', { name: /plus/i })).toBeNull()
  })

  it('rounds value according to decimals precision on blur', () => {
    const onValueChange = vi.fn()
    render(<NumericInput decimals={0} onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')

    // Test saisie de 5.1 avec decimals=0 - pendant la saisie, garde la valeur exacte
    fireEvent.change(input, { target: { value: '5.1' } })
    expect(onValueChange).toHaveBeenCalledWith(5.1)

    // L'arrondi se fait au blur
    act(() => {
      fireEvent.blur(input)
    })
    expect(onValueChange).toHaveBeenCalledWith(5) // Arrondi à l'entier
  })

  it('preserves decimal precision when specified on blur', () => {
    const onValueChange = vi.fn()
    render(<NumericInput decimals={2} onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')

    // Test saisie de 5.123 - pendant la saisie, garde la valeur exacte
    fireEvent.change(input, { target: { value: '5.123' } })
    expect(onValueChange).toHaveBeenCalledWith(5.123)

    // L'arrondi se fait au blur
    act(() => {
      fireEvent.blur(input)
    })
    expect(onValueChange).toHaveBeenCalledWith(5.12) // Arrondi à 2 décimales
  })

  it('increments value with arrow up key', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={10} step={5} onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'ArrowUp' })

    expect(onValueChange).toHaveBeenCalledWith(15)
  })

  it('decrements value with arrow down key', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={10} step={3} onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    expect(onValueChange).toHaveBeenCalledWith(7)
  })

  it('respects boundaries with arrow keys', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={0} min={0} max={10} onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')

    // Ne peut pas décrémenter en dessous du minimum
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(onValueChange).not.toHaveBeenCalled()

    // Peut incrémenter
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(onValueChange).toHaveBeenCalledWith(1)
  })

  it('ignores arrow keys when disabled', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={10} disabled onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('ignores arrow keys when readOnly', () => {
    const onValueChange = vi.fn()
    render(<NumericInput value={10} readOnly onValueChange={onValueChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    expect(onValueChange).not.toHaveBeenCalled()
  })
})
