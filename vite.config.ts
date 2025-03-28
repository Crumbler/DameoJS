import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: 'src',
  base: '',
  plugins: [tsconfigPaths()],
  build: {
    assetsDir: '',
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rollupOptions: {
      input: [
        'src/index.html',
        'src/scripts/serviceWorker.ts'
      ],
      output: {
        format: 'es',
        assetFileNames: '[name][extname]',
        chunkFileNames: '[name][extname]',
        entryFileNames: '[name].js',
        strict: true,
      },
    },
  },
});
