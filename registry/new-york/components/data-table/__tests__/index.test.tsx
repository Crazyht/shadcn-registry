import { describe, it, expect } from 'vitest'

// Import all test suites
import './basic.test'
import './sorting.test'
import './pagination.test'
import './row-selection.test'
import './grouping.test'
import './filtering.test'
import './infinite-scroll.test'

describe('DataTable - Complete Test Suite', () => {
  it('should import all test modules successfully', () => {
    // Ce test vérifie simplement que tous les modules de test sont importés sans erreur
    expect(true).toBe(true)
  })
})
