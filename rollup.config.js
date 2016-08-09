import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'dist/prelude.js',
  format: 'umd',
  moduleName: 'most',
  sourceMap: true,
  plugins: [
    buble()
  ]
}
