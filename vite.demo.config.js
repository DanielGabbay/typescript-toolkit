import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'demo-dist',
    lib: {
      entry: 'demo-entry.js',
      name: 'TreeShakingDemo',
      fileName: 'demo',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        preserveModules: false,
        manualChunks: undefined
      }
    },
    minify: false, // Keep readable for demonstration
    sourcemap: true
  }
});
