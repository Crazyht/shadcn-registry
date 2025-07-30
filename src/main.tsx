import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { setupHMR } from '@/lib/hmr-helper'

// Initialiser le HMR en mode développement
setupHMR()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
