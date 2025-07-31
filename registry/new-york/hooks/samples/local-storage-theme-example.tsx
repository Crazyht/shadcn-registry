import { useLocalStorage } from '../use-local-storage'

export function ThemeExample() {
  const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>('theme-preference', 'light')

  const themes = [
    { value: 'light', label: 'Clair', icon: '☀️' },
    { value: 'dark', label: 'Sombre', icon: '🌙' }
  ] as const

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-3">Préférence de thème</h3>

        <div className="grid grid-cols-2 gap-2">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${
                theme === themeOption.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white hover:bg-gray-50 border-gray-300'
              }`}
            >
              <span className="text-lg">{themeOption.icon}</span>
              <span className="font-medium">{themeOption.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-lg transition-colors ${
        theme === 'dark'
          ? 'bg-gray-800 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">
          <span className="font-medium">Thème actuel:</span>
          <span className="ml-2">{theme === 'dark' ? '🌙 Sombre' : '☀️ Clair'}</span>
        </p>
        <p className="text-xs mt-2 opacity-75">
          Cette préférence est sauvegardée dans localStorage
        </p>
      </div>

      <button
        onClick={removeTheme}
        className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        Réinitialiser (retour à "light")
      </button>
    </div>
  )
}
