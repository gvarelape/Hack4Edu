// Lo público del core (CONTRATO.md, punto 1). Los hooks llegan en los siguientes pasos.
export { default as Boton } from './componentes/Boton'
export { default as Tarjeta } from './componentes/Tarjeta'
export { default as Aviso } from './componentes/Aviso'
export { default as Cargando } from './componentes/Cargando'
export { default as Grafica } from './componentes/Grafica'
export { default as Tabla } from './componentes/Tabla'
export { default as MuestraColor } from './componentes/MuestraColor'
export { default as CampoNumero } from './componentes/CampoNumero'
export { default as ValorDestacado } from './componentes/ValorDestacado'
export { default as Confirmacion } from './componentes/Confirmacion'

export { leerNumero, formatear } from './lib/numeros'
export { normalizarTexto } from './lib/texto'
