export default function Aviso({ tipo = 'info', children }) {
  return (
    <div className={`core-aviso core-aviso-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
