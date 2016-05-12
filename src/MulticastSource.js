import MulticastDisposable from './MulticastDisposable'
import { dispose, emptyDisposable } from './dispose'
import { none, addSink, removeSink } from './sink'

export default class MulticastSource {
  constructor (source) {
    this.source = source
    this.sink = none()
    this.activeCount = 0
    this._disposable = emptyDisposable
  }

  run (sink, scheduler) {
    const n = this.add(sink)
    if (n === 1) {
      this._disposable = this.source.run(this, scheduler)
    }

    return new MulticastDisposable(this, sink)
  }

  _dispose () {
    const disposable = this._disposable
    this._disposable = void 0
    this.sink = none()
    return Promise.resolve(disposable).then(dispose)
  }

  add (sink) {
    this.sink = addSink(sink, this.sink)
    this.activeCount += 1
    return this.activeCount
  }

  remove (sink) {
    const s = this.sink
    this.sink = removeSink(sink, this.sink)
    if (s !== this.sink) {
      this.activeCount -= 1
    }
    return this.activeCount
  }

  event (time, value) {
    this.sink.event(time, value)
  }

  end (time, value) {
    this.sink.end(time, value)
  }

  error (time, err) {
    this.sink.error(time, err)
  }
}
