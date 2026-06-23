/**
 * useQRGenerator.js
 * Lógica centralizada de generación de QR con qr-code-styling.
 * - Mantiene una instancia de preview que se actualiza de forma reactiva.
 * - Expone helpers para exportar a PNG/SVG y copiar al portapapeles a la
 *   resolución elegida por el usuario (independiente del tamaño de preview).
 */
import { useCallback, useEffect, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'

export const DOT_TYPES = [
  { value: 'square', label: 'Cuadrado' },
  { value: 'rounded', label: 'Redondeado' },
  { value: 'dots', label: 'Puntos' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy redondeado' },
  { value: 'extra-rounded', label: 'Extra redondeado' },
]

export const DEFAULT_CUSTOMIZATION = {
  dotsColor: '#0D0F14',
  backgroundColor: '#FFFFFF',
  dotType: 'rounded',
  size: 1024,
  logo: null, // dataURL del logo central, o null
  logoSize: 0.3, // proporción del QR (máx 30%)
}

/** Construye las opciones de qr-code-styling para un tamaño de render concreto. */
function buildOptions(value, c, renderSize, type = 'canvas') {
  return {
    width: renderSize,
    height: renderSize,
    type,
    // qr-code-styling necesita un string no vacío para renderizar
    data: value && value.length ? value : ' ',
    margin: Math.round(renderSize * 0.04),
    qrOptions: {
      // Nivel alto de corrección de errores cuando hay logo encima
      errorCorrectionLevel: c.logo ? 'H' : 'Q',
    },
    image: c.logo || undefined,
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: Math.round(renderSize * 0.01),
      imageSize: c.logoSize,
      hideBackgroundDots: true,
    },
    dotsOptions: {
      color: c.dotsColor,
      type: c.dotType,
    },
    backgroundOptions: {
      color: c.backgroundColor,
    },
    cornersSquareOptions: {
      color: c.dotsColor,
      type: c.dotType === 'dots' ? 'dot' : 'extra-rounded',
    },
    cornersDotOptions: {
      color: c.dotsColor,
    },
  }
}

export function useQRGenerator({ value, customization, previewSize = 300 }) {
  const c = { ...DEFAULT_CUSTOMIZATION, ...customization }

  // Instancia de preview creada una sola vez (inicializador lazy de useState).
  const [instance] = useState(
    () => new QRCodeStyling(buildOptions(value, c, previewSize))
  )

  // Monta la instancia de preview dentro de un contenedor del DOM.
  const appendTo = useCallback(
    (container) => {
      if (container) {
        container.replaceChildren()
        instance.append(container)
      }
    },
    [instance]
  )

  // Actualiza el preview cuando cambian los datos o la personalización.
  useEffect(() => {
    instance.update(buildOptions(value, c, previewSize))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
    previewSize,
    c.dotsColor,
    c.backgroundColor,
    c.dotType,
    c.logo,
    c.logoSize,
  ])

  /** Crea una instancia temporal al tamaño de exportación deseado. */
  const buildExportInstance = useCallback(
    (type = 'canvas') => new QRCodeStyling(buildOptions(value, c, c.size, type)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, c.dotsColor, c.backgroundColor, c.dotType, c.logo, c.logoSize, c.size]
  )

  /** Descarga el QR en PNG (alta resolución) o SVG (vectorial). */
  const download = useCallback(
    async (extension = 'png', name = 'qrio') => {
      const type = extension === 'svg' ? 'svg' : 'canvas'
      const instance = buildExportInstance(type)
      await instance.download({ name, extension })
    },
    [buildExportInstance]
  )

  /** Copia el QR como imagen PNG al portapapeles. */
  const copyToClipboard = useCallback(async () => {
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('El portapapeles de imágenes no está disponible en este navegador.')
    }
    const instance = buildExportInstance('canvas')
    const blob = await instance.getRawData('png')
    if (!blob) throw new Error('No se pudo generar la imagen.')
    await navigator.clipboard.write([
      new window.ClipboardItem({ 'image/png': blob }),
    ])
  }, [buildExportInstance])

  return { appendTo, download, copyToClipboard }
}

export default useQRGenerator
