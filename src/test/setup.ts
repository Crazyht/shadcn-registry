import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { vi, afterEach, expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

/**
 * Nettoie après chaque test
 */
afterEach(() => {
  cleanup()
})

/**
 * Mock des API navigateur si nécessaire
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
