import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnimatedCounter } from './animated-counter'

/**
 * Tests pour AnimatedCounter
 * Fichier interne - Non inclus dans la registry
 */
describe('AnimatedCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders with initial value', () => {
    render(<AnimatedCounter value={100} />)
    expect(screen.getByText(/0/)).toBeInTheDocument()
  })

  it('renders with prefix', () => {
    render(<AnimatedCounter value={100} prefix="$" />)
    expect(screen.getByText(/\$/)).toBeInTheDocument()
  })

  it('renders with suffix', () => {
    render(<AnimatedCounter value={100} suffix="%" />)
    expect(screen.getByText(/%/)).toBeInTheDocument()
  })

  it('accepts ref prop', () => {
    const ref = { current: null }
    render(<AnimatedCounter value={100} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('applies custom className', () => {
    render(<AnimatedCounter value={100} className="custom-class" />)
    expect(screen.getByText(/0/).className).toContain('custom-class')
  })
})
