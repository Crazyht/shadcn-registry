import { useLocalStorage } from '../use-local-storage'

export function BasicExample() {
  const [name, setName, removeName] = useLocalStorage('user-name', '')

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Nom (persisté dans localStorage)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Entrez votre nom"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="p-3 bg-gray-50 rounded-md">
        <p className="text-sm">
          <span className="font-medium">Valeur stockée:</span>
          <span className="ml-2 text-blue-600">"{name || '(vide)'}"</span>
        </p>
      </div>

      <button
        onClick={removeName}
        className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
        disabled={!name}
      >
        Supprimer du localStorage
      </button>

      <p className="text-xs text-gray-600">
        💡 Actualisez la page pour voir que la valeur est persistée
      </p>
    </div>
  )
}
