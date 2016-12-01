import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'dist/multicast.es.js',
  moduleName: 'mostMulticast',
  sourceMap: true,
  plugins: [
    buble()
  ],
  globals: {
    '@most/prelude': 'mostPrelude'
  }
}
