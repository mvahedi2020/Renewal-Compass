import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/Renewal-Compass/', plugins: [react()],
  server: { host: '127.0.0.1', port: 4193, strictPort: true },
  preview: { host: '127.0.0.1', port: 4193, strictPort: true },
})
