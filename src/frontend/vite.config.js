import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import injectHtml from 'vite-plugin-html';
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: '6606',
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
  plugins: [react()],
});
