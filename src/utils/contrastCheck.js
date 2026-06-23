/**
 * contrastCheck.js
 * Calcula el ratio de contraste (WCAG) entre el color de los puntos y el fondo
 * para advertir cuando un QR puede ser difícil de escanear.
 */

/** Convierte #RGB o #RRGGBB a {r,g,b} (0-255). Devuelve null si es inválido. */
export function hexToRgb(hex = '') {
  let value = String(hex).trim().replace('#', '')
  if (value.length === 3) {
    value = value.split('').map((c) => c + c).join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  }
}

/** Luminancia relativa (WCAG 2.x) de un canal sRGB. */
function channelLuminance(channel) {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** Luminancia relativa de un color hex. */
export function relativeLuminance(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  )
}

/**
 * Ratio de contraste entre dos colores (1 a 21).
 */
export function contrastRatio(hexA, hexB) {
  const lumA = relativeLuminance(hexA)
  const lumB = relativeLuminance(hexB)
  const lighter = Math.max(lumA, lumB)
  const darker = Math.min(lumA, lumB)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Evalúa la escaneabilidad según el contraste entre puntos y fondo.
 * Para QR conviene un contraste alto (idealmente >= 7:1).
 * @returns {{ ratio:number, level:'good'|'warn'|'bad', message:string, scannable:boolean }}
 */
export function checkScannability(dotsColor, backgroundColor) {
  const ratio = contrastRatio(dotsColor, backgroundColor)
  const rounded = Math.round(ratio * 100) / 100

  if (ratio >= 7) {
    return {
      ratio: rounded,
      level: 'good',
      scannable: true,
      message: `Contraste óptimo (${rounded}:1). Escaneo fiable.`,
    }
  }
  if (ratio >= 4) {
    return {
      ratio: rounded,
      level: 'warn',
      scannable: true,
      message: `Contraste justo (${rounded}:1). Funciona, pero aumenta la diferencia para mayor fiabilidad.`,
    }
  }
  return {
    ratio: rounded,
    level: 'bad',
    scannable: false,
    message: `Contraste bajo (${rounded}:1). El QR podría no escanearse.`,
  }
}

export default checkScannability
