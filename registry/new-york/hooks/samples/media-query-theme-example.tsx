import { useMediaQuery } from '../use-media-query'

export function MediaQueryThemeExample() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)')

  const preferences = [
    {
      label: 'Thème sombre',
      query: '(prefers-color-scheme: dark)',
      active: prefersDark,
      icon: '🌙',
      description: 'Utilisateur préfère le mode sombre'
    },
    {
      label: 'Thème clair',
      query: '(prefers-color-scheme: light)',
      active: prefersLight,
      icon: '☀️',
      description: 'Utilisateur préfère le mode clair'
    },
    {
      label: 'Mouvement réduit',
      query: '(prefers-reduced-motion: reduce)',
      active: prefersReducedMotion,
      icon: '🚫',
      description: 'Utilisateur préfère moins d\'animations'
    },
    {
      label: 'Contraste élevé',
      query: '(prefers-contrast: high)',
      active: prefersHighContrast,
      icon: '🔆',
      description: 'Utilisateur préfère un contraste élevé'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="text-center p-4 border rounded-lg">
        <h3 className="font-medium mb-2">Préférences système détectées</h3>
        <p className="text-sm text-muted-foreground">
          Ces préférences sont basées sur les paramètres de votre système d'exploitation
        </p>
      </div>

      <div className="grid gap-3">
        {preferences.map((pref, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
              pref.active
                ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                : 'bg-gray-50 border-gray-200 dark:bg-gray-900/50'
            }`}
          >
            <div className="text-2xl">{pref.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{pref.label}</span>
                <div className={`w-2 h-2 rounded-full ${pref.active ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <p className="text-sm text-muted-foreground">{pref.description}</p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded mt-1 inline-block">
                {pref.query}
              </code>
            </div>
            <div className={`text-sm font-medium ${pref.active ? 'text-green-600' : 'text-gray-500'}`}>
              {pref.active ? 'Actif' : 'Inactif'}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Comment tester ces préférences
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• <strong>Thème:</strong> Changez le thème dans les paramètres de votre OS</li>
          <li>• <strong>Mouvement:</strong> Activez "Réduire les mouvements" dans l'accessibilité</li>
          <li>• <strong>Contraste:</strong> Activez le contraste élevé dans les paramètres d'accessibilité</li>
        </ul>
      </div>
    </div>
  )
}
