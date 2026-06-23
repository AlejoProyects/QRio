/** WhatsappForm.jsx — número de WhatsApp + mensaje opcional. */
function WhatsappForm({ data, onChange }) {
  return (
    <div className="form">
      <label className="field">
        <span className="field__label">Número (con código de país)</span>
        <input
          type="tel"
          className="field__input"
          placeholder="57 300 123 4567"
          value={data.phone || ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          autoComplete="off"
        />
        <span className="field__hint">Solo se conservan los dígitos. Incluye el código de país.</span>
      </label>
      <label className="field">
        <span className="field__label">Mensaje (opcional)</span>
        <textarea
          className="field__input field__textarea"
          placeholder="Hola, quiero más información..."
          rows={3}
          value={data.message || ''}
          onChange={(e) => onChange({ message: e.target.value })}
        />
      </label>
    </div>
  )
}

export default WhatsappForm
