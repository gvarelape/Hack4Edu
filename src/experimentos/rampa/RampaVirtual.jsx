import { DIBUJO, geometriaRampa } from './simulacionRampa'

// El dibujo de la rampa. La bola la mueve Simulacion por su ref, sin repintar nada más.
export default function RampaVirtual({ rampa, bolaRef }) {
  const { inicio, fin } = geometriaRampa(rampa)
  const { ancho, alto, radioBola } = DIBUJO
  const hueca = rampa.tipoBola === 'hueca'

  return (
    <svg
      className="rampa-virtual"
      viewBox={`0 0 ${ancho} ${alto}`}
      role="img"
      aria-label={`Rampa de ${Math.round(rampa.largo)} centímetros con ${Math.round(rampa.angulo)} grados de inclinación`}
    >
      <polygon
        className="rampa-virtual-cuesta"
        points={`${inicio.x},${inicio.y} ${fin.x},${fin.y} ${inicio.x},${fin.y}`}
      />
      <line
        className="rampa-virtual-tope"
        x1={fin.x + radioBola + 3}
        y1={fin.y}
        x2={fin.x + radioBola + 3}
        y2={fin.y - radioBola * 2}
      />
      <g ref={bolaRef}>
        <circle
          className={hueca ? 'rampa-virtual-bola-hueca' : 'rampa-virtual-bola'}
          r={radioBola}
        />
        {/* Una raya para que se vea si gira o resbala. */}
        <line
          className={hueca ? 'rampa-virtual-raya-hueca' : 'rampa-virtual-raya'}
          x1={0}
          y1={-radioBola}
          x2={0}
          y2={radioBola}
        />
      </g>
    </svg>
  )
}
