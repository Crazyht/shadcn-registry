import { useMediaQuery } from '../use-media-query'

export function MediaQueryNavigationExample() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const navigationItems = [
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'products', label: 'Produits', icon: '📦' },
    { id: 'services', label: 'Services', icon: '⚙️' },
    { id: 'about', label: 'À propos', icon: '👥' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ]

  return (
    <div className="space-y-6">
      {/* Navigation adaptative */}
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-4">🧭 Navigation adaptative</h3>

        {isMobile ? (
          // Navigation mobile - Menu burger simulé
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <span className="font-medium">Mon App</span>
              <button className="p-2 hover:bg-gray-200 rounded">
                <div className="space-y-1">
                  <div className="w-5 h-0.5 bg-gray-600"></div>
                  <div className="w-5 h-0.5 bg-gray-600"></div>
                  <div className="w-5 h-0.5 bg-gray-600"></div>
                </div>
              </button>
            </div>
            <div className="text-sm text-muted-foreground bg-orange-50 p-2 rounded">
              📱 Version mobile: Menu burger affiché
            </div>
          </div>
        ) : (
          // Navigation desktop/tablet - Barre horizontale
          <div className="space-y-3">
            <nav className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <span className="font-medium">Mon App</span>
              <div className={`flex ${isTablet ? 'gap-2' : 'gap-6'}`}>
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded transition-colors ${
                      prefersReducedMotion ? '' : 'hover:scale-105'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {!isTablet && <span className="text-sm">{item.label}</span>}
                  </button>
                ))}
              </div>
            </nav>
            <div className="text-sm text-muted-foreground bg-blue-50 p-2 rounded">
              {isTablet ? '📋 Version tablette: Icônes seules' : '🖥️ Version desktop: Barre complète'}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar adaptative */}
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-4">📂 Sidebar adaptative</h3>

        <div className={`flex gap-4 ${isMobile ? 'flex-col' : ''}`}>
          {/* Sidebar */}
          <div className={`${
            isMobile
              ? 'w-full order-2'
              : isTablet
                ? 'w-16'
                : 'w-48'
          } bg-gray-100 rounded-lg p-3`}>
            <div className="space-y-2">
              {navigationItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded"
                >
                  <span>{item.icon}</span>
                  {(!isTablet || isMobile) && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Contenu principal</h4>
            <p className="text-sm text-muted-foreground">
              Le layout s'adapte automatiquement selon la taille d'écran:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Mobile: Sidebar en dessous du contenu</li>
              <li>• Tablette: Sidebar étroite avec icônes seules</li>
              <li>• Desktop: Sidebar large avec labels</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Indicateurs de breakpoint */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-3 text-center rounded-lg border ${
          isMobile ? 'bg-orange-100 border-orange-300' : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="text-lg mb-1">📱</div>
          <div className="text-sm font-medium">Mobile</div>
          <div className="text-xs text-muted-foreground">≤ 768px</div>
        </div>

        <div className={`p-3 text-center rounded-lg border ${
          isTablet ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="text-lg mb-1">📋</div>
          <div className="text-sm font-medium">Tablette</div>
          <div className="text-xs text-muted-foreground">769-1024px</div>
        </div>

        <div className={`p-3 text-center rounded-lg border ${
          !isMobile && !isTablet ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="text-lg mb-1">🖥️</div>
          <div className="text-sm font-medium">Desktop</div>
          <div className="text-xs text-muted-foreground">≥ 1025px</div>
        </div>
      </div>
    </div>
  )
}
