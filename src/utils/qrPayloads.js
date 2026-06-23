/**
 * qrPayloads.js
 * Convierte los datos de cada tipo de QR en el string final que se codifica.
 * Cada builder recibe el objeto `data` del formulario y devuelve un string.
 */

/** Escapa caracteres especiales del formato WiFi (\ ; , : " ) */
function escapeWifi(value = '') {
  return String(value).replace(/([\\;,:"])/g, '\\$1')
}

/** Normaliza un número de teléfono dejando solo dígitos (formato wa.me) */
function normalizePhone(value = '') {
  return String(value).replace(/[^\d]/g, '')
}

/** Asegura que una URL tenga protocolo */
export function normalizeUrl(value = '') {
  const trimmed = String(value).trim()
  if (!trimmed) return ''
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

const builders = {
  url: (data = {}) => normalizeUrl(data.url),

  text: (data = {}) => String(data.text ?? ''),

  whatsapp: (data = {}) => {
    const phone = normalizePhone(data.phone)
    if (!phone) return ''
    const message = data.message ? `?text=${encodeURIComponent(data.message)}` : ''
    return `https://wa.me/${phone}${message}`
  },

  wifi: (data = {}) => {
    const ssid = escapeWifi(data.ssid)
    if (!ssid) return ''
    const encryption = data.encryption || 'WPA'
    if (encryption === 'nopass') {
      return `WIFI:T:nopass;S:${ssid};;`
    }
    const password = escapeWifi(data.password)
    const hidden = data.hidden ? 'H:true;' : ''
    return `WIFI:T:${encryption};S:${ssid};P:${password};${hidden};`
  },

  email: (data = {}) => {
    const to = String(data.to ?? '').trim()
    if (!to) return ''
    const params = []
    if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`)
    if (data.body) params.push(`body=${encodeURIComponent(data.body)}`)
    const query = params.length ? `?${params.join('&')}` : ''
    return `mailto:${to}${query}`
  },
}

/**
 * Construye el payload de QR para un tipo dado.
 * @param {string} type - url | text | whatsapp | wifi | email
 * @param {object} data - datos del formulario
 * @returns {string} string a codificar (vacío si los datos no son válidos)
 */
export function buildPayload(type, data) {
  const builder = builders[type]
  if (!builder) return ''
  return builder(data)
}

export default buildPayload
