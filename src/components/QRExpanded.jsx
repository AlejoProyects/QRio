/**
 * QRExpanded.jsx
 * Lightbox a pantalla completa con el QR en grande, pensado para proyectarlo
 * o que alguien lo escanee directamente desde la pantalla.
 */
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import useQRGenerator from '../hooks/useQRGenerator'

function QRExpanded({ value, customization, onClose }) {
  const containerRef = useRef(null)
  const { appendTo } = useQRGenerator({
    value,
    customization,
    previewSize: 1000,
  })

  // Montar el QR grande.
  useEffect(() => {
    appendTo(containerRef.current)
  }, [appendTo])

  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      className="qr-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Código QR ampliado"
      onClick={onClose}
    >
      <button
        type="button"
        className="qr-lightbox__close"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* stopPropagation: clicks sobre la tarjeta no cierran el modal */}
      <div className="qr-lightbox__card" onClick={(e) => e.stopPropagation()}>
        <div ref={containerRef} className="qr-lightbox__canvas" />
        {value && <p className="qr-lightbox__value">{value}</p>}
      </div>
    </div>,
    document.body
  )
}

export default QRExpanded
