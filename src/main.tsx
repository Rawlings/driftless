import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import App from './App'
import './app.css'
import { theme } from './core/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={theme}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)