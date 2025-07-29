// src/pages/home.tsx
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRegistry } from '@/hooks/use-registry'
import { getNavigationItems } from '@/lib/registry-parser'
import { Button } from '@/components/ui/button'

/**
 * Page d'accueil avec navigation vers les différents types
 * Affiche uniquement les types disponibles dans la registry
 */
export function HomePage() {
  const { registry } = useRegistry()
  const navItems = getNavigationItems(registry)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-8 w-8" />
          <h1 className="text-4xl md:text-6xl font-bold">
            ShadCN Registry
          </h1>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Une collection moderne de composants React construits avec Tailwind CSS v4 et React 19.
          Explorez nos composants, hooks, et utilitaires pour accélérer votre développement.
        </p>
      </div>

      {navItems.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
          {navItems.map((item) => (
            <Link
              key={item.type}
              to={item.route}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{item.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Explore {item.label.toLowerCase()}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {navItems.length === 0 && (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            La registry est actuellement vide. Commencez par ajouter des composants !
          </p>
          <Button asChild>
            <a
              href="https://github.com/yourusername/shadcn-registry"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir sur GitHub
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
