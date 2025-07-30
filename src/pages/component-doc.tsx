// src/pages/component-doc.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRegistry } from '@/hooks/use-registry'
import { HMRStatus } from '@/components/hmr-status'
import { SafeComponentRenderer } from '@/components/safe-component-renderer'
import { RegistryType } from '@/types/registry'
import { getFilePath } from '@/lib/registry-parser'

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

  const item = registry?.items.find(
    i => i.name === componentName && i.type === type
  )

  // Force reload function for HMR
  const forceReload = () => {
    // Trigger HMR update for this component
    window.dispatchEvent(new CustomEvent('docs-hmr-update', {
      detail: {
        componentName,
        timestamp: Date.now()
      }
    }))
  }

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
      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Button>

        {process.env.NODE_ENV === 'development' && (
          <Button
            onClick={forceReload}
            variant="outline"
            size="sm"
            className="gap-2"
            title="Reload documentation (Dev mode)"
          >
            <RefreshCw className="h-4 w-4" />
            Reload
          </Button>
        )}
      </div>

      {/* Render documentation using safe component renderer */}
      {componentName && item && (
        <SafeComponentRenderer
          componentName={componentName}
          docsPath={getFilePath(item.files[0]).replace(/\.(tsx?|jsx?)$/, '.docs.tsx')}
        />
      )}

      {/* HMR Status indicator for development */}
      <HMRStatus onReload={forceReload} />
    </div>
  )
}
