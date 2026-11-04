// Comparte la imagen de la ficha con el menú del móvil (Web Share API) o, si no se puede,
// la descarga (CUADERNO.md, "Compartir"). Nunca lanza errores.

/**
 * Devuelve una Promise con lo que ha pasado:
 * 'compartido' | 'cancelado' (el alumno cerró el menú) | 'descargado' | 'error'.
 * Hay que llamarla justo después de un toque del alumno: iOS lo exige para abrir el menú.
 */
export async function compartirImagen(blob, nombreArchivo, titulo) {
  let archivo = null
  try {
    archivo = new File([blob], nombreArchivo, { type: 'image/png' })
  } catch {
    // Navegadores muy antiguos sin File: se pasa directamente a descargar.
  }

  if (archivo && navigator.canShare?.({ files: [archivo] })) {
    try {
      await navigator.share({ files: [archivo], title: titulo })
      return 'compartido'
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelado'
      // Si falla por otra cosa, se intenta descargar.
    }
  }
  return descargar(blob, nombreArchivo)
}

function descargar(blob, nombreArchivo) {
  try {
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = nombreArchivo
    document.body.append(enlace)
    enlace.click()
    enlace.remove()
    // Se libera más tarde: algunos navegadores tardan en empezar la descarga.
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return 'descargado'
  } catch {
    return 'error'
  }
}
