import { Boton, MuestraColor } from '../../core'

const colorCss = ({ r, g, b }) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`

export default function PanelPelota({ color, tolerancia, onTolerancia, onGrabar, onVolver }) {
  return (
    <>
      <h1>{color ? '¡Ya la sigo!' : 'Toca la pelota'}</h1>
      <p>
        {color
          ? 'Comprueba que el punto está sobre la pelota. Luego pulsa "Grabar" y suéltala sin empujar.'
          : 'Pon la pelota arriba de la rampa, quieta, y tócala en la imagen.'}
      </p>
      {color && (
        <>
          <p className="rampa-color">
            <MuestraColor color={colorCss(color)} /> Este es el color que busco.
          </p>
          <label className="rampa-sensibilidad">
            Si el punto no sigue bien a la pelota, cambia la sensibilidad
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
