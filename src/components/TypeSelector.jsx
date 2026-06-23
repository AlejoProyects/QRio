/**
 * TypeSelector.jsx
 * Selector del tipo de QR (URL, WhatsApp, Texto, WiFi, Email).
 */
function TypeSelector({ types, active, onChange }) {
  return (
    <div className="type-selector" role="tablist" aria-label="Tipo de código QR">
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          role="tab"
          aria-selected={active === type.id}
          className={`type-selector__item${active === type.id ? ' is-active' : ''}`}
          onClick={() => onChange(type.id)}
        >
          <span className="type-selector__icon" aria-hidden="true">{type.icon}</span>
          <span className="type-selector__label">{type.label}</span>
        </button>
      ))}
    </div>
  )
}

export default TypeSelector
