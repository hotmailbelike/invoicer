/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset URLs, so the same build works at a domain root (Netlify, Cloudflare) and in a
  // subdirectory (GitHub Pages project site at /invoicer/). There is no router to break.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Pre-bundled up front so the first lazy import doesn't trigger a dev-server
  // re-optimize and full page reload mid-session.
  optimizeDeps: { include: ['@react-pdf/renderer'] },
  build: {
    // The PDF engine (~1.2 MB, ~460 kB gzipped) is one lazily loaded chunk that is never part of
    // first paint; the default 500 kB warning would fire on every build and hide real ones.
    chunkSizeWarningLimit: 1_300,
    rollupOptions: {
      onwarn(warning, warn) {
        // zod ships comments Rollup cannot place as annotations; harmless and not ours to fix.
        if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('/node_modules/zod/')) {
          return;
        }
        warn(warning);
      },
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
