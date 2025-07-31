import { useState } from 'react'
import { useLocalStorage } from '../use-local-storage'

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

  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-3">Liste de tâches persistée</h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Nouvelle tâche..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addTodo}
            disabled={!newTodo.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune tâche. Ajoutez-en une ci-dessus !
          </p>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 border rounded-lg ${
                todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <div className="text-sm text-gray-600">
          Total: {todos.length} tâche{todos.length !== 1 ? 's' : ''}
          {todos.filter(t => t.completed).length > 0 &&
            ` (${todos.filter(t => t.completed).length} terminée${todos.filter(t => t.completed).length !== 1 ? 's' : ''})`
          }
        </div>

        {todos.length > 0 && (
          <button
            onClick={clearTodos}
            className="text-sm text-red-500 hover:text-red-700 underline"
          >
            Tout supprimer
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600">
        💾 La liste est automatiquement sauvegardée dans localStorage
      </p>
    </div>
  )
}
