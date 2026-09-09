import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // `.trycloudflare.com` is allowed so the demo can be shared over a temporary tunnel.
  // Scoped to that domain rather than `true`, which would turn the host check off entirely.
  server: { host: '127.0.0.1', port: 4273, allowedHosts: ['.trycloudflare.com'] },
  preview: { host: '127.0.0.1', port: 4274 },
})
