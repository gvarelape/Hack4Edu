// Palabras que el alumno puede usar para decir lo mismo. Cada entrada lleva varias formas a una.
// Las claves y los valores van ya normalizados: minúsculas y sin tildes.
// Cada dueño puede ampliarlo con su tema.

export const SINONIMOS = {
  // General
  movil: ['telefono', 'celular', 'smartphone', 'mobil'],
  app: ['aplicacion', 'programa', 'web', 'pagina', 'kanga'],
  profe: ['profesor', 'profesora', 'maestro', 'maestra', 'docente', 'tutor', 'tutora'],
  experimento: ['practica', 'prueba', 'actividad'],
  mandar: ['enviar', 'envio', 'mando', 'compartir', 'comparto', 'pasar', 'paso', 'entregar'],
  borrar: ['eliminar', 'quitar', 'perder', 'perdido', 'borrado', 'borre'],
  funciona: ['va', 'anda', 'furula', 'funcione', 'pilla', 'detecta', 'capta'],
  lento: [
    'lenta',
    'despacio',
    'trabado',
    'trabada',
    'colgado',
    'colgada',
    'pillado',
    'pillada',
    'congelado',
    'traba',
    'congela',
  ],
  internet: ['wifi', 'conexion', 'cobertura', 'red', 'online', 'offline'],
  guardar: ['guarda', 'guardado', 'almacena'],
  error: ['fallo', 'equivocacion'],
  equivocar: ['equivocado', 'equivoque', 'fallado', 'falle', 'mal'],
  exacto: ['perfecto', 'preciso', 'justo', 'clavado'],
  repetir: ['varias', 'otra', 'repito'],
  grafica: ['grafico', 'dibujo', 'curva', 'linea'],
  microfono: ['micro', 'mic'],
  camara: ['camra', 'video'],

  // Rampa
  gravedad: ['g'],
  pelota: ['bola', 'canica', 'balon'],
  velocidad: ['rapido', 'rapida', 'rapidez', 'deprisa'],
  rampa: ['cuesta', 'pendiente', 'inclinado'],

  // Botellas
  agudo: ['fino', 'chillon'],
  grave: ['grueso', 'profundo'],
  sonido: ['ruido', 'nota', 'tono', 'pitido'],
  botella: ['garrafa', 'frasco'],
  soplar: ['soplo', 'soplido', 'sopla'],

  // pH
  lombarda: ['col morada', 'repollo morado', 'col lombarda', 'repollo lombardo'],
  acido: ['agrio', 'acida'],
  basico: ['alcalino', 'base', 'basica'],
  color: ['tono de color', 'colorcito'],
}

// Busca la forma principal de una palabra o expresión. Se construye una sola vez.
const formaPrincipal = new Map()
for (const [principal, otras] of Object.entries(SINONIMOS)) {
  formaPrincipal.set(principal, principal)
  for (const otra of otras) formaPrincipal.set(otra, principal)
}

/** Expresiones de varias palabras ('col morada'), de la más larga a la más corta. */
export const EXPRESIONES = [...formaPrincipal.keys()]
  .filter((clave) => clave.includes(' '))
  .sort((a, b) => b.length - a.length)

/** La forma principal de una palabra, o la misma palabra si no tiene sinónimos. */
export function sinonimoPrincipal(palabra) {
  return formaPrincipal.get(palabra) ?? palabra
}
