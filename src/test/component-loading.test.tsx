// Test to verify dynamic component loading works correctly
import { describe, it, expect } from 'vitest'

describe('Component Loading', () => {
  it('should load preview modules with correct keys', async () => {
    // Test that import.meta.glob generates the expected keys
    const previewModules = import.meta.glob('@registry/**/*.preview.tsx', { eager: false })

    const moduleKeys = Object.keys(previewModules)
    console.log('Available preview modules:', moduleKeys)

    // Should have at least one preview module
    expect(moduleKeys.length).toBeGreaterThan(0)

    // Keys should start with /registry/ (not @registry/)
    const hasCorrectKeyFormat = moduleKeys.some(key =>
      key.startsWith('/registry/') && key.endsWith('.preview.tsx')
    )
    expect(hasCorrectKeyFormat).toBe(true)
  })

  it('should load animated-counter preview correctly', async () => {
    const previewModules = import.meta.glob('@registry/**/*.preview.tsx', { eager: false })

    // The expected key for animated-counter preview
    const expectedKey = '/registry/new-york/components/animated-counter/animated-counter.preview.tsx'

    expect(previewModules[expectedKey]).toBeDefined()

    if (previewModules[expectedKey]) {
      const module = await previewModules[expectedKey]() as any

      // Should have AnimatedCounterPreview export (PascalCase)
      expect(module.AnimatedCounterPreview).toBeDefined()
      expect(typeof module.AnimatedCounterPreview).toBe('function')

      // Verify the component name transformation works
      const componentName = 'animated-counter'
      const pascalComponentName = componentName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')

      expect(pascalComponentName).toBe('AnimatedCounter')
      expect(module[`${pascalComponentName}Preview`]).toBe(module.AnimatedCounterPreview)
    }
  })
})
