/** WifiForm.jsx — credenciales de red WiFi. */
function WifiForm({ data, onChange }) {
  const encryption = data.encryption || 'WPA'

  return (
    <div className="form">
      <label className="field">
        <span className="field__label">Nombre de la red (SSID)</span>
        <input
          type="text"
          className="field__input"
          placeholder="MiRedWiFi"
          value={data.ssid || ''}
          onChange={(e) => onChange({ ssid: e.target.value })}
          autoComplete="off"
        />
      </label>

      <label className="field">
        <span className="field__label">Tipo de seguridad</span>
        <select
          className="field__input field__select"
          value={encryption}
          onChange={(e) => onChange({ encryption: e.target.value })}
        >
          <option value="WPA">WPA / WPA2 / WPA3</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Sin contraseña</option>
        </select>
      </label>

      {encryption !== 'nopass' && (
        <label className="field">
          <span className="field__label">Contraseña</span>
          <input
            type="text"
            className="field__input"
            placeholder="••••••••"
            value={data.password || ''}
            onChange={(e) => onChange({ password: e.target.value })}
            autoComplete="off"
          />
        </label>
      )}

      <label className="field field--checkbox">
        <input
          type="checkbox"
          checked={Boolean(data.hidden)}
          onChange={(e) => onChange({ hidden: e.target.checked })}
        />
        <span className="field__label">Red oculta</span>
      </label>
    </div>
  )
}

export default WifiForm
