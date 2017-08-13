import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'dist/multicast-prioritise.es.js',
  moduleName: 'mostMulticastPrioritise',
  sourceMap: true,
  plugins: [
    buble()
  ],
  globals: {
    '@most/prelude': 'mostPrelude'
  }
}
