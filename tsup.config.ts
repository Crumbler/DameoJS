import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'es2017',
  format: ['esm'],
  entry: ['src/scripts/main.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: false,
  platform: 'browser',
  watch: 'src/scripts',
  outDir: 'src/out',
});
