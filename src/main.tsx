import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import * as covidApi from './services/covidApi'

// Exposer les fonctions API pour tester dans la console (uniquement en développement)
if (import.meta.env.DEV) {
  (window as any).covidApi = covidApi
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
