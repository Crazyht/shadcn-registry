// src/pages/registry-list.tsx
import { useRegistry } from '@/hooks/use-registry'
import { getItemsByType } from '@/lib/registry-parser'
import { RegistryType } from '@/types/registry'
import { ComponentCard } from '@/components/registry/component-card'
import * as Icons from 'lucide-react'

interface RegistryListPageProps {
  type: RegistryType
  title: string
  icon: string
}

/**
 * Page générique pour afficher les items d'un type spécifique
 * S'adapte automatiquement au contenu de la registry
 */
export function RegistryListPage({ type, title, icon }: RegistryListPageProps) {
  const { registry, loading, error } = useRegistry()
  const items = getItemsByType(registry, type)

  /**
   * Récupère l'icône correspondante
   * @param iconName - Nom de l'icône
   * @returns Composant icône
   */
  function getIcon(iconName: string) {
    const iconMap: Record<string, any> = {
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
    return <Icon className="h-6 w-6" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading registry...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive">Error: {error}</div>
      </div>
    )
  }

  const Icon = getIcon(icon)

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        {Icon}
        <h1 className="text-3xl font-bold">{title}</h1>
        <span className="text-muted-foreground">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No {title.toLowerCase()} found in the registry.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ComponentCard
              key={item.name}
              item={item}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  )
}
