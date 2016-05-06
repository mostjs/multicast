import MulticastDisposable from './MulticastDisposable'
import { tryEvent, tryEnd } from './tryEvent'
import { dispose, emptyDisposable } from './dispose'
import { append, remove, findIndex } from '@most/prelude'

export default class MulticastSource {
  constructor (source) {
    this.source = source
    this.sink = undefined
    this.sinks = []
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
    return Promise.resolve(disposable).then(dispose)
  }

  add (sink) {
    if (this.sink === undefined) {
      this.sink = sink
      return 1
    }

    this.sinks = append(sink, this.sinks)
    return this.sinks.length + 1
  }

  remove (sink) {
    if (sink === this.sink) {
      this.sink = this.sinks.shift()
      return this.sink === undefined ? 0 : this.sinks.length + 1
    }

    this.sinks = remove(findIndex(sink, this.sinks), this.sinks)
    return this.sinks.length + 1
  }

  event (time, value) {
    const s = this.sinks
    if (s.length === 0) {
      this.sink.event(time, value)
    } else {
      tryEvent(time, value, this.sink)
      for (let i = 0; i < s.length; ++i) {
        tryEvent(time, value, s[i])
      }
    }
  }

  end (time, value) {
    // Important: slice first since sink.end may change
    // the set of sinks
    const s = this.sinks.slice()
    tryEnd(time, value, this.sink)
    for (let i = 0; i < s.length; ++i) {
      tryEnd(time, value, s[i])
    }
  }

  error (time, err) {
    // Important: slice first since sink.error may change
    // the set of sinks
    const s = this.sinks.slice()
    this.sink.error(time, err)
    for (let i = 0; i < s.length; ++i) {
      s[i].error(time, err)
    }
  }
}
