/** UrlForm.jsx — captura una URL / enlace. */
function UrlForm({ data, onChange }) {
  return (
    <div className="form">
      <label className="field">
        <span className="field__label">URL del enlace</span>
        <input
          type="url"
          className="field__input"
          placeholder="https://tu-sitio.com"
          value={data.url || ''}
          onChange={(e) => onChange({ url: e.target.value })}
          autoComplete="off"
        />
        <span className="field__hint">Se añade https:// automáticamente si lo omites.</span>
      </label>
    </div>
  )
}

export default UrlForm
