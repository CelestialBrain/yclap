import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Port claim: 9500 block (yclap web). Never 3000 / 5173 / 8080 — 5173 is the
 * mother program's; gargar holds 9400/9401. strictPort so a collision fails
 * loudly instead of drifting onto a neighbour's port.
 */
export default defineConfig({
  plugins: [react()],
  server: { port: 9500, strictPort: true },
  preview: { port: 9501, strictPort: true },
})
