import { idiomaActual, t } from './idioma.js'

const ATRIBUTOS = ['placeholder', 'aria-label', 'title', 'alt']
// No se traduce lo que escribe el alumno ni lo técnico.
const SIN_TRADUCIR = 'textarea, input, pre, script, style, [translate="no"]'

function traducirNodoTexto(nodo) {
  if (nodo.parentElement?.closest(SIN_TRADUCIR)) return
  const traducido = t(nodo.nodeValue)
  if (traducido !== nodo.nodeValue) nodo.nodeValue = traducido
}

function traducirAtributos(elemento) {
  for (const atributo of ATRIBUTOS) {
    const valor = elemento.getAttribute?.(atributo)
    if (!valor) continue
    const traducido = t(valor)
    if (traducido !== valor) elemento.setAttribute(atributo, traducido)
  }
}

function recorrer(raiz) {
  if (raiz.nodeType === Node.TEXT_NODE) {
    traducirNodoTexto(raiz)
    return
  }
  if (raiz.nodeType !== Node.ELEMENT_NODE) return
  traducirAtributos(raiz)
  raiz.querySelectorAll('*').forEach(traducirAtributos)
  const textos = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
  while (textos.nextNode()) traducirNodoTexto(textos.currentNode)
}

// Traduce lo que aparece en pantalla, antes de pintarlo, sin tocar el código de cada parte.
export function iniciarTraductorPantalla(raiz) {
  if (idiomaActual() === 'es') return
  const observador = new MutationObserver((cambios) => {
    for (const cambio of cambios) {
      if (cambio.type === 'characterData') traducirNodoTexto(cambio.target)
      else if (cambio.type === 'attributes') traducirAtributos(cambio.target)
      else cambio.addedNodes.forEach(recorrer)
    }
  })
  observador.observe(raiz, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATRIBUTOS,
  })
  recorrer(raiz)

  // La imagen para compartir se dibuja en un canvas, donde no hay nodos de texto.
  const dibujarTexto = CanvasRenderingContext2D.prototype.fillText
  CanvasRenderingContext2D.prototype.fillText = function (texto, ...resto) {
    return dibujarTexto.call(this, t(texto), ...resto)
  }
}
