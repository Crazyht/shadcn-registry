import { useMediaQuery } from '../use-media-query'

export function MediaQueryResponsiveExample() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  const getCurrentDevice = () => {
    if (isMobile) return { type: 'Mobile', icon: '📱', color: 'text-orange-600' }
    if (isTablet) return { type: 'Tablette', icon: '📋', color: 'text-blue-600' }
    if (isDesktop) return { type: 'Desktop', icon: '🖥️', color: 'text-green-600' }
    return { type: 'Inconnu', icon: '❓', color: 'text-gray-600' }
  }

  const device = getCurrentDevice()

  return (
    <div className="space-y-6">
      {/* Affichage principal */}
      <div className="text-center p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="text-4xl mb-2">{device.icon}</div>
        <h3 className={`text-xl font-bold ${device.color}`}>
          {device.type}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Redimensionnez votre fenêtre pour voir le changement
        </p>
      </div>

      {/* Détails des breakpoints */}
      <div className="grid gap-3">
        <div className={`flex items-center justify-between p-3 border rounded-lg ${isMobile ? 'bg-orange-50 border-orange-200' : ''}`}>
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span className="font-medium">Mobile</span>
            <code className="text-xs bg-gray-100 px-1 rounded">(max-width: 768px)</code>
          </div>
          <div className={`w-3 h-3 rounded-full ${isMobile ? 'bg-orange-500' : 'bg-gray-300'}`} />
        </div>

        <div className={`flex items-center justify-between p-3 border rounded-lg ${isTablet ? 'bg-blue-50 border-blue-200' : ''}`}>
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span className="font-medium">Tablette</span>
            <code className="text-xs bg-gray-100 px-1 rounded">(769px - 1024px)</code>
          </div>
          <div className={`w-3 h-3 rounded-full ${isTablet ? 'bg-blue-500' : 'bg-gray-300'}`} />
        </div>

        <div className={`flex items-center justify-between p-3 border rounded-lg ${isDesktop ? 'bg-green-50 border-green-200' : ''}`}>
          <div className="flex items-center gap-2">
            <span>🖥️</span>
            <span className="font-medium">Desktop</span>
            <code className="text-xs bg-gray-100 px-1 rounded">(min-width: 1025px)</code>
          </div>
          <div className={`w-3 h-3 rounded-full ${isDesktop ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </div>

      {/* Layout adaptatif */}
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-3">Layout adaptatif:</h4>
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'}`}>
          <div className="p-3 bg-gray-100 rounded text-center text-sm">Element 1</div>
          <div className="p-3 bg-gray-100 rounded text-center text-sm">Element 2</div>
          <div className="p-3 bg-gray-100 rounded text-center text-sm">Element 3</div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Colonnes: {isMobile ? '1' : isTablet ? '2' : '3'} (adapté automatiquement)
        </p>
      </div>
    </div>
  )
}
