/** EmailForm.jsx — destinatario, asunto y cuerpo de un correo. */
function EmailForm({ data, onChange }) {
  return (
    <div className="form">
      <label className="field">
        <span className="field__label">Destinatario</span>
        <input
          type="email"
          className="field__input"
          placeholder="hola@ejemplo.com"
          value={data.to || ''}
          onChange={(e) => onChange({ to: e.target.value })}
          autoComplete="off"
        />
      </label>
      <label className="field">
        <span className="field__label">Asunto (opcional)</span>
        <input
          type="text"
          className="field__input"
          placeholder="Asunto del correo"
          value={data.subject || ''}
          onChange={(e) => onChange({ subject: e.target.value })}
        />
      </label>
      <label className="field">
        <span className="field__label">Mensaje (opcional)</span>
        <textarea
          className="field__input field__textarea"
          placeholder="Escribe el cuerpo del correo..."
          rows={4}
          value={data.body || ''}
          onChange={(e) => onChange({ body: e.target.value })}
        />
      </label>
    </div>
  )
}

export default EmailForm
