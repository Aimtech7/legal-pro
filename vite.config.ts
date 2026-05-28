import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

// Vite configuration for LegalPro v1.0.1;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
