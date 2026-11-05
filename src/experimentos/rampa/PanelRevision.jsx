import { Aviso, Boton, ValorDestacado } from '../../core'

const MENSAJES_FALLO = {
  'pocos-puntos':
    'No hemos podido seguir la pelota el tiempo suficiente. Busca más luz, comprueba que se ve la rampa entera y prueba otra vez.',
  'sin-aceleracion':
    'La pelota no parece ir cada vez más rápido. Suéltala sin empujar y comprueba que la rampa está inclinada.',
  'tiempo-parado':
    'Tu móvil no nos ha dado bien el tiempo del vídeo. Prueba con otro navegador o pregúntale a tu profe.',
}

export default function PanelRevision({ revision, onTerminar, onRepetir }) {
  const { resultado, motivo } = revision
  return (
    <>
      {resultado ? (
        <>
          <h1>¡Medida hecha!</h1>
          <ValorDestacado valor={resultado.valores[0]} grande />
          <p>¿Ha ido bien? Si la pelota se ha desviado, puedes repetirla.</p>
          <Boton onClick={() => onTerminar(resultado)}>Ver resultados</Boton>
        </>
      ) : (
        <>
          <h1>Vamos a repetirla</h1>
          <Aviso tipo="info">{MENSAJES_FALLO[motivo]}</Aviso>
        </>
      )}
      <Boton variante={resultado ? 'secundario' : 'principal'} onClick={onRepetir}>
        Repetir
      </Boton>
    </>
  )
}
