import { Aviso, Boton, Cargando, MuestraColor } from '../../core'
import { textosPelota } from './textosPelota'

const colorCss = ({ r, g, b }) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`

export default function PanelPelota({
  color,
  origenColor,
  buscando,
  noEncontrada,
  tolerancia,
  onTolerancia,
  onGrabar,
  onVolver,
}) {
  const { titulo, ayuda } = textosPelota(color, origenColor)
  return (
    <>
      <h1>{titulo}</h1>
      <p>{ayuda}</p>
      {buscando && <Cargando texto="Buscando la pelota…" />}
      {noEncontrada && <Aviso tipo="info">No la he encontrado yo sola. Tócala en la imagen.</Aviso>}
      {color && (
        <>
          <p className="rampa-color">
            <MuestraColor color={colorCss(color)} /> Este es el color que busco.
          </p>
          <label className="rampa-barra">
            Si el círculo no sigue bien a la pelota, cambia la sensibilidad
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={tolerancia}
              onChange={(evento) => onTolerancia(Number(evento.target.value))}
            />
          </label>
        </>
      )}
      <Boton disabled={!color} onClick={onGrabar}>
        Grabar
      </Boton>
      <Boton variante="secundario" onClick={onVolver}>
        Volver a las marcas
      </Boton>
    </>
  )
}
