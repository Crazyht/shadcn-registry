import { useLocalStorage } from '../use-local-storage'

interface UserSettings {
  language: string
  notifications: boolean
  autoSave: boolean
  fontSize: number
}

export function SettingsExample() {
  const [settings, setSettings, resetSettings] = useLocalStorage<UserSettings>('user-settings', {
    language: 'fr',
    notifications: true,
    autoSave: false,
    fontSize: 14
  })

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Paramètres utilisateur</h3>

        {/* Language Setting */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium">Langue</label>
          <select
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Setting */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium">
            Taille de police: {settings.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="20"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>12px</span>
            <span>20px</span>
          </div>
        </div>

        {/* Boolean Settings */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
            />
            <span className="text-sm">Activer les notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => updateSetting('autoSave', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
            />
            <span className="text-sm">Sauvegarde automatique</span>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="font-medium mb-2">Aperçu des paramètres</h4>
        <div
          style={{ fontSize: `${settings.fontSize}px` }}
          className="space-y-1 text-sm"
        >
          <p><strong>Langue:</strong> {languages.find(l => l.code === settings.language)?.name}</p>
          <p><strong>Notifications:</strong> {settings.notifications ? '✅ Activées' : '❌ Désactivées'}</p>
          <p><strong>Sauvegarde auto:</strong> {settings.autoSave ? '✅ Activée' : '❌ Désactivée'}</p>
          <p><strong>Taille de police:</strong> {settings.fontSize}px (ce texte)</p>
        </div>
      </div>

      <button
        onClick={resetSettings}
        className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        Réinitialiser aux valeurs par défaut
      </button>

      <p className="text-xs text-gray-600">
        ⚙️ Tous les paramètres sont automatiquement sauvegardés
      </p>
    </div>
  )
}
