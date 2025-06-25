import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: '0.0.0.0', // 👈 Expose to network
    port: 5173,       // Optional: make sure port is predictable
  },
})
