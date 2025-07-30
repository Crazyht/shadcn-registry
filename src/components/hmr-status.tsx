// src/components/hmr-status.tsx
import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HMRStatusProps {
  onReload?: () => void
}

export function HMRStatus({ onReload }: HMRStatusProps) {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleHMRUpdate = (event: CustomEvent) => {
        setLastUpdate(new Date().toLocaleTimeString())
        setUpdateCount(prev => prev + 1)
        console.log('HMR Status: Documentation update detected', event.detail)
      }

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          // Page regained focus, potential opportunity to reload
          setLastUpdate(new Date().toLocaleTimeString())
        }
      }

      window.addEventListener('docs-hmr-update', handleHMRUpdate as EventListener)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        window.removeEventListener('docs-hmr-update', handleHMRUpdate as EventListener)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background/95 backdrop-blur border rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">HMR Status</span>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>Updates: {updateCount}</div>
          {lastUpdate && <div>Last: {lastUpdate}</div>}
        </div>

        <Button
          onClick={onReload}
          variant="outline"
          size="sm"
          className="w-full mt-3 gap-2"
        >
          <RefreshCw className="h-3 w-3" />
          Force Reload
        </Button>

        <div className="text-xs text-muted-foreground mt-2 text-center">
          Modify any .docs.tsx file to test HMR
        </div>
      </div>
    </div>
  )
}
