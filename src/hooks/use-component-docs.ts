// src/hooks/use-component-docs.ts
import { useState, useEffect, useCallback } from 'react'
import { getFilePath } from '@/lib/registry-parser'
import { getDocModuleCache, clearDocModuleCache } from '@/lib/hmr-helper'
import { RegistryItem } from '@/types/registry'

interface UseComponentDocsOptions {
  item: RegistryItem | undefined
  componentName: string | undefined
}

interface UseComponentDocsReturn {
  Documentation: React.ComponentType | null
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useComponentDocs({ item, componentName }: UseComponentDocsOptions): UseComponentDocsReturn {
  const [Documentation, setDocumentation] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearCache = useCallback(() => {
    clearDocModuleCache()
  }, [])

  const loadDocumentation = useCallback(async () => {
    if (!item || !componentName) {
      setDocumentation(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setDocumentation(null)

    try {
      const firstFile = item.files[0]
      if (!firstFile) {
        setError(`No file found for component ${componentName}`)
        return
      }

      const fileName = getFilePath(firstFile)
      const docsPath = fileName.replace(/\.(tsx?|jsx?)$/, '.docs.tsx')      // Check cache first
      const moduleCache = getDocModuleCache()
      const cacheKey = docsPath
      if (moduleCache.has(cacheKey)) {
        setDocumentation(moduleCache.get(cacheKey)!)
        return
      }

      console.log('Loading documentation from:', docsPath)

      // Try multiple import strategies
      const component = await tryImportStrategies(docsPath, componentName)

      if (component) {
        moduleCache.set(cacheKey, component)
        setDocumentation(component)
      } else {
        setError(`No documentation found for ${componentName}`)
      }
    } catch (err) {
      console.error(`Error loading documentation for ${componentName}:`, err)
      setError(`Failed to load documentation: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }, [item, componentName])

  const reload = useCallback(() => {
    clearCache()
    loadDocumentation()
  }, [clearCache, loadDocumentation])

  useEffect(() => {
    loadDocumentation()
  }, [loadDocumentation])  // Clear cache and reload on dev mode for better HMR
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleFocus = () => {
        // Reload documentation when window regains focus (helpful for dev)
        setTimeout(reload, 100)
      }

      const handleHMRUpdate = (event: CustomEvent) => {
        console.log('HMR: Documentation update detected:', event.detail)
        // Clear cache and reload if it's the current component
        if (componentName && event.detail.file?.includes(componentName)) {
          clearCache()
          setTimeout(loadDocumentation, 100)
        }
      }

      window.addEventListener('focus', handleFocus)
      window.addEventListener('docs-hmr-update', handleHMRUpdate as EventListener)

      return () => {
        window.removeEventListener('focus', handleFocus)
        window.removeEventListener('docs-hmr-update', handleHMRUpdate as EventListener)
      }
    }
  }, [reload, clearCache, loadDocumentation, componentName])

  return {
    Documentation,
    isLoading,
    error,
    reload
  }
}

async function tryImportStrategies(docsPath: string, componentName: string): Promise<React.ComponentType | null> {
  // Cache busting timestamp for development
  const timestamp = process.env.NODE_ENV === 'development' ? `?t=${Date.now()}&r=${Math.random()}` : ''

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
        key.includes(`/${componentName}.docs.tsx`)
      )
      if (componentKey && modules[componentKey]) {
        return await modules[componentKey]()
      }

      throw new Error('Module not found in glob')
    },

    // Strategy 2: Import from registry alias with cache busting (only if Strategy 1 fails)
    async () => {
      const registryPath = docsPath.replace('registry/', '')
      return await import(/* @vite-ignore */ `@registry/${registryPath}${timestamp}`)
    },

    // Strategy 3: Direct path to component docs with cache busting
    async () => {
      return await import(/* @vite-ignore */ `@registry/new-york/components/${componentName}/${componentName}.docs.tsx${timestamp}`)
    },

    // Strategy 4: Fallback direct import (last resort)
    async () => {
      return await import(/* @vite-ignore */ `/${docsPath}${timestamp}`)
    }
  ]

  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`Trying import strategy ${i + 1} for ${docsPath}`)
      const module = await strategies[i]()

      if (module.default && typeof module.default === 'function') {
        console.log(`Successfully loaded with strategy ${i + 1}`)
        return module.default
      }

      // Try named exports
      const namedExports = Object.keys(module).filter(key => key !== 'default')
      for (const exportName of namedExports) {
        const component = module[exportName]
        if (typeof component === 'function') {
          console.log(`Successfully loaded named export '${exportName}' with strategy ${i + 1}`)
          return component
        }
      }

    } catch (err) {
      console.log(`Strategy ${i + 1} failed:`, err)
      // For the first strategy (glob), if it fails, continue to other strategies
      // For other strategies, if we get a 500 error, skip to the next one
      if (err && typeof err === 'object' && 'message' in err && err.message.includes('500')) {
        console.log(`Strategy ${i + 1} returned 500 error, skipping to next strategy`)
        continue
      }
      continue
    }
  }

  return null
}
