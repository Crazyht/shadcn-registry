// src/providers/registry-provider.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useRegistry as useRegistryHook } from '@/hooks/use-registry'
import { Registry } from '@/types/registry'

/**
 * Contexte pour la registry
 */
interface RegistryContextValue {
  registry: Registry | null
  loading: boolean
  error: string | null
}

const RegistryContext = createContext<RegistryContextValue | undefined>(undefined)

/**
 * Provider pour partager l'état de la registry
 * @param children - Composants enfants
 */
export function RegistryProvider({ children }: { children: ReactNode }) {
  const registryData = useRegistryHook()

  return (
    <RegistryContext.Provider value={registryData}>
      {children}
    </RegistryContext.Provider>
  )
}

/**
 * Hook pour accéder au contexte de la registry
 * @returns Données de la registry
 * @throws Error si utilisé hors du provider
 */
export function useRegistry() {
  const context = useContext(RegistryContext)
  if (context === undefined) {
    throw new Error('useRegistry must be used within a RegistryProvider')
  }
  return context
}
