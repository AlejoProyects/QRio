import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base '/QRio/' para servir correctamente desde GitHub Pages
// (la ruta de Pages distingue mayúsculas: repo AlejoProyects/QRio)
export default defineConfig({
  base: '/QRio/',
  plugins: [react()],
})
