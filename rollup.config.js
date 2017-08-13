import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'dist/multicast-prioritise.js',
  format: 'umd',
  moduleName: 'mostMulticastPrioritise',
  sourceMap: true,
  plugins: [
    buble()
  ],
  globals: {
    '@most/prelude': 'mostPrelude'
  }
}
