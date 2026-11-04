// El vídeo a todo el ancho, con un canvas transparente encima para los puntos.
export default function VistaCamara({
  videoRef,
  lienzoRef,
  onToque,
  onEnded,
  onResize,
  onSeeked,
  onLoadedData,
}) {
  return (
    <div className="rampa-camara" onClick={onToque}>
      <video
        ref={videoRef}
        className="rampa-video"
        playsInline
        muted
        onEnded={onEnded}
        onResize={onResize}
        onSeeked={onSeeked}
        onLoadedData={onLoadedData}
      />
      <canvas ref={lienzoRef} className="rampa-capa" />
    </div>
  )
}
