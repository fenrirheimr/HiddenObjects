import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  assetsInclude: ['**/*.webp', '**/*.atlas', '**/*.json'],
});