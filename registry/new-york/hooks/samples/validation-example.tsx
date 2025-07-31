import { useState, useEffect } from 'react'
import { useDebounce } from '../use-debounce'

export function ValidationExample() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const debouncedEmail = useDebounce(email, 400)

  const validateEmail = async (emailValue: string): Promise<string[]> => {
    const validationErrors: string[] = []

    if (!emailValue) return validationErrors

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      validationErrors.push('Format d\'email invalide')
    }

    // Simulate async validation (check if email exists)
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock "email already exists" validation
    const existingEmails = ['test@example.com', 'admin@test.com', 'user@demo.com']
    if (existingEmails.includes(emailValue.toLowerCase())) {
      validationErrors.push('Cette adresse email est déjà utilisée')
    }

    return validationErrors
  }

  useEffect(() => {
    if (debouncedEmail) {
      setIsValidating(true)
      validateEmail(debouncedEmail).then(validationErrors => {
        setErrors(validationErrors)
        setIsValidating(false)
      })
    } else {
      setErrors([])
      setIsValidating(false)
    }
  }, [debouncedEmail])

  const getInputStatus = () => {
    if (!email) return 'default'
    if (isValidating) return 'validating'
    if (errors.length > 0) return 'error'
    return 'success'
  }

  const status = getInputStatus()

  return (
    <div className="w-full max-w-md space-y-3">
      <div>
        <label className="text-sm font-medium block mb-2">
          Validation d'email en temps réel
        </label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="exemple@domaine.com"
            className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              status === 'error' ? 'border-red-500 focus-visible:ring-red-500' :
              status === 'success' ? 'border-green-500 focus-visible:ring-green-500' :
              'border-input focus-visible:ring-ring'
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {status === 'validating' && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
            {status === 'success' && (
              <span className="text-green-500">✓</span>
            )}
            {status === 'error' && (
              <span className="text-red-500">✗</span>
            )}
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {status === 'success' && (
        <p className="text-sm text-green-600">
          ✓ Adresse email valide
        </p>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>Essayez: test@example.com (déjà utilisée)</p>
        <p>Ou: votre@email.com (valide)</p>
      </div>
    </div>
  )
}
