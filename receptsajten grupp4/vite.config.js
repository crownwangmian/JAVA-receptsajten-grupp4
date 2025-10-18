/// <reference types="vitest" />   // Enables Vitest type support in VS Code
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',             // Run tests in a simulated browser environment
    setupFiles: './src/setupTests.js', // File that runs before tests (for setup)
    globals: true,                     // Allow using describe/it/expect without imports
    css: true,                         // Allow importing CSS in tested components
  },
})
