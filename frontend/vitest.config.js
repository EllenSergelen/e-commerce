import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // This line tells Vitest how to read <Navbar />
  test: {
    environment: 'jsdom',
    globals: true,
  },
})