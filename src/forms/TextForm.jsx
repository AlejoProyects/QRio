/** TextForm.jsx — texto libre. */
function TextForm({ data, onChange }) {
  return (
    <div className="form">
      <label className="field">
        <span className="field__label">Texto</span>
        <textarea
          className="field__input field__textarea"
          placeholder="Escribe cualquier texto..."
          rows={5}
          value={data.text || ''}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>
    </div>
  )
}

export default TextForm
