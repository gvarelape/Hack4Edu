import { Aviso, Boton, CampoNumero } from '../../core'

export default function PanelMarcas({
  distancia,
  onDistancia,
  marcasCompletas,
  escala,
  onContinuar,
}) {
  return (
    <>
      <h1>Marca las dos cintas</h1>
      <p>Deja el móvil quieto y toca en la imagen cada trozo de cinta.</p>
      <CampoNumero
        etiqueta="Distancia real entre las cintas"
        valor={distancia}
        onCambio={onDistancia}
        unidad="cm"
      />
      {marcasCompletas && distancia > 0 && !escala && (
        <Aviso tipo="error">Las marcas están muy juntas. Toca otra vez las dos cintas.</Aviso>
      )}
      <Boton disabled={!escala} onClick={onContinuar}>
        Continuar
      </Boton>
    </>
  )
}
