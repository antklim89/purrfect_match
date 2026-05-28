/// <reference types="vitest/config" />

import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@/api': resolve('./src'),
    },
  },

  test: {
    setupFiles: resolve('./src/test/init-setup.ts')
  },
});
