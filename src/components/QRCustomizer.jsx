/**
 * QRCustomizer.jsx
 * Controles de personalización visual: colores, forma de puntos, logo y tamaño.
 */
import { useRef } from 'react'
import { DOT_TYPES } from '../hooks/useQRGenerator'

const MIN_SIZE = 512
const MAX_SIZE = 2048

function QRCustomizer({ customization, onChange }) {
  const fileInputRef = useRef(null)

  const handleLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isValid = /image\/(png|svg\+xml)/.test(file.type)
    if (!isValid) {
      alert('El logo debe ser PNG o SVG.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange({ logo: reader.result })
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    onChange({ logo: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="customizer">
      <h3 className="customizer__title">Personalización</h3>

      <div className="customizer__row">
        <label className="field field--color">
          <span className="field__label">Color de puntos</span>
          <span className="color-input">
            <input
              type="color"
              value={customization.dotsColor}
              onChange={(e) => onChange({ dotsColor: e.target.value })}
            />
            <span className="color-input__value">{customization.dotsColor}</span>
          </span>
        </label>

        <label className="field field--color">
          <span className="field__label">Color de fondo</span>
          <span className="color-input">
            <input
              type="color"
              value={customization.backgroundColor}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
            />
            <span className="color-input__value">{customization.backgroundColor}</span>
          </span>
        </label>
      </div>

      <label className="field">
        <span className="field__label">Forma de los puntos</span>
        <select
          className="field__input field__select"
          value={customization.dotType}
          onChange={(e) => onChange({ dotType: e.target.value })}
        >
          {DOT_TYPES.map((dot) => (
            <option key={dot.value} value={dot.value}>{dot.label}</option>
          ))}
        </select>
      </label>

      <div className="field">
        <span className="field__label">Logo central (opcional)</span>
        <div className="logo-control">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/svg+xml"
            onChange={handleLogo}
            className="logo-control__input"
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="btn btn--ghost btn--sm">
            {customization.logo ? 'Cambiar logo' : 'Subir logo'}
          </label>
          {customization.logo && (
            <button type="button" className="btn btn--sm btn--danger" onClick={removeLogo}>
              Quitar
            </button>
          )}
        </div>
        <span className="field__hint">PNG o SVG. Ocupa máx. 30% del QR.</span>
      </div>

      <label className="field">
        <span className="field__label">
          Tamaño de exportación: <strong>{customization.size}px</strong>
        </span>
        <input
          type="range"
          className="field__range"
          min={MIN_SIZE}
          max={MAX_SIZE}
          step={64}
          value={customization.size}
          onChange={(e) => onChange({ size: Number(e.target.value) })}
        />
        <span className="field__hint">{MIN_SIZE}px – {MAX_SIZE}px</span>
      </label>
    </div>
  )
}

export default QRCustomizer
