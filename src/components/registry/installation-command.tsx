import { useState, useEffect } from 'react'
import { Button } from '../ui/button'

interface InstallationCommandProps {
  /** Chemin relatif du composant dans la registry (ex: "hooks/use-debounce" ou "components/animated-counter") */
  componentPath: string
  /** Classe CSS optionnelle */
  className?: string
}

/**
 * Composant pour afficher une commande d'installation shadcn dynamique
 * Utilise l'URL actuelle et la variable BASE_URL de Vite pour construire l'URL complète de la registry
 * Format: domaine/{base}/r/{itemname}.json
 */
export function InstallationCommand({ componentPath, className = '' }: InstallationCommandProps) {
  const [registryUrl, setRegistryUrl] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin

      // Utiliser la variable base de Vite (ex: '/shadcn-registry/' ou '/')
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, '') // Retirer le / final

      // Extraire le nom de l'item depuis le componentPath
      // "hooks/use-debounce" → "use-debounce"
      // "components/animated-counter" → "animated-counter"
      const itemName = componentPath.split('/').pop() || ''

      // Construire l'URL selon le format: domaine/{base}/r/{itemname}.json
      setRegistryUrl(`${origin}${basePath}/r/${itemName}.json`)
    }
  }, [componentPath])

  const copyToClipboard = async () => {
    if (registryUrl) {
      await navigator.clipboard.writeText(`npx shadcn@latest add ${registryUrl}`)
    }
  }

  return (
    <div className={`rounded-lg bg-muted p-4 relative ${className}`}>
      <code className="text-sm break-all">
        npx shadcn@latest add {registryUrl || `[URL_BASE]/r/[ITEM_NAME].json`}
      </code>
      {registryUrl && (
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={copyToClipboard}
          title="Copier la commande"
        >
          📋
        </Button>
      )}
    </div>
  )
}
