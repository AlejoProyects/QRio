# QRio — Generador de QR Premium

Generador de códigos QR **premium, sin publicidad y 100% gratuito**. Todo se procesa en tu navegador: QRio no tiene backend ni almacena tus datos.

🔗 **Demo:** https://alejoproyects.github.io/QRio/

## Características

- **5 tipos de QR:** Enlace, WhatsApp, Texto libre, WiFi y Email.
- **Personalización visual:** colores de puntos y fondo, 6 formas de puntos, logo central (PNG/SVG, máx. 30%).
- **Validación de contraste** (WCAG) para asegurar que el QR sea escaneable.
- **Exportación:** PNG en alta resolución (512–2048 px), SVG vectorial y copiar al portapapeles.
- **Diseño dark premium** con layout split (formulario + preview sticky) y tabs en mobile.

## Stack

- React + Vite
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) para el render y la exportación
- Sin backend — todo en el cliente
- Deploy automático a GitHub Pages vía GitHub Actions

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # build de producción a /dist
npm run preview  # previsualizar el build
```

## Deploy en GitHub Pages

El workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) construye y publica en cada push a `main`.

Para activarlo una sola vez: en el repo, **Settings → Pages → Build and deployment → Source: GitHub Actions**.

> La base del proyecto es `/QRio/` (ver [vite.config.js](vite.config.js)), coincidiendo con el nombre del repositorio (la ruta de GitHub Pages distingue mayúsculas).

## Estructura

```
src/
  components/
    QRPreview.jsx      # render + exportación del QR
    QRCustomizer.jsx   # controles de personalización visual
    TypeSelector.jsx   # selector de tipo de QR
  forms/               # un formulario por tipo
    UrlForm.jsx  WhatsappForm.jsx  TextForm.jsx  WifiForm.jsx  EmailForm.jsx
  hooks/
    useQRGenerator.js  # lógica centralizada de generación
  utils/
    qrPayloads.js      # formatea los datos al string del QR
    contrastCheck.js   # valida el contraste para escaneabilidad
  App.jsx              # layout completo
```
