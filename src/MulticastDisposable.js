export default class MulticastDisposable {
  constructor (source, sink) {
    this.source = source
    this.sink = sink
  }

  dispose () {
    const s = this.source
    const remaining = s.remove(this.sink)
    return remaining === 0 && s._dispose()
  }
}
