import { useCallback, useEffect, useRef, useState } from 'react'
import { Boton, formatear, Grafica, Tarjeta, ValorDestacado } from '../../core'
import PrediccionRampa from './PrediccionRampa'
import RampaVirtual from './RampaVirtual'
import {
  alturaDeRampa,
  crearBajada,
  crearGraficaSimulada,
  LIMITES,
  posicionBola,
} from './simulacionRampa'
import { useBajada } from './useBajada'
import './rampa.css'

const TIPOS_BOLA = [
  { id: 'maciza', texto: 'Maciza (de goma o una canica grande)' },
  { id: 'hueca', texto: 'Hueca (como una de ping-pong)' },
  { id: 'sinRozamiento', texto: 'Sin rozamiento (resbala sin girar)' },
]

const RAMPA_INICIAL = { angulo: 12, largo: 100, tipoBola: 'maciza' }

export default function Simulacion({ onContinuar }) {
  const bolaRef = useRef(null)
  const [rampa, setRampa] = useState(RAMPA_INICIAL)

  const colocarBola = useCallback(
    (distancia) => {
      const { x, y, giro } = posicionBola(rampa, distancia)
      bolaRef.current?.setAttribute('transform', `translate(${x} ${y}) rotate(${giro})`)
    },
    [rampa],
  )

  const { puntos, estado, soltar, reiniciar } = useBajada(colocarBola)

  // Cualquier cambio en la rampa devuelve la bola arriba.
  useEffect(() => colocarBola(0), [colocarBola])

  const cambiarRampa = (cambios) => {
    reiniciar()
    setRampa((actual) => ({ ...actual, ...cambios }))
  }

  const bajada = crearBajada(rampa)

  return (
    <div className="rampa-simulacion">
      <p>Cambia la rampa y la bola, y suéltala. ¿Cuál llega antes?</p>

      <Tarjeta>
        <div className="rampa-simulacion-bloque">
          <RampaVirtual rampa={rampa} bolaRef={bolaRef} />
          <label className="rampa-barra">
            {`Inclinación: ${formatear(rampa.angulo, 0)}° (unos ${formatear(alturaDeRampa(rampa.angulo, rampa.largo), 0)} cm de altura)`}
            <input
              type="range"
              min={LIMITES.angulo.minimo}
              max={LIMITES.angulo.maximo}
              step="1"
              value={rampa.angulo}
              onChange={(evento) => cambiarRampa({ angulo: Number(evento.target.value) })}
            />
          </label>
          <label className="rampa-barra">
            {`Largo: ${formatear(rampa.largo, 0)} cm`}
            <input
              type="range"
              min={LIMITES.largo.minimo}
              max={LIMITES.largo.maximo}
              step="5"
              value={rampa.largo}
              onChange={(evento) => cambiarRampa({ largo: Number(evento.target.value) })}
            />
          </label>
          <fieldset className="rampa-opciones">
            <legend>¿Cómo es tu bola?</legend>
            {TIPOS_BOLA.map(({ id, texto }) => (
              <label key={id} className="rampa-opcion">
                <input
                  type="radio"
                  name="rampa-simulacion-bola"
                  checked={rampa.tipoBola === id}
                  onChange={() => cambiarRampa({ tipoBola: id })}
                />
                {texto}
              </label>
            ))}
          </fieldset>
          <Boton
            disabled={estado === 'bajando'}
            onClick={() => {
              colocarBola(0)
              soltar(bajada)
            }}
          >
            {estado === 'abajo' ? 'Soltar otra vez' : 'Soltar'}
          </Boton>
        </div>
      </Tarjeta>

      {puntos.length > 0 && (
        <Tarjeta>
          <div className="rampa-simulacion-bloque">
            {estado === 'abajo' && (
              <div className="rampa-simulacion-valores">
                <ValorDestacado
                  grande
                  valor={{ etiqueta: 'Tiempo de bajada', valor: bajada.duracion, unidad: 's' }}
                />
                <ValorDestacado
                  valor={{ etiqueta: 'Aceleración', valor: bajada.aceleracion, unidad: 'm/s²' }}
                />
              </div>
            )}
            <Grafica grafica={crearGraficaSimulada(puntos)} />
          </div>
        </Tarjeta>
      )}

      <PrediccionRampa onPonerRampa={cambiarRampa} onContinuar={onContinuar} />
    </div>
  )
}
