/**
 * QRPreview.jsx
 * Renderiza el QR en vivo y ofrece exportación (PNG / SVG / copiar).
 * Muestra una animación sutil de glow al actualizarse.
 */
import { useEffect, useRef, useState } from 'react'
import useQRGenerator from '../hooks/useQRGenerator'
import QRExpanded from './QRExpanded'

function QRPreview({ value, customization, contrast }) {
  const containerRef = useRef(null)
  const { appendTo, download, copyToClipboard } = useQRGenerator({
    value,
    customization,
    previewSize: 300,
  })

  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  // Montar la instancia de preview en el contenedor.
  useEffect(() => {
    appendTo(containerRef.current)
  }, [appendTo])

  const hasValue = Boolean(value && value.trim())

  // Firma que cambia con el contenido o el estilo: al cambiar, la capa de glow
  // se remonta (por su `key`) y vuelve a reproducir la animación CSS.
  const glowKey = `${value}|${customization.dotsColor}|${customization.backgroundColor}|${customization.dotType}|${customization.logo ? 'logo' : 'none'}`

  const handleCopy = async () => {
    setError('')
    try {
      await copyToClipboard()
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (err) {
      setError(err.message || 'No se pudo copiar.')
    }
  }

  const handleDownload = async (ext) => {
    setError('')
    try {
      await download(ext)
    } catch (err) {
      setError(err.message || 'No se pudo descargar.')
    }
  }

  return (
    <div className="qr-preview">
      <div className="qr-preview__stage" aria-live="polite">
        <span key={glowKey} className="qr-preview__glow" aria-hidden="true" />
        <button
          type="button"
          className="qr-preview__canvas-btn"
          onClick={() => hasValue && setExpanded(true)}
          disabled={!hasValue}
          aria-label="Ampliar el código QR para proyectarlo"
          title="Click para ampliar"
        >
          <div
            ref={containerRef}
            className="qr-preview__canvas"
            role="img"
            aria-label="Vista previa del código QR"
          />
          {hasValue && (
            <span className="qr-preview__expand-hint" aria-hidden="true">
              ⤢ Ampliar
            </span>
          )}
        </button>
        {!hasValue && (
          <div className="qr-preview__empty">
            Completa el formulario para generar tu QR
          </div>
        )}
      </div>

      {contrast && (
        <div className={`qr-preview__contrast qr-preview__contrast--${contrast.level}`}>
          <span className="qr-preview__contrast-dot" />
          {contrast.message}
        </div>
      )}

      <div className="qr-preview__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => handleDownload('png')}
          disabled={!hasValue}
        >
          Descargar PNG
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => handleDownload('svg')}
          disabled={!hasValue}
        >
          Descargar SVG
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={handleCopy}
          disabled={!hasValue}
        >
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>

      {error && <p className="qr-preview__error">{error}</p>}

      {expanded && hasValue && (
        <QRExpanded
          value={value}
          customization={customization}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  )
}

export default QRPreview
