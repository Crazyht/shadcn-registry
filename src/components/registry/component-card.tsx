// src/components/registry/component-card.tsx
import { useState, useEffect, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { RegistryItem, RegistryType, REGISTRY_TYPES } from '@/types/registry'
import { getFilePath } from '@/lib/registry-parser'
import { FileCode } from 'lucide-react'

// Pre-load all preview components using import.meta.glob
const previewModules = import.meta.glob('@registry/**/*.preview.tsx', { eager: false })

interface ComponentCardProps {
  item: RegistryItem
  type: RegistryType
}

/**
 * Card pour afficher un composant avec sa preview
 */
export function ComponentCard({ item, type }: ComponentCardProps) {
  const [Preview, setPreview] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    // Charger dynamiquement la preview si elle existe
    async function loadPreview() {
      try {
        // Extraire le nom du composant depuis le chemin du fichier
        const firstFile = item.files[0]
        const fileName = getFilePath(firstFile)
        const componentName = fileName
          .split('/')
          .pop()
          ?.replace('.tsx', '')
          ?.replace('.ts', '')

        if (!componentName) return

        // Construct the preview file path from the main file path
        // Remove file extension and add .preview.tsx
        const previewPath = fileName.replace(/\.(tsx?|jsx?)$/, '.preview.tsx')

        // import.meta.glob with @registry/** will generate keys like:
        // "/registry/new-york/components/animated-counter/animated-counter.preview.tsx"
        const moduleKey = `/${previewPath}`

        if (previewModules[moduleKey]) {
          const module = await previewModules[moduleKey]() as {
            default?: React.ComponentType;
            [key: string]: unknown;
          }

          // Convert kebab-case to PascalCase for the component name
          const pascalComponentName = componentName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')

          if (module.default || module[`${pascalComponentName}Preview`]) {
            const component = (module.default || module[`${pascalComponentName}Preview`]) as React.ComponentType
            setPreview(() => component)
          }
        }
      } catch (error) {
        console.error('Error loading preview:', error)
        // La preview n'existe pas, c'est normal
        console.debug(`No preview found for ${item.name}`)
      }
    }

    loadPreview()
  }, [item])

  // Générer l'URL de documentation en utilisant la route correcte
  const registryConfig = REGISTRY_TYPES.find(config => config.type === type)
  const docsUrl = registryConfig ? `${registryConfig.route}/${item.name}` : `/${type.replace('registry:', '')}/${item.name}`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <Link to={docsUrl} className="hover:underline">
          <CardTitle>{item.name}</CardTitle>
        </Link>
        {item.description && (
          <CardDescription>{item.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {Preview ? (
          <div className="border rounded-lg bg-muted/20 min-h-[200px] flex items-center justify-center">
            <Suspense fallback={<div className="text-muted-foreground">Loading preview...</div>}>
              <Preview />
            </Suspense>
          </div>
        ) : (
          <div className="border rounded-lg bg-muted/20 min-h-[200px] flex flex-col items-center justify-center text-muted-foreground">
            <FileCode className="h-8 w-8 mb-2" />
            <span className="text-sm">No preview available</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
          <FileCode className="h-4 w-4" />
          <span>{item.files.length} files</span>
        </div>
      </CardContent>
    </Card>
  )
}
