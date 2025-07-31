// Safe component renderer that prevents hooks ordering issues
import { lazy, Suspense, useState, useEffect } from 'react'

interface SafeComponentRendererProps {
  componentName: string
  docsPath: string
}

// Create a lazy component loader that doesn't store components in state
function createLazyDocumentationComponent(docsPath: string) {
  return lazy(async () => {
    try {
      console.log('Loading documentation from:', docsPath)

      // Use our import strategies
      const strategies = [
        // Strategy 1: Use import.meta.glob first (most reliable)
        async () => {
          const modules = import.meta.glob('@registry/**/*.docs.tsx', { eager: false })
          const registryPath = docsPath.startsWith('registry/') ? docsPath.replace('registry/', '@registry/') : `@registry/${docsPath}`

          // Try exact match first
          if (modules[registryPath]) {
            return await modules[registryPath]()
          }

          // Try finding by component name
          const componentKey = Object.keys(modules).find(key =>
            key.includes(docsPath.split('/').pop() || '')
          )
          if (componentKey && modules[componentKey]) {
            return await modules[componentKey]()
          }

          throw new Error('Module not found in glob')
        },

        // Strategy 2: Import from registry alias
        async () => {
          const registryPath = docsPath.replace('registry/', '')
          return await import(/* @vite-ignore */ `@registry/${registryPath}`)
        },

        // Strategy 3: Direct component path
        async () => {
          const componentName = docsPath.split('/').pop()?.replace('.docs.tsx', '') || ''
          return await import(/* @vite-ignore */ `@registry/new-york/components/${componentName}/${componentName}.docs.tsx`)
        },

        // Strategy 4: Direct hook path
        async () => {
          const hookName = docsPath.split('/').pop()?.replace('.docs.tsx', '') || ''
          if (docsPath.includes('/hooks/')) {
            return await import(/* @vite-ignore */ `@registry/new-york/hooks/${hookName}.docs.tsx`)
          }
          throw new Error('Not a hook path')
        }
      ]

      for (let i = 0; i < strategies.length; i++) {
        try {
          console.log(`Trying import strategy ${i + 1} for ${docsPath}`)
          const module = await strategies[i]()

          if (module.default && typeof module.default === 'function') {
            console.log(`Successfully loaded with strategy ${i + 1}`)
            return { default: module.default }
          }

          // Try named exports
          const namedExports = Object.keys(module).filter(key => key !== 'default')
          for (const exportName of namedExports) {
            const component = module[exportName]
            if (typeof component === 'function') {
              console.log(`Successfully loaded named export '${exportName}' with strategy ${i + 1}`)
              return { default: component }
            }
          }
        } catch (err) {
          console.log(`Strategy ${i + 1} failed:`, err)
          continue
        }
      }

      // Fallback component
      console.log('All strategies failed, using fallback component')
      return {
        default: function FallbackDocumentation() {
          return (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Documentation Not Found</h1>
              <p className="text-muted-foreground">
                Could not load documentation for this component.
              </p>
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

    return componentRegistry.get(cacheKey)!
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
