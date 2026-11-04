import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './core/estilos/tokens.css'
import './core/estilos/base.css'
import './core/estilos/componentes.css'
import { experimentos } from './registro'

// PROVISIONAL: se sustituye por App.jsx en el prompt 7.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Kanga</h1>
    <ul>
      {experimentos.map((experimento) => (
        <li key={experimento.id}>{experimento.titulo}</li>
      ))}
    </ul>
  </StrictMode>,
)
