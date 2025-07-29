// src/components/layout/layout.tsx
import { Header } from './header'
import { RegistryProvider } from '@/providers/registry-provider'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * Layout principal de l'application
 * Inclut le header et le provider de registry
 */
export function Layout({ children }: LayoutProps) {
  return (
    <RegistryProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </RegistryProvider>
  )
}
