import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src', // This should point to the directory containing index.html
  envDir: '../',
  envPrefix: 'PAYPAL',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: './dist', // Output will be in the root `dist`
    rollupOptions: {
      // Optional: specify any external modules here if needed
    },
  },
});
