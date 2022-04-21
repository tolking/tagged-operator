import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: './lib',
    lib: {
      entry: './src/index.ts',
      name: 'TemplateOperator',
      fileName: (format) => `index.${format}.js`,
    },
  },
})
