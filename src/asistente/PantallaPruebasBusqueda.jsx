// Resultado del banco de pruebas en #/prueba/asistente (CONTRATO.md, punto 9). Sin props.
import { useEffect, useState } from 'react'
import { Aviso, Cargando, Tarjeta } from '../core'
import { experimentos } from '../registro'
import { evaluarPruebas } from './busqueda/evaluarPruebas.js'
import { pruebasBusqueda } from './datos/pruebasBusqueda.js'
import { estadoModeloAsistente } from './busqueda/busquedaSignificado.js'
import './asistente.css'

const OBJETIVO_NIVEL_1 = 0.7
const porcentaje = (valor) => `${Math.round(valor * 100)} %`

const NOMBRE_TIPO = {
  equivocada: 'Respuesta equivocada',
  casi: 'Sale en "¿Quieres decir…?"',
  'sin-respuesta': 'Sin respuesta',
}

export default function PantallaPruebasBusqueda() {
  const [informe, setInforme] = useState(null)

  useEffect(() => {
    let activa = true
    const preguntas = experimentos.flatMap((experimento) => experimento.preguntas ?? [])
    evaluarPruebas(pruebasBusqueda, preguntas).then((resultado) => {
      if (activa) setInforme(resultado)
    })
    return () => {
      activa = false
    }
  }, [])

  if (!informe) return <Cargando texto="Pasando el banco de pruebas…" />

  const cumple = informe.porcentaje >= OBJETIVO_NIVEL_1 && informe.equivocadas === 0

  return (
    <section className="core-pantalla asistente-pruebas">
      <h2>Banco de pruebas de la búsqueda</h2>
      <Aviso tipo={cumple ? 'exito' : 'error'}>
        Nivel 1: {informe.aciertos} de {informe.total} aciertos ({porcentaje(informe.porcentaje)}).
        Objetivo: {porcentaje(OBJETIVO_NIVEL_1)} y ninguna respuesta equivocada.
      </Aviso>
      <p className="core-pantalla-nota">
        Respuestas equivocadas: {informe.equivocadas} · En "¿Quieres decir…?": {informe.casi} ·{' '}
        {informe.msPorBusqueda.toFixed(1)} ms por búsqueda · Nivel 2:{' '}
        {estadoModeloAsistente() === 'listo' ? 'aparcado (sin modelo)' : estadoModeloAsistente()}
      </p>

      {informe.fallos.length > 0 && (
        <Tarjeta>
          <ul className="asistente-pruebas-fallos">
            {informe.fallos.map((fallo) => (
              <li key={fallo.texto}>
                <strong>"{fallo.texto}"</strong>
                <span>
                  {NOMBRE_TIPO[fallo.tipo]} · confianza {fallo.confianza.toFixed(2)}
                </span>
                <span>
                  Esperada: {fallo.esperado ?? 'ninguna'} · Obtenida: {fallo.obtenido ?? 'ninguna'}
                </span>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}
    </section>
  )
}
