// src/components/layout/header.tsx
import { Link } from 'react-router-dom'
import { Moon, Sun, Github, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRegistry } from '@/hooks/use-registry'
import { getNavigationItems } from '@/lib/registry-parser'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

/**
 * Header principal avec navigation adaptative
 * Affiche uniquement les types présents dans la registry
 */
export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { registry } = useRegistry()
  const navItems = getNavigationItems(registry)

  useEffect(() => {
    const dark = localStorage.getItem('theme') === 'dark'
    setIsDark(dark)
    if (dark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  /**
   * Bascule entre thème clair et sombre
   */
  function toggleTheme() {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newTheme)
  }

  /**
   * Récupère l'icône correspondant au nom
   * @param iconName - Nom de l'icône
   * @returns Composant icône
   */
  function getIcon(iconName: string) {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      blocks: Icons.Blocks,
      package: Icons.Package,
      library: Icons.Library,
      zap: Icons.Zap,
      layers: Icons.Layers,
      'file-image': Icons.FileImage,
      file: Icons.File,
      brush: Icons.Brush,
      palette: Icons.Palette,
      'grid-3x3': Icons.Grid3x3
    }

    const Icon = iconMap[iconName] || Icons.Package
    return <Icon className="h-4 w-4" />
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo/Titre - Gauche */}
          <div className="flex items-center gap-6 flex-1">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="text-xl">ShadCN Registry</span>
            </Link>
          </div>

          {/* Navigation - Centre */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.type}
                to={item.route}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  "text-muted-foreground"
                )}
              >
                {getIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions - Droite */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <a
              href="https://github.com/yourusername/shadcn-registry"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>

            <button
              onClick={toggleTheme}
              className="hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation mobile */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.type}
                  to={item.route}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {getIcon(item.icon)}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
