// src/hooks/use-registry.ts
import { useState, useEffect } from 'react'
import { Registry } from '@/types/registry'
import { loadRegistry } from '@/lib/registry-parser'

/**
 * Hook pour charger et accéder à la registry
 * @returns État de la registry (données, chargement, erreur)
 */
export function useRegistry() {
  const [registry, setRegistry] = useState<Registry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await loadRegistry()
        setRegistry(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load registry')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { registry, loading, error }
}
