// src/lib/hmr-helper.ts

/**
 * Helper pour améliorer le Hot Module Replacement
 */

export function setupHMR() {
  if (import.meta.env.DEV && import.meta.hot) {
    // Accepter le HMR pour ce module
    import.meta.hot.accept()

    // Écouter les changements dans les fichiers de documentation
    import.meta.hot.on('vite:beforeUpdate', (payload) => {
      console.log('HMR: Detecting changes in:', payload.updates)

      // Si c'est un fichier .docs.tsx, forcer le reload
      const hasDocsUpdate = payload.updates?.some((update: { path?: string }) =>
        update.path && update.path.includes('.docs.tsx')
      )

      if (hasDocsUpdate) {
        console.log('HMR: Documentation file changed, clearing module cache')

        // Émettre un événement personnalisé pour notifier les composants
        window.dispatchEvent(new CustomEvent('docs-hmr-update', {
          detail: { updates: payload.updates }
        }))
      }
    })

    // Nettoyer le cache des modules de documentation lors des updates
    import.meta.hot.on('vite:afterUpdate', () => {
      if (window.__DOC_MODULE_CACHE) {
        console.log('HMR: Clearing documentation module cache')
        window.__DOC_MODULE_CACHE.clear()
      }
    })
  }
}

/**
 * Cache global pour les modules de documentation
 */
declare global {
  interface Window {
    __DOC_MODULE_CACHE?: Map<string, React.ComponentType>
  }
}

export function getDocModuleCache(): Map<string, React.ComponentType> {
  if (!window.__DOC_MODULE_CACHE) {
    window.__DOC_MODULE_CACHE = new Map()
  }
  return window.__DOC_MODULE_CACHE
}

export function clearDocModuleCache() {
  if (window.__DOC_MODULE_CACHE) {
    window.__DOC_MODULE_CACHE.clear()
    console.log('Documentation module cache cleared')
  }
}
