import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change base to '/your-repo-name/' when deploying to GitHub Pages
// e.g. base: '/slashdot-os/'
export default defineConfig({
  plugins: [react()],
  base: '/Interbatch-Coding-2026-25MS/',
})
