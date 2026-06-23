import { useMemo, useState } from 'react'
import './App.css'
import TypeSelector from './components/TypeSelector'
import QRPreview from './components/QRPreview'
import QRCustomizer from './components/QRCustomizer'
import UrlForm from './forms/UrlForm'
import WhatsappForm from './forms/WhatsappForm'
import TextForm from './forms/TextForm'
import WifiForm from './forms/WifiForm'
import EmailForm from './forms/EmailForm'
import { buildPayload } from './utils/qrPayloads'
import { checkScannability } from './utils/contrastCheck'
import { DEFAULT_CUSTOMIZATION } from './hooks/useQRGenerator'

const QR_TYPES = [
  { id: 'url', label: 'Enlace', icon: '🔗', Form: UrlForm },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', Form: WhatsappForm },
  { id: 'text', label: 'Texto', icon: '📝', Form: TextForm },
  { id: 'wifi', label: 'WiFi', icon: '📶', Form: WifiForm },
  { id: 'email', label: 'Email', icon: '✉️', Form: EmailForm },
]

function App() {
  const [type, setType] = useState('url')
  const [formData, setFormData] = useState({})
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION)
  const [mobileTab, setMobileTab] = useState('form') // 'form' | 'preview'

  const activeType = QR_TYPES.find((t) => t.id === type) || QR_TYPES[0]
  const ActiveForm = activeType.Form

  // Datos del tipo activo (cada tipo guarda su propio sub-objeto).
  const currentData = useMemo(() => formData[type] || {}, [formData, type])

  const updateFormData = (patch) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...(prev[type] || {}), ...patch },
    }))
  }

  const updateCustomization = (patch) =>
    setCustomization((prev) => ({ ...prev, ...patch }))

  const value = useMemo(() => buildPayload(type, currentData), [type, currentData])

  const contrast = useMemo(
    () => checkScannability(customization.dotsColor, customization.backgroundColor),
    [customization.dotsColor, customization.backgroundColor]
  )

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo">QR<span className="app__logo-accent">io</span></span>
          <span className="app__tagline">Generador de QR premium</span>
        </div>
        <span className="app__badge">Sin publicidad · 100% gratis</span>
      </header>

      {/* Tabs solo visibles en mobile */}
      <nav className="app__mobile-tabs">
        <button
          type="button"
          className={`app__mobile-tab${mobileTab === 'form' ? ' is-active' : ''}`}
          onClick={() => setMobileTab('form')}
        >
          Editar
        </button>
        <button
          type="button"
          className={`app__mobile-tab${mobileTab === 'preview' ? ' is-active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          Vista previa
        </button>
      </nav>

      <main className="app__layout">
        <section
          className={`panel panel--form${mobileTab === 'form' ? ' is-mobile-active' : ''}`}
        >
          <TypeSelector types={QR_TYPES} active={type} onChange={setType} />

          <div className="card">
            <ActiveForm data={currentData} onChange={updateFormData} />
          </div>

          <div className="card">
            <QRCustomizer customization={customization} onChange={updateCustomization} />
          </div>
        </section>

        <aside
          className={`panel panel--preview${mobileTab === 'preview' ? ' is-mobile-active' : ''}`}
        >
          <div className="card card--sticky">
            <QRPreview value={value} customization={customization} contrast={contrast} />
          </div>
        </aside>
      </main>

      <footer className="app__footer">
        Hecho con cariño · QRio no almacena tus datos: todo ocurre en tu navegador.
      </footer>
    </div>
  )
}

export default App
