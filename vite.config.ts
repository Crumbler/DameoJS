import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  base: '',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, "src/scripts")
      }
    ]
  },
  build: {
    assetsDir: '',
    rollupOptions: {
      output: {
        format: 'es',
        assetFileNames: "[name][extname]",
        chunkFileNames: "[name][extname]",
        entryFileNames: '[name].js',
        strict: true
      }
    }
  }
});
