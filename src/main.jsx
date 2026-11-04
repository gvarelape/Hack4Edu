import { arrancar } from './core/arrancar'
import App from './core/App'
import './core/estilos/tokens.css'
import './core/estilos/base.css'
import './core/estilos/componentes.css'
import './core/estilos/datos.css'
import './core/estilos/pantallas.css'
import './core/estilos/inicio.css'
import './core/estilos/dibujos.css'
import './core/estilos/ciencias.css'

arrancar(document.getElementById('root'), <App />)
