import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('short_movies')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
