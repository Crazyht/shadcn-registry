// Safe component renderer that prevents hooks ordering issues
import { lazy, Suspense, useState, useEffect } from 'react'

interface SafeComponentRendererProps {
  componentName: string
  docsPath: string
}

// Pre-load all docs modules using import.meta.glob (Vite's recommended way)
// Use relative pattern from src to registry
const docsModules = import.meta.glob('../../registry/**/*.docs.tsx', { eager: false })

// Create a lazy component loader that uses the pre-loaded modules
function createLazyDocumentationComponent(docsPath: string) {
  return lazy(async () => {
    console.log('🔍 Attempting to load:', docsPath)

    try {
      // Normalize the path for our glob pattern (absolute from project root)
      const normalizedPath = docsPath.startsWith('/')
        ? docsPath
        : `/${docsPath}`

      console.log('🔄 Looking for module at:', normalizedPath)

      // Try to find the exact match first
      if (docsModules[normalizedPath]) {
        console.log('✅ Found exact match for:', normalizedPath)
        const module = await docsModules[normalizedPath]() as Record<string, unknown>

        if (module.default && typeof module.default === 'function') {
          return { default: module.default as React.ComponentType }
        }

        // Try named exports
        const namedExports = Object.keys(module).filter(key => key !== 'default')
        for (const exportName of namedExports) {
          const component = module[exportName]
          if (typeof component === 'function') {
            console.log('✅ Found component via named export:', exportName)
            return { default: component as React.ComponentType }
          }
        }
      }

      // If no exact match, try to find by pattern
      const matchingPaths = Object.keys(docsModules).filter(path => {
        const componentName = docsPath.split('/').pop()?.replace('.docs.tsx', '') || ''
        return path.includes(componentName) && path.endsWith('.docs.tsx')
      })

      console.log('🔍 Matching paths found:', matchingPaths)

      for (const matchingPath of matchingPaths) {
        try {
          console.log('🔄 Trying matching path:', matchingPath)
          const module = await docsModules[matchingPath]() as Record<string, unknown>

          if (module.default && typeof module.default === 'function') {
            console.log('✅ Found component via pattern match at:', matchingPath)
            return { default: module.default as React.ComponentType }
          }

          // Try named exports
          const namedExports = Object.keys(module).filter(key => key !== 'default')
          for (const exportName of namedExports) {
            const component = module[exportName]
            if (typeof component === 'function') {
              console.log('✅ Found component via named export in pattern match:', exportName)
              return { default: component as React.ComponentType }
            }
          }
        } catch (error) {
          console.log('❌ Pattern match failed for:', matchingPath, error)
          continue
        }
      }

      // Fallback component
      console.log('❌ SafeComponentRenderer - All strategies failed, using fallback component')
      console.log('📋 Available modules:', Object.keys(docsModules))
      return {
        default: function FallbackDocumentation() {
          return (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Documentation Not Found</h1>
              <p className="text-muted-foreground">
                Could not load documentation for this component.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Tried to load: {docsPath}
              </p>
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm">Available modules ({Object.keys(docsModules).length})</summary>
                <pre className="text-xs mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                  {Object.keys(docsModules).join('\n')}
                </pre>
              </details>
            </div>
          )
        }
      }
    } catch (error) {
      console.error('Failed to load documentation:', error)
      return {
        default: function ErrorDocumentation() {
          return (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2 text-destructive">Error</h1>
              <p className="text-muted-foreground">
                Failed to load documentation: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          )
        }
      }
    }
  })
}

// Component registry to avoid recreating lazy components
const componentRegistry = new Map<string, React.LazyExoticComponent<React.ComponentType>>()

export function SafeComponentRenderer({ componentName, docsPath }: SafeComponentRendererProps) {
  const [key, setKey] = useState(0)

  // Create or get cached lazy component
  const LazyComponent = (() => {
    const cacheKey = `${componentName}-${docsPath}`

    if (!componentRegistry.has(cacheKey)) {
      componentRegistry.set(cacheKey, createLazyDocumentationComponent(docsPath))
    }

    const component = componentRegistry.get(cacheKey)
    if (!component) {
      throw new Error(`Failed to load component: ${componentName}`)
    }
    return component
  })()

  // Listen for HMR updates in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleHMRUpdate = (event: CustomEvent) => {
        if (event.detail.componentName === componentName) {
          console.log(`HMR Update detected for ${componentName}, clearing cache...`)
          // Clear cache and force re-render
          const cacheKey = `${componentName}-${docsPath}`
          componentRegistry.delete(cacheKey)
          setKey(prev => prev + 1)
        }
      }

      window.addEventListener('docs-hmr-update', handleHMRUpdate as EventListener)

      return () => {
        window.removeEventListener('docs-hmr-update', handleHMRUpdate as EventListener)
      }
    }
  }, [componentName, docsPath])

  return (
    <Suspense
      key={key}
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading documentation...</div>
        </div>
      }
    >
      <LazyComponent />
    </Suspense>
  )
}

// Default export as well for compatibility
export default SafeComponentRenderer
