import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: './lib',
    lib: {
      entry: './src/index.ts',
      name: 'TaggedOperator',
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [dts()],
})
