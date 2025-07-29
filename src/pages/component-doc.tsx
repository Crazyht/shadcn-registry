// src/pages/component-doc.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRegistry } from '@/hooks/use-registry'
import { RegistryType } from '@/types/registry'
import { getFilePath } from '@/lib/registry-parser'

// Pre-load all documentation components using import.meta.glob
const docModules = import.meta.glob('@registry/**/*.docs.tsx', { eager: false })

interface ComponentDocPageProps {
  type: RegistryType
}

/**
 * Page de documentation pour un composant spécifique
 */
export function ComponentDocPage({ type }: ComponentDocPageProps) {
  const { componentName } = useParams<{ componentName: string }>()
  const navigate = useNavigate()
  const { registry } = useRegistry()
  const [Documentation, setDocumentation] = useState<React.ComponentType | null>(null)

  const item = registry?.items.find(
    i => i.name === componentName && i.type === type
  )

  useEffect(() => {
    if (!item) return

    async function loadDocumentation() {
      try {
        const firstFile = item?.files[0]
        if (!firstFile) {
          console.warn(`No file found for component ${componentName}`)
          return
        }

        // Handle both old string format and new object format
        const fileName = getFilePath(firstFile)

        // Construct the documentation file path from the main file path
        // Remove file extension and add .docs.tsx
        const docsPath = fileName.replace(/\.(tsx?|jsx?)$/, '.docs.tsx')

        // import.meta.glob with @registry/** will generate keys like:
        // "/registry/new-york/components/animated-counter/animated-counter.docs.tsx"
        const moduleKey = `/${docsPath}`

        console.log('Looking for docs module:', moduleKey)
        console.log('Available docs modules:', Object.keys(docModules))

        if (docModules[moduleKey]) {
          const module = await docModules[moduleKey]() as any

          if (module.default) {
            setDocumentation(() => module.default)
          }
        } else {
          console.log(`No documentation module found for key: ${moduleKey}`)
        }
      } catch {
        console.error(`No documentation found for ${componentName}`)
      }
    }

    loadDocumentation()
  }, [item, componentName])

  if (!item) {
    return (
      <div className="space-y-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Component not found</h1>
          <p className="text-muted-foreground">
            The component "{componentName}" doesn't exist in the registry.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </Button>

      {Documentation ? (
        <Suspense fallback={<div>Loading documentation...</div>}>
          <Documentation />
        </Suspense>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
          {item.description && (
            <p className="text-lg text-muted-foreground mb-6">{item.description}</p>
          )}
          <div className="prose dark:prose-invert max-w-none">
            <p>No documentation available for this component.</p>
            <h2>Installation</h2>
            <pre className="bg-muted p-4 rounded-lg">
              <code>npx shadcn add {item.name}</code>
            </pre>
            <h2>Files</h2>
            <ul>
              {item.files.map((file, index) => (
                <li key={index}><code>{getFilePath(file)}</code></li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
