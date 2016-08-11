import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'dist/multicast.js',
  format: 'umd',
  moduleName: 'mostMulticast',
  sourceMap: true,
  plugins: [
    buble()
  ]
}
