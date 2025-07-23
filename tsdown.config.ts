import { defineConfig } from 'tsdown'
import { dependencies } from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  noExternal: Object.keys(dependencies),
  shims: false,
  dts: false,
  external: ['vscode']
})
