import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/KNN-World-Cup/',
  plugins: [react(), tailwindcss()],
})
