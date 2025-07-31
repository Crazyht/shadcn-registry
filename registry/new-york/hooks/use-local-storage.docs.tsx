import { DocSample } from '../../../src/components/registry'
import {
  LocalStorageBasicExample,
  LocalStorageThemeExample,
  LocalStorageTodoExample,
  LocalStorageSettingsExample
} from './samples'

/**
 * Documentation pour useLocalStorage
 * Fichier interne - Non inclus dans la registry
 */
export function UseLocalStorageDocumentation() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">useLocalStorage</h1>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Hook
          </span>
        </div>
        <p className="text-lg text-muted-foreground">
          Hook React pour persister facilement des données dans localStorage avec synchronisation automatique.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          ✨ Fonctionnalités
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">💾</div>
            <div>
              <h3 className="font-medium">Persistance automatique</h3>
              <p className="text-sm text-muted-foreground">Sauvegarde automatique dans localStorage</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🔄</div>
            <div>
              <h3 className="font-medium">Synchronisation</h3>
              <p className="text-sm text-muted-foreground">État synchronisé avec le stockage</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🛡️</div>
            <div>
              <h3 className="font-medium">Gestion d'erreurs</h3>
              <p className="text-sm text-muted-foreground">Gestion robuste des erreurs de sérialisation</p>
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-2xl">🌐</div>
            <div>
              <h3 className="font-medium">SSR Compatible</h3>
              <p className="text-sm text-muted-foreground">Fonctionne côté serveur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📦 Installation
        </h2>
        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm">npx shadcn@latest add use-local-storage</code>
        </div>
        <p className="text-sm text-muted-foreground">
          Cette commande installera automatiquement le hook et ses dépendances.
        </p>
      </div>

      {/* API Reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">📖 Référence API</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">useLocalStorage</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-4 py-2 text-left">Paramètre</th>
                    <th className="border border-border px-4 py-2 text-left">Type</th>
                    <th className="border border-border px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">key</td>
                    <td className="border border-border px-4 py-2 font-mono text-sm">string</td>
                    <td className="border border-border px-4 py-2">Clé unique pour localStorage</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">initialValue</td>
                    <td className="border border-border px-4 py-2 font-mono text-sm">T</td>
                    <td className="border border-border px-4 py-2">Valeur par défaut si aucune donnée stockée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Valeur de retour</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-4 py-2 text-left">Index</th>
                    <th className="border border-border px-4 py-2 text-left">Type</th>
                    <th className="border border-border px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">[0]</td>
                    <td className="border border-border px-4 py-2 font-mono text-sm">T</td>
                    <td className="border border-border px-4 py-2">Valeur actuelle stockée</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">[1]</td>
                    <td className="border border-border px-4 py-2 font-mono text-sm">(value: T | ((val: T) =&gt; T)) =&gt; void</td>
                    <td className="border border-border px-4 py-2">Fonction pour mettre à jour la valeur</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">[2]</td>
                    <td className="border border-border px-4 py-2 font-mono text-sm">() =&gt; void</td>
                    <td className="border border-border px-4 py-2">Fonction pour supprimer la valeur du storage</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">🚀 Exemples</h2>

        <div className="space-y-8">
          <DocSample
            title="Utilisation basique"
            description="Persistance simple d'une valeur string dans localStorage"
            sourceCode={`import { useLocalStorage } from './use-local-storage'

export function BasicExample() {
  const [name, setName, removeName] = useLocalStorage('user-name', '')

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Entrez votre nom"
      />

      <div>
        <p>Valeur stockée: "{name || '(vide)'}"</p>
      </div>

      <button onClick={removeName} disabled={!name}>
        Supprimer du localStorage
      </button>
    </div>
  )
}`}
          >
            <LocalStorageBasicExample />
          </DocSample>

          <DocSample
            title="Gestion des préférences de thème"
            description="Stockage de préférences utilisateur avec types TypeScript"
            sourceCode={`import { useLocalStorage } from './use-local-storage'

export function ThemeExample() {
  const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>('theme-preference', 'light')

  const themes = [
    { value: 'light', label: 'Clair', icon: '☀️' },
    { value: 'dark', label: 'Sombre', icon: '🌙' }
  ] as const

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={\`flex items-center gap-2 p-3 border rounded-lg \${
              theme === themeOption.value
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-50'
            }\`}
          >
            <span>{themeOption.icon}</span>
            <span>{themeOption.label}</span>
          </button>
        ))}
      </div>

      <div className={\`p-4 rounded-lg \${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'
      }\`}>
        <p>Thème actuel: {theme === 'dark' ? '🌙 Sombre' : '☀️ Clair'}</p>
      </div>
    </div>
  )
}`}
          >
            <LocalStorageThemeExample />
          </DocSample>

          <DocSample
            title="Liste de tâches persistée"
            description="Gestion d'objets complexes avec ajout, modification et suppression"
            sourceCode={`import { useState } from 'react'
import { useLocalStorage } from './use-local-storage'

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

export function TodoListExample() {
  const [todos, setTodos, clearTodos] = useLocalStorage<TodoItem[]>('todo-list', [])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }
      setTodos(prev => [...prev, todo])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Nouvelle tâche..."
        />
        <button onClick={addTodo} disabled={!newTodo.trim()}>
          Ajouter
        </button>
      </div>

      <div className="space-y-2">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}`}
          >
            <LocalStorageTodoExample />
          </DocSample>

          <DocSample
            title="Paramètres utilisateur complexes"
            description="Gestion d'un objet de configuration avec différents types de données"
            sourceCode={`import { useLocalStorage } from './use-local-storage'

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

  return (
    <div className="space-y-4">
      <select
        value={settings.language}
        onChange={(e) => updateSetting('language', e.target.value)}
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>

      <input
        type="range"
        min="12"
        max="20"
        value={settings.fontSize}
        onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
      />

      <label>
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={(e) => updateSetting('notifications', e.target.checked)}
        />
        Notifications
      </label>

      <div style={{ fontSize: \`\${settings.fontSize}px\` }}>
        Aperçu de la taille de police
      </div>
    </div>
  )
}`}
          >
            <LocalStorageSettingsExample />
          </DocSample>
        </div>
      </div>
    </div>
  )
}

// Default export for dynamic loading
export default UseLocalStorageDocumentation
