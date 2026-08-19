import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(command === 'build' ? [viteSingleFile()] : []),
  ],
  // Dev server uses '/' so HMR works; build inlines everything via singlefile
  base: command === 'build' ? './' : '/',
  build: {
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // IIFE = classic script, works on file:// without any server
        format: 'iife',
        name: 'App',
        inlineDynamicImports: true,
      },
    },
  },
}))
